"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AlertsHeader() {
  return (
    <div className="relative mb-8 flex justify-between items-center bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/40 shadow-sm z-50">
      <h1 className="text-3xl font-extrabold text-[#111844] tracking-tight">Alerts</h1>
      
      {/* Floating Section 13 Tab */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="absolute -top-6 right-8 bg-gradient-to-r from-[#111844] to-[#1F215D] px-6 py-2 rounded-t-xl shadow-lg border border-[#111844]"
      >
        <span className="text-sm font-bold text-[#DCCBFF] tracking-widest uppercase">Section 13</span>
      </motion.div>
    </div>
  );
}
