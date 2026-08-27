"use client";
import { useState } from "react";
import { Plus, X } from "lucide-react";

function FaqList({ faqs }) {
  const [openId, setOpenId] = useState(null);

  function toggleFaq(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="flex flex-col gap-2">
      {faqs.map((faq) => {
        const isOpen = openId === faq.id;

        return (
          <div key={faq.id} className="border border-slate-200 p-4">
            <button
              type="button"
              onClick={() => toggleFaq(faq.id)}
              aria-expanded={isOpen}
              aria-controls={`faq-answer-${faq.id}`}
              className="w-full flex justify-between items-center text-xs font-semibold text-left"
            >
              {faq.question}
              {isOpen ? <X size={14} /> : <Plus size={14} />}
            </button>

            {isOpen && (
              <p
                id={`faq-answer-${faq.id}`}
                className="text-xs text-gray-500 mt-2 fade-in"
              >
                {faq.answer}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default FaqList;
