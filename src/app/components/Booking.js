"use client";

import { useState } from "react";
import confetti from "canvas-confetti";

import Calendar from "@/app/components/Calendar";
import SelectTime from "@/app/components/SelectTime";
import { differenceInHours, parse } from "date-fns";
import Link from "next/link";

import { FaArrowRight } from "react-icons/fa";

export default function Booking() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [step, setStep] = useState(1);
  const [bookingId, setBookingId] = useState(null);

  // Details form
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [players, setPlayers] = useState("");
  const [notes, setNotes] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);

  // Booking summary
  const ratePerHour = 5000;
  const duration =
    startTime && endTime
      ? differenceInHours(
          parse(endTime, "hh:mm a", selectedDate),
          parse(startTime, "hh:mm a", selectedDate),
        )
      : 0;
  const subtotal = duration * ratePerHour;
  const discount = discountApplied;
  const total = subtotal - discount;

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

      {/* Step 1: Date & Time */}
      {step === 1 && (
        <>
          <Calendar
            selectedDate={selectedDate}
            onSelectDate={setSelectedDate}
          />
          {selectedDate && (
            <SelectTime
              selectedDate={selectedDate}
              startTime={startTime}
              setStartTime={setStartTime}
              endTime={endTime}
              setEndTime={setEndTime}
            />
          )}
          {selectedDate && startTime && endTime && (
            <button
              onClick={() => setStep(2)}
              className=" flex items-center gap-2 bg-(--primary) text-(--white) text-xs py-3 px-8 w-max rounded-sm transition-all duration-300 ease-out hover:translate-x-1"
            >
              Continue to Details
              <FaArrowRight color="var(--white)" aria-hidden="true" size={14} />
            </button>
          )}
        </>
      )}

      {/* Step 2: Your Details */}
      {step === 2 && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setStep(3);
          }}
          className="space-y-4 w-[90%]"
        >
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded p-2 text-xs"
              required
            />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2 text-xs"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border rounded p-2 text-xs"
              required
            />
            <input
              type="number"
              placeholder="Number of Players"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              className="w-full border rounded p-2 text-xs"
            />
          </div>
          <textarea
            placeholder="Any Notes (Optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full border rounded p-2 text-xs"
          />

          {/* Promo Code */}
          <div className="flex flex-col gap-2 text-xs">
            <input
              type="text"
              placeholder="Have a promo code?"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
              className="flex-1 border rounded p-2 text-xs"
            />
            <button
              type="button"
              onClick={() => {
                if (promoCode === "WELCOME10") {
                  setDiscountApplied(subtotal * 0.1);
                }
              }}
              className=" flex items-center gap-2 bg-(--forest) text-(--white) text-xs py-3 px-8 w-max rounded-sm transition-all duration-300 ease-out hover:translate-x-1"
            >
              Apply Code
              <FaArrowRight color="var(--white)" aria-hidden="true" size={14} />
            </button>
          </div>

          <button
            type="submit"
            className=" flex items-center gap-2 bg-(--primary) text-(--white) text-xs py-3 px-20 w-max rounded-sm transition-all duration-300 ease-out hover:translate-x-1"
          >
            Review Booking
            <FaArrowRight color="var(--white)" aria-hidden="true" size={14} />
          </button>
        </form>
      )}

      {/* Step 3: Review Booking */}
      {step === 3 && (
        <div className="space-y-4 w-full shadow p-4 flex flex-col">
          <h3 className="font-bold text-lg">Booking Summary</h3>
          <p className="text-sm font-bold">
            Date:{" "}
            <span className="font-extrabold">
              {selectedDate.toDateString()}
            </span>
          </p>
          <p className="text-sm font-bold">
            Time:{" "}
            <span className="font-extrabold">
              {startTime} – {endTime}
            </span>
          </p>
          {/* ✅ Duration shows here */}
          <p className="text-sm font-bold">
            Duration:{" "}
            <span className="font-extrabold">
              {duration} {duration === 1 ? "hour" : "hours"}
            </span>
          </p>
          <p className="font-bold text-sm">
            Rate: <span className="font-extrabold">₦{ratePerHour}</span>/hr
          </p>
          <p className="font-bold text-sm">
            Subtotal: <span className="font-extrabold">₦{subtotal}</span>
          </p>
          <p className="font-bold text-sm">
            Discount: <span className="font-extrabold">–₦{discount}</span>
          </p>
          <p className="text-(--primary) font-bold text-sm">
            Total:
            <span className="font-extrabold"> ₦{total}</span>
          </p>

          <button
            onClick={() => {
              const id = `GLT-${Date.now()}`;
              setBookingId(id);
              setStep(4);

              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 },
              });

              // Reset state if you want to clear details
              setSelectedDate(null);
              setStartTime(null);
              setEndTime(null);
              setFullName("");
              setEmail("");
              setPhone("");
              setPlayers("");
              setNotes("");
              setPromoCode("");
              setDiscountApplied(0);
            }}
            // TODO: call backend API to send confirmation email

            className=" flex items-center self-center-safe gap-2 bg-(--primary) text-(--white) text-xs py-3 px-8 rounded-sm transition-all duration-300 ease-out hover:translate-x-1"
          >
            Confirm Booking
            <FaArrowRight color="var(--white)" aria-hidden="true" size={14} />
          </button>
        </div>
      )}

      {/* Step 4: Confirmation */}
      {step === 4 && (
        <div className="space-y-4 text-center relative">
          <div className="text-green-600 text-4xl">✔</div>
          <h2 className="text-xl font-bold">Booking Confirmed!</h2>
          <p>Your pitch has been successfully booked.</p>
          <p>Booking ID: {bookingId}</p>
          <p>Date: {selectedDate?.toDateString()}</p>
          <p>
            Time: {startTime} – {endTime}
          </p>
          <p>
            Duration: {duration} {duration === 1 ? "hour" : "hours"}
          </p>
          <p>Total Amount: ₦{total}</p>
          <div className="bg-yellow-100 p-2 rounded">
            <p className="font-semibold">Payment on Arrival</p>
            <p>Pay when you arrive at the turf.</p>
          </div>
          <p>We’ve sent a confirmation email to {email}</p>

          <Link
            href="/"
            onClick={() => {
              setBookingId(null);
              setStep(1);
            }}
            className=" bg-(--primary) text-white py-2 rounded w-max"
          >
            Back to Home
          </Link>
        </div>
      )}
    </div>
  );
}
