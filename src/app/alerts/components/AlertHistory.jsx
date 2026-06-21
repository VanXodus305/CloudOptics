"use client";
import React from "react";
import { motion } from "framer-motion";
import { AdjustmentsHorizontalIcon, ClockIcon } from "@heroicons/react/24/outline";

export default function AlertHistory() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      className="relative mt-12"
    >

      <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col relative z-0 min-h-[200px]">
        
        {/* Top bar area for the box */}
        <div className="flex justify-end mb-4 relative z-20">
          <button className="bg-green-100/50 text-green-700 border border-green-200 hover:bg-green-100 hover:border-green-300 transition-colors px-4 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
            <AdjustmentsHorizontalIcon className="w-4 h-4" />
            Filter
          </button>
        </div>

        {/* Main Content Area */}
        <div className="bg-white/80 rounded-2xl p-8 border border-white shadow-inner flex-grow flex items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#792CA2]/5 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-400/5 rounded-full blur-2xl pointer-events-none" />
          
          <p className="text-gray-600 font-medium text-center relative z-10 text-lg">
            Showing all the <span className="font-bold text-[#111844]">resolved</span>, <span className="font-bold text-[#111844]">in progress</span> and <span className="font-bold text-[#111844]">unresolved</span> alerts
          </p>
        </div>

      </div>
    </motion.div>
  );
}
