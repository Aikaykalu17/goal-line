"use client";
import SpinnerMini from "./SpinnerMini";
import {
  CheckCircle,
  User,
  Phone,
  Mail,
  Tag,
  MessageSquare,
} from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";

function RegistrationForm() {
  const [status, setStatus] = useState("idle");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [subject, setSubject] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const isDisabled = status === "success";

  const isFormValid =
    fullName.trim() !== "" &&
    phoneNumber.trim() !== "" &&
    subject.trim() !== "" &&
    message.trim() !== "" &&
    email.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    const formData = new FormData(e.target);

    const data = {
      fullName: formData.get("fullName"),
      phoneNumber: formData.get("phoneNumber"),
      email: formData.get("email"),
      subject: formData.get("subject"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Something went wrong");
      setStatus("success");
      e.target.reset();
      setFullName("");
      setPhoneNumber("");
      setEmail("");
      setSubject("");
      setMessage("");
      setTimeout(() => setStatus("idle"), 8000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }

  return (
    <form
      aria-labelledby="form-title"
      className="flex flex-col gap-5 rounded-2xl border border-(--border)/50  p-4 shadow-lg sm:p-6"
      onSubmit={handleSubmit}
    >
      <div>
        <h2
          id="form-title"
          className="text-(--text) font-extrabold text-xl tracking-tight"
        >
          Send us a message
        </h2>
        <p className="mt-1 text-sm text-(--muted)">
          Fill in your details and we&apos;ll get back to you soon.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="fullName"
            className="text-sm font-semibold text-(--text)"
          >
            Full Name
          </label>
          <div className="relative">
            <User
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Enter your full name"
              value={fullName}
              className="w-full border border-(--border)/60 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-colors bg-gray-50/60 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/15 disabled:opacity-60"
              disabled={isDisabled}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="phoneNumber"
            className="text-sm font-semibold text-(--text)"
          >
            Phone Number
          </label>
          <div className="relative">
            <Phone
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              aria-hidden="true"
            />
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              required
              placeholder="+234 800 000 0000"
              value={phoneNumber}
              className="w-full border border-(--border)/60 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-colors bg-gray-50/60 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/15 disabled:opacity-60"
              disabled={isDisabled}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-sm font-semibold text-(--text)">
          Email Address
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            className="w-full border border-(--border)/60 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-colors bg-gray-50/60 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/15 disabled:opacity-60"
            disabled={isDisabled}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="subject"
          className="text-sm font-semibold text-(--text)"
        >
          Subject
        </label>
        <div className="relative">
          <Tag
            size={16}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            aria-hidden="true"
          />
          <input
            id="subject"
            name="subject"
            required
            placeholder="How can we help you?"
            value={subject}
            className="w-full border border-(--border)/60 rounded-xl py-2.5 pl-10 pr-4 text-sm outline-none transition-colors bg-gray-50/60 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/15 disabled:opacity-60"
            disabled={isDisabled}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="message"
          className="text-sm font-semibold text-(--text)"
        >
          Message
        </label>
        <div className="relative">
          <MessageSquare
            size={16}
            className="pointer-events-none absolute left-3.5 top-3.5 text-gray-400"
            aria-hidden="true"
          />
          <textarea
            id="message"
            name="message"
            required
            placeholder="Type your message here."
            value={message}
            className="w-full border border-(--border)/60 rounded-xl py-3 pl-10 pr-4 text-sm h-36 resize-none outline-none transition-colors bg-gray-50/60 focus:border-(--primary) focus:bg-white focus:ring-2 focus:ring-(--primary)/15 disabled:opacity-60"
            disabled={isDisabled}
            onChange={(e) => setMessage(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={isDisabled || status === "sending"}
        className="bg-(--primary) text-white text-sm font-bold py-3 px-8 rounded-xl self-start disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
      >
        {status === "sending" && <SpinnerMini />}
        {status === "success" && (
          <CheckCircle
            size={20}
            className="animate-bounce"
            aria-hidden="true"
          />
        )}
        {status !== "sending" && status !== "success" && (
          <>
            Send Message <FaTelegramPlane size={16} />
          </>
        )}
      </button>

      <div aria-live="polite" className="text-sm">
        {status === "success" && (
          <p
            role="status"
            className="flex items-start gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-3 font-medium text-green-700"
          >
            <CheckCircle
              size={16}
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            />
            Message received! We&apos;ll reach out via the email you provided.
            Please avoid submitting multiple messages.
          </p>
        )}
        {status === "error" && (
          <p
            role="alert"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 font-medium text-red-600"
          >
            Something went wrong. Please try again.
          </p>
        )}
      </div>
    </form>
  );
}

export default RegistrationForm;
