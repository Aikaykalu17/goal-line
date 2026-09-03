import ProcessList from "@/app/components/ProcessList";
import Reveal from "@/app/components/Reveal";
import processSteps from "@/data/process-steps";
import {
  ArrowRight,
  Trophy,
  CalendarClock,
  ShieldCheck,
  BadgeCheck,
} from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "How It Works - GoalLine Turf",
  description:
    "Learn how to book a pitch time, understand availability, pricing, promo codes, confirmations, and private booking rules.",
};

function Page() {
  return (
    <section className="w-full py-8 md:py-12">
      <div className="mx-auto flex w-[90%] max-w-7xl flex-col gap-10">
        {/* Hero */}
        <div className="grid gap-5 md:grid-cols-[1.3fr_1fr] md:items-end md:gap-10">
          <div>
            <p className="text-sm font-bold text-(--primary)">GoalLine Turf</p>
            <h2 className="mt-2 text-4xl font-black leading-[1.05] text-(--text) md:text-5xl">
              How the booking
              <br className="hidden md:block" /> process works
            </h2>
          </div>
          <p className="border-l-2 border-(--primary)/30 pl-4 text-sm font-medium leading-6 text-(--muted) md:text-base">
            A clear, simple, and secure process, built around your matchday from
            first click to kickoff.
          </p>
        </div>

        <Reveal>
          <ProcessList />
        </Reveal>

        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.4fr_0.9fr]">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-(--primary)/10 p-2 text-(--primary)">
                  <CalendarClock size={20} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-(--text) md:text-xl">
                  The booking process, step by step
                </h3>
              </div>

              <ol className="space-y-5">
                {processSteps.map((step) => (
                  <li
                    key={step.number}
                    className="flex gap-4 rounded-xl border border-gray-100 bg-gray-50 p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-(--primary) font-bold text-(--white)">
                      {step.number}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-(--text) md:text-base">
                        {step.title}
                      </h4>
                      <p className="mt-1 text-sm leading-6 text-(--muted)">
                        {step.text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            <div className="space-y-5 rounded-2xl border border-gray-200 p-5 shadow-sm md:p-7">
              <div>
                <h3 className="text-lg font-bold text-(--text) md:text-xl">
                  What &quot;Today&apos;s availability&quot; means
                </h3>
                <p className="mt-2 text-sm leading-6 text-(--muted)">
                  This shows you the turf&apos;s real schedule for the day you
                  pick. Green means the time is free. Grey means someone has
                  already booked that time. This helps you know what time is
                  still open before you book.
                </p>
              </div>

              <div className="flex gap-3 border-l-4 border-green-500 py-1 pl-4">
                <div>
                  <p className="text-sm font-bold text-(--text)">
                    Green, available
                  </p>
                  <p className="mt-1 text-sm leading-6 text-(--muted)">
                    This time is free. No one has booked it. You can pick any
                    part of it.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 border-l-4 border-gray-400 py-1 pl-4">
                <div>
                  <p className="text-sm font-bold text-(--text)">
                    Grey, already booked
                  </p>
                  <p className="mt-1 text-sm leading-6 text-(--muted)">
                    This time has already been booked by someone else. It could
                    be maintenance, a full day event, or another booking. Some
                    of these bookings are open to sharing, so other players may
                    still be allowed to use the turf at the same time. But this
                    time cannot be picked for a new private booking.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 border-l-4 border-(--primary) py-1 pl-4">
                <div>
                  <p className="text-sm font-bold text-(--text)">
                    Booking a private slot
                  </p>
                  <p className="mt-1 text-sm leading-6 text-(--muted)">
                    If you want the turf all to yourself, your start and end
                    time must stay inside the green area. Do not let your time
                    cross into any grey area. Grey means the turf is already in
                    use by someone else, so it cannot be part of your private
                    booking.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-(--primary)/10 p-2 text-(--primary)">
                  <ShieldCheck size={20} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-(--text) md:text-xl">
                  Booking types and exclusivity
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex flex-col gap-1.5">
                  <span className="w-fit rounded-full bg-(--primary)/10 px-2.5 py-1 text-xs font-bold text-(--primary)">
                    Solo / Individual
                  </span>
                  <p className="text-sm leading-6 text-(--muted)">
                    One player books a time. Other people can still be allowed
                    to use the turf at the same time.
                  </p>
                </li>
                <li className="flex flex-col gap-1.5">
                  <span className="w-fit rounded-full bg-(--primary)/10 px-2.5 py-1 text-xs font-bold text-(--primary)">
                    Team / Group, open to others
                  </span>
                  <p className="text-sm leading-6 text-(--muted)">
                    A group books the turf but is okay with other players
                    joining or using the turf at the same time.
                  </p>
                </li>
                <li className="flex flex-col gap-1.5">
                  <span className="w-fit rounded-full bg-(--primary)/10 px-2.5 py-1 text-xs font-bold text-(--primary)">
                    Team / Group, private booking
                  </span>
                  <p className="text-sm leading-6 text-(--muted)">
                    The time you pick becomes yours alone. No one else can use
                    the turf during that time. Your start and end time must not
                    cross into any grey area, because that time already belongs
                    to another booking.
                  </p>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl bg-(--primary)/10 p-2 text-(--primary)">
                  <BadgeCheck size={20} aria-hidden="true" />
                </div>
                <h3 className="text-lg font-bold text-(--text) md:text-xl">
                  Status, confirmation, payment, and expiry
                </h3>
              </div>

              <ul className="space-y-4">
                <li className="flex flex-col gap-1.5">
                  <span className="w-fit rounded-full bg-amber-100 px-2.5 py-1 text-xs font-bold text-amber-700">
                    Pending
                  </span>
                  <p className="text-sm leading-6 text-(--muted)">
                    The booking has been made but is waiting for payment and
                    confirmation.
                  </p>
                </li>
                <li className="flex flex-col gap-1.5">
                  <span className="w-fit rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700">
                    Confirmed
                  </span>
                  <p className="text-sm leading-6 text-(--muted)">
                    Payment has been made, and the booking is now active.
                  </p>
                </li>
                <li className="flex flex-col gap-1.5">
                  <span className="w-fit rounded-full bg-gray-200 px-2.5 py-1 text-xs font-bold text-gray-600">
                    Expired
                  </span>
                  <p className="text-sm leading-6 text-(--muted)">
                    A past booking that was never confirmed. It is no longer
                    valid.
                  </p>
                </li>
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm md:p-7">
            <h3 className="text-lg font-bold text-(--text) md:text-xl">
              Pricing, promo codes, and flexible rates
            </h3>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-bold text-(--text)">Promo codes</p>
                <p className="mt-2 text-sm leading-6 text-(--muted)">
                  A promo code can lower your total price if it is still valid.
                  We check the discount amount and the expiry date before your
                  booking is accepted. Expired or inactive codes will not work.
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4">
                <p className="text-sm font-bold text-(--text)">
                  Pricing management
                </p>
                <p className="mt-2 text-sm leading-6 text-(--muted)">
                  Admins can set different prices for different days or times.
                  Prices can go up or down for weekends, evenings, nights, or
                  special periods, depending on demand.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal>
          <div className="flex flex-row items-center justify-between gap-4 rounded-2xl bg-green-100 p-6 text-(--primary-dark) shadow-sm">
            <div className="flex items-center gap-4">
              <Trophy size={38} aria-hidden="true" />
              <div>
                <p className="text-lg font-bold">
                  Everything is designed to keep play simple.
                </p>
                <p className="text-sm font-medium text-(--primary-dark)">
                  Pick your time, choose the right booking type, pay when
                  confirmed, and get straight to the game.
                </p>
              </div>
            </div>
          </div>
        </Reveal>

        <div
          className="flex h-[40vh] flex-col justify-center gap-6 rounded-xl px-8 text-(--white) md:h-[50vh] lg:h-[30vh]"
          style={{
            backgroundImage: "url('/images/diffPitch.webp')",
            backgroundPosition: "center",
            backgroundSize: "cover",
          }}
        >
          <div>
            <h2 className="text-2xl font-black">Ready to Play?</h2>
            <p className="mt-2 text-sm text-white/90">
              Book your pitch time, choose the right format, and get your match
              started with confidence.
            </p>
          </div>
          <Link
            href="/booking"
            className="flex w-max items-center gap-4 rounded-sm bg-(--primary) px-8 py-3 text-xs font-bold text-(--white) transition-all duration-300 ease-out hover:translate-y-1 hover:text-(--text)"
          >
            Book your slot now
            <ArrowRight color="var(--white)" size={20} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default Page;
