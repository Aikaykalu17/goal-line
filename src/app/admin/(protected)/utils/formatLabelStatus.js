const formatStatusLabel = (status) => {
  const normalized = String(status || "")
    .trim()
    .toLowerCase();
  if (!normalized) return "Pending";

  if (normalized === "expired") return "Expired Booking";

  const formatted = normalized
    .split(" ")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

  return formatted;
};

export default formatStatusLabel;
