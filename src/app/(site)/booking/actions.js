"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import {
  sendBookingEmails,
  sendPendingBookingReminderEmail,
} from "@/lib/email";
import {
  DEFAULT_PRICING,
  calculatePromoDiscount,
  getRateForDate,
} from "@/lib/pricing";

function isValidDate(value) {
  return value instanceof Date && !Number.isNaN(value.getTime());
}

export async function parseBookingTypeFromNotes(notes, fallback = "solo") {
  const raw = String(notes || "").trim();
  if (!raw) return fallback;

  const match = raw.match(/booking_type:\s*(solo|private|open)/i);
  if (match?.[1]) {
    return match[1].toLowerCase();
  }

  return fallback;
}

export async function validatePromoCodeAction(code, subtotal = 0) {
  const normalizedCode = String(code || "").trim();

  if (!normalizedCode) {
    return { valid: false, discount: 0, reason: "Please enter a promo code." };
  }

  const supabase = createSupabaseAdminClient();
  const { data: promo, error } = await supabase
    .from("promo")
    .select("code, active, expires_at, discount_percent")
    .eq("code", normalizedCode.toUpperCase())
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!promo) {
    return {
      valid: false,
      discount: 0,
      reason: "Invalid or expired promo code!",
    };
  }

  if (!promo.active) {
    return {
      valid: false,
      discount: 0,
      reason: "This promo code is currently inactive!",
    };
  }

  const expiresAt = promo.expires_at ? new Date(promo.expires_at) : null;
  if (expiresAt && expiresAt <= new Date()) {
    return {
      valid: false,
      discount: 0,
      reason: "This promo code has expired!",
    };
  }

  const discountPercent = Number(promo.discount_percent ?? 0);
  if (!Number.isFinite(discountPercent) || discountPercent <= 0) {
    return { valid: false, discount: 0, reason: "This promo code is invalid." };
  }

  const discount = calculatePromoDiscount(Number(subtotal || 0), {
    discount_percent: discountPercent,
  });

  return {
    valid: true,
    discount,
    promo,
  };
}

export async function createBookingAction({
  user_full_name,
  user_email,
  user_phone,
  players,
  booking_type,
  notes,
  start_at,
  end_at,
  duration_minutes,
  rate_per_hour,
  subtotal,
  discount,
  total,
  promo_code,
  booking_code,
}) {
  const supabase = createSupabaseAdminClient();

  const start = new Date(start_at);
  const end = new Date(end_at);

  if (!user_full_name?.trim() || !user_email?.trim() || !user_phone?.trim()) {
    throw new Error("Please provide your name, email and phone number.");
  }

  if (!isValidDate(start) || !isValidDate(end) || start >= end) {
    throw new Error("Invalid booking date or time.");
  }

  const playersNumber = Number(players);
  if (!Number.isInteger(playersNumber) || playersNumber < 1) {
    throw new Error("Number of players must be at least 1.");
  }

  const normalizedBookingType = String(
    booking_type || (playersNumber >= 8 ? "private" : "solo"),
  )
    .trim()
    .toLowerCase();

  const isPrivateBlockingBooking =
    playersNumber >= 8 && !["solo", "open"].includes(normalizedBookingType);

  if (start <= new Date()) {
    throw new Error("Please select a future date and time.");
  }

  const duration = Math.round((end.getTime() - start.getTime()) / 60000);
  if (duration < 30 || duration % 30 !== 0) {
    throw new Error("Booking duration must be in 30-minute intervals.");
  }

  if (duration > 15 * 60) {
    throw new Error("The selected booking duration is too long.");
  }

  const { data: pricingData } = await supabase
    .from("pricing")
    .select("*")
    .maybeSingle();

  const effectiveRate = getRateForDate(start, pricingData || DEFAULT_PRICING);
  const calculatedSubtotal = (duration / 60) * effectiveRate;

  let safeDiscount = 0;
  let safePromoCode = null;

  if (promo_code?.trim()) {
    const result = await validatePromoCodeAction(
      promo_code,
      calculatedSubtotal,
    );

    if (result.valid) {
      safeDiscount = Number(result.discount) || 0;
      safePromoCode = result.promo.code;
    }
  }

  const calculatedTotal = Math.max(0, calculatedSubtotal - safeDiscount);

  if (isPrivateBlockingBooking) {
    const { data: blocked, error: blockedError } = await supabase
      .from("blocked")
      .select("id")
      .lt("start_at", end.toISOString())
      .gt("end_at", start.toISOString())
      .limit(1);

    if (blockedError) {
      throw new Error("Could not verify availability.");
    }

    if (blocked?.length) {
      throw new Error(
        "Sorry, this date or time is blocked. Please pick another time.",
      );
    }

    const { data: existingBookings, error: bookingError } = await supabase
      .from("bookings")
      .select("id, notes, players")
      .lt("start_at", end.toISOString())
      .gt("end_at", start.toISOString())
      .neq("status", "cancelled")
      .limit(200);

    if (bookingError) {
      throw new Error("Could not verify booking availability.");
    }

    const hasBlockingOverlap = await Promise.all(
      (existingBookings || []).map(async (existing) => {
        const existingPlayers = Number(existing.players ?? 0);
        const existingType = await parseBookingTypeFromNotes(
          existing.notes,
          existingPlayers >= 8 ? "private" : "solo",
        );
        return existingPlayers >= 8 && existingType !== "open";
      }),
    ).then((results) => results.some(Boolean));

    if (hasBlockingOverlap) {
      throw new Error(
        "Sorry, this time slot was just booked by someone else. Please pick another time.",
      );
    }
  }

  const notesPayload = [notes?.trim(), `booking_type:${normalizedBookingType}`]
    .filter(Boolean)
    .join(" | ");

  const { data, error } = await supabase
    .from("bookings")
    .insert({
      user_full_name: user_full_name.trim(),
      user_email: user_email.trim(),
      user_phone: user_phone.trim(),
      players: playersNumber,
      booking_code: booking_code,
      notes: notesPayload,
      start_at: start.toISOString(),
      end_at: end.toISOString(),
      duration_minutes: duration,
      rate_per_hour: effectiveRate,
      subtotal: calculatedSubtotal,
      discount: safeDiscount,
      total: calculatedTotal,
      promo_code: safePromoCode,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  try {
    await sendBookingEmails({
      booking: data,
      customerEmail: user_email.trim(),
      customerName: user_full_name.trim(),
      customerPhone: user_phone.trim(),
    });

    await sendPendingBookingReminderEmail({
      booking: data,
      customerEmail: user_email.trim(),
      customerName: user_full_name.trim(),
    });
  } catch (emailError) {
    console.error("Booking created, but email dispatch failed:", emailError);
  }

  return { success: true, booking: data };
}
