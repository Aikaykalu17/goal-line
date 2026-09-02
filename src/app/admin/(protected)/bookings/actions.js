"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

const ALLOWED_STATUSES = ["pending", "confirmed", "cancelled", "expired"];

async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized.");
  }

  return data.user;
}

export async function updateBookingStatusAction(id, newStatus) {
  await requireAuthenticatedUser();

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
  await requireAuthenticatedUser();

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
