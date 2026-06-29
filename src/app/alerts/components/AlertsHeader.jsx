"use client";
import React from "react";
import { motion } from "framer-motion";

import { BellAlertIcon } from "@heroicons/react/24/outline";

export default function AlertsHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-50 max-w-[1600px] mx-auto w-full">
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex items-center gap-4"
      >
        {/* Animated Icon Badge */}
        <motion.div
          whileHover={{ scale: 1.1, rotate: 6 }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className="p-3.5 bg-gradient-to-br from-[#792CA2] to-[#9A4DCC] rounded-2xl shadow-xl shadow-[#792CA2]/30 flex items-center justify-center"
        >
          <BellAlertIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
        </motion.div>
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2]">
            Alerts Center
          </h1>
          <p className="text-sm text-gray-400 font-medium mt-0.5">
            Monitor, investigate, and resolve active incidents in real-time
          </p>
        </div>
      </motion.div>
    </div>
  );
}
