"use client";
import React from "react";
import { motion } from "framer-motion";
import { ChartBarSquareIcon, ArrowTrendingUpIcon } from "@heroicons/react/24/outline";
import CountUp from "react-countup";

export default function TotalInsights({ totalActions = 0, totalSavings = 0, isLoading = false }) {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white flex flex-col justify-between min-h-[220px] h-full animate-pulse"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gray-200" />
            <div className="space-y-2">
              <div className="h-3 bg-gray-200 rounded w-24" />
              <div className="h-2.5 bg-gray-200 rounded w-36" />
            </div>
          </div>
          <div className="w-12 h-6 rounded-full bg-gray-200" />
        </div>

        <div className="mt-6 space-y-3">
          <div className="flex items-baseline gap-2">
            <div className="h-10 bg-gray-200 rounded w-16" />
            <div className="h-4 bg-gray-200 rounded w-12" />
          </div>
          <div className="h-3.5 bg-gray-200 rounded w-48" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(121,44,162,0.15)" }}
      className="relative overflow-hidden bg-white/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white flex flex-col justify-between min-h-[220px] h-full"
    >
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-[#9A4DCC]/20 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex items-start justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#792CA2] to-[#9A4DCC] flex items-center justify-center shadow-lg shadow-[#792CA2]/30">
            <ChartBarSquareIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Total Insights</h2>
            <p className="text-xs text-gray-400 mt-0.5">Discovered across all resources</p>
          </div>
        </div>
        
      </div>

      <div className="relative z-10 mt-6">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-black text-[#111844] tracking-tighter">
            <CountUp end={totalActions} duration={1.5} />
          </span>
          <span className="text-lg font-semibold text-gray-400">actions</span>
        </div>
        <p className="text-sm text-gray-500 mt-2 font-medium">
          Implementing these can save approximately <span className="text-[#792CA2] font-bold">${Math.round(totalSavings).toLocaleString()}/mo</span>.
        </p>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#792CA2] via-[#9A4DCC] to-[#DCCBFF]" />
    </motion.div>
  );
}
