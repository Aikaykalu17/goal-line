"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { createSupabaseServerClient } from "@/lib/supabaseServer";

async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized.");
  }

  return data.user;
}

export async function getPromoCodesAction() {
  const supabase = createSupabaseAdminClient();
  const { data, error } = await supabase
    .from("promo")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
}

export async function upsertPromoCodeAction(form) {
  await requireAdmin();

  const code = String(form.code || "")
    .trim()
    .toUpperCase();
  const discountPercent = Number(form.discount_percent ?? 0);

  if (!code) {
    throw new Error("Promo code is required.");
  }

  if (!Number.isFinite(discountPercent) || discountPercent <= 0) {
    throw new Error("Discount percentage must be greater than zero.");
  }

  const supabase = createSupabaseAdminClient();
  const nextRecord = {
    code,
    discount_percent: discountPercent,
    active: Boolean(form.active),
    expires_at: form.expires_at
      ? new Date(form.expires_at).toISOString()
      : null,
  };

  const { data, error } = await supabase
    .from("promo")
    .upsert(nextRecord, { onConflict: "code" })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function togglePromoCodeAction(code, active) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("promo")
    .update({ active: Boolean(active) })
    .eq("code", String(code).toUpperCase());

  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePromoCodeAction(code) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const { error } = await supabase
    .from("promo")
    .delete()
    .eq("code", String(code).toUpperCase());

  if (error) {
    throw new Error(error.message);
  }
}
