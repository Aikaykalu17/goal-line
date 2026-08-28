import PrivacySection from "./PrivacySection";
import booking from "@/data/booking";

function BookingCard() {
  return (
    <div className="flex flex-col gap-4 md:grid md:grid-cols-2 h-full">
      {booking.map((b) => (
        <PrivacySection
          key={b.id}
          id={b.id}
          title={b.title}
          description={b.description}
          icon={b.icon}
        />
      ))}
    </div>
  );
}

export default BookingCard;
