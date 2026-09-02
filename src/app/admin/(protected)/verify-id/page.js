"use client";

import { useState } from "react";
import { format } from "date-fns";
import { FaSearch, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { supabase } from "@/lib/supabaseClient";
import formatCurrency from "@/utils/formatCurrency";
import SpinnerMini from "@/app/components/SpinnerMini";

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
  const [result, setResult] = useState(null); // "not-found" | booking object
  const [hasSearched, setHasSearched] = useState(false);

  async function handleVerify(e) {
    e.preventDefault();
    const id = query.trim();

    if (!id) return;

    setIsSearching(true);
    setHasSearched(true);
    setResult(null);

    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    setIsSearching(false);

    if (error) {
      // Postgres error 22P02 = malformed input for uuid type (e.g. not a valid UUID at all)
      console.error("Verify ID error:", error);
      setResult("not-found");
      return;
    }

    setResult(data || "not-found");
  }

  const isBookingResult = result && result !== "not-found";
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
          className="flex items-center justify-center gap-2 bg-(--primary) text-white px-4 py-2 rounded text-sm disabled:opacity-60"
        >
          {isSearching ? (
            <>
              <SpinnerMini />
              <span className="text-xs">Verifying...</span>
            </>
          ) : (
            <>
              <FaSearch size={12} />
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
            <div className={`rounded-lg p-4 space-y-2 ${resultCardClasses}`}>
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
                Amount:{" "}
                <span className="font-medium">
                  ₦{formatCurrency(result.total)}
                </span>
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
