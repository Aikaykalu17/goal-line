import { supabase } from "@/lib/supabaseClient";

// Insert a new booking
export async function createBooking(bookingData) {
  const { data, error } = await supabase
    .from("bookings")
    .insert([bookingData])
    .select();

  if (error) throw new Error(error.message);
  return data[0];
}

// Fetch today's bookings
export async function getTodaysBookings() {
  const today = new Date();
  const start = new Date(today.setHours(0, 0, 0, 0)).toISOString();
  const end = new Date(today.setHours(23, 59, 59, 999)).toISOString();

  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .gte("start_at", start)
    .lt("start_at", end);

  if (error) throw new Error(error.message);
  return data;
}

// Fetch upcoming bookings
export async function getUpcomingBookings() {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .gt("start_at", new Date().toISOString())
    .order("start_at", { ascending: true });

  if (error) throw new Error(error.message);
  return data;
}

export async function getBookingByCode(bookingCode) {
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .eq("booking_code", bookingCode.toUpperCase()) // make it case-insensitive
    .single();

  if (error) throw new Error(error.message);
  return data;
}
