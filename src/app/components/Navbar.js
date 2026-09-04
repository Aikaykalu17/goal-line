"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Hamburger from "./Hamburger";
import navItems from "@/data/navItems";
import { ArrowRight } from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About GoalLine" },
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

  // Disables homepage scrolling whenever open is true.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  function handleClick() {
    setOpen((open) => !open);
  }

  const mobileMenuId = "mobile-navigation";

  return (
    <header className="bg-(--background) flex justify-between items-center h-18 w-full fixed left-0 top-0 z-50 shadow-2xl">
      <div className="px-6 flex justify-between items-center w-full">
        <div className="z-50   flex justify-between items-center">
          <Image
            src={open ? "/whiteLogo.webp" : "/logo.webp"}
            alt="Goal Line Turf logo"
            width={140}
            height={40}
            priority
            className="h-8 sm:h-10 w-auto object-contain"
          />
        </div>
        {/* Nav links for desktop view */}
        <nav className="hidden landscape:flex md:flex items-center gap-1 lg:gap-2">
          {navLinks.map(({ href, label }) => {
            const isActive = pathname === href;

            return (
              <Link
                key={href}
                href={href}
                aria-current={isActive ? "page" : undefined}
                className={`
          group relative px-3 lg:px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200
          ${
            isActive
              ? "text-(--primary)"
              : "text-(--text)/80 hover:text-(--text)"
          }
        `}
              >
                {label}
                <span
                  className={`absolute inset-x-3 lg:inset-x-4 -bottom-0.5 h-0.5 rounded-full bg-(--primary) transition-transform duration-300 ease-out ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>
        <Link
          href="/booking"
          onClick={() => dispatch({ type: "RESET" })}
          className="group hidden landscape:flex md:flex items-center gap-2 py-2.5 px-5 rounded-xl bg-(--primary) text-white text-sm font-bold transition-all duration-300 hover:gap-3 hover:shadow-lg hover:-translate-y-0.5"
        >
          Book Now
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        {/* Hamburger biutton */}
        <div className="md:hidden landscape:hidden">
          <button
            type="button"
            className={open ? "hamburger open" : "hamburger"}
            onClick={handleClick}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls={mobileMenuId}
            aria-haspopup="true"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        <div
          id={mobileMenuId}
          className={open ? "overlay active" : "overlay"}
          onClick={(e) => e.stopPropagation()}
          aria-label="Mobile navigation menu"
        >
          <Hamburger navItems={navItems} onClose={handleClick} isOpen={open} />
        </div>
      </div>
    </header>
  );
}

export default Navbar;
