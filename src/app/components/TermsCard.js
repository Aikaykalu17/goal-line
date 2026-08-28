import terms from "@/data/terms";
import PrivacySection from "./PrivacySection";

function TermsCard() {
  return (
    <div className="flex flex-col gap-4 w-[90%] mx-auto">
      {terms.map((item, index) => (
        <PrivacySection
          key={item.id}
          id={item.id}
          title={item.title}
          description={item.description}
          variant="terms"
          total={terms.length} //
        />
      ))}
    </div>
  );
}

export default TermsCard;
