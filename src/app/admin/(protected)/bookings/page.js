"use client";
import { updateBookingStatusAction } from "./actions";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { supabase } from "@/lib/supabaseClient";
import formatCurrency from "@/utils/formatCurrency";
import Spinner from "@/app/components/Spinner";

const TABS = ["All", "Pending", "Confirmed", "Cancelled"];
const PAGE_SIZE = 10;

const STATUS_STYLES = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

const formatStatusLabel = (status) => {
  const normalized = String(status || "").trim();
  if (!normalized) return "Pending";

  return normalized
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [bookings, setBookings] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  useEffect(() => {
    let ignore = false;

    async function loadBookings() {
      setIsLoading(true);

      let query = supabase
        .from("bookings")
        .select("*", { count: "exact" })
        .order("start_at", { ascending: false });

      if (activeTab !== "All") {
        query = query.eq("status", activeTab.toLowerCase());
      }

      const from = (page - 1) * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;

      if (ignore) return;

      if (error) {
        console.error("Error fetching bookings:", error);
      } else {
        setBookings(data || []);
        setTotalCount(count || 0);
      }

      setIsLoading(false);
    }

    loadBookings();

    return () => {
      ignore = true;
    };
  }, [activeTab, page, reloadTrigger]);

  useEffect(() => {
    const channel = supabase
      .channel("bookings-page-changes")
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

  function handleTabChange(tab) {
    setActiveTab(tab);
    setPage(1);
  }

  async function handleStatusChange(id, newStatus) {
    setActioningId(id);

    try {
      await updateBookingStatusAction(id, newStatus);
      setReloadTrigger((n) => n + 1);
    } catch (err) {
      alert("Could not update booking: " + err.message);
    }

    setActioningId(null);
  }
  if (isLoading && bookings.length === 0) {
    return <Spinner label="Loading bookings" />;
  }

  return (
    <div className="w-full">
      <h1 className="text-xl font-bold text-(--text) md:text-2xl">Bookings</h1>

      <div className="mt-4 flex flex-wrap gap-2 border-b border-gray-200">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`border-b-2 px-3 py-2 text-sm font-bold ${
              activeTab === tab
                ? "border-(--primary) text-(--primary)"
                : "border-transparent text-gray-500 hover:text-(--text)"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-4 hidden overflow-hidden rounded-xl border border-gray-200 bg-white md:block">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs text-gray-500">
              <tr>
                <th className="p-3 font-bold">ID</th>
                <th className="p-3 font-bold">Date</th>
                <th className="p-3 font-bold">Time</th>
                <th className="p-3 font-bold">Customer</th>
                <th className="p-3 font-bold">Players</th>
                <th className="p-3 font-bold">Amount</th>
                <th className="p-3 font-bold">Status</th>
                <th className="p-3 font-bold">Action</th>
              </tr>
            </thead>
            <tbody>
              {!isLoading && bookings.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-4 text-center text-gray-400">
                    No bookings found.
                  </td>
                </tr>
              )}

              {!isLoading &&
                bookings.map((booking) => (
                  <tr key={booking.id} className="border-t border-gray-100">
                    <td
                      className="p-3 font-mono text-xs font-bold"
                      title={booking.id}
                    >
                      {booking.id.slice(0, 8)}
                    </td>
                    <td className="p-3 text-xs">
                      {format(new Date(booking.start_at), "MMM d, yyyy")}
                    </td>
                    <td className="p-3 text-xs">
                      {format(new Date(booking.start_at), "h:mm a")} –{" "}
                      {format(new Date(booking.end_at), "h:mm a")}
                    </td>
                    <td className="p-3 text-xs">{booking.user_full_name}</td>
                    <td className="p-3 text-xs">{booking.players}</td>
                    <td className="p-3 text-xs">
                      ₦{formatCurrency(booking.total)}
                    </td>
                    <td className="p-3 text-xs">
                      <span
                        className={`inline-block rounded px-2 py-0.5 text-xs font-semibold ${
                          STATUS_STYLES[booking.status] ||
                          "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {formatStatusLabel(booking.status)}
                      </span>
                    </td>
                    <td className="p-3">
                      {booking.status === "pending" ? (
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(booking.id, "confirmed")
                            }
                            disabled={actioningId === booking.id}
                            className="cursor-pointer rounded border border-green-600 px-2 py-1 text-xs text-green-700 disabled:opacity-50"
                          >
                            Confirm
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              handleStatusChange(booking.id, "cancelled")
                            }
                            disabled={actioningId === booking.id}
                            className="cursor-pointer rounded border border-red-600 px-2 py-1 text-xs text-red-700 disabled:opacity-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-400">–</span>
                      )}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 space-y-3 md:hidden">
        {!isLoading && bookings.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-4 text-center text-gray-400">
            No bookings found.
          </div>
        )}

        {!isLoading &&
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex flex-col gap-3 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="font-mono text-[11px] font-bold text-gray-700">
                  {booking.id.slice(0, 8)}
                </div>
                <span
                  className={`inline-block rounded px-2 py-0.5 text-[10px] font-semibold ${
                    STATUS_STYLES[booking.status] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {booking.status}
                </span>
              </div>

              <div className="flex flex-col gap-1 text-sm text-gray-600">
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium text-gray-800">
                    {format(new Date(booking.start_at), "MMM d, yyyy")}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium text-gray-800">
                    {format(new Date(booking.start_at), "h:mm a")} –{" "}
                    {format(new Date(booking.end_at), "h:mm a")}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Customer</span>
                  <span className="font-medium text-gray-800">
                    {booking.user_full_name}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Players</span>
                  <span className="font-medium text-gray-800">
                    {booking.players}
                  </span>
                </div>
                <div className="flex justify-between gap-3">
                  <span className="text-gray-500">Amount</span>
                  <span className="font-medium text-gray-800">
                    ₦{formatCurrency(booking.total)}
                  </span>
                </div>
              </div>

              {booking.status === "pending" && (
                <div className="mt-1 flex gap-2">
                  <button
                    onClick={() => handleStatusChange(booking.id, "confirmed")}
                    disabled={actioningId === booking.id}
                    className="flex-1 cursor-pointer rounded border border-green-600 px-2 py-2 text-xs font-medium text-green-700 disabled:opacity-50"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking.id, "cancelled")}
                    disabled={actioningId === booking.id}
                    className="flex-1 cursor-pointer rounded border border-red-600 px-2 py-2 text-xs font-medium text-red-700 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
      </div>

      {totalCount > 0 && (
        <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-bold">
            Showing {(page - 1) * PAGE_SIZE + 1} to{" "}
            {Math.min(page * PAGE_SIZE, totalCount)} of {totalCount} bookings
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
            >
              Prev
            </button>
            <span className="px-2 py-1 text-xs font-bold">
              {page} / {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded border border-gray-300 px-3 py-1 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
