"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { subDays } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import formatCurrency from "@/utils/formatCurrency";
import {
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaWallet,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import Spinner from "@/app/components/Spinner";

function TrendBadge({ current, previous }) {
  if (previous === 0) {
    if (current === 0) return null;
    return <span className="text-xs font-medium text-green-600">New</span>;
  }

  const change = ((current - previous) / previous) * 100;
  const isUp = change >= 0;

  return (
    <span
      className={`flex items-center gap-1 text-xs font-medium ${
        isUp ? "text-green-600" : "text-red-600"
      }`}
    >
      {isUp ? <FaArrowUp size={10} /> : <FaArrowDown size={10} />}
      {Math.abs(change).toFixed(0)}% from last week
    </span>
  );
}

function compactNumber(value) {
  if (!Number.isFinite(Number(value))) return value;

  const n = Number(value);
  const abs = Math.abs(n);

  if (abs >= 1_000_000) {
    return `${(n / 1_000_000).toFixed(abs >= 10_000_000 ? 1 : 2).replace(/\.0$/, "")}M`;
  }

  if (abs >= 1_000) {
    return `${(n / 1_000).toFixed(abs >= 10_000 ? 1 : 2).replace(/\.0$/, "")}K`;
  }

  return String(n);
}

function StatCard({ label, value, icon: Icon, trend, viewAllHref }) {
  const rawValue = value;
  const displayValue =
    typeof value === "string" && value.startsWith("₦")
      ? `₦${compactNumber(value.replace("₦", ""))}`
      : compactNumber(value);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-gray-500">{label}</p>
          <p
            className="mt-2 text-2xl font-bold leading-tight text-(--text)"
            title={String(rawValue)}
          >
            {displayValue}
          </p>
        </div>
        <div className="mt-1 flex-shrink-0 rounded-lg bg-(--primary)/10 p-2 text-(--primary)">
          <Icon size={16} />
        </div>
      </div>

      <div className="mt-2">
        {trend}
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="block text-xs text-(--primary) hover:underline"
          >
            View all
          </Link>
        )}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  // Fetch stats — reruns whenever reloadTrigger changes
  useEffect(() => {
    let ignore = false;

    async function loadStats() {
      setIsLoading(true);

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

      if (ignore) return;

      const sum = (rows) =>
        (rows || []).reduce((acc, r) => acc + (r.total || 0), 0);

      setStats({
        totalBookings: totalBookingsRes.count || 0,
        pending: pendingRes.count || 0,
        confirmed: confirmedRes.count || 0,
        cancelled: cancelledRes.count || 0,
        last7Bookings: last7BookingsRes.count || 0,
        prev7Bookings: prev7BookingsRes.count || 0,
        totalRevenue: sum(revenueRowsRes.data),
        last7Revenue: sum(last7RevenueRowsRes.data),
        prev7Revenue: sum(prev7RevenueRowsRes.data),
      });

      setIsLoading(false);
    }

    loadStats();

    return () => {
      ignore = true;
    };
  }, [reloadTrigger]);

  // Realtime subscription — bumps reloadTrigger whenever bookings change
  useEffect(() => {
    const channel = supabase
      .channel("dashboard-bookings-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          setReloadTrigger((n) => n + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading || !stats) {
    return <Spinner label="Loading dashboard" fullScreen />;
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-(--text)">Dashboard</h1>
      <p className="mt-1 text-sm text-gray-500">
        Welcome back, Admin! Here&apos;s what&apos;s happening with your turf.
      </p>

      <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        <StatCard
          label="Total Bookings"
          value={stats.totalBookings}
          icon={FaCalendarAlt}
          trend={
            <TrendBadge
              current={stats.last7Bookings}
              previous={stats.prev7Bookings}
            />
          }
        />
        <StatCard
          label="Pending Payments"
          value={stats.pending}
          icon={FaClock}
          viewAllHref="/admin/bookings"
        />
        <StatCard
          label="Confirmed Bookings"
          value={stats.confirmed}
          icon={FaCheckCircle}
          viewAllHref="/admin/bookings"
        />
        <StatCard
          label="Cancelled Bookings"
          value={stats.cancelled}
          icon={FaTimesCircle}
          viewAllHref="/admin/bookings"
        />
        <StatCard
          label="Total Revenue"
          value={`₦${formatCurrency(stats.totalRevenue)}`}
          icon={FaWallet}
          trend={
            <TrendBadge
              current={stats.last7Revenue}
              previous={stats.prev7Revenue}
            />
          }
        />
      </div>
    </div>
  );
}
