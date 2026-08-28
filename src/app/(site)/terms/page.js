import SectionBanner from "@/app/components/SectionBanner";
import TermsCard from "@/app/components/TermsCard";

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
      <div className="w-[90%] mx-auto">
        <TermsCard />
      </div>
    </section>
  );
}

export default Page;
