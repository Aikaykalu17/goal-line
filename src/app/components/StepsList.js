import steps from "@/data/steps";
import StepsCard from "./StepsCard";
import { ArrowRight, ArrowDown } from "lucide-react";

export default function StepsList() {
  return (
    <section className="w-full flex flex-col items-center gap-8 border-b border-gray-200 pb-8">
      <div className="text-center max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-center gap-3">
          <span className="h-px w-8 bg-(--primary)" aria-hidden="true" />
          <p className="text-xs font-bold uppercase tracking-wide text-(--primary)">
            Get started
          </p>
          <span className="h-px w-8 bg-(--primary)" aria-hidden="true" />
        </div>
        <h2 className="mt-3 text-xl sm:text-2xl md:text-3xl font-extrabold text-(--text) tracking-tight leading-snug">
          How it works
        </h2>
        <p className="mt-2 text-xs md:text-sm text-(--muted) font-medium leading-relaxed">
          Booking your game in three simple steps
        </p>
      </div>

      <div className="w-[90%] mx-auto flex flex-col gap-4 md:flex-row md:items-stretch md:gap-3">
        {steps.map((s, index) => {
          const isLast = index === steps.length - 1;
          return (
            <div
              key={s.title}
              className="flex flex-col items-center gap-4 md:flex-1 md:flex-row"
            >
              <StepsCard {...s} />
              {!isLast && (
                <>
                  <ArrowDown
                    size={16}
                    className="shrink-0 text-(--primary)/40 md:hidden"
                    aria-hidden="true"
                  />
                  <ArrowRight
                    size={16}
                    className="hidden shrink-0 text-(--primary)/40 md:block"
                    aria-hidden="true"
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
