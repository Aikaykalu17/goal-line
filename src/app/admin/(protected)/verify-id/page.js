"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import formatCurrency from "@/utils/formatCurrency";
import SpinnerMini from "@/app/components/SpinnerMini";
import { updateBookingExtraTimeAction, verifyBookingIdAction } from "./actions";

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
  const [result, setResult] = useState(null); // "not-found" | booking object
  const [hasSearched, setHasSearched] = useState(false);
  const [extraTimeMessage, setExtraTimeMessage] = useState("");

  async function handleVerify(e) {
    e.preventDefault();
    const id = query.trim();

    if (!id) return;

    setIsSearching(true);
    setHasSearched(true);
    setResult(null);
    setExtraTimeMessage("");

    const booking = await verifyBookingIdAction(id);

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
      <h1 className="text-xl font-bold text-(--text)">Verify Booking ID</h1>
      <p className="mt-1 text-xs text-gray-500 font-medium">
        Enter a booking ID to verify its validity.
      </p>

      <form
        onSubmit={handleVerify}
        className="flex flex-col mt-4 md:flex md:flex-row gap-3 max-w-md"
      >
        <input
          type="text"
          placeholder="e.g. 1a2b3c4d"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 border border-gray-300 rounded p-2 text-sm"
        />
        <button
          type="submit"
          disabled={isSearching}
          className="flex items-center justify-center gap-2 bg-(--primary) text-(--white) px-4 py-2 rounded text-xs disabled:opacity-60 cursor-pointer"
        >
          {isSearching ? (
            <>
              <SpinnerMini />
              <span className="text-xs">Verifying...</span>
            </>
          ) : (
            <>
              <FaSearch size={12} aria-hidden="true" />
              <span className="text-xs">Verify ID</span>
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
            <div className={`rounded-lg p-4 space-y-3 ${resultCardClasses}`}>
              <p className="flex flex-col items-center gap-2 font-semibold text-green-700 md:flex md:flex-row md:items-center">
                <span className="flex items-center gap-2">
                  <FaCheckCircle />
                  Booking ID:
                </span>
                <span className="font-mono text-xs">{result.id}</span>
              </p>
              <p className="text-sm font-bold">
                Status:{" "}
                <span
                  className={`inline-block px-2 py-0.5 rounded text-xs font-bold border  ${
                    STATUS_STYLES[bookingStatus] || "bg-gray-100 text-gray-700"
                  }`}
                >
                  {formatStatusText(bookingStatus)}
                </span>
              </p>
              <p className="text-sm font-bold">
                Date:{" "}
                <span className="font-medium">
                  {format(new Date(result.start_at), "MMMM d, yyyy")}
                </span>
              </p>
              <p className="text-sm font-bold">
                Time:{" "}
                <span className="font-medium">
                  {format(new Date(result.start_at), "h:mm a")} –{" "}
                  {format(new Date(result.end_at), "h:mm a")}
                </span>
              </p>
              <p className="text-sm font-bold">
                Customer:{" "}
                <span className="font-medium">{result.user_full_name}</span>
              </p>
              <p className="text-sm font-bold">
                Booking Type:{" "}
                <span className="font-medium">
                  {String(result.notes || "").includes("booking_type:open")
                    ? "Open to others"
                    : String(result.notes || "").includes("booking_type:solo")
                      ? "Solo / Individual"
                      : "Private booking"}
                </span>
              </p>
              <p className="text-sm font-bold">
                Amount:{" "}
                <span className="font-medium">
                  ₦{formatCurrency(result.total)}
                </span>
              </p>

              {rawBookingStatus === "confirmed" ? (
                <div className="rounded border border-dashed border-gray-300 bg-white/60 p-3">
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
                      className="flex-1 rounded border border-gray-300 p-2 text-sm"
                    />
                    <button
                      type="button"
                      onClick={handleExtraTimeSave}
                      disabled={isUpdatingExtraTime}
                      className="rounded bg-(--primary) px-3 py-2 text-xs font-semibold text-white disabled:opacity-60 cursor-pointer"
                    >
                      {isUpdatingExtraTime ? "Saving..." : "Save"}
                    </button>
                  </div>
                  {extraTimeMessage && (
                    <p className="mt-2 text-xs font-medium text-gray-700">
                      {extraTimeMessage}
                    </p>
                  )}
                </div>
              ) : (
                <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs font-medium text-amber-800">
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
