import Image from "next/image";
import Link from "next/link";
import {
  FaArrowRight,
  FaLeaf,
  FaParking,
  FaShieldAlt,
  FaShower,
} from "react-icons/fa";

function About() {
  return (
    <section className="w-full bg-(--forest) py-8">
      <div className="w-[90%] mx-auto flex flex-col gap-8 md:grid md:grid-cols-2">
        <div className="flex flex-col gap-8 justify-center">
          <h2 className="text-(--white) font-bold">About GoalLIne Turf</h2>
          <p className="text-(--white) text-xs">
            GoalLine Turf is a premium 5-a-side football <br /> turf located in
            a secure environment with top <br /> facilities. Whether it&apos;s a
            friendly match <br /> or regular training, we&apos;ve got you
            covered.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex items-center gap-2">
              <FaLeaf color="var(--white)" size={16} aria-hidden="true" />
              <p className="text-(--white) text-xs">Well maintained turf</p>
            </div>

            <div className="flex items-center gap-2">
              <FaShieldAlt color="var(--white)" size={16} aria-hidden="true" />
              <p className="text-(--white) text-xs">Secure environment</p>
            </div>

            <div className="flex items-center gap-2">
              <FaShower color="var(--white)" size={16} aria-hidden="true" />
              <p className="text-(--white) text-xs">Clean changing rooms</p>
            </div>

            <div className="flex items-center gap-2">
              <FaParking color="var(--white)" size={16} aria-hidden="true" />
              <p className="text-(--white) text-xs">Ample parking space</p>
            </div>
          </div>
          <Link
            href="/about"
            className=" flex items-center gap-2 bg-(--white) text-(--forest) text-xs py-3 px-8 w-max rounded-sm  hover:text-(--text) transition-all duration-300 ease-out hover:translate-x-1"
          >
            About GoalLine Turf{" "}
            <FaArrowRight color="var(--forest)" aria-hidden="true" size={14} />
          </Link>
        </div>
        <div className="flex justify-end">
          <Image
            src="/images/fullPitch.webp"
            width={500}
            height={100}
            alt="GoalLine Turf"
            className="rounded-lg"
          />
        </div>
      </div>
    </section>
  );
}

export default About;
