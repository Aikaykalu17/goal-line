import Booking from "@/app/components/Booking";
import SectionBanner from "@/app/components/SectionBanner";

export const metadata = {
  title: "Booking - GoalLine Turf",
  description: "Book a slot.",
};

function Page() {
  return (
    <section className="w-full">
      <SectionBanner backgroundImage="/images/diffPitch.webp">
        <h2 className="text-(--white) font-bold text-2xl md:text-4xl">
          Book Your Pitch
        </h2>
        <p className="text-(--white) text-base font-bold">
          Choose your preferred date and time to get started.
        </p>
      </SectionBanner>

      <div className="w-[90%] mx-auto py-8">
        <Booking />
      </div>
    </section>
  );
}

export default Page;
