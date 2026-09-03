"use client";
import { useState } from "react";
import { Plus, Minus } from "lucide-react";

function FaqList({ faqs }) {
  const [openId, setOpenId] = useState(null);

  function toggleFaq(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2.5">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div
            key={faq.id}
            className={`border border-(--border)/40 rounded-xl bg-(--bg)/70 backdrop-blur-sm transition-all duration-300 ${
              isOpen ? "border-(--primary)/40" : "hover:border-(--primary)/20"
            }`}
          >
            <button
              type="button"
              onClick={() => toggleFaq(faq.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq.id}`}
              className="w-full flex justify-between items-center gap-4 p-3.5 sm:p-4 text-left group"
            >
              <h3 className="text-sm sm:text-base font-semibold text-(--text) group-hover:text-(--primary) transition-colors">
                {faq.question}
              </h3>
              <div className="shrink-0 p-1 rounded-full bg-(--primary)/10 group-hover:bg-(--primary)/20 transition-colors">
                {isOpen ? (
                  <Minus
                    size={14}
                    className="text-(--primary) transition-transform duration-300"
                  />
                ) : (
                  <Plus
                    size={14}
                    className="text-(--primary) transition-transform duration-300 group-hover:rotate-90"
                  />
                )}
              </div>
            </button>

            <div
              id={`faq-answer-${faq.id}`}
              className={`grid transition-all duration-300 ease-in-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-3.5 sm:px-4 pb-3.5 sm:pb-4 text-xs sm:text-sm text-(--muted) leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default FaqList;
