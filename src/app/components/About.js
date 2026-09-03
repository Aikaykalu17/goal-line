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
          <div className="flex flex-col gap-5 sm:gap-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-(--text) tracking-tight leading-tight">
              About GoalLine Turf
            </h2>

            <p className="text-(--muted) text-sm md:text-base font-medium leading-relaxed">
              GoalLine Turf is a premium 5-a-side football turf located in a
              secure environment with top facilities. Whether it&apos;s a
              friendly match or regular training, we&apos;ve got you covered.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { icon: FaLeaf, text: "Well maintained turf" },
                { icon: FaShieldAlt, text: "Secure environment" },
                { icon: FaShower, text: "Clean changing rooms" },
                { icon: FaParking, text: "Ample parking space" },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-3 p-4 rounded-xl border border-(--border)/40 bg-(--bg)/70 backdrop-blur-sm hover:border-(--primary)/40 transition-all duration-300"
                >
                  <Icon
                    color="var(--primary)"
                    size={18}
                    aria-hidden="true"
                    className="shrink-0"
                  />
                  <p className="text-(--text) text-sm font-semibold">{text}</p>
                </div>
              ))}
            </div>

            <Link
              href="/about"
              className="flex items-center gap-2 bg-(--primary) text-white text-sm font-semibold py-3 px-6 w-max rounded-lg transition-all duration-300 hover:gap-3 hover:shadow-lg mt-2 sm:mt-0"
            >
              About GoalLine Turf
              <FaArrowRight aria-hidden="true" size={14} />
            </Link>
          </div>

          {/* Image */}
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden shadow-lg mt-2 md:mt-0">
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
      </Reveal>
    </section>
  );
}

export default About;
