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
    <div className="w-full">
      {/* Mobile accordion */}
      <div
        className={`md:hidden border rounded-xl bg-(--bg)/70 backdrop-blur-sm transition-all duration-300 ${
          isOpen ? "border-(--primary)/40 shadow-sm" : "border-(--border)/40"
        }`}
      >
        <button
          type="button"
          onClick={toggleOpen}
          aria-expanded={isOpen}
          aria-controls={`item-answer-${id}`}
          className="w-full flex justify-between items-center gap-4 p-3.5 sm:p-4 text-left"
        >
          <h3 className="text-sm font-bold text-(--text) leading-tight">
            {title}
          </h3>
          <div className="p-1.5 rounded-lg bg-(--primary)/10 shrink-0">
            <ChevronDown
              size={16}
              className={`text-(--primary) transition-transform duration-300 ${
                isOpen ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>
        </button>

        <div
          id={`item-answer-${id}`}
          className={`grid transition-all duration-300 ease-in-out ${
            isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 text-xs text-(--muted) leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>

      {/* Desktop expanded */}
      <div className="hidden md:block h-full">
        {variant === "terms" ? (
          // Terms & Conditions layout with number + connector line
          <div className="flex flex-row gap-4">
            <div className="relative flex flex-col items-center pt-1">
              <span className="bg-(--primary) text-white flex items-center justify-center w-7 h-7 font-bold rounded-full text-xs shadow-sm z-10">
                {id}
              </span>
              {id < total && (
                <span className="absolute top-7 left-1/2 -translate-x-1/2 w-px h-[calc(100%-0.5rem)] bg-(--primary)/20" />
              )}
            </div>
            <div className="flex flex-col gap-1.5 pb-6">
              <h3 className="text-base text-(--text) font-bold">{title}</h3>
              <p className="text-sm text-(--muted) leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        ) : (
          // Default layout with icon - icon rendered exactly as passed
          <div className="flex flex-row gap-4 p-5 rounded-xl border border-(--border)/40 bg-(--bg)/70 backdrop-blur-sm hover:border-(--primary)/30 hover:shadow-sm transition-all duration-300 h-full">
            <div className="shrink-0">{Icon}</div>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-base text-(--text) font-bold leading-tight">
                {title}
              </h3>
              <p className="text-sm text-(--muted) leading-relaxed">
                {description}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PrivacySection;
