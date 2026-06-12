"use client";

import { motion } from "framer-motion";

export default function FadeIn({ children }) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 80,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: false,
        amount: 0.25,
      }}
      transition={{
        duration: 1,
      }}
    >
      {children}
    </motion.div>
  );
}