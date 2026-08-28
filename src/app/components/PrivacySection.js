"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

function PrivacySection({
  id,
  title,
  description,
  icon: Icon,
  total,
  variant = "default",
}) {
  const [isOpen, setIsOpen] = useState(false);

  function toggleOpen() {
    setIsOpen((prev) => !prev);
  }

  return (
    <div>
      {/* Mobile accordion */}
      <div className="border border-slate-200 p-4 md:hidden">
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={`item-answer-${id}`}
          className="w-full flex justify-between items-center text-xs font-semibold text-left"
        >
          {title}
          <ChevronDown
            size={14}
            className={`transform transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {isOpen && (
          <p
            id={`item-answer-${id}`}
            className="text-xs text-gray-500 mt-2 fade-in"
          >
            {description}
          </p>
        )}
      </div>

      {/* Desktop expanded */}
      <div className="hidden md:block">
        {variant === "terms" ? (
          // Terms & Conditions layout with number + connector line
          <div className="flex flex-row gap-4">
            <div className="relative flex flex-col items-center">
              <span className="bg-(--primary) text-(--white) flex items-center justify-center w-6 h-6 font-bold rounded-full text-xs">
                {id}
              </span>
              {/* vertical connector line */}
              {id < total && (
                <span className="absolute top-6 left-1/2 -translate-x-1/2 w-px h-full bg-(--primary)" />
              )}
            </div>
            <div className="flex flex-col gap-4 ">
              <h3 className="text-xs text-(--text) font-bold">{title}</h3>
              <p className="text-xs text-(--muted) font-bold">{description}</p>
            </div>
          </div>
        ) : (
          // Default layout with icon (Privacy Policy, Booking Policy, etc.)
          <div className="flex flex-row gap-4 shadow p-6 h-full">
            {Icon}
            <div className="flex flex-col gap-2">
              <h3 className="text-xs text-(--text) font-bold">{title}</h3>
              <p className="text-xs text-(--muted) font-bold">{description}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivacySection;
