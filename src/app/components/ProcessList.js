import process from "@/data/process";
import ProcessCard from "./ProcessCard";

function ProcessList() {
  return (
    <div className="flex flex-col gap-8 md:flex md:flex-row w-full md:justify-evenly">
      {process.map((p) => (
        <ProcessCard key={p.id} {...p} />
      ))}
    </div>
  );
}

export default ProcessList;
