"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

async function requireAuthenticatedUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized.");
  }

  return data.user;
}

export async function createBlockedDateAction({ start_at, end_at, reason }) {
  const user = await requireAuthenticatedUser();
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
    reason: reason?.trim() || null,
    created_by: user.id,
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/calendar");
  return { ok: true };
}

export async function getBlockedDatesAction({ start, end }) {
  await requireAuthenticatedUser();

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
