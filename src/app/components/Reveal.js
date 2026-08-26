"use client";
import { motion } from "framer-motion";

export default function Reveal({ children, direction = "up" }) {
  const variants = {
    up: { hidden: { opacity: 0, y: 50 }, show: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -50 }, show: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 50 }, show: { opacity: 1, x: 0 } },
  };

  return (
    <motion.div
      className="w-full overflow-hidden"
      variants={variants[direction]}
      initial="hidden"
      whileInView="show"
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      {children}
    </motion.div>
  );
}
