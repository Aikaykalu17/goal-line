import Link from "next/link";
import { FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-(--forest) flex flex-col">
      <div className="w-[90%] mx-auto flex flex-col gap-8 py-8 md:flex md:flex-row md:justify-between">
        <div className="flex flex-col gap-4">
          <h2 className="text-(--white) font-bold">GoalLine Turf</h2>
          <p className="text-(--white) text-xs">The best place to play.</p>
          <p className="text-(--white) text-xs">
            Book your slot and enjoy the beautiful game.
          </p>
        </div>
        <nav className="flex flex-row gap-12" aria-label="Social Links">
          <div>
            <h2 className="text-(--white) font-bold">Explore</h2>
            <ul className="flex flex-col">
              <li>
                <Link
                  href="/"
                  className="text-(--white) text-xs cursor-pointer"
                >
                  Home
                </Link>{" "}
              </li>
              <li>
                {" "}
                <Link
                  href="/about"
                  className="text-(--white) text-xs cursor-pointer"
                >
                  About
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  href="/how-it-works"
                  className="text-(--white) text-xs cursor-pointer"
                >
                  How It Works
                </Link>
              </li>
              <li>
                {" "}
                <Link
                  href="/contact"
                  className="text-(--white) text-xs cursor-pointer"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-(--white) font-bold">Support</h2>
            <ul className="flex flex-col">
              <li>
                <Link href="" className="text-(--white) text-xs cursor-pointer">
                  FAQs
                </Link>
              </li>
              <li>
                <Link href="" className="text-(--white) text-xs cursor-pointer">
                  Booking Policy
                </Link>
              </li>
              <li>
                <Link href="" className="text-(--white) text-xs cursor-pointer">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-(--white) text-xs cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>
        </nav>

        <div className="flex flex-col gap-4 items-center md:flex md:flex-col xl:flex xl:flex-col xl:items-center xl:gap-4">
          <h2 className="text-(--white) font-bold">Follow Us</h2>
          <div className="flex gap-6 md:self-center">
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
      <div className="py-4 text-center border-t border-gray-600">
        <p className="text-[0.625rem] text-gray-400">
          © {year} GoalLine Turf. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
// <address className="text-(--white)  text-xs font-bold">
//       No. 14 Aminu Kano Crescent, Wuse II, Abuja, FCT, Nigeria
//     </address>
//     <p className="text-(--white) font-bold">
//       Open daily:{" "}
//       <time dateTime="08:00" className="text-xs">
//         8:00 AM
//       </time>{" "}
//       –
//       <time dateTime="23:00" className="text-xs">
//         11:00 PM
//       </time>
//     </p>
