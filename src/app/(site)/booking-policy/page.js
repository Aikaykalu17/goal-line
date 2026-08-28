import BookingCard from "@/app/components/BookingCard";
import SectionBanner from "@/app/components/SectionBanner";

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
      <div className="w-[90%] mx-auto">
        <BookingCard />
      </div>
    </section>
  );
}

export default Page;
