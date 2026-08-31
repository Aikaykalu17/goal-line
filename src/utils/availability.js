import { areIntervalsOverlapping, startOfMonth, endOfMonth } from "date-fns";
import { supabase } from "@/lib/supabaseClient";

const OPEN_HOUR = 8;
const CLOSE_HOUR = 23;

// Fetch all bookings within the month containing `anyDateInMonth`
export async function fetchBookingsForMonth(anyDateInMonth) {
  const monthStart = startOfMonth(anyDateInMonth);
  const monthEnd = endOfMonth(anyDateInMonth);

  const { data, error } = await supabase
    .from("bookings")
    .select("start_at, end_at")
    .gte("start_at", monthStart.toISOString())
    .lte("end_at", monthEnd.toISOString());

  if (error) {
    console.error("Error fetching month bookings:", error);
    return [];
  }
  return data;
}

// Merge overlapping/adjacent intervals, then check if they fully cover open->close
function isDayFullyBooked(dayBookings, dayDate) {
  if (dayBookings.length === 0) return false;

  const open = new Date(dayDate);
  open.setHours(OPEN_HOUR, 0, 0, 0);
  const close = new Date(dayDate);
  close.setHours(CLOSE_HOUR, 0, 0, 0);

  const intervals = dayBookings
    .map((b) => ({ start: new Date(b.start_at), end: new Date(b.end_at) }))
    .sort((a, b) => a.start - b.start);

  const merged = [];
  for (const iv of intervals) {
    const last = merged[merged.length - 1];
    if (last && iv.start <= last.end) {
      last.end = iv.end > last.end ? iv.end : last.end;
    } else {
      merged.push({ ...iv });
    }
  }

  return merged.some((iv) => iv.start <= open && iv.end >= close);
}

// Group a month's bookings by day, return a Set of "yyyy-MM-dd" strings that are fully booked
export function getFullyBookedDays(monthBookings) {
  const byDay = {};

  monthBookings.forEach((b) => {
    const dayKey = format(new Date(b.start_at), "yyyy-MM-dd"); // format already imported in your file
    if (!byDay[dayKey]) byDay[dayKey] = [];
    byDay[dayKey].push(b);
  });

  const fullyBooked = new Set();
  Object.entries(byDay).forEach(([dayKey, bookings]) => {
    const dayDate = new Date(bookings[0].start_at);
    if (isDayFullyBooked(bookings, dayDate)) {
      fullyBooked.add(dayKey);
    }
  });

  return fullyBooked;
}

// Fetch all bookings for a given date
export async function fetchBookingsForDate(date) {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("bookings")
    .select("start_at, end_at")
    .gte("start_at", startOfDay.toISOString())
    .lte("end_at", endOfDay.toISOString());

  if (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
  return data;
}

// Check if a slot overlaps with existing bookings
export function isSlotAvailable(slotStart, slotEnd, existingBookings) {
  return !existingBookings.some((booking) =>
    areIntervalsOverlapping(
      { start: new Date(booking.start_at), end: new Date(booking.end_at) },
      { start: slotStart, end: slotEnd },
    ),
  );
}

import { format, addHours, setHours, setMinutes } from "date-fns";

// Generate slots between startHour and endHour (e.g., 8 AM – 11 PM)
export function generateAllSlots(selectedDate, startHour = 8, endHour = 23) {
  const slots = [];
  let current = setHours(setMinutes(selectedDate, 0), startHour);

  while (current.getHours() < endHour) {
    const next = addHours(current, 1);
    slots.push({
      start: format(current, "hh:mm a"),
      end: format(next, "hh:mm a"),
    });
    current = next;
  }

  return slots;
}

import { eachDayOfInterval, format as formatDate } from "date-fns"; // add these if not already imported

// Fetch all blocked date ranges overlapping the given month
export async function fetchBlockedDatesForMonth(anyDateInMonth) {
  const monthStart = startOfMonth(anyDateInMonth);
  const monthEnd = endOfMonth(anyDateInMonth);

  const { data, error } = await supabase
    .from("blocked")
    .select("start_at, end_at")
    .lte("start_at", monthEnd.toISOString())
    .gte("end_at", monthStart.toISOString());

  if (error) {
    console.error("Error fetching blocked dates:", error);
    return [];
  }
  return data;
}

// Expand blocked ranges into a Set of "yyyy-MM-dd" strings, one per blocked day
export function getBlockedDaySet(blockedRows) {
  const blockedDays = new Set();

  blockedRows.forEach((row) => {
    const start = new Date(row.start_at);
    const end = new Date(row.end_at);
    const daysInRange = eachDayOfInterval({ start, end });
    daysInRange.forEach((day) =>
      blockedDays.add(formatDate(day, "yyyy-MM-dd")),
    );
  });

  return blockedDays;
}

// Quick check for a single date — used as a final guard right before booking
export async function isDateBlocked(date) {
  const dayStart = new Date(date);
  dayStart.setHours(0, 0, 0, 0);
  const dayEnd = new Date(date);
  dayEnd.setHours(23, 59, 59, 999);

  const { data, error } = await supabase
    .from("blocked")
    .select("id")
    .lte("start_at", dayEnd.toISOString())
    .gte("end_at", dayStart.toISOString())
    .limit(1);

  if (error) {
    console.error("Error checking blocked date:", error);
    return false; // fail-open here would be wrong for safety, but fail-closed would block bookings on a network error — flag this trade-off to Aikay
  }
  return data && data.length > 0;
}
