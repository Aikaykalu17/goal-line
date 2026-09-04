"use client";

import Link from "next/link";
import HamburgerList from "./HamburgerList";
import { FaArrowRight } from "react-icons/fa";

function Hamburger({ isOpen, onClose, navItems }) {
  return (
    <div
      id="mobile-menu"
      aria-hidden={!isOpen}
      className={`fixed inset-0 top-18 z-40 transition-all duration-300 ${
        isOpen ? "opacity-100 visible" : "opacity-0 invisible"
      }`}
    >
      {/* Backdrop blur */}
      <div className="absolute inset-0 bg-(--bg)/80 backdrop-blur-md" />

      <div className="relative h-[calc(100dvh-72px)] flex flex-col px-5 pt-5 pb-4">
        {/* Scrollable list */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden -mx-5 px-5 pb-4">
          <HamburgerList navItems={navItems} onClose={onClose} />
        </div>

        {/* Sticky CTA */}
        <div className="pt-4 border-t border-(--white)/10">
          <Link
            href="/booking"
            onClick={onClose}
            className="group w-full flex items-center justify-center gap-2.5 px-6 py-3.5 bg-(--primary) text-white rounded-xl text-sm font-bold shadow-lg hover:shadow-(--primary)/30 transition-all duration-300 active:scale-95"
          >
            Book Now
            <FaArrowRight
              size={14}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Hamburger;
