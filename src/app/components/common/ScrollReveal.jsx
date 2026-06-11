"use client";

import { motion } from "framer-motion";

export default function ScrollReveal({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 120,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: false,
        amount: 0.15,
      }}
      transition={{
        duration: 1,
        ease: "easeOut",
      }}
    >
      {children}
    </motion.div>
  );
}