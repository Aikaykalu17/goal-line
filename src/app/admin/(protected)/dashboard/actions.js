"use server";

import { subDays } from "date-fns";
import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/authGuard";

// Admin-only read of aggregate booking/revenue stats. Runs on the server
// with the service-role client so this never depends on the anon key or
// Supabase RLS being locked down correctly.
export async function getDashboardStatsAction() {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();

  const now = new Date();
  const last7Start = subDays(now, 7);
  const prev7Start = subDays(now, 14);

  const [
    totalBookingsRes,
    pendingRes,
    confirmedRes,
    cancelledRes,
    last7BookingsRes,
    prev7BookingsRes,
    revenueRowsRes,
    last7RevenueRowsRes,
    prev7RevenueRowsRes,
  ] = await Promise.all([
    supabase.from("bookings").select("*", { count: "exact", head: true }),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "confirmed"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .eq("status", "cancelled"),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", last7Start.toISOString()),
    supabase
      .from("bookings")
      .select("*", { count: "exact", head: true })
      .gte("created_at", prev7Start.toISOString())
      .lt("created_at", last7Start.toISOString()),
    supabase.from("bookings").select("total").eq("status", "confirmed"),
    supabase
      .from("bookings")
      .select("total")
      .eq("status", "confirmed")
      .gte("created_at", last7Start.toISOString()),
    supabase
      .from("bookings")
      .select("total")
      .eq("status", "confirmed")
      .gte("created_at", prev7Start.toISOString())
      .lt("created_at", last7Start.toISOString()),
  ]);

  const sum = (rows) =>
    (rows || []).reduce((acc, r) => acc + (r.total || 0), 0);

  return {
    totalBookings: totalBookingsRes.count || 0,
    pending: pendingRes.count || 0,
    confirmed: confirmedRes.count || 0,
    cancelled: cancelledRes.count || 0,
    last7Bookings: last7BookingsRes.count || 0,
    prev7Bookings: prev7BookingsRes.count || 0,
    totalRevenue: sum(revenueRowsRes.data),
    last7Revenue: sum(last7RevenueRowsRes.data),
    prev7Revenue: sum(prev7RevenueRowsRes.data),
  };
}
