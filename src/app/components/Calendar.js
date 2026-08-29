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
import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

export default function Calendar({ selectedDate, onSelectDate }) {
  const [viewDate, setViewDate] = useState(new Date());
  const today = startOfDay(new Date());

  // Full grid range: from the Monday of the first week to the Sunday of the last week
  const gridStart = startOfWeek(startOfMonth(viewDate), { weekStartsOn: 1 });
  const gridEnd = endOfWeek(endOfMonth(viewDate), { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: gridStart, end: gridEnd });

  function goToPrevMonth() {
    setViewDate((prev) => subMonths(prev, 1));
  }

  function goToNextMonth() {
    setViewDate((prev) => addMonths(prev, 1));
  }

  function handleSelect(day) {
    if (isBefore(day, today)) return;
    onSelectDate(day);
  }

  return (
    <div className="w-full max-w-sm rounded-xl border border-(--border) bg-white p-4">
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
          const selected = selectedDate && isSameDay(day, selectedDate);
          const todayFlag = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={past}
              onClick={() => handleSelect(day)}
              className={`
                aspect-square rounded-full text-sm transition-colors
                ${past ? "cursor-not-allowed text-gray-300" : "cursor-pointer text-(--text) hover:bg-(--primary)/10"}
                ${outsideMonth && !past ? "text-gray-300" : ""}
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
