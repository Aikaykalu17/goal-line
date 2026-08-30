import { supabase } from "@/lib/supabaseClient";

export async function getActivePromo(code) {
  const { data, error } = await supabase
    .from("promo")
    .select("*")
    .eq("code", code)
    .eq("active", true)
    .single();

  if (error || !data) {
    console.error(error);
    return null;
  }

  const hasNoExpiry = !data.expires_at;
  const isNotExpired = hasNoExpiry || new Date(data.expires_at) > new Date();

  if (isNotExpired) {
    return data;
  }

  return null;
}
