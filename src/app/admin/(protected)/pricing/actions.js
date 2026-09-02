"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/authGuard";
import { DEFAULT_PRICING } from "@/lib/pricing";

export async function getPricingConfigAction() {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("pricing")
    .select("*")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data || DEFAULT_PRICING;
}

export async function savePricingAction(payload) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const nextValues = {
    ...DEFAULT_PRICING,
    ...(payload || {}),
  };

  const { data, error } = await supabase
    .from("pricing")
    .upsert({ id: 1, ...nextValues }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
