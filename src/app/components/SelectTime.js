"use client";

import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";
import { FaChevronDown, FaCheck } from "react-icons/fa";
import {
  set,
  addMinutes,
  format,
  parseISO,
  differenceInMinutes,
} from "date-fns";

const OPEN_HOUR = 8; // 8:00 AM
const CLOSE_HOUR = 23; // 11:00 PM
const INTERVAL_MINUTES = 30;

function getDayBounds(selectedDate) {
  const open = set(selectedDate, {
    hours: OPEN_HOUR,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  const close = set(selectedDate, {
    hours: CLOSE_HOUR,
    minutes: 0,
    seconds: 0,
    milliseconds: 0,
  });
  return { open, close };
}

function generateTimesOfDay(selectedDate, from, to) {
  const times = [];
  let current = from;
  while (current <= to) {
    times.push(current);
    current = addMinutes(current, INTERVAL_MINUTES);
  }
  return times;
}

function toBusyIntervals(bookings) {
  return bookings.map((b) => ({
    start: parseISO(b.start_at),
    end: parseISO(b.end_at),
  }));
}

function isWithinBusyInterval(time, busyIntervals) {
  return busyIntervals.some((iv) => time >= iv.start && time < iv.end);
}

export default function SelectTime({
  selectedDate,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  bookings = [],
}) {
  if (!selectedDate) return null;

  const { open, close } = getDayBounds(selectedDate);
  const busyIntervals = toBusyIntervals(bookings);

  const startTimeSlots = generateTimesOfDay(selectedDate, open, close).filter(
    (t) => !isWithinBusyInterval(t, busyIntervals) && t < close,
  );
  const startOptions = startTimeSlots.map((t) => format(t, "hh:mm a"));

  if (startOptions.length === 0) {
    return (
      <div className="mt-6 w-full max-w-sm rounded-xl border border-(--border) bg-white p-4 text-center">
        <p className="text-sm font-semibold text-(--text)">
          Sorry, we&apos;re fully booked for {selectedDate.toDateString()}.
        </p>
        <p className="mt-1 text-sm text-gray-500">Please select another day.</p>
      </div>
    );
  }

  let endOptions = [];
  if (startTime) {
    const startDate = startTimeSlots.find(
      (t) => format(t, "hh:mm a") === startTime,
    );

    if (startDate) {
      const nextBooking = busyIntervals
        .filter((iv) => iv.start > startDate)
        .sort((a, b) => a.start - b.start)[0];

      const boundary = nextBooking ? nextBooking.start : close;

      const endTimeSlots = generateTimesOfDay(
        selectedDate,
        addMinutes(startDate, INTERVAL_MINUTES),
        boundary,
      );
      endOptions = endTimeSlots.map((t) => format(t, "hh:mm a"));
    }
  }

  let duration = null;
  if (startTime && endTime) {
    const startDate = startTimeSlots.find(
      (t) => format(t, "hh:mm a") === startTime,
    );
    const endDate = generateTimesOfDay(selectedDate, open, close).find(
      (t) => format(t, "hh:mm a") === endTime,
    );
    if (startDate && endDate) {
      const minutes = differenceInMinutes(endDate, startDate);
      if (minutes > 0) duration = minutes / 60;
    }
  }

  function handleStartChange(value) {
    setStartTime(value);
    setEndTime(null);
  }

  return (
    <div className=" w-full max-w-sm rounded-xl border border-(--border) bg-white p-4 h-[stretch]">
      <p className="mb-3 text-sm font-semibold text-(--text)">
        Selected Date: {selectedDate.toDateString()}
      </p>

      {/* Start Time */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-(--text)">
          Start Time
        </label>
        <Listbox value={startTime} onChange={handleStartChange}>
          <div className="relative mt-1">
            <ListboxButton className="flex items-center justify-between border rounded p-2 w-full text-(--text)">
              <span>{startTime || "Select start time"}</span>
              <FaChevronDown size={12} className="text-gray-400" />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="z-100 mt-1 max-h-60 w-(--button-width) overflow-auto rounded bg-white border shadow"
            >
              {startOptions.map((time) => (
                <ListboxOption
                  key={time}
                  value={time}
                  className="flex items-center justify-between p-2 cursor-pointer rounded hover:bg-(--primary)/10 data-[selected]:bg-(--primary-dark) data-[selected]:text-white data-[selected]:font-semibold"
                >
                  <span>{time}</span>
                  <FaCheck
                    size={12}
                    className="hidden [[data-selected]_&]:block"
                  />
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      {/* End Time */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-(--text)">
          End Time
        </label>
        <Listbox value={endTime} onChange={setEndTime} disabled={!startTime}>
          <div className="relative mt-1">
            <ListboxButton className="flex items-center justify-between border rounded p-2 w-full text-(--text) disabled:opacity-50">
              <span>{endTime || "Select end time"}</span>
              <FaChevronDown size={12} className="text-gray-400" />
            </ListboxButton>
            <ListboxOptions
              anchor="bottom"
              className="z-100 mt-1 max-h-60 w-(--button-width) overflow-auto rounded bg-white border shadow"
            >
              {endOptions.map((time) => (
                <ListboxOption
                  key={time}
                  value={time}
                  className="flex items-center justify-between p-2 cursor-pointer rounded hover:bg-(--primary)/10 data-[selected]:bg-(--primary-dark) data-[selected]:text-white data-[selected]:font-semibold"
                >
                  <span>{time}</span>
                  <FaCheck
                    size={12}
                    className="hidden [[data-selected]_&]:block"
                  />
                </ListboxOption>
              ))}
            </ListboxOptions>
          </div>
        </Listbox>
      </div>

      {duration && (
        <p className="text-sm font-semibold text-(--text)">
          Duration: {duration} {duration === 1 ? "hour" : "hours"}
        </p>
      )}
    </div>
  );
}
