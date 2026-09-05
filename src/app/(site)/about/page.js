import HeroBackground from "@/app/components/HeroBackground";
import HighlightsList from "@/app/components/HighlightsList";
import Reveal from "@/app/components/Reveal";
import Image from "next/image";

export const metadata = {
  title: "About - GoalLine Turf",
  description: "About GoalLine Turf.",
};

function Page() {
  return (
    <section className="w-full flex flex-col gap-8">
      <HeroBackground
        backgroundImage="/images/diffAngle.webp"
        imagePosition="center bottom"
        className="v-shape flex flex-col gap-4 pt-12 pl-8 md:pt-20 md:pl-20"
      >
        <h2 className="text-white text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight leading-[1.1] drop-shadow-lg">
          About <span className="text-(--primary)">GoalLine Turf</span>
        </h2>
        <p className="text-white/90 text-sm sm:text-base font-semibold leading-snug drop-shadow-md">
          More than just a pitch - it is where <br /> good games and great
          moments happen.
        </p>
      </HeroBackground>

      <div className="w-[90%] mx-auto flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col gap-10 md:grid md:grid-cols-2 md:items-center md:gap-16">
            <div className="flex flex-col gap-5 md:gap-5 md:border-l md:border-(--border) md:pl-6">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-(--primary)" aria-hidden="true" />
                <h3 className="text-xs font-bold uppercase tracking-wide text-(--primary)">
                  Who we are
                </h3>
              </div>

              <h2 className="leading-[1.05] text-(--text)">
                <span className="block text-3xl font-bold sm:text-4xl lg:text-5xl">
                  Built for players.
                </span>
                <span className="mt-1 block text-xl font-medium text-(--muted) sm:text-2xl lg:text-3xl">
                  Focused on experience.
                </span>
              </h2>

              <div className="flex flex-col gap-4 max-w-md md:max-w-lg">
                <p className="text-sm leading-relaxed text-(--muted) sm:text-base">
                  GoalLine Turf is a premium 5-a-side football turf designed to
                  give you the best playing experience with top-quality
                  facilities, a secure environment, and excellent customer
                  service.
                </p>
                <p className="text-sm leading-relaxed text-(--muted) sm:text-base">
                  Whether you&apos;re here for a casual game with friends, a
                  competitive match, or a regular training session, we&apos;ve
                  got the perfect pitch for you.
                </p>
              </div>
            </div>

            <div className="relative">
              <div
                className="absolute -right-3 -bottom-3 hidden h-full w-full rounded-2xl bg-(--primary)/15 sm:block"
                aria-hidden="true"
              />
              <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-black/5 shadow-sm sm:aspect-3/2 md:aspect-4/5">
                <Image
                  src="/images/diffPitch.webp"
                  alt="Players on the GoalLine Turf pitch"
                  fill
                  loading="lazy"
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <HighlightsList />
        </Reveal>
      </div>
    </section>
  );
}

export default Page;
