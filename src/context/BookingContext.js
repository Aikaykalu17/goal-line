"use client";

import { createContext, useContext, useReducer } from "react";

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

const BookingContext = createContext(null);

export function BookingProvider({ children }) {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
