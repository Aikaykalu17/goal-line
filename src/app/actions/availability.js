"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";

// Public availability read. It returns only the blocked periods needed by the calendar.
export async function getBlockedDatesAction({ start, end }) {
  const supabase = createSupabaseAdminClient();

  const startDate = new Date(start);
  const endDate = new Date(end);

  if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
    return [];
  }

  const { data, error } = await supabase
    .from("blocked")
    .select("id, start_at, end_at, reason")
    .lte("start_at", endDate.toISOString())
    .gte("end_at", startDate.toISOString())
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}
