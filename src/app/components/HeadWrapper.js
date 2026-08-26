"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import useHeaderVisibility from "../(site)/hooks/useHeaderVisibility";
import Navbar from "./Navbar";

export default function HeaderWrapper() {
  const { showHeader, targetRef } = useHeaderVisibility();
  const location = usePathname();

  const isKnownRoute = [
    "/",
    "/about",
    "/booking",
    "/contact",
    "/how-it-works",
  ].includes(location);

  return (
    <>
      <AnimatePresence>
        {showHeader && isKnownRoute && (
          <motion.div
            key="navbar"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="fixed top-0 left-0 w-full z-50"
          >
            <Navbar />
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={targetRef} className="h-px w-full" aria-hidden="true"></div>
    </>
  );
}
