"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/lib/supabaseServer";
import { DEFAULT_PRICING } from "@/lib/pricing";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized.");
  }

  return data.user;
}

export async function getPricingConfigAction() {
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
