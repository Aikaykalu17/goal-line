"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

import Hamburger from "./Hamburger";
import navItems from "@/data/navItems";

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
          px-3 lg:px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200
          ${
            isActive
              ? "text-(--primary) bg-(--primary)/10"
              : "text-(--text)/80 hover:text-(--text) hover:bg-(--bg)/50"
          }
        `}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <Link
          href="/booking"
          onClick={() => dispatch({ type: "RESET" })}
          className="hidden landscape:flex md:flex items-center py-2.5 px-5 rounded-xl bg-(--primary) text-white text-sm font-bold transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
        >
          Book Now
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
