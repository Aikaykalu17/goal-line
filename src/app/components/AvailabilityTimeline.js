"use client";

import { parseISO, differenceInMinutes, parse } from "date-fns";

const OPEN_HOUR = 8; // 8:00 AM
const CLOSE_HOUR = 23; // 11:00 PM
const TOTAL_MINUTES = (CLOSE_HOUR - OPEN_HOUR) * 60;

// Convert a Date object's time-of-day into "% across the 8AM-11PM bar"
function toPercent(date, selectedDate) {
  const dayStart = new Date(selectedDate);
  dayStart.setHours(OPEN_HOUR, 0, 0, 0);
  const minutesFromOpen = differenceInMinutes(date, dayStart);
  const clamped = Math.max(0, Math.min(minutesFromOpen, TOTAL_MINUTES));
  return (clamped / TOTAL_MINUTES) * 100;
}

const HOUR_MARKERS = [8, 11, 14, 17, 20, 23]; // 8AM, 11AM, 2PM, 5PM, 8PM, 11PM

function formatHourLabel(hour) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const displayHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${displayHour}${suffix}`;
}

export default function AvailabilityTimeline({
  selectedDate,
  bookings = [],
  startTime,
  endTime,
}) {
  if (!selectedDate) return null;

  const busySegments = bookings.map((b) => {
    const start = parseISO(b.start_at);
    const end = parseISO(b.end_at);
    return {
      left: toPercent(start, selectedDate),
      width: toPercent(end, selectedDate) - toPercent(start, selectedDate),
    };
  });

  let selectionSegment = null;
  if (startTime && endTime) {
    const startDate = parse(startTime, "hh:mm a", selectedDate);
    const endDate = parse(endTime, "hh:mm a", selectedDate);
    selectionSegment = {
      left: toPercent(startDate, selectedDate),
      width:
        toPercent(endDate, selectedDate) - toPercent(startDate, selectedDate),
    };
  }

  return (
    <div className=" w-full max-w-sm border border-gray-400 rounded p-4">
      <p className="mb-2 text-xs font-medium text-(--primary-dark)">
        Today&apos;s Availability
      </p>

      <div className="relative h-6 w-full rounded-full bg-gray-100">
        {busySegments.map((seg, i) => (
          <div
            key={i}
            className="absolute top-0 h-full rounded-full bg-gray-400"
            style={{ left: `${seg.left}%`, width: `${seg.width}%` }}
            title="Booked"
          />
        ))}

        {selectionSegment && (
          <div
            className="absolute top-0 h-full rounded-full bg-(--primary)/70 ring-2 ring-(--primary)"
            style={{
              left: `${selectionSegment.left}%`,
              width: `${selectionSegment.width}%`,
            }}
            title="Your selection"
          />
        )}
      </div>

      <div className="mt-1 flex justify-between text-[0.625rem] text-gray-400">
        {HOUR_MARKERS.map((hour) => (
          <span key={hour}>{formatHourLabel(hour)}</span>
        ))}
      </div>
    </div>
  );
}
