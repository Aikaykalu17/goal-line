"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/authGuard";

// Admin-only booking lookup by ID. Returns full booking details (including
// customer name/email/phone), so it must go through the service-role
// client on the server, never the anon key from the browser.
export async function verifyBookingIdAction(id) {
  await requireAdmin();

  const trimmedId = String(id || "").trim();
  if (!trimmedId) return null;

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", trimmedId)
    .maybeSingle();

  if (error) {
    return null;
  }

  return data || null;
}

export async function updateBookingExtraTimeAction(id, extraMinutes) {
  await requireAdmin();

  const bookingId = String(id || "").trim();
  const minutesToAdd = Number(extraMinutes);

  if (!bookingId) {
    throw new Error("Booking ID is required.");
  }

  if (!Number.isFinite(minutesToAdd) || minutesToAdd <= 0) {
    throw new Error("Enter a valid extra time duration in minutes.");
  }

  const supabase = createSupabaseAdminClient();
  const { data: booking, error: fetchError } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .maybeSingle();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!booking) {
    throw new Error("Booking not found.");
  }

  if (String(booking.status || "").toLowerCase() !== "confirmed") {
    throw new Error("Extra time can only be edited for confirmed bookings.");
  }

  const currentEnd = new Date(booking.end_at);
  const updatedEnd = new Date(currentEnd.getTime() + minutesToAdd * 60 * 1000);
  const currentDuration = Number(booking.duration_minutes || 0);
  const currentRate = Number(booking.rate_per_hour || 0);
  const currentTotal = Number(booking.total || 0);
  const extraAmount = (minutesToAdd / 60) * currentRate;
  const nextDuration = currentDuration + minutesToAdd;
  const nextTotal = currentTotal + extraAmount;

  const { error } = await supabase
    .from("bookings")
    .update({
      end_at: updatedEnd.toISOString(),
      duration_minutes: nextDuration,
      total: nextTotal,
    })
    .eq("id", bookingId);

  if (error) {
    throw new Error(error.message);
  }

  return {
    ok: true,
    minutesAdded: minutesToAdd,
    newEndAt: updatedEnd.toISOString(),
    newTotal: nextTotal,
  };
}
