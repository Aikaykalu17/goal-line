import PrivacyCard from "@/app/components/PrivacyCard";
import SectionBanner from "@/app/components/SectionBanner";

function page() {
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
      <div>
        <PrivacyCard />
      </div>
    </section>
  );
}

export default page;
