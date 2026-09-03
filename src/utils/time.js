import { set } from "date-fns";

export function getDurationMinutes(startAt, endAt) {
  const ms = new Date(endAt) - new Date(startAt);
  if (ms <= 0) return 0;
  return ms / (1000 * 60);
}

export function parseTimeString(timeStr, date) {
  if (!timeStr || !date) return null;
  const [time, modifier] = timeStr.split(" ");
  let [hours, minutes] = time.split(":").map(Number);
  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;
  return set(date, { hours, minutes, seconds: 0, milliseconds: 0 });
}
