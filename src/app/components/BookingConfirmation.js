"use client";

import { useRef, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Link from "next/link";
import { format } from "date-fns";
import { FaCheckCircle, FaHome, FaRegCopy, FaCheck } from "react-icons/fa";

import getDurationDisplay from "@/utils/durationDisplay";

import formatCurrency from "@/utils/formatCurrency";

export default function BookingConfirmation({ booking, bookingId }) {
  const confirmationRef = useRef(null);
  const [copied, setCopied] = useState(false);

  function handleCopyId() {
    navigator.clipboard.writeText(bookingId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const ticketWidthPx = 400;
  const ticketHeightPx = 200 * 3.7795275591;
  const innerTicketWidth = 385;

  async function downloadAsImage() {
    if (!confirmationRef.current) return;
    const { scrollWidth, scrollHeight } = confirmationRef.current;
    const canvas = await html2canvas(confirmationRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      width: scrollWidth,
      height: scrollHeight,
    });
    const link = document.createElement("a");
    link.download = `booking-${bookingId}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  }

  async function downloadAsPDF() {
    if (!confirmationRef.current) return;
    const { scrollWidth, scrollHeight } = confirmationRef.current;
    const canvas = await html2canvas(confirmationRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      useCORS: true,
      width: scrollWidth,
      height: scrollHeight,
    });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width + 16, canvas.height + 16],
    });
    pdf.addImage(imgData, "PNG", 8, 8, canvas.width, canvas.height);
    pdf.save(`booking-${bookingId}.pdf`);
  }

  return (
    <div
      className="space-y-4 text-center relative shadow rounded flex flex-col items-center"
      style={{
        backgroundColor: "#ffffff",
        width: "100%",
        maxWidth: `${ticketWidthPx}px`,
        minHeight: `${ticketHeightPx}px`,
        padding: "0.875rem 0.875rem 0.75rem",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <div
        ref={confirmationRef}
        className="flex flex-col items-center"
        style={{
          backgroundColor: "#ffffff",
          width: `${innerTicketWidth}px`,
          maxWidth: `${innerTicketWidth}px`,
          height: "auto",
          padding: "0.375rem 1rem 2rem 1rem",
          boxSizing: "border-box",
          overflow: "visible",
          textAlign: "center",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "6px",
            marginBottom: "8px",
            alignItems: "center",
          }}
        >
          <FaCheckCircle color="#008a4c" size={54} aria-hidden="true" />
        </div>

        <h2
          className="text-xl font-bold"
          style={{
            color: "#008a4c",
            margin: "0 0 8px",
            letterSpacing: "-0.03em",
          }}
        >
          Booking Received!
        </h2>

        <p
          style={{ color: "#17201c", margin: "0 0 18px", fontSize: "1.05rem" }}
        >
          Your pitch has been successfully booked.
        </p>

        <div
          style={{
            width: "100%",
            borderTop: "1px solid #e5e7eb",
            borderBottom: "1px solid #e5e7eb",
            padding: "12px 0",
            marginBottom: "14px",
          }}
        >
          <p
            className="text-sm font-bold flex flex-col items-center gap-2"
            style={{ color: "#17201c", width: "100%", margin: 0 }}
          >
            Booking ID:
            <span
              className="flex flex-col items-center gap-3"
              style={{ width: "100%" }}
            >
              <span
                className="font-extrabold"
                style={{
                  color: "#17201c",
                  width: "100%",
                  overflowWrap: "anywhere",
                  wordBreak: "break-word",
                  lineHeight: 1.5,
                  letterSpacing: "-0.02em",
                }}
              >
                {bookingId}
              </span>
              <button
                type="button"
                onClick={handleCopyId}
                aria-label="Copy booking ID"
                className="text-(--primary)"
                style={{ color: "#008a4c" }}
              >
                {copied ? (
                  <FaCheck size={14} />
                ) : (
                  <FaRegCopy size={14} aria-hidden="true" />
                )}
              </button>
            </span>
            {copied && (
              <span className="text-xs" style={{ color: "#008a4c" }}>
                Copied!
              </span>
            )}
          </p>
        </div>

        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "8px",
            textAlign: "center",
          }}
        >
          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Date:{" "}
            <span className="font-extrabold">
              {format(new Date(booking.start_at), "EEEE, MMMM d, yyyy")}
            </span>
          </p>

          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Time:{" "}
            <span className="font-extrabold">
              {format(new Date(booking.start_at), "h:mm a")} –{" "}
              {format(new Date(booking.end_at), "h:mm a")}
            </span>
          </p>

          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Duration:{" "}
            <span className="font-extrabold">
              {getDurationDisplay(booking.start_at, booking.end_at)}
            </span>
          </p>

          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Customer:{" "}
            <span className="font-extrabold">{booking.user_full_name}</span>
          </p>

          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Booking Type:{" "}
            <span className="font-extrabold">
              {String(booking.notes || "").includes("booking_type:open")
                ? "Open to others"
                : String(booking.notes || "").includes("booking_type:solo")
                  ? "Solo / Individual"
                  : "Private booking"}
            </span>
          </p>

          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Total Amount:{" "}
            <span className="font-extrabold">
              ₦{formatCurrency(booking.total)}
            </span>
          </p>
          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Promo Code:{" "}
            <span className="font-extrabold">
              {booking.promo_code || "None"}
            </span>
          </p>
          <p className="text-sm font-bold" style={{ width: "100%", margin: 0 }}>
            Discount Applied:{" "}
            <span className="font-extrabold">
              ₦{formatCurrency(booking.discount)}
            </span>
          </p>
        </div>

        <div
          className="p-2 rounded w-full"
          style={{
            backgroundColor: "#fef3c7",
            color: "#78350f",
            marginTop: "14px",
            border: "1px solid #f4d58a",
          }}
        >
          <p
            className="font-semibold"
            style={{ color: "#78350f", margin: "0 0 4px" }}
          >
            Payment on Arrival
          </p>
          <p className="text-xs" style={{ color: "#78350f", margin: 0 }}>
            Please pay the total amount when you arrive at the turf.
          </p>
        </div>

        <p
          className="text-sm"
          style={{ marginTop: "14px", textAlign: "center", lineHeight: 1.5 }}
        >
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
