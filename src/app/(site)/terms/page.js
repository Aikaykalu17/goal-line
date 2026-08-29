import Reveal from "@/app/components/Reveal";
import SectionBanner from "@/app/components/SectionBanner";
import TermsCard from "@/app/components/TermsCard";

export const metadata = {
  title: "Terms & Conditions - GoalLine Turf",
  description: "Read our terms and conditions.",
};

function Page() {
  return (
    <section className="pb-8 flex flex-col gap-8">
      <SectionBanner backgroundImage="/images/diffPitch.webp">
        <h2 className="text-(--white) font-bold text-2xl md:text-4xl">
          Terms & Conditions
        </h2>
        <p className="text-(--white) text-base font-bold">
          Please read our terms and condtions carefully before booking.
        </p>
      </SectionBanner>

      <Reveal>
        <div className="w-[90%] mx-auto">
          <TermsCard />
        </div>
      </Reveal>
    </section>
  );
}

export default Page;
