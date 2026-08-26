import steps from "@/data/steps";
import StepsCard from "./StepsCard";

export default function StepsList() {
  return (
    <section className="w-full flex flex-col items-center gap-4">
      <div className="text-center">
        <h2 className="text-(--text) font-bold">How it Works</h2>
        <p className="text-(--muted)">
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
