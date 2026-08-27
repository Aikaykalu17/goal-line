import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
} from "react-icons/fa";

function Page() {
  return (
    <section className="w-full">
      <div
        className="w-full h-[40vh] md:h-[50vh] lg:h-[30vh] flex flex-col  justify-start p-8 gap-6 rounded-xl"
        style={{
          backgroundImage: "url('/images/diffPitch.webp')",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="w-[90%] mx-auto">
          <h2 className="text-(--white) font-bold text-2xl md:text-4xl">
            Contact Us
          </h2>
          <p className="text-(--white) text-xs">
            We&apos;d love to hear from you <br />
            Reach out to us for your bookings, enquiries, and any other
            information.
          </p>
        </div>
      </div>
      <div className="w-[90%] mx-auto">
        {/* form */}
        <div>
          <div>
            <h3 className="text-(--text) font-bold">Get in Touch</h3>
            <div className="flex">
              <FaMapMarkerAlt />
              <div className="flex-col">
                <p className="font-bold">Address</p>
                <address className="text-(--white)  text-xs font-bold">
                  No. 14 Aminu Kano Crescent, Wuse II, Abuja, FCT, Nigeria
                </address>
              </div>
            </div>
          </div>
          <form></form>
        </div>
      </div>
    </section>
  );
}

export default Page;
