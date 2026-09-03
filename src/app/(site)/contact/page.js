import RegistrationForm from "@/app/components/RegistrationForm";
import Reveal from "@/app/components/Reveal";
import SectionBanner from "@/app/components/SectionBanner";
import FaqList from "@/app/components/FaqList"; // use your existing FaqList
import faqs from "@/data/faqs"; // use your existing faqs data
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";
import { HelpCircle } from "lucide-react";

export const metadata = {
  title: "Contact Us - GoalLine Turf",
  description:
    "Get in touch with GoalLine Turf for bookings, enquiries, and support in Abuja.",
};

function Page() {
  return (
    <section className="w-full flex-col gap-10 pb-20">
      <SectionBanner backgroundImage="/images/diffPitch.webp">
        <div className="flex flex-col gap-3">
          <h2 className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl tracking-tight drop-shadow-lg">
            Contact Us
          </h2>
          <p className="text-white/90 text-base sm:text-lg font-medium max-w-2xl drop-shadow-md">
            We&apos;d love to hear from you. Reach out for bookings, enquiries,
            and any other information.
          </p>
        </div>
      </SectionBanner>

      <div className="w-[90%] max-w-7xl mx-auto flex flex-col gap-16 ">
        <Reveal>
          {/* 1. Contact Info + Form */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Contact Info Card */}
            <div className="flex flex-col gap-6 p-6 sm:p-8 rounded-2xl border border-(--border)/40 bg-(--bg)/70 backdrop-blur-sm">
              <div>
                <h3 className="text-2xl font-extrabold text-(--text) tracking-tight">
                  Get in Touch
                </h3>
                <p className="text-(--muted) text-sm font-medium mt-1">
                  Fill out the form and we&apos;ll get back to you within 24
                  hours.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  {
                    icon: FaMapMarkerAlt,
                    label: "Address",
                    value:
                      "No. 14 Aminu Kano Crescent, Wuse II, Abuja, FCT, Nigeria",
                    href: "https://maps.google.com/?q=No.+14+Aminu+Kano+Crescent+Wuse+II+Abuja",
                  },
                  {
                    icon: FaPhoneAlt,
                    label: "Phone",
                    value: "+234 810 137 5140",
                    href: "tel:+2348101375140",
                  },
                  {
                    icon: FaEnvelope,
                    label: "Email",
                    value: "ikegod4luv@gmail.com",
                    href: "mailto:ikegod4luv@gmail.com",
                  },
                  {
                    icon: FaClock,
                    label: "Opening Hours",
                    value: "Mon – Fri: 6:00 AM – 11:00 PM",
                    href: null,
                  },
                ].map(({ icon: Icon, label, value, href }) => (
                  <div
                    key={label}
                    className="flex gap-3 rounded-xl p-2 transition-colors hover:bg-(--primary)/5"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-(--primary)/10">
                      <Icon
                        color="var(--primary)"
                        size={16}
                        aria-hidden="true"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <p className="text-sm font-bold text-(--text)">{label}</p>
                      {href ? (
                        <a
                          href={href}
                          target={label === "Address" ? "_blank" : undefined}
                          rel={
                            label === "Address"
                              ? "noopener noreferrer"
                              : undefined
                          }
                          className="text-sm text-(--muted) font-medium hover:text-(--primary) transition-colors"
                        >
                          {value}
                        </a>
                      ) : (
                        <p className="text-sm text-(--muted) font-medium">
                          <time dateTime="Mo-Fr 06:00-23:00">{value}</time>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Registration Form (renders its own card) */}
            <RegistrationForm />
          </div>

          {/* 2. FAQ */}
          <div className="pt-8 border-t border-(--border)/30">
            <div className="flex flex-col items-center gap-3 mb-8 text-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-(--primary)/10">
                <HelpCircle
                  size={20}
                  color="var(--primary)"
                  aria-hidden="true"
                />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-(--text) tracking-tight">
                Frequently Asked Questions
              </h3>
              <p className="text-(--muted) text-xs sm:text-sm font-medium max-w-2xl mx-auto">
                Quick answers to common questions about bookings and facilities.
              </p>
            </div>
            <div className="max-w-3xl mx-auto">
              <FaqList faqs={faqs} />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Page;
