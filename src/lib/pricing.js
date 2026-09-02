export const DEFAULT_PRICING = {
  weekday_day: 5000,
  weekday_night: 6000,
  weekend_day: 7000,
  weekend_night: 8000,
};

export function isWeekendDate(date) {
  const value = date instanceof Date ? date : new Date(date);
  return value.getDay() === 0 || value.getDay() === 6;
}

export function getRateForDate(date, pricing = DEFAULT_PRICING) {
  const value = date instanceof Date ? date : new Date(date);
  const isWeekend = isWeekendDate(value);
  const hour = value.getHours();
  const isNight = hour >= 18 || hour < 6;

  const key = isWeekend
    ? isNight
      ? "weekend_night"
      : "weekend_day"
    : isNight
      ? "weekday_night"
      : "weekday_day";

  return Number(pricing?.[key] ?? DEFAULT_PRICING[key] ?? 5000);
}

export function calculatePromoDiscount(subtotal, promo = {}) {
  const safeSubtotal = Number(subtotal) || 0;
  const rawValue = Number(promo.discount_percent ?? 0);

  if (!Number.isFinite(rawValue) || rawValue <= 0) {
    return 0;
  }

  return Math.min(Math.max((safeSubtotal * rawValue) / 100, 0), safeSubtotal);
}
