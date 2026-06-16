"use client";
import React from "react";

export default function PerformanceMetricsHeader() {
  return (
    <div className="mb-6 bg-gradient-to-r from-white/80 via-[#792CA2]/5 to-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center">
        <div className="w-1.5 h-8 bg-gradient-to-b from-[#792CA2] to-[#1F215D] rounded-full mr-3.5 shadow-md shadow-[#792CA2]/20" />
        <div className="flex flex-col">
          <h2 className="text-xl font-black bg-gradient-to-r from-[#111844] via-[#792CA2] to-[#1F215D] bg-clip-text text-transparent tracking-tight leading-none ">
            Performance&nbsp;&nbsp;&nbsp;Metrics
          </h2>
          <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">
            Real-time Cloud Operations
          </p>
        </div>
      </div>
    </div>
  );
}
