"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/authGuard";

// Admin-only read of the current month's bookings for the calendar grid.
// Includes customer name and price, so it must never be fetched with the
// public anon key from the browser — it goes through this guarded action.
export async function getMonthBookingsAction({ start, end }) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("bookings")
    .select("id, start_at, end_at, status, user_full_name, total")
    .gte("start_at", start)
    .lte("end_at", end)
    .neq("status", "cancelled");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function createBlockedDateAction({ start_at, end_at, reason }) {
  const user = await requireAdmin();
  const supabase = createSupabaseAdminClient();

  const start = new Date(start_at);
  const end = new Date(end_at);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start >= end
  ) {
    throw new Error("Invalid date range.");
  }

  const safeReason = String(reason || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z]/g, "");

  if (safeReason && !/^[a-z]+$/.test(safeReason)) {
    throw new Error(
      "Reason must be a single word such as maintenance, party, or repair.",
    );
  }

  const { data: existing, error: overlapError } = await supabase
    .from("blocked")
    .select("id")
    .lt("start_at", end.toISOString())
    .gt("end_at", start.toISOString())
    .limit(1);

  if (overlapError) {
    throw new Error(overlapError.message);
  }

  if (existing?.length) {
    throw new Error("This date is already blocked.");
  }

  const { error } = await supabase.from("blocked").insert({
    start_at: start.toISOString(),
    end_at: end.toISOString(),
    reason: safeReason || null,
    created_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/calendar");
  return { ok: true };
}

export async function unblockDateAction(id) {
  await requireAdmin();

  if (!id) {
    throw new Error("A blocked date is required.");
  }

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase.from("blocked").delete().eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/calendar");
  return { ok: true };
}

export async function getBlockedDatesAction({ start, end }) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return [];
  }

  const { data, error } = await supabase
    .from("blocked")
    .select("id, start_at, end_at, reason, created_by")
    .lte("start_at", endDate.toISOString())
    .gte("end_at", startDate.toISOString())
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}
