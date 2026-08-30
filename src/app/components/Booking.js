"use client";

import { useEffect, useReducer, useState } from "react";
import confetti from "canvas-confetti";
import { supabase } from "@/lib/supabaseClient";

import { differenceInHours, format, parse } from "date-fns";

import { FaArrowRight } from "react-icons/fa";

import Calendar from "@/app/components/Calendar";
import SelectTime from "@/app/components/SelectTime";
import {
  fetchBookingsForDate,
  isSlotAvailable,
  generateAllSlots,
} from "@/utils/availability";
import formatCurrency from "../../utils/formatCurrency";

import PromoCodeInput from "./PromoCode";
import SpinnerMini from "./SpinnerMini";
import BookingConfirmation from "./BookingConfirmation";

// ✅ Initial state
const initialState = {
  step: 1,
  booking: null,
  bookingId: null,
  selectedDate: null,
  startTime: null,
  endTime: null,
  bookingsForDate: [],
  availableSlots: [],
  fullName: "",
  email: "",
  phone: "",
  players: "",
  notes: "",
  promoCode: "",
  discountApplied: 0,
  errorMessage: "",
};

// ✅ Reducer
function bookingReducer(state, action) {
  switch (action.type) {
    case "SET_START_TIME":
      return { ...state, startTime: action.start };
    case "SET_END_TIME":
      return { ...state, endTime: action.end };
    case "SET_DATE":
      return {
        ...state,
        selectedDate: action.date,
        startTime: null,
        endTime: null,
        errorMessage: "",
      };
    case "SET_USER":
      return { ...state, ...action.payload };
    case "SET_PROMO":
      return {
        ...state,
        promoCode: action.code,
        discountApplied: action.discount,
      };
    case "SET_BOOKINGS":
      return {
        ...state,
        bookingsForDate: action.bookings,
        availableSlots: action.slots,
      };
    case "CONFIRM_BOOKING":
      return {
        ...state,
        bookingId: action.id,
        booking: action.booking,
        step: 4,
      };
    case "NEXT_STEP":
      return { ...state, step: state.step + 1 };
    case "PREV_STEP":
      return { ...state, step: state.step - 1 };
    case "SET_ERROR":
      return { ...state, errorMessage: action.message, step: state.step - 1 };
    case "RESET":
      return initialState;

    default:
      return state;
  }
}

export default function Booking() {
  const [state, dispatch] = useReducer(bookingReducer, initialState);
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    dispatch({ type: "RESET" });
  }, []);

  // Booking summary
  const ratePerHour = 5000;
  const duration =
    state.startTime && state.endTime
      ? differenceInHours(
          parse(state.endTime, "hh:mm a", state.selectedDate),
          parse(state.startTime, "hh:mm a", state.selectedDate),
        )
      : 0;
  const subtotal = duration * ratePerHour;
  const discount = state.discountApplied;
  const total = subtotal - discount;

  //  Availability effect
  useEffect(() => {
    if (!state.selectedDate) return; // guard

    if (state.selectedDate) {
      fetchBookingsForDate(state.selectedDate).then((bookings) => {
        const allSlots = generateAllSlots(state.selectedDate);
        const freeSlots = allSlots.filter((slot) => {
          const slotStart = parse(slot.start, "hh:mm a", state.selectedDate);
          const slotEnd = parse(slot.end, "hh:mm a", state.selectedDate);
          return isSlotAvailable(slotStart, slotEnd, bookings);
        });

        dispatch({ type: "SET_BOOKINGS", bookings, slots: freeSlots });
      });
    }
  }, [state.selectedDate]);

  // Supabase insert function
  async function confirmBooking() {
    const startDateTime = parse(state.startTime, "hh:mm a", state.selectedDate);
    const endDateTime = parse(state.endTime, "hh:mm a", state.selectedDate);

    try {
      const latestBookings = await fetchBookingsForDate(state.selectedDate);
      const stillAvailable = isSlotAvailable(
        startDateTime,
        endDateTime,
        latestBookings,
      );

      if (!stillAvailable) {
        dispatch({
          type: "SET_ERROR",
          message:
            "Sorry, this time slot was just booked by someone else. Please pick another time.",
        });
        dispatch({ type: "SET_BOOKINGS", bookings: latestBookings, slots: [] });
        dispatch({ type: "PREV_STEP" });
        return;
      }

      const { data, error } = await supabase
        .from("bookings")
        .insert([
          {
            user_full_name: state.fullName,
            user_email: state.email,
            user_phone: state.phone,
            players: state.players,
            notes: state.notes,
            start_at: startDateTime.toISOString(),
            end_at: endDateTime.toISOString(),
            duration_hours: duration,
            rate_per_hour: ratePerHour,
            subtotal,
            discount,
            total,
            promo_code: state.promoCode,
            status: "confirmed",
          },
        ])
        .select();

      if (error) {
        alert("Could not save booking: " + error.message);
        return;
      }

      dispatch({ type: "CONFIRM_BOOKING", id: data[0].id, booking: data[0] });
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Unexpected error:", err);
    }
  }

  return (
    <div className="space-y-6 w-full flex flex-col gap-4 items-center">
      {/* Stepper */}
      <div className="flex items-center justify-center gap-1">
        {["Choose Date & Time", "Your Details", "Review Booking"].map(
          (label, idx) => {
            const stepNum = idx + 1;
            return (
              <div key={label} className="flex items-center">
                <div
                  className={`flex flex-col items-center gap-0.5 ${
                    state.step >= stepNum
                      ? "text-(--primary) text-xs"
                      : "text-gray-400 text-xs"
                  }`}
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full font-bold
                    ${
                      state.step >= stepNum
                        ? "bg-(--primary) text-white text-xs"
                        : "border border-gray-400 text-xs"
                    }`}
                  >
                    {stepNum}
                  </span>
                  <span className="text-[0.5625rem] font-bold">{label}</span>
                </div>
                {stepNum < 3 && (
                  <div
                    className={`h-0.5 w-12 ${
                      state.step > stepNum ? "bg-(--primary)" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            );
          },
        )}
      </div>
      <div className="flex flex-col justify-center items-start gap-4 md:grid md:grid-cols-2 md:gap-8 w-full">
        {/* Step 1: Date & Time */}
        {state.step === 1 && (
          <>
            <Calendar
              selectedDate={state.selectedDate}
              onSelectDate={(date) => dispatch({ type: "SET_DATE", date })}
            />
            {state.selectedDate && (
              <SelectTime
                selectedDate={state.selectedDate}
                startTime={state.startTime}
                setStartTime={(val) =>
                  dispatch({ type: "SET_START_TIME", start: val })
                }
                endTime={state.endTime}
                setEndTime={(val) =>
                  dispatch({ type: "SET_END_TIME", end: val })
                }
                bookings={state.bookingsForDate}
              />
            )}
            {state.selectedDate && state.startTime && state.endTime && (
              <button
                onClick={() => dispatch({ type: "NEXT_STEP" })}
                className="flex items-center self-end gap-2 bg-(--primary) text-(--white) text-xs py-3 px-8 w-max rounded-sm transition-all duration-300 ease-out hover:translate-x-1 md:col-span-2 place-self-center-safe"
              >
                Continue to Details
                <FaArrowRight
                  color="var(--white)"
                  aria-hidden="true"
                  size={14}
                />
              </button>
            )}
          </>
        )}

        {/* Step 2: Your Details */}
        {state.step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              dispatch({ type: "NEXT_STEP" });
            }}
            className="space-y-4 w-[90%] md:row-span-2"
          >
            <input
              type="text"
              placeholder="Full Name"
              value={state.fullName}
              onChange={(e) =>
                dispatch({
                  type: "SET_USER",
                  payload: { fullName: e.target.value },
                })
              }
              className="border border-gray-400 rounded p-2 w-full text-xs"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={state.email}
              onChange={(e) =>
                dispatch({
                  type: "SET_USER",
                  payload: { email: e.target.value },
                })
              }
              className="border border-gray-400 rounded p-2 w-full text-xs"
              required
            />
            <input
              type="tel"
              placeholder="Phone"
              value={state.phone}
              onChange={(e) =>
                dispatch({
                  type: "SET_USER",
                  payload: { phone: e.target.value },
                })
              }
              className="border border-gray-400 rounded p-2 w-full text-xs"
              required
            />
            <input
              type="number"
              placeholder="Number of Players"
              value={state.players}
              min="1"
              onChange={(e) =>
                dispatch({
                  type: "SET_USER",
                  payload: { players: e.target.value },
                })
              }
              className="border border-gray-400 rounded p-2 w-full text-xs"
              required
            />
            <textarea
              placeholder="Notes"
              value={state.notes}
              onChange={(e) =>
                dispatch({
                  type: "SET_USER",
                  payload: { notes: e.target.value },
                })
              }
              className="border border-gray-400 rounded p-2 w-full text-xs "
            />
            <PromoCodeInput
              promoCode={state.promoCode}
              discountApplied={state.discountApplied}
              subtotal={subtotal}
              dispatch={dispatch}
            />

            <button
              type="submit"
              className="bg-(--primary) text-white px-8 py-3.5 rounded text-xs flex items-center gap-2 cursor-pointer transition-all duration-300 ease-out hover:translate-x-1"
            >
              Continue to Review
              <FaArrowRight color="var(--white)" aria-hidden="true" size={14} />
            </button>
          </form>
        )}
      </div>
      {/* Step 3: Review Booking */}
      {state.step === 3 && (
        <div className="space-y-4 w-full shadow p-4 flex flex-col">
          {state.errorMessage && (
            <p className="text-(--error) text-sm font-semibold mb-2">
              {state.errorMessage}
            </p>
          )}
          <h3 className="font-extrabold text-lg text-(--primary-dark)">
            Booking Summary
          </h3>

          <p className="text-sm font-bold">
            Date:{" "}
            <span className="font-extrabold">
              {format(state.selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
          </p>

          <p className="text-sm font-bold">
            Time:{" "}
            <span className="font-extrabold">
              {state.startTime} – {state.endTime}
            </span>
          </p>

          <p className="text-sm font-bold">
            Duration:{" "}
            <span className="font-extrabold">
              {duration} {duration === 1 ? "hour" : "hours"}
            </span>
          </p>

          <p className="font-bold text-sm">
            Rate:{" "}
            <span className="font-extrabold">
              ₦{formatCurrency(ratePerHour)}
            </span>
            /hr
          </p>
          <p className="font-bold text-sm">
            Subtotal:{" "}
            <span className="font-extrabold">₦{formatCurrency(subtotal)}</span>
          </p>
          <p className="font-bold text-sm">
            Discount:{" "}
            <span className="font-extrabold">
              –₦{formatCurrency(state.discountApplied)}
            </span>
          </p>
          <p className="text-(--primary) font-bold text-sm">
            Total:{" "}
            <span className="font-extrabold">
              ₦{formatCurrency(subtotal - state.discountApplied)}
            </span>
          </p>
          <button
            onClick={async () => {
              setIsConfirming(true);
              await confirmBooking();
              setIsConfirming(false);
            }}
            disabled={isConfirming}
            className="flex items-center self-center-safe gap-2 bg-(--primary) text-(--white) text-xs py-3 px-8 rounded-sm transition-all duration-300 ease-out hover:translate-x-1"
          >
            {isConfirming ? (
              <SpinnerMini />
            ) : (
              <>
                Confirm Booking
                <FaArrowRight
                  color="var(--white)"
                  aria-hidden="true"
                  size={14}
                />
              </>
            )}
          </button>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {state.step === 4 && state.booking && (
        <BookingConfirmation
          booking={state.booking}
          bookingId={state.bookingId}
        />
        // <div className="space-y-4 text-center relative shadow p-6 rounded flex flex-col items-center">
        //   <FaCheckCircle color="var(--primary)" size={50} aria-hidden="true" />
        //   <h2 className="text-xl font-bold text-(--primary)">
        //     Booking Confirmed!
        //   </h2>
        //   <p>Your pitch has been successfully booked.</p>

        //   <p className="text-sm font-bold flex flex-col">
        //     Booking ID:{" "}
        //     <span className="font-extrabold">{state.bookingId}</span>
        //   </p>

        //   <p className="text-sm font-bold">
        //     Date:{" "}
        //     <span className="font-extrabold">
        //       {format(new Date(state.booking.start_at), "EEEE, MMMM d, yyyy")}
        //     </span>
        //   </p>

        //   <p className="text-sm font-bold">
        //     Time:{" "}
        //     <span className="font-extrabold">
        //       {format(new Date(state.booking.start_at), "h:mm a")} –{" "}
        //       {format(new Date(state.booking.end_at), "h:mm a")}
        //     </span>
        //   </p>

        //   <p className="text-sm font-bold">
        //     Duration:{" "}
        //     <span className="font-extrabold">
        //       {(new Date(state.booking.end_at) -
        //         new Date(state.booking.start_at)) /
        //         (1000 * 60 * 60)}{" "}
        //       {(new Date(state.booking.end_at) -
        //         new Date(state.booking.start_at)) /
        //         (1000 * 60 * 60) ===
        //       1
        //         ? "hour"
        //         : "hours"}
        //     </span>
        //   </p>

        //   <p className="text-sm font-bold">
        //     Total Amount:{" "}
        //     <span className="font-extrabold">₦{state.booking.total}</span>
        //   </p>
        //   <p className="text-sm font-bold">
        //     Promo Code:{" "}
        //     <span className="font-extrabold">
        //       {state.booking.promo_code || "None"}
        //     </span>
        //   </p>

        //   <p className="text-sm font-bold">
        //     Discount Applied:{" "}
        //     <span className="font-extrabold">₦{state.booking.discount}</span>
        //   </p>

        //   <div className="bg-(--warning) p-2 rounded w-full">
        //     <p className="font-semibold">Payment on Arrival</p>
        //     <p className="text-xs">
        //       Please pay the total amount when you arrive at the turf.
        //     </p>
        //   </div>

        //   <p className="text-sm">
        //     We’ve sent a confirmation email to{" "}
        //     <span className="font-extrabold">{state.booking.user_email}</span>
        //   </p>

        //   <Link
        //     href="/"
        //     className="bg-(--primary) text-(--white) px-8 py-3.5 flex items-center gap-2 rounded text-xs transition-all duration-300 ease-out hover:translate-x-1"
        //   >
        //     Back to Home
        //     <FaHome color="var(--white)" size={20} aria-hidden="true" />
        //   </Link>
        // </div>
      )}
    </div>
  );
}
