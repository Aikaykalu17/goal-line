import { createSupabaseServerClient } from "@/lib/supabaseServer";

// Verifies there is a real, server-confirmed Supabase session before an
// admin server action is allowed to touch the database. Every admin action
// must call this first, and its result must never be trusted from a value
// the client sent — it always re-checks the session on the server.
export async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user) {
    throw new Error("Unauthorized.");
  }

  return data.user;
}
