import { ArrowRight } from "lucide-react";
import Link from "next/link";

function Hero() {
  return (
    <section
      className="w-full py-8 aspect-video [@media(orientation:landscape)_and_(max-height:750px)]:h-[80vh] [@media(orientation:landscape)_and_(max-height:500px)]:gap-3 md:h-[40vh] lg:h-[90vh]"
      style={{
        backgroundImage: "url('/images/fullPitch.webp')",
        backgroundPosition: "center",
        backgroundSize: "cover",
      }}
    >
      <div className="w-[90%] h-full mx-auto flex flex-col justify-center gap-4">
        <h1 className="text-(--white) text-2xl font-bold xl:text-5xl">
          Play. Book. <br />
          Enjoy Football.
        </h1>
        <p className="text-(--gray) text-xs font-bold">All at GoalLine Turf</p>
        <p className="text-(--gray) text-xs font-bold">
          A premium 5-a-side turf available for hourly, <br /> daily and monthly
          bookings
        </p>
        <Link
          href="/booking"
          className="px-8 py-3 bg-(--primary) text-xs text-(--white) rounded-sm flex items-center gap-4 w-max transition-all duration-300 ease-out hover:translate-y-1 cursor-pointer hover:text-(--text)"
        >
          Book your slot now{" "}
          <ArrowRight color="var(--white)" size={20} aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}

export default Hero;
