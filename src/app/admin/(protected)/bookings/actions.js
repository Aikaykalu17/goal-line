"use server";

import { revalidatePath } from "next/cache";
import { createSupabaseAdminClient } from "@/lib/supabaseClient";

export async function updateBookingStatusAction(id, newStatus) {
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

  return { ok: true };
}
