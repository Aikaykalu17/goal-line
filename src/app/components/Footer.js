import Image from "next/image";
import Link from "next/link";
import {
  FaFacebook,
  FaWhatsapp,
  FaInstagram,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

function Footer() {
  const year = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: "Home", href: "/" },
      { name: "About", href: "/about" },
      { name: "How It Works", href: "/how-it-works" },
      { name: "Contact", href: "/contact" },
    ],
    support: [
      { name: "FAQs", href: "/contact" },
      { name: "Booking Policy", href: "/booking-policy" },
      { name: "Terms & Conditions", href: "/terms" },
      { name: "Privacy Policy", href: "/privacy" },
    ],
  };

  const socials = [
    { name: "Facebook", href: "https://www.facebook.com", icon: FaFacebook },
    { name: "WhatsApp", href: "https://wa.me/2348101375140", icon: FaWhatsapp },
    { name: "Instagram", href: "https://www.instagram.com", icon: FaInstagram },
  ];

  return (
    <footer className="w-full bg-(--forest)">
      <div className="w-[90%] max-w-7xl mx-auto py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="flex flex-col gap-4 lg:col-span-1">
            <Link href="/" className="w-fit">
              <Image
                src="/whiteLogo.webp"
                alt="GoalLine Turf"
                width={140}
                height={40}
                priority
                className="object-contain"
              />
            </Link>
            <p className="text-white/80 text-sm leading-relaxed">
              The best place to play. <br />
              Book your slot and enjoy the beautiful game.
            </p>

            <address className="not-italic flex flex-col gap-2 text-sm text-white/70">
              <span className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-0.5 shrink-0" size={14} />
                No. 14 Aminu Kano Crescent, Wuse II, Abuja
              </span>
              <span className="flex items-center gap-2">
                <FaClock size={14} />
                Open daily: 8:00 AM – 11:00 PM
              </span>
            </address>
          </div>

          {/* Explore */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg tracking-tight">
              Explore
            </h2>
            <ul className="flex flex-col gap-3">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg tracking-tight">
              Support
            </h2>
            <ul className="flex flex-col gap-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-white/70 text-sm hover:text-white hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div className="flex flex-col gap-4">
            <h2 className="text-white font-bold text-lg tracking-tight">
              Follow Us
            </h2>
            <p className="text-white/70 text-sm">
              Join our community and stay updated.
            </p>
            <div className="flex gap-4">
              {socials.map(({ name, href, icon: Icon }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="p-2.5 rounded-full bg-white/10 hover:bg-(--primary) transition-all duration-300 hover:scale-110 group"
                >
                  <Icon
                    size={20}
                    className="text-white group-hover:text-white"
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="w-[90%] max-w-7xl mx-auto py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/50 text-xs">
            © {year} GoalLine Turf. All rights reserved.
          </p>
          <p className="text-white/50 text-xs">
            Inspired by Ndubuaku Casper ❤️
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
