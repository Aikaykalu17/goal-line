"use client";

import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  startOfWeek,
  endOfWeek,
  format,
  isBefore,
  isToday,
  isSameDay,
  isSameMonth,
  addMonths,
  subMonths,
  startOfDay,
} from "date-fns";
import { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import {
  fetchBookingsForMonth,
  getFullyBookedDays,
  getBlockedDaySet,
} from "@/utils/availability";
import { getBlockedDatesAction } from "@/app/actions/availability";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function Calendar({ selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [fullyBookedDays, setFullyBookedDays] = useState(new Set());
  const [blockedDays, setBlockedDays] = useState(new Set());
  const [blockedReasons, setBlockedReasons] = useState([]);
  const today = startOfDay(new Date());

  function getBlockedLabel(blocked) {
    const date = blocked?.start_at ? new Date(blocked.start_at) : null;
    const reason = blocked?.reason
      ? String(blocked.reason).trim()
      : "maintenance";
    const formattedDate = date ? format(date, "MMM d, yyyy") : "This date";
    const sentenceReason = reason ? ` because of ${reason}` : "";
    return `Please, we're sorry. ${formattedDate} is unavilable for booking${sentenceReason}.`;
  }

  useEffect(() => {
    let ignore = false;

    async function loadAvailability() {
      const rangeStart = startOfMonth(viewDate);
      const rangeEnd = endOfMonth(viewDate);

      try {
        const [bookings, blocked] = await Promise.all([
          fetchBookingsForMonth(viewDate),
          getBlockedDatesAction({ start: rangeStart, end: rangeEnd }),
        ]);

        if (ignore) return;

        setFullyBookedDays(getFullyBookedDays(bookings));
        setBlockedDays(getBlockedDaySet(blocked));
        setBlockedReasons((blocked || []).filter(Boolean).slice(0, 4));
      } catch (error) {
        console.error("Could not load calendar availability:", error);
        if (!ignore) {
          setFullyBookedDays(new Set());
          setBlockedDays(new Set());
        }
      }
    }

    loadAvailability();

    return () => {
      ignore = true;
    };
  }, [viewDate]);

  const gridStart = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function goToPrevMonth() {
    setViewDate((prev) => subMonths(prev, 1));
  }

  function goToNextMonth() {
    setViewDate((prev) => addMonths(prev, 1));
  }

  function handleSelect(day, isFullyBooked) {
    if (isBefore(day, today) || isFullyBooked) return;
    onSelectDate(day);
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-(--border) bg-white p-4 md:place-self-end">
      <p className="mb-3 text-sm font-semibold text-(--text)">Select Date</p>

      {/* Month navigation */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={goToPrevMonth}
          aria-label="Previous month"
          className="p-2 text-(--text) hover:text-(--primary)"
        >
          <FaChevronLeft size={12} />
        </button>
        <span className="text-sm font-semibold text-(--text)">
          {format(viewDate, "MMMM yyyy")}
        </span>
        <button
          type="button"
          onClick={goToNextMonth}
          aria-label="Next month"
          className="p-2 text-(--text) hover:text-(--primary)"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Weekday header */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((day) => (
          <span key={day} className="text-xs font-medium text-gray-400">
            {day}
          </span>
        ))}
      </div>

      {/* Date grid */}
      <div className="mt-2 grid grid-cols-7 gap-1 text-center">
        {days.map((day) => {
          const past = isBefore(day, today);
          const outsideMonth = !isSameMonth(day, viewDate);
          const dayKey = format(day, "yyyy-MM-dd");
          const isFullyBooked = fullyBookedDays.has(dayKey);
          const isBlocked = blockedDays.has(dayKey);
          const disabled = past || isFullyBooked || isBlocked;
          const selected = selectedDate && isSameDay(day, selectedDate);
          const todayFlag = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => handleSelect(day, isFullyBooked)}
              title={
                isBlocked
                  ? "Unavailable"
                  : isFullyBooked
                    ? "Fully booked"
                    : undefined
              }
              className={`
                aspect-square rounded-full text-sm transition-colors
                ${disabled ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-(--text) hover:bg-(--primary)/10"}
                ${outsideMonth && !disabled ? "text-gray-300" : ""}
                ${todayFlag && !selected ? "font-semibold text-(--primary)" : ""}
                ${selected ? "bg-(--primary) text-white font-semibold" : ""}
              `}
            >
              {format(day, "d")}
            </button>
          );
        })}
      </div>

      {blockedReasons.length > 0 && (
        <div className="mt-4 rounded-xl border border-red-100 bg-red-50 p-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-red-700">
            unavailable
          </p>
          <ul className="mt-2 space-y-1 text-xs text-red-700">
            {blockedReasons.map((blocked) => (
              <li key={blocked.id}>{getBlockedLabel(blocked)}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
