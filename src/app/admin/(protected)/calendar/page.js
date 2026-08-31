"use client";

import { useEffect, useState } from "react";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { FaChevronLeft, FaChevronRight, FaPlus, FaTimes } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import formatCurrency from "@/utils/formatCurrency";
import Spinner from "@/app/components/Spinner";
import { createBlockedDateAction } from "./actions";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

const STATUS_STYLES = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
};

function BlockDateModal({ onClose, onSaved }) {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!startDate || !endDate) return;

    setIsSaving(true);
    setError("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      await createBlockedDateAction({
        start_at: new Date(`${startDate}T00:00:00`).toISOString(),
        end_at: new Date(`${endDate}T23:59:59`).toISOString(),
        reason,
        created_by: user?.id || null,
      });

      onSaved();
      onClose();
    } catch (err) {
      setError(err.message);
    }
    setIsSaving(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-sm rounded-xl bg-white p-5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-(--text)">Block Date</h2>
          <button onClick={onClose} aria-label="Close">
            <FaTimes size={14} className="text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {error && <p className="text-xs text-red-600">{error}</p>}

          <div>
            <label className="block text-xs font-medium text-gray-500">
              From
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500">
              To
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500">
              Reason (optional)
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g. Maintenance"
              className="mt-1 w-full rounded border border-gray-300 p-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full rounded bg-(--primary) py-2.5 text-sm text-white disabled:opacity-60"
          >
            {isSaving ? "Saving..." : "Block Date"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function CalendarPage() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [monthBookings, setMonthBookings] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reloadTrigger, setReloadTrigger] = useState(0);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setIsLoading(true);

      const monthStart = startOfMonth(viewDate);
      const monthEnd = endOfMonth(viewDate);

      const [bookingsRes, blockedRes] = await Promise.all([
        supabase
          .from("bookings")
          .select("id, start_at, end_at, status, user_full_name, total")
          .gte("start_at", monthStart.toISOString())
          .lte("start_at", monthEnd.toISOString())
          .neq("status", "cancelled"),
        supabase
          .from("blocked")
          .select("*")
          .lte("start_at", monthEnd.toISOString())
          .gte("end_at", monthStart.toISOString()),
      ]);

      if (ignore) return;

      setMonthBookings(bookingsRes.data || []);
      setBlockedDates(blockedRes.data || []);
      setIsLoading(false);
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [viewDate, reloadTrigger]);

  useEffect(() => {
    const channel = supabase
      .channel("calendar-page-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bookings" },
        () => {
          setReloadTrigger((n) => n + 1);
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "blocked" },
        () => {
          setReloadTrigger((n) => n + 1);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const gridStart = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function hasBookings(day) {
    return monthBookings.some((b) => isSameDay(new Date(b.start_at), day));
  }

  function isBlocked(day) {
    return blockedDates.some((b) => {
      const start = new Date(b.start_at);
      const end = new Date(b.end_at);
      return (
        day >= new Date(start.toDateString()) &&
        day <= new Date(end.toDateString())
      );
    });
  }

  const selectedDayBookings = monthBookings
    .filter((b) => isSameDay(new Date(b.start_at), selectedDate))
    .sort((a, b) => new Date(a.start_at) - new Date(b.start_at));

  const upcomingBlocked = [...blockedDates].sort(
    (a, b) => new Date(a.start_at) - new Date(b.start_at),
  );

  return (
    <div className="w-full pb-20">
      <h1 className="text-xl font-bold text-(--text) md:text-2xl">Calendar</h1>

      <div className="mt-4 flex flex-col gap-6 lg:grid lg:grid-cols-2">
        {/* Calendar */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setViewDate((d) => subMonths(d, 1))}
              aria-label="Previous month"
            >
              <FaChevronLeft size={12} className="text-(--text)" />
            </button>
            <span className="text-sm font-bold text-(--text)">
              {format(viewDate, "MMMM yyyy")}
            </span>
            <button
              onClick={() => setViewDate((d) => addMonths(d, 1))}
              aria-label="Next month"
            >
              <FaChevronRight size={12} className="text-(--text)" />
            </button>
          </div>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS.map((d) => (
              <span key={d} className="text-xs text-gray-400">
                {d}
              </span>
            ))}
          </div>

          <div className="mt-2 grid grid-cols-7 gap-1 text-center">
            {days.map((day) => {
              const outsideMonth = !isSameMonth(day, viewDate);
              const blocked = isBlocked(day);
              const booked = hasBookings(day);
              const selected = isSameDay(day, selectedDate);
              const todayFlag = isToday(day);

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`relative aspect-square rounded-full text-sm transition-colors
                    ${outsideMonth ? "text-gray-300" : "text-(--text)"}
                    ${selected ? "bg-(--primary) text-white font-semibold" : ""}
                    ${!selected && blocked ? "bg-red-100 text-red-700" : ""}
                    ${!selected && todayFlag ? "font-bold text-(--primary)" : ""}
                    hover:bg-(--primary)/10
                  `}
                >
                  {format(day, "d")}
                  {booked && !selected && (
                    <span className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-(--primary)" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day bookings */}
        <div className="rounded-xl border border-gray-200 bg-white p-4">
          <h2 className="text-sm font-bold text-(--text)">
            Bookings for {format(selectedDate, "MMMM d, yyyy")}
          </h2>

          {isLoading ? (
            <div className="mt-4">
              <Spinner label="Loading" />
            </div>
          ) : selectedDayBookings.length === 0 ? (
            <p className="mt-3 text-sm text-gray-400">
              No bookings for this day.
            </p>
          ) : (
            <div className="mt-3 space-y-2">
              {selectedDayBookings.map((b) => (
                <div
                  key={b.id}
                  className="rounded-lg border border-gray-100 p-3 text-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-(--text)">
                      {b.user_full_name}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-xs font-semibold ${
                        STATUS_STYLES[b.status] || "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {format(new Date(b.start_at), "h:mm a")} –{" "}
                    {format(new Date(b.end_at), "h:mm a")}
                    {" · "}₦{formatCurrency(b.total)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Blocked Dates panel */}
      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-(--text)">Blocked Dates</h2>
          <button
            onClick={() => setShowBlockModal(true)}
            className="flex items-center gap-1 rounded bg-(--primary) px-3 py-1.5 text-xs text-white"
          >
            <FaPlus size={10} />
            Block Date
          </button>
        </div>

        {upcomingBlocked.length === 0 ? (
          <p className="mt-3 text-sm text-gray-400">No blocked dates.</p>
        ) : (
          <div className="mt-3 space-y-2">
            {upcomingBlocked.map((b) => {
              const sameDay = isSameDay(
                new Date(b.start_at),
                new Date(b.end_at),
              );
              return (
                <div
                  key={b.id}
                  className="flex items-center justify-between rounded-lg border border-gray-100 p-3 text-sm"
                >
                  <div>
                    <p className="font-medium text-(--text)">
                      {sameDay
                        ? format(new Date(b.start_at), "MMMM d, yyyy")
                        : `${format(new Date(b.start_at), "MMM d")} – ${format(new Date(b.end_at), "MMM d, yyyy")}`}
                    </p>
                    {b.reason && (
                      <p className="text-xs text-gray-500">{b.reason}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">All Day</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showBlockModal && (
        <BlockDateModal
          onClose={() => setShowBlockModal(false)}
          onSaved={() => setReloadTrigger((n) => n + 1)}
        />
      )}
    </div>
  );
}
