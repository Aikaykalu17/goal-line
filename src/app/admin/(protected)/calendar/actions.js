"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabaseClient";

export async function createBlockedDateAction({
  start_at,
  end_at,
  reason,
  created_by,
}) {
  const supabase = createSupabaseAdminClient();

  const { error } = await supabase
    .from("blocked")
    .insert([{ start_at, end_at, reason, created_by }]);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/calendar");
  return { ok: true };
}
