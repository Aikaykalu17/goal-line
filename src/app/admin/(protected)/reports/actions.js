"use server";

import { createSupabaseAdminClient } from "@/lib/supabaseAdmin";
import { requireAdmin } from "@/lib/authGuard";

export async function getReportsAction({ startDate, endDate }) {
  await requireAdmin();

  const supabase = createSupabaseAdminClient();
  const start = new Date(`${startDate}T00:00:00`);
  const end = new Date(`${endDate}T23:59:59.999`);

  if (
    Number.isNaN(start.getTime()) ||
    Number.isNaN(end.getTime()) ||
    start > end
  ) {
    throw new Error("Please provide a valid date range.");
  }

  const { data: bookings, error } = await supabase
    .from("bookings")
    .select("id,start_at,created_at,total,status,promo_code")
    .order("start_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  const toLocalDateKey = (value) => {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const validBookings = (bookings || []).filter((booking) => {
    const key = toLocalDateKey(booking.start_at);
    if (!key) return false;
    return key >= startDate && key <= endDate;
  });

  const confirmed = validBookings.filter(
    (booking) => booking.status === "confirmed",
  );
  const pending = validBookings.filter(
    (booking) => booking.status === "pending",
  );
  const cancelled = validBookings.filter(
    (booking) => booking.status === "cancelled",
  );

  const revenue = confirmed.reduce(
    (sum, booking) => sum + Number(booking.total || 0),
    0,
  );
  const totalBookings = validBookings.length;
  const totalConfirmed = confirmed.length;
  const averageOrder = totalConfirmed ? revenue / totalConfirmed : 0;

  const promoUsage = Object.entries(
    validBookings.reduce((acc, booking) => {
      if (!booking.promo_code) return acc;
      acc[booking.promo_code] = (acc[booking.promo_code] || 0) + 1;
      return acc;
    }, {}),
  )
    .map(([code, count]) => ({ code, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  const dailyChart = [];
  const cursor = new Date(start);
  while (cursor <= end) {
    const current = new Date(cursor);
    const dayKey = toLocalDateKey(current);
    const dayValue = confirmed
      .filter((booking) => toLocalDateKey(booking.start_at) === dayKey)
      .reduce((sum, booking) => sum + Number(booking.total || 0), 0);

    dailyChart.push({
      day: current.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      value: dayValue,
    });

    cursor.setDate(cursor.getDate() + 1);
  }

  return {
    stats: {
      totalBookings,
      confirmed: totalConfirmed,
      pending: pending.length,
      cancelled: cancelled.length,
      revenue,
      averageOrder,
    },
    promoUsage,
    chart: dailyChart,
    bookings: validBookings,
  };
}
