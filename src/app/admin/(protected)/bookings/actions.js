"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/authGuard";

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "expired"];

// Admin-only read. Runs on the server with the service-role client so the
// bookings list (which includes customer name/email/phone) is never fetched
// with the public anon key from the browser.
export async function getBookingsAction(tab = "All") {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();

  let query = supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .order("start_at", { ascending: true });

  if (tab && tab !== "All" && tab !== "Expired") {
    query = query.eq("status", tab.toLowerCase());
  }

  if (tab === "Expired") {
    query = query.eq("status", "expired");
  }

  const { data, count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return { data: data || [], count: count || 0 };
}

export async function updateBookingStatusAction(id, newStatus) {
  await requireAdmin();

  if (!id) throw new Error("Booking ID is required.");
  if (!ALLOWED_STATUSES.includes(newStatus)) {
    throw new Error("Invalid booking status.");
  }

  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("bookings")
    .update({ status: newStatus })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/calendar");

  return { ok: true };
}

export async function syncExpiredBookingsAction() {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const { data: pendingBookings, error: fetchError } = await supabase
    .from("bookings")
    .select("id, created_at")
    .eq("status", "pending");

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  const expiredIds = (pendingBookings || [])
    .filter((booking) => {
      const createdAt = booking?.created_at
        ? new Date(booking.created_at)
        : null;
      if (!createdAt || Number.isNaN(createdAt.getTime())) return false;
      return createdAt < today;
    })
    .map((booking) => booking.id);

  if (!expiredIds.length) {
    return { updated: 0 };
  }

  const { error: updateError } = await supabase
    .from("bookings")
    .update({ status: "expired" })
    .in("id", expiredIds);

  if (updateError) {
    throw new Error(updateError.message);
  }

  revalidatePath("/admin/bookings");
  revalidatePath("/admin/dashboard");
  revalidatePath("/admin/calendar");

  return { updated: expiredIds.length };
}
