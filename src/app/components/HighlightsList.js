import highlights from "@/data/hightlights";
import HighlightsCard from "./HighlightsCard";

function HighlightsList() {
  return (
    <div className="w-full ">
      <div className="flex flex-col gap-8 pb-8 md:grid md:grid-cols-2 xl:flex xl:flex-row">
        {highlights.map((h) => (
          <HighlightsCard key={h.id} {...h} />
        ))}
      </div>
    </div>
  );
}

export default HighlightsList;
