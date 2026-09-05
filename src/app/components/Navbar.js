"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

import Hamburger from "./Hamburger";
import navItems from "@/data/navItems";
import { ArrowRight, ChevronDown } from "lucide-react";
import { useBooking } from "@/context/BookingContext";

const aboutLinks = [
  { href: "/booking-policy", label: "Booking Policy" },
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
];

function Navbar() {
  const [open, setOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [prevPathname, setPrevPathname] = useState(null);
  const aboutRef = useRef(null);
  const pathname = usePathname();
  const { dispatch } = useBooking();

  const navLinks = [
    { href: "/how-it-works", label: "How It Works" },
    { href: "/contact", label: "Contact" },
  ];

  const isAboutActive =
    pathname === "/about" || aboutLinks.some((link) => link.href === pathname);

  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (aboutOpen) setAboutOpen(false);
  }

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    document.documentElement.style.overflow = open ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!aboutOpen) return;

    function handleClickOutside(e) {
      if (aboutRef.current && !aboutRef.current.contains(e.target)) {
        setAboutOpen(false);
      }
    }

    function handleEscape(e) {
      if (e.key === "Escape") setAboutOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [aboutOpen]);

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
        <nav className="hidden landscape:flex md:flex items-center gap-0.5 md:gap-1 lg:gap-2">
          <Link
            href="/"
            aria-current={pathname === "/" ? "page" : undefined}
            className={`px-2 md:px-3 lg:px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              pathname === "/"
                ? "bg-(--primary)/10 text-(--primary)"
                : "text-(--text)/80 hover:bg-(--primary)/5 hover:text-(--text)"
            }`}
          >
            Home
          </Link>

          {/* About GoalLine dropdown */}
          <div
            ref={aboutRef}
            className="relative"
            onMouseEnter={() => setAboutOpen(true)}
            onMouseLeave={() => setAboutOpen(false)}
          >
            <button
              type="button"
              onClick={() => setAboutOpen((v) => !v)}
              aria-expanded={aboutOpen}
              aria-haspopup="menu"
              aria-controls="about-dropdown"
              className={`flex items-center gap-1.5 px-2 md:px-3 lg:px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${
                isAboutActive
                  ? "bg-(--primary)/10 text-(--primary)"
                  : "text-(--text)/80 hover:bg-(--primary)/5 hover:text-(--text)"
              }`}
            >
              About <span className="hidden md:inline">GoalLine</span>
              <ChevronDown
                size={14}
                className={`transition-transform duration-300 ${
                  aboutOpen ? "rotate-180" : "rotate-0"
                }`}
                aria-hidden="true"
              />
            </button>

            <div
              id="about-dropdown"
              role="menu"
              className={`absolute left-1/2 top-full z-50 w-52 -translate-x-1/2 pt-2 ${
                aboutOpen ? "pointer-events-auto" : "pointer-events-none"
              }`}
            >
              <div
                className={`flex flex-col rounded-2xl border border-gray-100 bg-white p-2 shadow-lg origin-top transition-[transform,opacity] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                  aboutOpen ? "scale-100 opacity-100" : "scale-90 opacity-0"
                }`}
              >
                <Link
                  href="/about"
                  role="menuitem"
                  aria-current={pathname === "/about" ? "page" : undefined}
                  className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                    pathname === "/about"
                      ? "bg-(--primary)/10 text-(--primary)"
                      : "text-(--text)/80 hover:bg-(--primary)/5 hover:text-(--text)"
                  }`}
                >
                  About GoalLine
                </Link>

                <div className="my-1.5 h-px bg-gray-100" aria-hidden="true" />

                {aboutLinks.map(({ href, label }) => {
                  const isActive = pathname === href;
                  return (
                    <Link
                      key={href}
                      href={href}
                      role="menuitem"
                      aria-current={isActive ? "page" : undefined}
                      className={`rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                        isActive
                          ? "bg-(--primary)/10 text-(--primary)"
                          : "text-(--text)/80 hover:bg-(--primary)/5 hover:text-(--text)"
                      }`}
                    >
                      {label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <Link
            href="/how-it-works"
            aria-current={pathname === "/how-it-works" ? "page" : undefined}
            className={`px-2 md:px-3 lg:px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              pathname === "/how-it-works"
                ? "bg-(--primary)/10 text-(--primary)"
                : "text-(--text)/80 hover:bg-(--primary)/5 hover:text-(--text)"
            }`}
          >
            <span className="md:hidden">Process</span>
            <span className="hidden md:inline">How It Works</span>
          </Link>

          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`px-2 md:px-3 lg:px-4 py-3 text-sm font-semibold rounded-lg transition-colors duration-200 ${
              pathname === "/contact"
                ? "bg-(--primary)/10 text-(--primary)"
                : "text-(--text)/80 hover:bg-(--primary)/5 hover:text-(--text)"
            }`}
          >
            Contact
          </Link>
        </nav>
        <Link
          href="/booking"
          onClick={() => dispatch({ type: "RESET" })}
          className="group hidden landscape:flex md:flex items-center gap-2 py-2.5 px-5 rounded-xl bg-(--primary) text-white text-sm font-bold transition-all duration-300 hover:gap-3 hover:shadow-lg"
        >
          Book Now
          <ArrowRight
            size={16}
            className="transition-transform duration-300 group-hover:translate-x-0.5"
            aria-hidden="true"
          />
        </Link>
        {/* Hamburger button */}
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
