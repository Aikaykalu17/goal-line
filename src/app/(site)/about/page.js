import HighlightsList from "@/app/components/HighlightsList";
import Reveal from "@/app/components/Reveal";
import Image from "next/image";

export const metadata = {
  title: "About - GoalLine Turf",
  description: "About GoalLine Turf.",
};

function Page() {
  return (
    <section className="w-full">
      <div
        className="w-full py-8 aspect-video [@media(orientation:landscape)_and_(max-height:750px)]:h-[80vh] [@media(orientation:landscape)_and_(max-height:500px)]:gap-3 md:h-[40vh] lg:h-[90vh] v-shape flex flex-col pt-12 md:pt-20 gap-4 pl-8 md:pl-20"
        style={{
          backgroundImage: "url('/images/diffAngle.webp')",
          backgroundPosition: "center bottom",
          backgroundSize: "cover",
        }}
      >
        <h2 className="text-(--white) text-2xl xl:text-5xl font-bold">
          About <span className="text-(--primary)">GoalLine Turf</span>
        </h2>
        <p className="text-(--white) text-xs">
          More than just a pitch - it is where <br /> good games and great
          moments happen.
        </p>
      </div>
      <div className="w-[90%] mx-auto flex flex-col gap-12">
        <Reveal>
          <div className="flex flex-col gap-8 md:grid md:grid-cols-2 place-items-end">
            <div className="flex flex-col gap-4">
              <h3 className="text-xs font-bold text-(--primary)">WHO WE ARE</h3>
              <p className="text-(--text) font-bold">
                Built for Players. <br />
                Focused on Experience.
              </p>
              <p className="text-xs font-bold text-(--muted)">
                GoalLine Turf is a premuim 5-a-side football turf designed to
                give you the best playing experience with top-quality facilties,
                a secure environment, and excellent customer service.
              </p>
              <p className="text-xs font-bold text-(--muted)">
                Whether you&apos;re here for a casual game with friends, a
                competitive match, or regular training session, we&apos;ve got
                the perfect pitch for you.
              </p>
            </div>
            <div className="flex flex-row">
              <Image
                src="/images/diffPitch.webp"
                alt="GoalLine Turf"
                width={450}
                height={100}
                className="rounded-lg self-end"
                sizes="500px"
              />
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
