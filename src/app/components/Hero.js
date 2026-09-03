"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import HeroBackground from "./HeroBackground";

function Hero() {
  return (
    <HeroBackground backgroundImage="/images/fullPitch.webp" priority>
      <div className="w-[90%] max-w-5xl h-full mx-auto flex-col justify-center gap-5 sm:gap-6 text-center md:text-left">
        <h1 className="text-white text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-tight drop-shadow-lg">
          Book. Play. <br className="hidden sm:block" />
          Enjoy Football.
        </h1>

        <p className="text-white/90 text-sm sm:text-base font-semibold drop-shadow-md">
          All at GoalLine Turf
        </p>

        <p className="text-white/80 text-sm sm:text-base font-medium leading-relaxed drop-shadow-md max-w-xl">
          A premium 5-a-side turf available for hourly, daily and monthly
          bookings
        </p>

        <Link
          href="/booking"
          className="px-6 sm:px-8 py-3 sm:py-3.5 bg-(--primary) text-white text-sm sm:text-base font-bold rounded-xl flex items-center gap-2 w-max mx-auto md:mx-0 mt-2 transition-all duration-300 ease-out hover:gap-3 hover:shadow-2xl"
        >
          Book your slot now
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </div>
    </HeroBackground>
  );
}

export default Hero;
