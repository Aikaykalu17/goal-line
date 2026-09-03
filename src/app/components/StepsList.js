import steps from "@/data/steps";
import StepsCard from "./StepsCard";

export default function StepsList() {
  return (
    <section className="w-full flex flex-col items-center gap-4 border-b border-gray-200 pb-8">
      <div className="text-center max-w-2xl mx-auto px-4">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-(--text) tracking-tight leading-tight">
          How it Works
        </h2>
        <p className="mt-2 text-sm md:text-base text-(--muted) font-medium leading-relaxed">
          Booking your game in three simple steps
        </p>
      </div>
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {steps.map((s) => (
          <StepsCard key={s.title} {...s} />
        ))}
      </div>
    </section>
  );
}
