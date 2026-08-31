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
  fetchBlockedDatesForMonth,
  getBlockedDaySet,
} from "@/utils/availability";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function Calendar({ selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(new Date());
  const [fullyBookedDays, setFullyBookedDays] = useState(new Set());
  const [blockedDays, setBlockedDays] = useState(new Set());
  const today = startOfDay(new Date());

  useEffect(() => {
    fetchBookingsForMonth(viewDate).then((bookings) => {
      setFullyBookedDays(getFullyBookedDays(bookings));
    });
  }, [viewDate]);

  useEffect(() => {
    fetchBookingsForMonth(viewDate).then((bookings) => {
      setFullyBookedDays(getFullyBookedDays(bookings));
    });
    fetchBlockedDatesForMonth(viewDate).then((blocked) => {
      setBlockedDays(getBlockedDaySet(blocked));
    });
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
    </div>
  );
}
