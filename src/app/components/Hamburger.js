"use client";

import Link from "next/link";
import HamburgerList from "./HamburgerList";
import { FaArrowRight } from "react-icons/fa";

function Hamburger({ isOpen, onClose, navItems }) {
  return (
    <nav
      id="mobile-menu"
      aria-label="Main navigation"
      aria-hidden={!isOpen}
      className="mt-8 flex flex-col gap-4 w-[90%] mx-auto h-[90%]"
    >
      <HamburgerList navItems={navItems} onClose={onClose} />

      <Link
        href="/booking"
        onClick={() => dispatch({ type: "RESET" })}
        className="px-12 py-4 bg-(--white) text-(--primary) rounded-sm text-center w-max self-center text-xs flex items-center gap-4"
      >
        Book Now{" "}
        <FaArrowRight color="var(--forest)" aria-hidden="true" size={14} />
      </Link>
    </nav>
  );
}

export default Hamburger;
