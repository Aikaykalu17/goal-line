"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Spinner from "@/app/components/Spinner";
import { getReportsAction } from "./actions";

const today = new Date();
const defaultStart = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
  .toISOString()
  .slice(0, 10);
const defaultEnd = new Date(today.getTime()).toISOString().slice(0, 10);

export default function ReportsPage() {
  const [startDate, setStartDate] = useState(defaultStart);
  const [endDate, setEndDate] = useState(defaultEnd);
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadReport() {
    setLoading(true);
    setError("");

    try {
      const nextReport = await getReportsAction({ startDate, endDate });
      setReport(nextReport);
    } catch (err) {
      setError(err?.message || "Could not load report.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    let ignore = false;

    async function fetchReport() {
      setLoading(true);
      setError("");

      try {
        const nextReport = await getReportsAction({ startDate, endDate });
        if (!ignore) {
          setReport(nextReport);
        }
      } catch (err) {
        if (!ignore) {
          setError(err?.message || "Could not load report.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchReport();

    return () => {
      ignore = true;
    };
  }, [startDate, endDate]);

  const chart = report?.chart || [];
  const promoUsage = report?.promoUsage || [];
  const stats = report?.stats || {
    totalBookings: 0,
    confirmed: 0,
    pending: 0,
    cancelled: 0,
    revenue: 0,
  };

  const hasRevenue = chart.some((item) => Number(item.value || 0) > 0);
  const chartMax =
    chart.reduce((max, item) => Math.max(max, Number(item.value || 0)), 0) || 1;

  function exportCsv() {
    if (!report?.bookings?.length) return;

    const rows = [
      ["id", "created_at", "status", "total", "promo_code"],
      ...report.bookings.map((booking) => [
        booking.id,
        booking.created_at ?? "",
        booking.status ?? "",
        Number(booking.total || 0),
        booking.promo_code ?? "",
      ]),
    ];

    const csv = rows
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `reports-${startDate}-to-${endDate}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  return (
    <div className="w-full max-w-full overflow-hidden pb-20">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="min-w-0">
          <h1 className="text-xl font-bold text-(--text) md:text-2xl">
            Reports
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Daily performance and promo usage across your booking window.
          </p>
        </div>

        <div className="grid w-full gap-2 sm:grid-cols-2 xl:w-auto xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto_auto] xl:items-end">
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
            Start date
            <input
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm xl:min-w-[150px]"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-medium text-gray-600">
            End date
            <input
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm xl:min-w-[150px]"
            />
          </label>
          <button
            type="button"
            onClick={loadReport}
            className="h-[42px] w-full rounded-xl bg-(--forest) px-4 py-2 text-sm font-semibold text-white sm:w-auto xl:self-end"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={!report?.bookings?.length}
            className="h-10.5 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto xl:self-end"
          >
            Export CSV
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {loading ? (
        <div className="mt-6 w-full min-h-[300px] rounded-2xl border border-gray-200 bg-white p-4">
          <Spinner
            label="Loading report"
            fullScreen={false}
            variant="inner-page"
          />
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard label="Bookings" value={stats.totalBookings} />
            <StatCard label="Confirmed" value={stats.confirmed} />
            <StatCard label="Pending" value={stats.pending} />
            <StatCard label="Cancelled" value={stats.cancelled} />
            <StatCard
              label="Revenue"
              value={`₦${Number(stats.revenue || 0).toLocaleString()}`}
              highlight
            />
          </div>

          <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="text-base font-bold text-slate-900">
                Revenue chart
              </h2>

              {!hasRevenue ? (
                <p className="mt-6 text-sm text-gray-400">
                  No revenue data for this date range.
                </p>
              ) : (
                <div className="mt-5 h-60 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={chart}
                      margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="day"
                        tickLine={false}
                        axisLine={false}
                        fontSize={10}
                      />
                      <YAxis tickLine={false} axisLine={false} fontSize={10} />
                      <Tooltip
                        formatter={(value) => [
                          `₦${Number(value).toLocaleString()}`,
                          "Revenue",
                        ]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Bar
                        dataKey="value"
                        fill="#0d7a5f"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 sm:p-5">
              <h2 className="text-base font-bold text-slate-900">
                Promo usage
              </h2>
              <div className="mt-4 space-y-3">
                {promoUsage.length === 0 && (
                  <p className="text-sm text-gray-400">No promo usage yet.</p>
                )}

                {promoUsage.map((item) => (
                  <div
                    key={item.code}
                    className="flex items-center justify-between gap-3 rounded-xl bg-gray-50 px-3 py-2"
                  >
                    <span className="truncate text-sm font-semibold text-slate-700">
                      {item.code}
                    </span>
                    <span className="shrink-0 rounded-full bg-emerald-100 px-2 py-1 text-[10px] font-bold text-emerald-700">
                      {item.count} use{item.count > 1 ? "s" : ""}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, highlight = false }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-4">
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-gray-500 sm:text-xs">
        {label}
      </p>
      <p
        className={`mt-3 text-xl font-bold sm:text-2xl ${
          highlight ? "text-(--forest)" : "text-slate-900"
        }`}
      >
        {value}
      </p>
    </div>
  );
}
