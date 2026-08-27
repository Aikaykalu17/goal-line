"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

function PrivacySection({ id, title, description, icon: Icon }) {
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
        <div className="flex flex-row gap-4">
          {Icon}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs text-(--text) font-bold">{title}</h3>
            <p className="text-xs text-(--muted) font-bold">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacySection;
