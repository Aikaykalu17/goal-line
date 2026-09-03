import process from "@/data/process";
import ProcessCard from "./ProcessCard";

function ProcessList() {
  return (
    <div className="flex flex-col gap-2 w-full md:flex-row md:justify-evenly md:gap-8">
      {process.map((p, index) => (
        <ProcessCard key={p.id} {...p} isLast={index === process.length - 1} />
      ))}
    </div>
  );
}

export default ProcessList;
