import { supabase } from "@/lib/supabaseClient";

export async function blockTimeRange({ start_at, end_at, reason, created_by }) {
  const { data, error } = await supabase
    .from("blocked_times")
    .insert([{ start_at, end_at, reason, created_by }])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

export async function getBlockedTimes() {
  const { data, error } = await supabase
    .from("blocked_times")
    .select("*")
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}
