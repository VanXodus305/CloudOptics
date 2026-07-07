"use client";
import React from "react";
import { motion } from "framer-motion";

export default function AlertsTable({ alerts, setIsAlertsModalOpen, isLoading }) {
  const renderLegend = (className) => (
    <div className={`flex items-center gap-2 text-[8px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-wider ${className}`}>
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical
      </span>
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> High
      </span>
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Medium
      </span>
      <span className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Low
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white/80 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 dark:border-white/5 relative"
    >
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-[#080A1A]/40 rounded-3xl flex items-center justify-center z-30 backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex justify-between items-start mb-2">
        <div className="flex flex-col gap-1.5">
          <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] flex flex-wrap gap-x-1.5 gap-y-0.5">
            <span>Optimization</span>
            <span>Alerts</span>
          </h3>
          {renderLegend("md:hidden mt-0.5")}
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <button
            onClick={() => setIsAlertsModalOpen(true)}
            className="text-xs text-[#792CA2] dark:text-[#C084FC] hover:underline font-bold flex items-center gap-0.5 focus:outline-none"
          >
            View All
          </button>
          {/* Colored Legends for Alerts*/}
          {renderLegend("hidden md:flex")}
        </div>
      </div>

      <div className="space-y-3 mt-4">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className="bg-gray-50 dark:bg-slate-800/80 border border-gray-100/80 dark:border-slate-700 rounded-2xl flex items-stretch overflow-hidden shadow-sm"
          >
            <div className="p-3 flex justify-between items-center flex-grow">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  {/* Colored bullets describing the severity*/}
                  <span
                    className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${
                      alert.severity === "Critical"
                        ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]"
                        : alert.severity === "High"
                        ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]"
                        : alert.severity === "Medium"
                        ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]"
                        : "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                    }`}
                    title={alert.severity}
                  />
                  <h4 className="text-xs font-extrabold text-gray-800 dark:text-gray-200">
                    {alert.title}
                  </h4>
                </div>
                <p className="text-[10px] text-gray-400 dark:text-gray-400 leading-normal">
                  {alert.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
