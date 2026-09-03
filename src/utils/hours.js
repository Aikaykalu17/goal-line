import { getDurationMinutes } from "./time";

export function getDurationHours(startAt, endAt) {
  const minutes = getDurationMinutes(startAt, endAt);
  return minutes / 60; // 90min = 1.5
}
