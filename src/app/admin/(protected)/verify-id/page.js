"use client";

import { useState } from "react";
import { format } from "date-fns";
import {
  FaSearch,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
} from "react-icons/fa";
import formatCurrency from "@/utils/formatCurrency";
import SpinnerMini from "@/app/components/SpinnerMini";
import {
  updateBookingExtraTimeAction,
  verifyBookingCodeAction,
} from "./actions";

const STATUS_STYLES = {
  confirmed: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  cancelled: "bg-red-100 text-red-700",
  expired: "bg-red-100 text-red-700",
};

function formatStatusText(status) {
  const normalized = String(status || "").trim();
  if (!normalized) return "Pending";

  const title = normalized
    .toLowerCase()
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return title === "Expired" ? "Expired Booking" : title;
}

function getBookingStatus(booking) {
  const status = String(booking?.status || "")
    .trim()
    .toLowerCase();

  if (status === "pending") {
    const createdAt = booking?.created_at ? new Date(booking.created_at) : null;
    if (createdAt && !Number.isNaN(createdAt.getTime())) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (createdAt < today) {
        return "expired";
      }
    }
  }

  return status || "pending";
}

export default function VerifyIdPage() {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isUpdatingExtraTime, setIsUpdatingExtraTime] = useState(false);
  const [extraMinutes, setExtraMinutes] = useState(30);
  const [result, setResult] = useState(null); //
  const [hasSearched, setHasSearched] = useState(false);
  const [extraTimeMessage, setExtraTimeMessage] = useState("");

  async function handleVerify(e) {
    e.preventDefault();
    const code = query.trim();

    if (!code) return;

    setIsSearching(true);
    setHasSearched(true);
    setResult(null);
    setExtraTimeMessage("");

    const booking = await verifyBookingCodeAction(code);

    setIsSearching(false);
    setResult(booking || "not-found");
    setQuery("");
  }

  async function handleExtraTimeSave() {
    if (!result || result === "not-found") return;

    const rawStatus = String(result.status || "")
      .trim()
      .toLowerCase();
    if (rawStatus !== "confirmed") {
      setExtraTimeMessage(
        "Extra time editing is available only for confirmed bookings.",
      );
      return;
    }

    setIsUpdatingExtraTime(true);
    setExtraTimeMessage("");

    try {
      const payload = await updateBookingExtraTimeAction(
        result.id,
        Number(extraMinutes) || 0,
      );
      setResult((current) => ({
        ...current,
        end_at: payload.newEndAt,
        duration_minutes:
          Number(current.duration_minutes || 0) + payload.minutesAdded,
        total: payload.newTotal,
      }));
      setExtraTimeMessage(
        `Extra time added successfully: ${payload.minutesAdded} minutes.`,
      );
    } catch (error) {
      setExtraTimeMessage(error?.message || "Could not update extra time.");
    } finally {
      setIsUpdatingExtraTime(false);
    }
  }

  const isBookingResult = result && result !== "not-found";
  const rawBookingStatus = isBookingResult
    ? String(result.status || "")
        .trim()
        .toLowerCase()
    : null;
  const bookingStatus = isBookingResult ? getBookingStatus(result) : null;
  const resultCardClasses =
    bookingStatus === "confirmed"
      ? "bg-green-100"
      : bookingStatus === "expired"
        ? "bg-red-100"
        : bookingStatus === "cancelled"
          ? "bg-red-100"
          : "bg-amber-50";

  return (
    <div>
      <h1 className="text-xl font-bold text-(--text)">Verify Booking Code</h1>
      <p className="mt-1 text-xs text-gray-500 font-medium">
        Enter a booking CODE to verify its validity.
      </p>

      <form
        onSubmit={handleVerify}
        className="flex flex-col mt-4 md:flex-row gap-3 max-w-md"
      >
        <div className="relative flex-1">
          <FaSearch
            size={12}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            type="text"
            placeholder="e.g. GLT-2323-89769"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-xl bg-gray-50/60 py-2.5 pl-9 pr-3 text-sm outline-none transition-colors focus:border-(--forest) focus:bg-white focus:ring-2 focus:ring-(--forest)/15"
          />
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="flex items-center justify-center gap-2 rounded-xl bg-(--forest) px-5 py-2.5 text-xs font-semibold text-(--white) transition-all duration-300 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
        >
          {isSearching ? (
            <>
              <SpinnerMini />
              <span>Verifying...</span>
            </>
          ) : (
            <>
              <FaSearch size={12} aria-hidden="true" />
              <span>Verify Code</span>
            </>
          )}
        </button>
      </form>

      {hasSearched && !isSearching && (
        <div className="mt-6 max-w-md">
          {result === "not-found" && (
            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700">
              <FaTimesCircle />
              No booking found matching that ID.
            </div>
          )}

          {isBookingResult && (
            <div className={`rounded-2xl p-5 space-y-4 ${resultCardClasses}`}>
              {/* Header: Booking code + status */}
              <div className="flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-green-100">
                    <FaCheckCircle
                      className="text-green-700"
                      size={16}
                      aria-hidden="true"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-500">
                      Booking Code
                    </p>
                    <p className="font-mono text-sm font-bold text-(--text)">
                      {result.booking_code}
                    </p>
                  </div>
                </div>

                <span
                  className={`inline-flex w-fit items-center rounded-full border px-3 py-1 text-xs font-bold ${
                    STATUS_STYLES[bookingStatus] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {formatStatusText(bookingStatus)}
                </span>
              </div>

              {/* Booking details */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                    Date
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-(--text)">
                    {format(new Date(result.start_at), "MMMM d, yyyy")}
                  </p>
                </div>

                <div className="rounded-xl bg-white/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                    Time
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-(--text)">
                    {format(new Date(result.start_at), "h:mm a")} –{" "}
                    {format(new Date(result.end_at), "h:mm a")}
                  </p>
                </div>

                <div className="rounded-xl bg-white/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                    Customer
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-(--text)">
                    {result.user_full_name}
                  </p>
                </div>

                <div className="rounded-xl bg-white/60 p-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                    Booking Type
                  </p>
                  <p className="mt-0.5 text-sm font-semibold text-(--text)">
                    {String(result.notes || "").includes("booking_type:open")
                      ? "Open to others"
                      : String(result.notes || "").includes("booking_type:solo")
                        ? "Solo / Individual"
                        : "Private booking"}
                  </p>
                </div>

                <div className="rounded-xl bg-white/60 p-3 sm:col-span-2">
                  <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-gray-500">
                    Amount
                  </p>
                  <p className="mt-0.5 text-sm font-bold text-(--primary)">
                    ₦{formatCurrency(result.total)}
                  </p>
                </div>
              </div>

              {/* Extra time / status notice */}
              {rawBookingStatus === "confirmed" ? (
                <div className="rounded-xl border border-dashed border-gray-300 bg-white/60 p-4">
                  <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-gray-600">
                    Add extra time (minutes)
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="15"
                      step="15"
                      value={extraMinutes}
                      onChange={(e) => setExtraMinutes(e.target.value)}
                      className="flex-1 rounded-lg border border-gray-300 bg-white p-2.5 text-sm outline-none transition-colors focus:border-(--forest) focus:ring-2 focus:ring-(--forest)/15"
                    />
                    <button
                      type="button"
                      onClick={handleExtraTimeSave}
                      disabled={isUpdatingExtraTime}
                      className="flex items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2.5 text-xs font-semibold text-white transition-all duration-300 hover:shadow-md disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                    >
                      {isUpdatingExtraTime ? (
                        <>
                          <SpinnerMini />
                          Saving
                        </>
                      ) : (
                        "Save"
                      )}
                    </button>
                  </div>
                  {extraTimeMessage && (
                    <p className="mt-2 text-xs font-medium text-gray-700">
                      {extraTimeMessage}
                    </p>
                  )}
                </div>
              ) : (
                <div className="flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 p-3.5 text-xs font-medium text-amber-800">
                  <FaClock
                    className="mt-0.5 shrink-0"
                    size={12}
                    aria-hidden="true"
                  />
                  Extra time is available only for confirmed bookings.
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
