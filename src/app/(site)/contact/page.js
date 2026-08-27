import RegistrationForm from "@/app/components/RegistrationForm";
import Reveal from "@/app/components/Reveal";
import SectionBanner from "@/app/components/SectionBanner";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

function Page() {
  return (
    <section className="w-full flex flex-col gap-8 pb-4">
      {/* <div
        className="w-full h-[40vh] md:h-[50vh] lg:h-[30vh] flex flex-col  justify-start p-8 gap-6"
        style={{
          backgroundImage: "url('/images/diffPitch.webp')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-[90%] mx-auto flex flex-col gap-4">
          <h2 className="text-(--white) font-bold text-2xl md:text-4xl">
            Contact Us
          </h2>
          <p className="text-(--white) text-base font-bold">
            We&apos;d love to hear from you <br />
            Reach out to us for your bookings, enquiries, and any other
            information.
          </p>
        </div>
      </div> */}
      <SectionBanner backgroundImage="/images/diffPitch.webp">
        <h2 className="text-(--white) font-bold text-2xl md:text-4xl">
          Contact Us
        </h2>
        <p className="text-(--white) text-base font-bold">
          We’d love to hear from you <br />
          Reach out to us for your bookings, enquiries, and any other
          information.
        </p>
      </SectionBanner>
      <div className="w-[90%] mx-auto">
        <Reveal>
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-(--text) font-bold">Get in Touch</h3>
                <p className="text-xs text-(--muted) font-bold">
                  Fill out the form and we&apos;ll get back to you as soon as
                  possible.
                </p>
              </div>
              <div className="flex flex-col">
                <div className="flex flex-row items-center gap-2">
                  <FaMapMarkerAlt
                    aria-hidden="true"
                    color="var(--primary-dark)"
                    size={20}
                  />
                  <p className="font-bold">Address</p>
                </div>
                <address className="text-(--muted) not-italic text-xs font-bold">
                  No. 14 Aminu Kano Crescent, Wuse II, Abuja, FCT, Nigeria
                </address>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <FaPhoneAlt
                    aria-hidden="true"
                    color="var(--primary-dark)"
                    size={20}
                  />
                  <p className="font-bold">Phone</p>
                </div>
                <a
                  href="tel:+2348101375140"
                  className="text-xs font-bold text-(--muted)"
                >
                  +234 810 137 5140
                </a>
              </div>

              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <FaEnvelope
                    aria-hidden="true"
                    color="var(--primary-dark)"
                    size={20}
                  />
                  <p className="font-bold">Email</p>
                </div>
                <a
                  href="mailto:ikegod4luv@gmail.com"
                  className="text-xs font-bold text-(--muted)"
                >
                  ikegod4luv@gmail.com
                </a>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center gap-2">
                  <FaClock
                    aria-hidden="true"
                    color="var(--primary-dark)"
                    size={20}
                  />
                  <p className="font-bold">Opening Hours</p>
                </div>
                <p className="text-xs font-bold text-(--muted)">
                  <time dateTime="Mo-Fr 06:00-23:00">
                    Mon – Fri: 6:00 AM – 11:00 PM
                  </time>
                </p>
              </div>
            </div>

            {/* form */}
            <RegistrationForm />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Page;
