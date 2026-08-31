"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { format } from "date-fns";
import { FaCheckCircle, FaHome, FaRegCopy, FaCheck } from "react-icons/fa";

import formatCurrency from "@/utils/formatCurrency";

function getDurationDisplay(startAt, endAt) {
  const ms = new Date(endAt) - new Date(startAt);
  const minutes = Math.round(ms / (1000 * 60));
  const hours = minutes / 60;

  if (minutes >= 60) {
    return `${hours % 1 === 0 ? hours : hours.toFixed(1)} hr${hours > 1 ? "s" : ""}`;
  }
  return `${minutes} min${minutes > 1 ? "s" : ""}`;
}

export default function BookingConfirmation({ booking, bookingId }) {
  const confirmationRef = useRef(null);
  const [copied, setCopied] = useState(false);

  function handleCopyId() {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function downloadAsImage() {
    if (!confirmationRef.current) return;
    const canvas = await html2canvas(confirmationRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    const link = document.createElement("a");
    link.download = `booking-${bookingId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function downloadAsPDF() {
    if (!confirmationRef.current) return;
    const canvas = await html2canvas(confirmationRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(`booking-${bookingId}.pdf`);
  }

  return (
    <div className="space-y-4 text-center relative shadow p-6 rounded flex flex-col items-center">
      <div
        ref={confirmationRef}
        className="space-y-4 flex flex-col items-center"
      >
        <FaCheckCircle color="var(--primary)" size={50} aria-hidden="true" />
        <h2 className="text-xl font-bold text-(--primary)">
          Booking Received!
        </h2>
        <p>Your pitch has been successfully booked.</p>

        <p className="text-sm font-bold flex flex-col items-center gap-2">
          Booking ID:
          <span className="flex flex-col items-center gap-3">
            <span className="font-extrabold">{bookingId}</span>
            <button
              type="button"
              onClick={handleCopyId}
              aria-label="Copy booking ID"
              className="text-(--primary)"
            >
              {copied ? (
                <FaCheck size={14} />
              ) : (
                <FaRegCopy size={14} aria-hidden="true" />
              )}
            </button>
          </span>
          {copied && <span className="text-xs text-(--primary)">Copied!</span>}
        </p>

        <p className="text-sm font-bold">
          Date:{" "}
          <span className="font-extrabold">
            {format(new Date(booking.start_at), "EEEE, MMMM d, yyyy")}
          </span>
        </p>

        <p className="text-sm font-bold">
          Time:{" "}
          <span className="font-extrabold">
            {format(new Date(booking.start_at), "h:mm a")} –{" "}
            {format(new Date(booking.end_at), "h:mm a")}
          </span>
        </p>

        <p className="text-sm font-bold">
          Duration:{" "}
          <span className="font-extrabold">
            {getDurationDisplay(booking.start_at, booking.end_at)}
          </span>
        </p>

        <p className="text-sm font-bold">
          Total Amount:{" "}
          <span className="font-extrabold">
            ₦{formatCurrency(booking.total)}
          </span>
        </p>
        <p className="text-sm font-bold">
          Promo Code:{" "}
          <span className="font-extrabold">{booking.promo_code || "None"}</span>
        </p>
        <p className="text-sm font-bold">
          Discount Applied:{" "}
          <span className="font-extrabold">₦{booking.discount}</span>
        </p>

        <div className="bg-amber-100 p-2 rounded w-full">
          <p className="font-semibold">Payment on Arrival</p>
          <p className="text-xs">
            Please pay the total amount when you arrive at the turf.
          </p>
        </div>

        <p className="text-sm">
          We&apos;ve sent a confirmation email to{" "}
          <span className="font-extrabold">{booking.user_email}</span>
        </p>
      </div>

      <div className="flex gap-3">
        <button
          onClick={downloadAsImage}
          className="border border-(--primary) text-(--primary) px-4 py-2 rounded text-xs cursor-pointer"
        >
          Download as Image
        </button>
        <button
          onClick={downloadAsPDF}
          className="border border-(--primary) text-(--primary) px-4 py-2 rounded text-xs cursor-pointer"
        >
          Download as PDF
        </button>
      </div>

      <Link
        href="/"
        className="bg-(--primary) text-(--white) px-8 py-3.5 flex items-center gap-2 rounded text-xs transition-all duration-300 ease-out hover:translate-x-1"
      >
        Back to Home
        <FaHome color="var(--white)" size={20} aria-hidden="true" />
      </Link>
    </div>
  );
}
