import {
  addMinutes,
  eachDayOfInterval,
  endOfMonth,
  endOfDay,
  format,
  isBefore,
  parse,
  set,
  startOfDay,
  startOfMonth,
} from "date-fns";
import { supabase } from "@/lib/supabaseClient";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 23;
const SLOT_INTERVAL_MINUTES = 30;

function getDayBounds(date) {
  return {
    open: set(date, {
      hours: OPEN_HOUR,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }),
    close: set(date, {
      hours: CLOSE_HOUR,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    }),
  };
}

export function generateAllSlots(date) {
  const { open, close } = getDayBounds(date);
  const slots = [];

  for (
    let start = open;
    addMinutes(start, SLOT_INTERVAL_MINUTES) <= close;
    start = addMinutes(start, SLOT_INTERVAL_MINUTES)
  ) {
    const end = addMinutes(start, SLOT_INTERVAL_MINUTES);
    slots.push({
      start: format(start, "hh:mm a"),
      end: format(end, "hh:mm a"),
    });
  }

  return slots;
}

export function isSlotAvailable(start, end, bookings = []) {
  return !bookings.some((booking) => {
    if (booking.status === "cancelled") return false;

    const bookingStart = new Date(booking.start_at);
    const bookingEnd = new Date(booking.end_at);

    return start < bookingEnd && end > bookingStart;
  });
}

export async function fetchBookingsForDate(date) {
  const start = startOfDay(date).toISOString();
  const end = endOfDay(date).toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("id, start_at, end_at, status")
    .lt("start_at", end)
    .gt("end_at", start)
    .neq("status", "cancelled")
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export async function fetchBookingsForMonth(date) {
  const start = startOfMonth(date).toISOString();
  const end = endOfMonth(date).toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("id, start_at, end_at, status")
    .lt("start_at", end)
    .gt("end_at", start)
    .neq("status", "cancelled")
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data || [];
}

export function getFullyBookedDays(bookings = []) {
  const bookedByDay = new Map();

  bookings.forEach((booking) => {
    const dayKey = format(new Date(booking.start_at), "yyyy-MM-dd");
    const slots = bookedByDay.get(dayKey) || new Set();

    const bookingStart = new Date(booking.start_at);
    const bookingEnd = new Date(booking.end_at);
    const { open, close } = getDayBounds(bookingStart);

    for (
      let slotStart = open;
      addMinutes(slotStart, SLOT_INTERVAL_MINUTES) <= close;
      slotStart = addMinutes(slotStart, SLOT_INTERVAL_MINUTES)
    ) {
      const slotEnd = addMinutes(slotStart, SLOT_INTERVAL_MINUTES);
      if (slotStart < bookingEnd && slotEnd > bookingStart) {
        slots.add(format(slotStart, "HH:mm"));
      }
    }

    bookedByDay.set(dayKey, slots);
  });

  const fullyBooked = new Set();
  const totalSlots = generateAllSlots(new Date()).length;

  bookedByDay.forEach((slots, dayKey) => {
    if (slots.size >= totalSlots) fullyBooked.add(dayKey);
  });

  return fullyBooked;
}

export function getBlockedDaySet(blocked = []) {
  const days = new Set();

  blocked.forEach((period) => {
    const start = startOfDay(new Date(period.start_at));
    const end = startOfDay(new Date(period.end_at));

    if (isBefore(end, start)) return;

    eachDayOfInterval({ start, end }).forEach((day) => {
      days.add(format(day, "yyyy-MM-dd"));
    });
  });

  return days;
}

// Kept here only for callers that need the same slot parsing rules.
export function parseSlot(date, start, end) {
  return {
    start: parse(start, "hh:mm a", date),
    end: parse(end, "hh:mm a", date),
  };
}
