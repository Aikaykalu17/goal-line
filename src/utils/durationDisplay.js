import { getDurationMinutes } from "./time";

function getDurationDisplay(startAt, endAt) {
  const totalMinutes = Math.floor(getDurationMinutes(startAt, endAt));
  if (totalMinutes <= 0) return "0 min";

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  const hrText = hours > 0 ? `${hours} hr${hours > 1 ? "s" : ""}` : "";
  const minText = minutes > 0 ? `${minutes} min${minutes > 1 ? "s" : ""}` : "";

  return [hrText, minText].filter(Boolean).join(" ");
}
export default getDurationDisplay;
