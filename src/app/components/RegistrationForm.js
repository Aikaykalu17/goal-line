"use client";
import SpinnerMini from "./SpinnerMini";

import { Check, CheckCircle } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";
import { useState } from "react";
import faqs from "@/data/faqs";
import FaqList from "./FaqList";
import Reveal from "./Reveal";

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
    subject !== "" &&
    message !== "" &&
    email.trim() !== "";

  async function handleSubmit(e) {
    e.preventDefault();

    setStatus("sending");
    const formData = new FormData(e.target);

    const data = {
      fullName: formData.get("fullName"),
      dob: formData.get("dob"),
      position: formData.get("position"),
      phoneNumber: formData.get("phoneNumber"),
      state: formData.get("state"),
      email: formData.get("email"),
      message: formData.get("message"),
    };
    console.log(data);

    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Something went wrong");
      }
      setStatus("success");
      e.target.reset();

      setTimeout(() => {
        setStatus("idle");
      }, 8000);
    } catch (error) {
      console.error(error);
      setStatus("error");
    }
  }
  return (
    <div className="w-full bg-white ">
      <div className="py-8 flex flex-col gap-6  items-start rounded-l-sm rounded-r-sm  md:flex md:flex-col landscape:grid landscape:grid-cols-2">
        <Reveal>
          <form
            aria-labelledby="form-title"
            className="flex flex-col gap-4 pb-4 flex-1 border border-gray-500 p-4 rounded"
            onSubmit={handleSubmit}
          >
            <h2
              id="form-title"
              className="text-(--primary-dark) text-center font-extrabold text-lg"
            >
              Send us a message!
            </h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="text-xs flex flex-col gap-0.5">
                <label htmlFor="fullName">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Enter your full name"
                  className="border border-slate-400 rounded py-2 px-4 text-xs outline-none"
                  disabled={isDisabled}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>

              <div className="text-xs flex flex-col gap-0.5">
                <label htmlFor="phoneNumber">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="Phone number"
                  className="border border-slate-400 rounded py-2 px-4 text-xs focus:outline-none"
                  disabled={isDisabled}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                />
              </div>
            </div>

            <div className=" gap-3">
              <div className="text-xs flex flex-col gap-0.5">
                <label htmlFor="email">Email Address</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address"
                  className="border border-slate-400 rounded py-2 px-4 text-xs outline-none"
                  disabled={isDisabled}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <div className="text-xs flex flex-col gap-0.5">
              <label htmlFor="subject">Subject</label>
              <input
                id="subject"
                name="subject"
                required
                placeholder="How can we help you?"
                className="border border-slate-400 rounded py-2 px-4 text-xs outline-none"
                disabled={isDisabled}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>
            <div className="text-xs flex flex-col gap-0.5">
              <label htmlFor="message">Message</label>
              <textarea
                id="message"
                name="message"
                placeholder="Type your message here."
                className="border border-slate-400 rounded py-2 px-4 text-xs w-full h-32 resize-none overflow-y-auto outline-none"
                disabled={isDisabled}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>
            {isFormValid && (
              <button
                type="submit"
                disabled={isDisabled || status === "sending"}
                className="bg-(--primary) text-xs text-(--white) font-semibold py-4 px-20 rounded-md self-center disabled:opacity-50 flex items-center justify-center gap-2 transition-all duration-300 ease-out hover:translate-x-1 cursor-pointer border"
              >
                {status === "sending" && <SpinnerMini />}
                {status === "success" && (
                  <CheckCircle
                    size={30}
                    color="var(--white)"
                    className="animate-bounce"
                  />
                )}
                {status !== "sending" && status !== "success" && (
                  <>
                    Send a Message
                    <FaTelegramPlane size={16} />
                  </>
                )}
              </button>
            )}
            <div aria-live="polite">
              {status === "success" && (
                <p role="status" className="text-green-600 text-xs text-center">
                  Message received! We&apos;ll reach out via the email you
                  provided for other informaion and arrangements. Please avoid
                  submitting multiple messages.
                </p>
              )}
              {status === "error" && (
                <p role="alert" className="text-red-600 text-xs text-center">
                  Something went wrong. Please try again.
                </p>
              )}
            </div>
          </form>
        </Reveal>

        <div className="flex flex-col w-full gap-8 md:flex-1">
          <Reveal>
            <div className="flex flex-col gap-4">
              <h2 className="text-(--primary-dark) font-extrabold">FAQS</h2>
              <FaqList faqs={faqs} />
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

export default RegistrationForm;
