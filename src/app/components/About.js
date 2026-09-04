import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaLeaf,
  FaParking,
  FaShieldAlt,
  FaShower,
} from "react-icons/fa";
import Reveal from "./Reveal";

function About() {
  return (
    <section className="w-full py-12 md:py-16">
      <Reveal>
        <div className="w-[90%] max-w-7xl mx-auto flex flex-col gap-8 md:grid md:grid-cols-2 md:gap-12 items-center">
          {/* Text Content */}
          <div className="flex flex-col gap-4 sm:gap-5">
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-(--primary)" aria-hidden="true" />
              <p className="text-xs font-bold uppercase tracking-wide text-(--primary)">
                Who we are
              </p>
            </div>

            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-(--text) tracking-tight leading-snug">
              About GoalLine Turf
            </h2>

            <p className="text-(--muted) text-xs md:text-sm font-medium leading-relaxed">
              GoalLine Turf is a premium 5-a-side football turf located in a
              secure environment with top facilities. Whether it&apos;s a
              friendly match or regular training, we&apos;ve got you covered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {[
                { icon: FaLeaf, text: "Well maintained turf" },
                { icon: FaShieldAlt, text: "Secure environment" },
                { icon: FaShower, text: "Clean changing rooms" },
                { icon: FaParking, text: "Ample parking space" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="group flex items-center gap-2.5 p-3 rounded-lg border border-(--border)/40 bg-(--bg)/70 backdrop-blur-sm hover:border-(--primary)/40 hover:-translate-y-0.5 transition-all duration-300"
                >
                  <div className="shrink-0 rounded-md p-1.5 bg-(--primary)/10 group-hover:bg-(--primary)/20 transition-colors duration-300">
                    <Icon color="var(--primary)" size={14} aria-hidden="true" />
                  </div>
                  <p className="text-(--text) text-xs font-semibold">{text}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="group flex items-center gap-2 bg-(--primary) text-white text-sm font-semibold py-3 px-6 w-max rounded-lg transition-all duration-300 hover:gap-3 hover:shadow-lg mt-2 sm:mt-0"
            >
              About GoalLine Turf
              <FaArrowRight
                aria-hidden="true"
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Image */}
          <div className="relative w-full mt-2 md:mt-0">
            <div
              className="absolute -right-3 -bottom-3 hidden h-full w-full rounded-2xl bg-(--primary)/15 sm:block"
              aria-hidden="true"
            />
            <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/fullPitch.webp"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                alt="GoalLine Turf full pitch"
                priority
              />
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

export default About;
