import booking from "@/data/booking";
import PrivacySection from "./PrivacySection";

function PrivacyCard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
      {booking.map((item) => (
        <PrivacySection
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          icon={item.icon}
        />
      ))}
    </div>
  );
}

export default PrivacyCard;
