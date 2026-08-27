import privacy from "@/data/privacy";
import PrivacySection from "./PrivacySection";

function PrivacyCard() {
  return (
    <div className="flex flex-col gap-8 w-[90%] mx-auto">
      {privacy.map((item) => (
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
