import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full bg-(--forest)">
      <div className="w-[90%] mx-auto flex flex-col gap-8 py-8 md:flex md:flex-row md:justify-between">
        <div className="flex flex-col gap-4">
          <p className="text-(--white) font-bold">GoalLine Turf</p>
          <address className="text-(--white)  text-xs font-bold">
            No. 14 Aminu Kano Crescent, Wuse II, Abuja, FCT, Nigeria
          </address>
          <p className="text-(--white) font-bold">
            Open daily:{" "}
            <time dateTime="08:00" className="text-xs">
              8:00 AM
            </time>{" "}
            –
            <time dateTime="23:00" className="text-xs">
              11:00 PM
            </time>
          </p>
        </div>
        <div className="flex flex-col gap-4 items-center md:flex md:flex-col xl:flex xl:flex-row xl:items-center xl:gap-8">
          <div className="flex gap-6 self-start md:self-center">
            {/* Facebook */}
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <FaFacebook
                color="var(--white)"
                size={30}
                aria-hidden="true"
                className="cursor-pointer"
              />
            </a>

            {/* WhatsApp */}
            <a
              href="https://wa.me/2348012345678"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
            >
              <FaWhatsapp
                color="var(--white)"
                size={30}
                aria-hidden="true"
                className="cursor-pointer"
              />
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram
                color="var(--white)"
                size={30}
                aria-hidden="true"
                className="cursor-pointer"
              />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
