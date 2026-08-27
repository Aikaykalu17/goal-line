import ProcessList from "@/app/components/ProcessList";
import { ArrowRight, Trophy } from "lucide-react";
import Link from "next/link";

function Page() {
  return (
    <section className="w-full py-8">
      <div className="w-[90%] mx-auto flex flex-col gap-10 items-center">
        <div className="text-center">
          <h2 className="text-(--text) font-bold">
            How It <span className="text-(--primary) font-bold">Works</span>
          </h2>
          <p className="text-(--muted) text-xs font-bold">
            Book your game in just three easy steps.
          </p>
        </div>
        <ProcessList />
        <div className="flex flex-row bg-green-100 rounded-lg w-full p-8 items-center gap-8 ">
          <Trophy size={50} aria-hidden="true" color="var(--primary-dark)" />
          <div>
            <p className="text-(--primary-dark) font-bold">
              That&apos;s it! You&apos;re all set.
            </p>
            <p className="text-(--muted) text-xs">
              Focus on the game, we&apos;ll handle the rest.
            </p>
          </div>
        </div>

        <div
          className="w-full h-[40vh] md:h-[50vh] lg:h-[30vh] flex flex-col  justify-center px-8 gap-6 text-(--white) rounded-xl"
          style={{
            backgroundImage: "url('/images/diffPitch.webp')",
            backgroundPosition: "center ",
            backgroundSize: "cover",
          }}
        >
          <div>
            <h2 className="font-bold text-2xl">Ready to Play?</h2>
            <p className="text-xs">
              Gather your team and and book your slot now.
            </p>
          </div>
          <Link
            href="/booking"
            className="px-8 py-3 bg-(--primary) text-(--white) text-xs rounded-sm flex items-center gap-4 w-max transition-all duration-300 ease-out hover:translate-y-1 cursor-pointer hover:text-(--text)"
          >
            Book your slot now{" "}
            <ArrowRight color="var(--white)" size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Page;
