"use client";

import { useEffect, useReducer, useState } from "react";
import confetti from "canvas-confetti";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Listbox,
  ListboxButton,
  ListboxOptions,
  ListboxOption,
} from "@headlessui/react";

import { format, parse } from "date-fns";

import {
  FaUsers,
  FaEnvelope,
  FaArrowRight,
  FaPhone,
  FaCheck,
  FaUser,
  FaChevronDown,
} from "react-icons/fa";

import Calendar from "@/app/components/Calendar";
import SelectTime from "@/app/components/SelectTime";
import {
  fetchBookingsForDate,
  isSlotAvailable,
  generateAllSlots,
} from "@/utils/availability";
import formatCurrency from "../../utils/formatCurrency";
import { DEFAULT_PRICING } from "@/lib/pricing";

import PromoCodeInput from "./PromoCode";
import SpinnerMini from "./SpinnerMini";
import BookingConfirmation from "./BookingConfirmation";
import AvailabilityTimeline from "./AvailabilityTimeline";
import { ChevronLeft, ChevronRight, Info } from "lucide-react";
import { createBookingAction } from "@/app/(site)/booking/actions";
import { getRateForDate } from "@/lib/pricing";
import { getPricingConfigAction } from "../admin/(protected)/pricing/actions";

import { parseTimeString } from "@/utils/time";
import getDurationDisplay from "@/utils/durationDisplay";
import { getDurationHours } from "@/utils/hours";

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
  playerType: "solo",
  teamMode: "private",
  players: "1",
  notes: "",
  promoCode: "",
  discountApplied: 0,
  errorMessage: "",
};

function normalizeTeamMode(value) {
  const normalized = String(value || "private")
    .trim()
    .toLowerCase();

  if (["open", "open_to_others", "play_with_others"].includes(normalized)) {
    return "open";
  }

  return "private";
}

function getBookingTypeLabel({ playerType, teamMode }) {
  if (playerType === "solo") return "Solo / Individual";

  return normalizeTeamMode(teamMode) === "open"
    ? "Open to others"
    : "Private booking";
}

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
    case "SET_STEP":
      return { ...state, step: action.step };
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
  const [livePricing, setLivePricing] = useState(DEFAULT_PRICING);

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const step = Number(searchParams.get("step")) || 1;

  // Fetch live pricing on mount
  useEffect(() => {
    getPricingConfigAction()
      .then((pricing) => setLivePricing(pricing || DEFAULT_PRICING))
      .catch((err) => {
        console.error("Could not load pricing:", err);
        setLivePricing(DEFAULT_PRICING);
      });
  }, []);

  function goToStep(n) {
    router.push(`${pathname}?step=${n}`);
  }

  // Booking summary

  const selectedStartDateTime =
    state.selectedDate && state.startTime
      ? parse(state.startTime, "hh:mm a", state.selectedDate)
      : null;

  const ratePerHour = selectedStartDateTime
    ? getRateForDate(selectedStartDateTime, livePricing)
    : 5000;

  const selectedEndDateTime = parseTimeString(
    state.endTime,
    state.selectedDate,
  );

  // ✅ New billing + display logic
  const durationHours = getDurationHours(
    selectedStartDateTime,
    selectedEndDateTime,
  ); // 1.5 for 90min

  const hoursDisplay = getDurationDisplay(
    selectedStartDateTime,
    selectedEndDateTime,
  ); // "1 hr 30 mins"

  const subtotal = durationHours * ratePerHour;

  //  Availability effect
  useEffect(() => {
    if (!state.selectedDate) return;

    fetchBookingsForDate(state.selectedDate)
      .then((bookings) => {
        const allSlots = generateAllSlots(state.selectedDate);
        const freeSlots = allSlots.filter((slot) => {
          const slotStart = parse(slot.start, "hh:mm a", state.selectedDate);
          const slotEnd = parse(slot.end, "hh:mm a", state.selectedDate);
          return isSlotAvailable(slotStart, slotEnd, bookings);
        });

        dispatch({ type: "SET_BOOKINGS", bookings, slots: freeSlots });
      })
      .catch((error) => {
        console.error("Could not load booking availability:", error);
      });
  }, [state.selectedDate]);

  async function confirmBooking() {
    if (!state.selectedDate || !state.startTime || !state.endTime) return;

    const startDateTime = parse(state.startTime, "hh:mm a", state.selectedDate);
    const endDateTime = parse(state.endTime, "hh:mm a", state.selectedDate);

    try {
      const bookingType =
        state.playerType === "solo"
          ? "solo"
          : normalizeTeamMode(state.teamMode);

      const notesPayload = [state.notes?.trim(), `booking_type:${bookingType}`]
        .filter(Boolean)
        .join(" | ");

      const result = await createBookingAction({
        user_full_name: state.fullName,
        user_email: state.email,
        user_phone: state.phone,
        players: state.players,
        booking_type: bookingType,
        notes: notesPayload,
        start_at: startDateTime.toISOString(),
        end_at: endDateTime.toISOString(),
        duration_minutes: minutes,
        rate_per_hour: ratePerHour,
        subtotal,
        discount,
        total,
        promo_code: state.promoCode,
      });

      dispatch({
        type: "CONFIRM_BOOKING",
        id: result.booking.id,
        booking: result.booking,
      });
      router.replace(`${pathname}?step=4`);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.6 } });
    } catch (err) {
      console.error("Could not create booking:", err);

      const message = err?.message || "Could not save your booking.";
      dispatch({ type: "SET_ERROR", message });
      router.replace(`${pathname}?step=1`);
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
                    step >= stepNum
                      ? "text-(--primary) text-xs"
                      : "text-gray-400 text-xs"
                  }`}
                >
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full font-bold
                    ${
                      step >= stepNum
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
                      step > stepNum ? "bg-(--primary)" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </div>
            );
          },
        )}
      </div>
      <div className="flex flex-col justify-center gap-4 md:grid md:grid-cols-2 md:gap-8 w-full">
        {/* Step 1: Date & Time */}
        {step === 1 && (
          <>
            {/* Availability legend */}
            <div className="w-full rounded-2xl border border-(--primary)/20 bg-(--primary)/5 px-4 py-3 sm:px-5 sm:py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-2.5 rounded-lg bg-gray-50/70 p-3">
                  <Info
                    size={16}
                    className="mt-0.5 shrink-0 text-(--primary)"
                    aria-hidden="true"
                  />
                  <div className="space-y-1 text-xs font-semibold leading-5 text-(--text)">
                    <p>
                      On the{" "}
                      <span className="font-extrabold text---primary)">
                        Today&apos;s Availability Timeline
                      </span>
                    </p>

                    <p className="pl-1">
                      <span className="font-extrabold uppercase text-green-600">
                        Green
                      </span>
                      : Your booking time
                    </p>

                    <p className="pl-1">
                      <span className="font-extrabold uppercase text-gray-500">
                        Grey
                      </span>
                      : Already booked but open to join
                    </p>

                    <p className="pl-1">
                      <span className="font-extrabold uppercase text-(--primary)">
                        Private Booking
                      </span>
                      : Not shared. Reserved just for you.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4 pl-6 sm:shrink-0 sm:pl-0">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-green-500"
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-bold text-gray-700 sm:text-xs">
                      Your booking time
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-gray-400"
                      aria-hidden="true"
                    />
                    <span className="text-[11px] font-bold text-gray-700 sm:text-xs">
                      Already booked
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {state.errorMessage && (
              <p className="text-center text-sm font-semibold text-(--error) md:col-span-2">
                {state.errorMessage}
              </p>
            )}
            <Calendar
              selectedDate={state.selectedDate}
              onSelectDate={(date) => dispatch({ type: "SET_DATE", date })}
            />
            {state.selectedDate && (
              <div className="flex flex-col-reverse gap-4">
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
                <AvailabilityTimeline
                  selectedDate={state.selectedDate}
                  bookings={state.bookingsForDate}
                  startTime={state.startTime}
                  endTime={state.endTime}
                />
              </div>
            )}
            {state.selectedDate && state.startTime && state.endTime && (
              <button
                onClick={() => goToStep(2)}
                className="flex items-center gap-2 bg-(--primary) text-(--white) text-xs py-3 px-8 w-max rounded-sm transition-all duration-300 ease-out hover:translate-x-1 md:col-span-2 place-self-center cursor-pointer"
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
        {step === 2 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              goToStep(3);
            }}
            className="space-y-5 md:row-span-2 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
            id="bookingForm"
            autoComplete="true"
            aria-label="Booking details"
          >
            {/* Contact details */}
            <div className="space-y-3">
              <label htmlFor="fullName" className="sr-only">
                Full Name
              </label>
              <div className="relative">
                <FaUser
                  size={12}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="fullName"
                  type="text"
                  placeholder="Full Name"
                  value={state.fullName}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_USER",
                      payload: { fullName: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/60 p-2.5 pl-9 text-xs transition focus:border-(--primary) focus:bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/15"
                  required
                  name="fullName"
                />
              </div>

              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <div className="relative">
                <FaEnvelope
                  size={12}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={state.email}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_USER",
                      payload: { email: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/60 p-2.5 pl-9 text-xs transition focus:border-(--primary) focus:bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/15"
                  required
                  name="email"
                />
              </div>

              <label htmlFor="phone" className="sr-only">
                Phone
              </label>
              <div className="relative">
                <FaPhone
                  size={12}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  aria-hidden="true"
                />
                <input
                  id="phone"
                  type="tel"
                  placeholder="Phone"
                  value={state.phone}
                  onChange={(e) =>
                    dispatch({
                      type: "SET_USER",
                      payload: { phone: e.target.value },
                    })
                  }
                  className="w-full rounded-xl border border-gray-300 bg-gray-50/60 p-2.5 pl-9 text-xs transition focus:border-(--primary) focus:bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/15"
                  required
                  name="phone"
                />
              </div>
            </div>

            {/* Player / team setup */}
            <div className="space-y-3 rounded-xl bg-gray-50/70 p-3">
              <Listbox
                value={state.playerType}
                onChange={(nextValue) => {
                  const nextPlayers = nextValue === "solo" ? "1" : "8";
                  dispatch({
                    type: "SET_USER",
                    payload: {
                      playerType: nextValue,
                      teamMode: nextValue === "solo" ? "private" : "private",
                      players: nextPlayers,
                    },
                  });
                }}
              >
                <div className="relative">
                  <ListboxButton
                    aria-label="Player type"
                    className="flex w-full items-center justify-between rounded-xl border border-gray-300 bg-white p-2.5 text-left text-xs text-(--text) transition hover:border-(--primary)/50"
                  >
                    <span className="flex items-center gap-2">
                      {state.playerType === "solo" ? (
                        <FaUser
                          size={11}
                          className="text-(--primary)"
                          aria-hidden="true"
                        />
                      ) : (
                        <FaUsers
                          size={11}
                          className="text-(--primary)"
                          aria-hidden="true"
                        />
                      )}
                      {state.playerType === "solo"
                        ? "Solo / Individual"
                        : "Team / Group"}
                    </span>
                    <FaChevronDown
                      size={10}
                      className="text-gray-400"
                      aria-hidden="true"
                    />
                  </ListboxButton>

                  <ListboxOptions className="absolute z-20 mt-1 w-full overflow-auto rounded-xl border border-gray-200 bg-white p-1 text-xs shadow-lg">
                    {[
                      { value: "solo", label: "Solo / Individual" },
                      { value: "team", label: "Team / Group" },
                    ].map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="flex cursor-pointer items-center justify-between rounded-lg px-2.5 py-2 hover:bg-(--primary)/10 data-selected:bg-(--primary)/10 data-selected:font-semibold"
                      >
                        <span>{option.label}</span>
                        <FaCheck
                          size={10}
                          className="hidden text-(--primary) data-selected:block"
                          aria-hidden="true"
                        />
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>

              {state.playerType === "team" && (
                <>
                  <div className="flex items-center gap-2">
                    <label htmlFor="players" className="sr-only">
                      Number of Players
                    </label>
                    <input
                      id="players"
                      type="number"
                      placeholder="Number of Players"
                      value={state.players}
                      min="8"
                      step="1"
                      onChange={(e) =>
                        dispatch({
                          type: "SET_USER",
                          payload: { players: e.target.value },
                        })
                      }
                      className="flex-1 w-full rounded-xl border border-gray-300 bg-white p-2.5 text-xs transition focus:border-(--primary) focus:outline-none focus:ring-2 focus:ring-(--primary)/15"
                      required
                      name="players"
                    />
                  </div>

                  <div
                    className="space-y-2"
                    role="radiogroup"
                    aria-labelledby="booking-type-label"
                  >
                    <label
                      id="booking-type-label"
                      className="block text-[10px] font-medium text-gray-500"
                    >
                      Booking type
                    </label>

                    <div className="flex gap-2">
                      {[
                        { value: "private", label: "Private booking" },
                        { value: "open", label: "Open to others" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border px-2 py-2.5 text-[11px] font-medium transition-all ${
                            state.teamMode === option.value
                              ? "border-(--primary) bg-(--primary)/10 text-(--primary) shadow-sm"
                              : "border-gray-300 bg-white text-gray-600 hover:border-gray-400"
                          }`}
                        >
                          <input
                            type="radio"
                            name="teamBookingMode"
                            value={option.value}
                            checked={state.teamMode === option.value}
                            onChange={() =>
                              dispatch({
                                type: "SET_USER",
                                payload: { teamMode: option.value },
                              })
                            }
                            className="sr-only"
                          />
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              state.teamMode === option.value
                                ? "bg-(--primary)"
                                : "bg-gray-300"
                            }`}
                            aria-hidden="true"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <label htmlFor="notes" className="sr-only">
              Notes
            </label>
            <textarea
              id="notes"
              placeholder="Anything else we should know? (optional)"
              value={state.notes}
              onChange={(e) =>
                dispatch({
                  type: "SET_USER",
                  payload: { notes: e.target.value },
                })
              }
              rows={3}
              className="w-full resize-none rounded-xl border border-gray-300 bg-gray-50/60 p-2.5 text-xs transition focus:border-(--primary) focus:bg-white focus:outline-none focus:ring-2 focus:ring-(--primary)/15"
              name="notes"
            />

            <PromoCodeInput
              promoCode={state.promoCode}
              discountApplied={state.discountApplied}
              subtotal={subtotal}
              dispatch={dispatch}
            />

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex items-center gap-2 self-start rounded-lg border border-(--primary-dark) bg-transparent px-6 py-3 text-xs text-(--primary) transition-colors hover:bg-gray-50"
              >
                <ChevronLeft
                  color="var(--primary-dark)"
                  size={14}
                  aria-hidden="true"
                />
                Back
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border border-(--primary) bg-(--primary) px-8 py-3 text-xs text-white shadow-sm transition-all duration-300 ease-out hover:translate-x-1 hover:shadow-md"
              >
                Review Booking
                <ChevronRight
                  color="var(--white)"
                  aria-hidden="true"
                  size={14}
                />
              </button>
            </div>
          </form>
        )}
      </div>
      {/* Step 3: Review Booking */}
      {step === 3 && (
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
            Customer: <span className="font-extrabold">{state.fullName}</span>
          </p>

          <p className="text-sm font-bold">
            {" "}
            Booking Type:{" "}
            <span className="font-extrabold">
              {getBookingTypeLabel({
                playerType: state.playerType,
                teamMode: state.teamMode,
              })}
            </span>
          </p>

          <p className="text-sm font-bold">
            {" "}
            Date:{" "}
            <span className="font-extrabold">
              {format(state.selectedDate, "EEEE, MMMM d, yyyy")}
            </span>
          </p>

          <p className="text-sm font-bold">
            Time:{" "}
            <span className="font-extrabold">
              {state?.startTime && state?.endTime
                ? `${state.startTime} – ${state.endTime}`
                : "Not selected"}
            </span>
          </p>
          {/* <p>Duration: {getDurationDisplay(startAt, endAt)}</p> */}

          <p className="text-sm font-bold">
            Duration: <span className="font-extrabold">{hoursDisplay}</span>
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
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="text-(--primary) text-xs self-start py-3 px-8 bg-transparent border border-(primary-dark) flex items-center gap-2 rounded-sm cursor-pointer"
            >
              <ChevronLeft
                color="var(--primary-dark)"
                size={14}
                aria-hidden="true"
              />
              Back
            </button>
            <button
              type="button"
              onClick={async () => {
                setIsConfirming(true);
                await confirmBooking();
                setIsConfirming(false);
              }}
              disabled={isConfirming}
              aria-busy={isConfirming}
              className={`inline-flex min-h-3 min-w-44 items-center justify-center gap-2 self-center-safe rounded-sm border border-(--primary) bg-(--primary) px-6 py-3 text-xs text-(--white) transition-all duration-300 ease-out cursor-pointer 
    ${isConfirming ? "opacity-50 cursor-not-allowed" : "hover:translate-x-1"}`}
            >
              {isConfirming ? (
                <>
                  <SpinnerMini />
                  <span>Confirming booking</span>
                </>
              ) : (
                <>
                  Confirm Booking
                  <ChevronRight
                    color="var(--white)"
                    aria-hidden="true"
                    size={14}
                  />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && state.booking && (
        <BookingConfirmation
          booking={state.booking}
          bookingId={state.bookingId}
        />
      )}
    </div>
  );
}
