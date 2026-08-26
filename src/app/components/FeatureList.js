import features from "@/data/features";
import FeatureCard from "./FeatureCard";

export default function FeatureList() {
  return (
    <section className="w-full">
      <div className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-4 gap-6">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </section>
  );
}
