"use client";
import React from "react";
import { motion } from "framer-motion";
import {
  Squares2X2Icon,
  CpuChipIcon,
  LightBulbIcon,
  BellAlertIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";

export default function Sidebar({
  isSidebarExpanded,
  setIsSidebarExpanded,
  isLiveSimulation,
  setIsLiveSimulation,
  handleSignOut,
}) {
  return (
    <motion.aside
      animate={{ width: isSidebarExpanded ? 240 : 76 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="flex-shrink-0 h-full bg-[#111844] text-white p-5 flex flex-col overflow-y-auto z-40 border-r border-[#1F215D]/20 rounded-tr-2xl"
    >
      <div className="flex items-center justify-between mb-8">
        {isSidebarExpanded && (
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-semibold text-lg tracking-wide text-gray-200 uppercase text-xs font-bold"
          >
            Navigation
          </motion.h2>
        )}
        <button
          onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
          className={`p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors focus:outline-none ${!isSidebarExpanded ? "mx-auto" : ""}`}
          title={isSidebarExpanded ? "Collapse Menu" : "Expand Menu"}
        >
          <Bars3Icon className="w-5 h-5" />
        </button>
      </div>

      <nav className="flex-grow flex flex-col justify-between pb-12">
        <div className="space-y-4">
          <button
            className={`text-xs font-semibold text-white relative flex items-center transition-all duration-150 ${
              isSidebarExpanded
                ? "w-full text-left px-4 py-3 rounded-xl bg-[#792CA2] gap-3 shadow-md hover:bg-[#9A4DCC]"
                : "w-11 h-11 rounded-xl bg-[#792CA2] mx-auto justify-center hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_#5c1f7e,0_2px_6px_rgba(121,44,162,0.3)] shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.4)] border border-[#9A4DCC]/30"
            }`}
          >
            <Squares2X2Icon className="w-5 h-5 flex-shrink-0" />
            {isSidebarExpanded && (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                Dashboard
              </motion.span>
            )}
          </button>

          {[
            { name: "Resources", icon: CpuChipIcon },
            { name: "Recommendations", icon: LightBulbIcon },
            { name: "Alerts", icon: BellAlertIcon },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                className={`text-xs transition-all duration-150 font-medium flex items-center ${
                  isSidebarExpanded
                    ? "w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/25 gap-3"
                    : "w-11 h-11 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/15 border border-gray-700/40 bg-white/5 mx-auto justify-center active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(0,0,0,0.2)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live Simulation Toggle */}
        <div className={`transition-all duration-300 ${
          isSidebarExpanded
            ? "py-3 px-4 bg-[#792CA2]/10 border border-[#792CA2]/25 rounded-xl my-4 flex flex-col items-stretch"
            : "w-11 h-11 rounded-xl bg-white/5 border border-gray-700/40 mx-auto my-4 flex items-center justify-center shadow-[0_3px_0_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.2)]"
        }`}>
          <div className={`flex items-center justify-between w-full ${isSidebarExpanded ? "" : "justify-center"}`}>
            {isSidebarExpanded && (
              <div className="flex flex-col">
                <span className="text-[9px] text-[#DCCBFF] font-bold uppercase tracking-wider">Simulation</span>
              </div>
            )}
            <button
              onClick={() => setIsLiveSimulation(!isLiveSimulation)}
              className={`rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex-shrink-0 ${
                isSidebarExpanded ? "w-9 h-5" : "w-8 h-4.5"
              } ${
                isLiveSimulation ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-600"
              }`}
            >
              <motion.div
                layout
                className={`${isSidebarExpanded ? "w-4 h-4" : "w-3 h-3"} bg-white rounded-full shadow-md`}
                animate={{ x: isLiveSimulation ? (isSidebarExpanded ? 16 : 14) : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>
          {isLiveSimulation && isSidebarExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex items-center gap-1.5 mt-1.5 w-full justify-start animate-pulse"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
              </span>
            </motion.div>
          )}
        </div>

        <div className="space-y-4">
          <button
            className={`text-xs font-medium flex items-center transition-all duration-150 ${
              isSidebarExpanded
                ? "w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/25 gap-3"
                : "w-11 h-11 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/15 border border-gray-700/40 bg-white/5 mx-auto justify-center active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(0,0,0,0.2)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"
            }`}
          >
            <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
            {isSidebarExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate"
              >
                Settings
              </motion.span>
            )}
          </button>

          <button
            onClick={handleSignOut}
            className={`text-xs font-medium flex items-center transition-all duration-150 ${
              isSidebarExpanded
                ? "w-full text-left px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 gap-3"
                : "w-11 h-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/25 border border-red-950/40 bg-red-950/10 mx-auto justify-center active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(239,68,68,0.1)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(239,68,68,0.15)] hover:shadow-[0_4px_0_#991b1b,0_4px_10px_rgba(239,68,68,0.25)] hover:border-red-500/30"
            }`}
          >
            <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
            {isSidebarExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="truncate"
              >
                Sign Out
              </motion.span>
            )}
          </button>
        </div>
      </nav>
    </motion.aside>
  );
}
