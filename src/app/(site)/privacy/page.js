import PrivacyCard from "@/app/components/PrivacyCard";
import Reveal from "@/app/components/Reveal";
import SectionBanner from "@/app/components/SectionBanner";

export const metadata = {
  title: "Privacy Policy - GoalLine Turf",
  description: "Read our privacy policy.",
};

function Page() {
  return (
    <section className="pb-4 flex flex-col gap-4">
      <SectionBanner backgroundImage="/images/diffPitch.webp">
        <h2 className="text-(--white) font-bold text-2xl md:text-4xl">
          Privacy Policy
        </h2>
        <p className="text-(--white) text-base font-bold">
          We&apos;re committed to protecting your privacy and personal
          information.
        </p>
      </SectionBanner>

      <Reveal>
        <div className="flex flex-col gap-4 w-[90%] mx-auto">
          <PrivacyCard />
        </div>
      </Reveal>
    </section>
  );
}

export default Page;
