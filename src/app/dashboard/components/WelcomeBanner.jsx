"use client";
import React from "react";
import { motion } from "framer-motion";

export default function WelcomeBanner({ userName }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="rounded-3xl p-6 md:p-8 mb-6 md:mb-8 bg-gradient-to-r from-[#792CA2] via-[#9A4DCC] to-[#1F215D] text-white shadow-xl relative overflow-hidden"
    >
      {/* Custom Interactive SVG Background Pattern */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="banner-dots"
              width="24"
              height="24"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="2" cy="2" r="1.5" fill="#fff" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#banner-dots)" />
          <path
            d="M-100 80 C 150 -20, 200 130, 500 60 C 800 -10, 850 130, 1200 80"
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth="3"
          />
          <path
            d="M-50 110 C 200 20, 150 150, 600 80 C 900 10, 800 160, 1250 100"
            fill="none"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1.5"
          />
        </svg>
      </div>

      {/* Glowing Orbital graphics filling the empty right banner spot */}
      <div className="absolute right-14 top-1/2 -translate-y-1/2 w-28 h-28 hidden md:block pointer-events-none">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-center"
        >
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
            className="w-18 h-18 rounded-full border border-dotted border-white/40 flex items-center justify-center"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#DCCBFF] to-white/40 blur-[2px]"
            />
          </motion.div>
        </motion.div>
        <div className="absolute inset-5 rounded-full bg-white/5 blur-md animate-pulse" />
      </div>

      <div className="relative z-10">
        <h2 className="text-2xl font-bold">Welcome, {userName} </h2>
        <p className="mt-2 text-sm opacity-90 max-w-xl leading-relaxed">
          Monitor cloud spending, identify optimization opportunities, and reduce
          unnecessary costs.
        </p>
      </div>
    </motion.div>
  );
}
