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

import { differenceInMinutes, format, parse } from "date-fns";

import { FaArrowRight, FaCheck, FaChevronDown } from "react-icons/fa";

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
import AvailabilityTimeline from "./AvailabilityTimeline";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createBookingAction } from "@/app/(site)/booking/actions";
import { getRateForDate } from "@/lib/pricing";

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

  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const step = Number(searchParams.get("step")) || 1;

  function goToStep(n) {
    router.push(`${pathname}?step=${n}`);
  }

  // Booking summary

  const selectedStartDateTime =
    state.selectedDate && state.startTime
      ? parse(state.startTime, "hh:mm a", state.selectedDate)
      : null;

  const ratePerHour = selectedStartDateTime
    ? getRateForDate(selectedStartDateTime)
    : 5000;

  const minutes =
    state.startTime && state.endTime
      ? differenceInMinutes(
          parse(state.endTime, "hh:mm a", state.selectedDate),
          parse(state.startTime, "hh:mm a", state.selectedDate),
        )
      : 0;

  const duration = minutes / 60; // 30 mins = 0.5
  const subtotal = duration * ratePerHour; // 0.5 * 5000 = 2500
  const discount = state.discountApplied || 0;
  const total = subtotal - discount;

  const hoursDisplay =
    minutes >= 60
      ? `${duration} hour${duration > 1 ? "s" : ""}` // "1.5 hours"
      : `${minutes} mins`; // "30 mins"

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
            className="space-y-4 w-[90%] md:row-span-2"
            id="bookingForm"
            autoComplete="true"
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
              name="fullName"
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
              name="email"
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
              name="phone"
            />
            <div className="space-y-2">
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
                  <ListboxButton className="flex w-full items-center justify-between rounded border border-gray-400 bg-white p-2 text-left text-xs text-(--text)">
                    <span>
                      {state.playerType === "solo"
                        ? "Solo / Individual"
                        : "Team / Group"}
                    </span>
                    <FaChevronDown size={12} className="text-gray-400" />
                  </ListboxButton>

                  <ListboxOptions className="absolute z-20 mt-1 w-full overflow-auto rounded border border-gray-200 bg-white p-1 text-xs shadow-lg">
                    {[
                      { value: "solo", label: "Solo / Individual" },
                      { value: "team", label: "Team / Group" },
                    ].map((option) => (
                      <ListboxOption
                        key={option.value}
                        value={option.value}
                        className="flex cursor-pointer items-center justify-between rounded px-2 py-2 hover:bg-(--primary)/10 data-selected:bg-(--primary)/10 data-selected:font-semibold"
                      >
                        <span>{option.label}</span>
                        <FaCheck
                          size={10}
                          className="hidden text-(--primary) data-selected:block"
                        />
                      </ListboxOption>
                    ))}
                  </ListboxOptions>
                </div>
              </Listbox>

              {state.playerType === "team" && (
                <>
                  <div className="flex items-center gap-2">
                    <input
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
                      className="flex-1 border border-gray-400 rounded p-2 w-full text-xs"
                      required
                      name="players"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold uppercase tracking-[0.16em] text-gray-600">
                      Booking Type
                    </label>

                    <div className="flex gap-2">
                      {[
                        { value: "private", label: "Private booking" },
                        { value: "open", label: "Open to others" },
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex flex-1 cursor-pointer items-center gap-2 rounded border px-2 py-2 text-[11px] font-medium transition ${
                            state.teamMode === option.value
                              ? "border-(--primary) bg-(--primary)/5 text-(--primary)"
                              : "border-gray-300 bg-white text-gray-700"
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
                            className="accent-(--primary)"
                          />
                          <span>{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
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
              name="notes"
            />
            <PromoCodeInput
              promoCode={state.promoCode}
              discountApplied={state.discountApplied}
              subtotal={subtotal}
              dispatch={dispatch}
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => router.back()}
                className="text-(--primary) text-xs self-start py-3 px-8 bg-transparent border border-(primary-dark) flex items-center gap-2 rounded-sm cursor-pointer"
              >
                <ChevronLeft
                  color="var(--primary-dark)"
                  size={14}
                  aria-hidden="true"
                />{" "}
                Back
              </button>
              <button
                type="submit"
                className="bg-(--primary) text-white px-8 py-3 rounded text-xs flex items-center gap-2 cursor-pointer transition-all duration-300 ease-out hover:translate-x-1"
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
              className={`inline-flex min-h-[46px] min-w-[210px] items-center justify-center gap-2 self-center-safe rounded-sm border border-transparent bg-(--primary) px-8 py-3 text-xs text-(--white) transition-all duration-300 ease-out cursor-pointer
    ${isConfirming ? "opacity-50 cursor-not-allowed" : "hover:translate-x-1"}`}
            >
              {isConfirming ? (
                <span className="inline-flex items-center justify-center gap-2">
                  <SpinnerMini />
                  <span className="sr-only">Confirming booking</span>
                </span>
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
