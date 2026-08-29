import BookingCard from "@/app/components/BookingCard";
import Reveal from "@/app/components/Reveal";
import SectionBanner from "@/app/components/SectionBanner";

export const metadata = {
  title: "Booking Policy - GoalLine Turf",
  description: "Read our booking rules and guidelines.",
};

function Page() {
  return (
    <section className="w-full pb-8 flex flex-col gap-8">
      <SectionBanner backgroundImage="/images/diffPitch.webp">
        <h2 className="text-(--white) font-bold text-2xl md:text-4xl">
          Booking Policy
        </h2>
        <p className="text-(--white) text-base font-bold">
          Important Information about our booking rules and cancellation terms.
        </p>
      </SectionBanner>

      <Reveal>
        <div className="w-[90%] mx-auto">
          <BookingCard />
        </div>
      </Reveal>
    </section>
  );
}

export default Page;
