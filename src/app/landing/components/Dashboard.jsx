"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";

export default function DashboardPreview() {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <section
      id="dashboard"
      className="
      py-28
      bg-[#F9F7F7]
      dark:bg-[#080A1A]
      rounded-t-[50px]
      border-t
      border-[#EEEEEE]
      dark:border-slate-800/40
      relative
      overflow-hidden
      transition-colors
      duration-500
      "
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
          grid
          lg:grid-cols-2
          gap-12
          lg:gap-20
          items-center
          "
        >
          {/* SaaS Dashboard Mockup Panel */}
          <div
            className="
            min-h-[480px]
            h-auto
            sm:h-[480px]
            pb-4
            sm:pb-0
            rounded-3xl
            bg-[#F9F7F7]
            dark:bg-[#080A1A]
            border
            border-gray-200
            dark:border-slate-800/50
            flex
            flex-col
            shadow-2xl
            overflow-hidden
            relative
            transition-colors
            duration-500
            "
          >
            {/* Dashboard Header (Mini Topbar) */}
            <div className="bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border-b border-gray-200/80 dark:border-slate-800/80 px-4 py-3 flex items-center justify-between z-10 transition-colors duration-500">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-gray-400 dark:text-slate-500 font-mono ml-2">
                  cloudoptics.io/dashboard
                </span>
              </div>
              <div className="flex items-center gap-3">
                {/* Date Badge */}
                <div className="hidden xs:flex items-center gap-1 px-2 py-0.5 rounded-md bg-gray-100 dark:bg-slate-900 border border-gray-200/50 dark:border-slate-800/50 text-[9px] font-bold text-gray-500 dark:text-slate-400">
                  <span className="text-[#792CA2] dark:text-[#B770FF]">📅</span>
                  <span>June 16, 2026</span>
                </div>
                {/* User image badge */}
                <div className="w-6 h-6 rounded-full bg-gradient-to-r from-[#792CA2] to-[#DCCBFF] p-0.5 shadow-sm">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center text-[8px] font-black text-[#792CA2]">
                    U
                  </div>
                </div>
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="flex-grow p-3.5 grid grid-cols-12 gap-3.5 bg-[#F9F7F7] dark:bg-[#080A1A] z-10 transition-colors duration-500">
              {/* Mockup Sidebar (Dark Sidebar) */}
              <div className="hidden sm:flex col-span-3 bg-[#111844] rounded-2xl p-2.5 flex-col justify-between border border-[#1F215D]/20 shadow-md">
                <div>
                  {/* Brand name representation */}
                  <div className="flex items-center gap-1 px-1 mb-3">
                    <div className="w-3.5 h-3.5 rounded bg-gradient-to-tr from-[#792CA2] to-[#DCCBFF] flex items-center justify-center text-[7px] font-black text-white">
                      CO
                    </div>
                    <span className="text-[8px] font-extrabold text-gray-200 tracking-wider">
                      CloudOptics
                    </span>
                  </div>

                  {/* Navigation title */}
                  <div className="text-[5.5px] font-bold text-gray-500 uppercase tracking-widest px-1 mb-1.5">
                    Navigation
                  </div>

                  {/* Sidebar Navigation Items */}
                  <div className="space-y-1">
                    {/* Dashboard */}
                    <button
                      onClick={() => setActiveTab("dashboard")}
                      className={`h-5 rounded-lg w-full flex items-center px-2 gap-1.5 shadow-sm transition-colors text-left focus:outline-none cursor-pointer ${
                        activeTab === "dashboard"
                          ? "bg-[#792CA2] text-white"
                          : "bg-transparent hover:bg-white/5 text-gray-400"
                      }`}
                    >
                      <svg
                        className={`w-2 h-2 flex-shrink-0 ${activeTab === "dashboard" ? "text-white" : "text-gray-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                      >
                        <rect x="3" y="3" width="7" height="7" rx="1.5" />
                        <rect x="14" y="3" width="7" height="7" rx="1.5" />
                        <rect x="3" y="14" width="7" height="7" rx="1.5" />
                        <rect x="14" y="14" width="7" height="7" rx="1.5" />
                      </svg>
                      <span className="text-[7px] font-extrabold">
                        Dashboard
                      </span>
                    </button>

                    {/* Resources */}
                    <button
                      onClick={() => setActiveTab("resources")}
                      className={`h-5 rounded-lg w-full flex items-center px-2 gap-1.5 transition-colors text-left focus:outline-none cursor-pointer ${
                        activeTab === "resources"
                          ? "bg-[#792CA2] text-white"
                          : "bg-transparent hover:bg-white/5 text-gray-400"
                      }`}
                    >
                      <svg
                        className={`w-2 h-2 flex-shrink-0 ${activeTab === "resources" ? "text-white" : "text-gray-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                      >
                        <rect x="5" y="5" width="14" height="14" rx="2" />
                        <path
                          d="M9 5V3M15 5V3M9 21v-2M15 21v-2M5 9H3M5 15H3M21 9h-2M21 15h-2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <span className="text-[7px] font-semibold">
                        Resources
                      </span>
                    </button>

                    {/* Recommendations */}
                    <button
                      onClick={() => setActiveTab("recommendations")}
                      className={`h-5 rounded-lg w-full flex items-center px-2 gap-1.5 transition-colors text-left focus:outline-none cursor-pointer ${
                        activeTab === "recommendations"
                          ? "bg-[#792CA2] text-white"
                          : "bg-transparent hover:bg-white/5 text-gray-400"
                      }`}
                    >
                      <svg
                        className={`w-2 h-2 flex-shrink-0 ${activeTab === "recommendations" ? "text-white" : "text-gray-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 18a3.75 3.75 0 0 0 .495-7.467 5.99 5.99 0 0 0-1.925 3.546 5.974 5.974 0 0 1-2.133-1A3.75 3.75 0 0 0 12 18Z"
                        />
                      </svg>
                      <span className="text-[7px] font-semibold">
                        Recommendations
                      </span>
                    </button>

                    {/* Alerts */}
                    <button
                      onClick={() => setActiveTab("alerts")}
                      className={`h-5 rounded-lg w-full flex items-center px-2 gap-1.5 transition-colors text-left focus:outline-none cursor-pointer ${
                        activeTab === "alerts"
                          ? "bg-[#792CA2] text-white"
                          : "bg-transparent hover:bg-white/5 text-gray-400"
                      }`}
                    >
                      <svg
                        className={`w-2 h-2 flex-shrink-0 ${activeTab === "alerts" ? "text-white" : "text-gray-400"}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth="3"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                        />
                      </svg>
                      <span className="text-[7px] font-semibold">Alerts</span>
                    </button>
                  </div>
                </div>

                {/* Bottom items */}
                <div className="space-y-1">
                  {/* Settings */}
                  <div className="h-5 bg-transparent hover:bg-white/5 rounded-lg w-full flex items-center px-2 gap-1.5 transition-colors">
                    <svg
                      className="w-2 h-2 text-gray-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                    >
                      <circle cx="12" cy="12" r="3" />
                      <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-[7px] font-semibold text-gray-400">
                      Settings
                    </span>
                  </div>

                  {/* Sign Out */}
                  <div className="h-5 bg-transparent hover:bg-red-950/15 rounded-lg w-full flex items-center px-2 gap-1.5 transition-colors">
                    <svg
                      className="w-2 h-2 text-red-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75"
                      />
                    </svg>
                    <span className="text-[7px] font-bold text-red-400">
                      Sign Out
                    </span>
                  </div>
                </div>
              </div>

              {/* Main Contents */}
              <div className="col-span-12 sm:col-span-9 flex flex-col gap-3 relative">
                {/* Mini Welcome Banner */}
                <div className="rounded-2xl p-3 bg-gradient-to-r from-[#792CA2] via-[#9A4DCC] to-[#1F215D] text-white shadow-md relative overflow-hidden flex justify-between items-center">
                  {/* Custom Dot Pattern Background */}
                  <div className="absolute inset-0 opacity-15 pointer-events-none">
                    <svg
                      className="w-full h-full"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <defs>
                        <pattern
                          id="mini-banner-dots"
                          width="12"
                          height="12"
                          patternUnits="userSpaceOnUse"
                        >
                          <circle cx="1" cy="1" r="0.75" fill="#fff" />
                        </pattern>
                      </defs>
                      <rect
                        width="100%"
                        height="100%"
                        fill="url(#mini-banner-dots)"
                      />
                    </svg>
                  </div>

                  {/* Rotating Orbital graphics */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 pointer-events-none opacity-40">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 16,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-center"
                    >
                      <motion.div
                        animate={{ rotate: -360 }}
                        transition={{
                          duration: 8,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-6.5 h-6.5 rounded-full border border-dotted border-white/40 flex items-center justify-center"
                      >
                        <div className="w-2.5 h-2.5 rounded-full bg-gradient-to-tr from-[#DCCBFF] to-white/60 blur-[0.5px]" />
                      </motion.div>
                    </motion.div>
                  </div>

                  <div className="relative z-10">
                    <h3 className="text-[11px] font-bold tracking-tight">
                      Welcome, Admin User
                    </h3>
                    <p className="text-[8px] opacity-90 mt-0.5 max-w-[80%] leading-relaxed font-medium">
                      Monitor cloud spending, identify optimization
                      opportunities, and reduce unnecessary costs.
                    </p>
                  </div>
                </div>

                {/* 4 KPI Cards */}
                <div className="grid grid-cols-4 gap-2">
                  {/* Total Spend */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/40 p-2 rounded-xl shadow-sm border-t-2 border-t-[#982598] transition-colors duration-500">
                    <span className="text-[6.5px] text-gray-400 dark:text-slate-400 uppercase font-bold tracking-wider block truncate">
                      Total Spend
                    </span>
                    <p className="text-[10px] font-black text-[#111844] dark:text-white mt-0.5 font-mono">
                      $14,892.45
                    </p>
                    <div className="w-full h-0.5 bg-gray-100 dark:bg-slate-950 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "75%" }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-rose-500"
                      />
                    </div>
                  </div>

                  {/* Compute Spend */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/40 p-2 rounded-xl shadow-sm border-t-2 border-t-[#9A4DCC] transition-colors duration-500">
                    <span className="text-[6.5px] text-gray-400 dark:text-slate-400 uppercase font-bold tracking-wider block truncate">
                      Compute
                    </span>
                    <p className="text-[10px] font-black text-[#111844] dark:text-white mt-0.5 font-mono">
                      $8,430.12
                    </p>
                    <div className="w-full h-0.5 bg-gray-100 dark:bg-slate-950 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "60%" }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-[#9A4DCC]"
                      />
                    </div>
                  </div>

                  {/* Storage Spend */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/40 p-2 rounded-xl shadow-sm border-t-2 border-t-[#792CA2] transition-colors duration-500">
                    <span className="text-[6.5px] text-gray-400 dark:text-slate-400 uppercase font-bold tracking-wider block truncate">
                      Storage
                    </span>
                    <p className="text-[10px] font-black text-[#111844] dark:text-white mt-0.5 font-mono">
                      $4,120.30
                    </p>
                    <div className="w-full h-0.5 bg-gray-100 dark:bg-slate-950 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "45%" }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-[#792CA2]"
                      />
                    </div>
                  </div>

                  {/* Total Savings */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/40 p-2 rounded-xl shadow-sm border-t-2 border-t-[#1F215D] transition-colors duration-500">
                    <span className="text-[6.5px] text-gray-400 dark:text-slate-400 uppercase font-bold tracking-wider block truncate">
                      Savings
                    </span>
                    <p className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 mt-0.5 font-mono">
                      $2,342.03
                    </p>
                    <div className="w-full h-0.5 bg-gray-100 dark:bg-slate-950 rounded-full mt-1.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: "88%" }}
                        transition={{ duration: 1.5 }}
                        className="h-full bg-emerald-500"
                      />
                    </div>
                  </div>
                </div>

                {/* 2 Charts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-grow">
                  {/* Cost Trends Chart */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/40 p-3 rounded-2xl shadow-sm flex flex-col justify-between transition-colors duration-500">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-[#111844] dark:text-white">
                        Cost Trend (7 Days)
                      </span>
                      <div className="flex gap-1">
                        <div className="w-5 h-1.5 bg-gray-100 dark:bg-slate-950 rounded" />
                        <div className="w-7 h-1.5 bg-[#792CA2]/15 dark:bg-[#B770FF]/20 rounded" />
                      </div>
                    </div>

                    {/* Graph bars container with Y-Axis and Grid Lines */}
                    <div className="flex-grow flex gap-1.5 mt-3 relative">
                      {/* Y-Axis Labels */}
                      <div className="flex flex-col justify-between text-[6px] text-gray-400 dark:text-slate-500 font-bold h-full pb-3.5 pr-0.5 font-mono select-none">
                        <span>$15k</span>
                        <span>$10k</span>
                        <span>$5k</span>
                        <span>$0</span>
                      </div>

                      {/* Grid Lines & Bars Area */}
                      <div className="flex-grow relative h-full flex items-end justify-between px-0.5">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 pb-3 flex flex-col justify-between pointer-events-none select-none">
                          <div className="w-full border-t border-gray-100 dark:border-slate-800/30" />
                          <div className="w-full border-t border-gray-100 dark:border-slate-800/30" />
                          <div className="w-full border-t border-gray-100 dark:border-slate-800/30" />
                          <div className="w-full border-t border-gray-100 dark:border-slate-800/30" />
                        </div>

                        {/* Graph bars */}
                        {[65, 45, 80, 55, 95, 70, 85].map((val, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col items-center gap-1 flex-1 mx-0.5 h-full justify-end relative z-10"
                          >
                            <div className="w-full bg-gray-100/50 dark:bg-slate-950/20 rounded-t flex-grow flex items-end justify-center overflow-hidden">
                              <motion.div
                                initial={{ height: 0 }}
                                whileInView={{ height: `${val}%` }}
                                transition={{ duration: 1, delay: idx * 0.05 }}
                                className="w-full bg-gradient-to-t from-[#792CA2] to-[#B770FF] dark:from-[#5E1A86] dark:to-[#9A4DCC] rounded-t"
                              />
                            </div>
                            <span className="text-[6px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mt-0.5">
                              D{idx + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Cost Distribution Chart */}
                  <div className="bg-white/80 dark:bg-slate-900/80 border border-white/60 dark:border-slate-800/40 p-3 rounded-2xl shadow-sm flex flex-col justify-between transition-colors duration-500">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-[9px] font-bold text-[#111844] dark:text-white">
                        Distribution
                      </span>
                      <div className="w-11 h-3 bg-gray-100 dark:bg-slate-950 rounded text-[6px] font-bold text-gray-400 flex items-center justify-center">
                        All Clusters
                      </div>
                    </div>

                    <div className="flex-grow flex items-center justify-around mt-3">
                      {/* Mini Donut Circle */}
                      <div className="relative w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-full h-full transform -rotate-90"
                          viewBox="0 0 100 100"
                        >
                          {/* Inner / outer dotted lines */}
                          <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="transparent"
                            stroke="rgba(121, 44, 162, 0.12)"
                            strokeWidth="0.5"
                            strokeDasharray="2 2"
                          />
                          <circle
                            cx="50"
                            cy="50"
                            r="31"
                            fill="transparent"
                            stroke="rgba(121, 44, 162, 0.12)"
                            strokeWidth="0.5"
                            strokeDasharray="2 2"
                          />

                          {/* Segments */}
                          {/* Compute: 45% (Color: #792CA2) */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#792CA2"
                            strokeWidth="8"
                            strokeDasharray={`${0.45 * 238.7} 238.7`}
                            strokeDashoffset="0"
                          />
                          {/* Storage: 25% (Color: #9A4DCC) -> starts at 45% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#9A4DCC"
                            strokeWidth="8"
                            strokeDasharray={`${0.25 * 238.7} 238.7`}
                            strokeDashoffset={`-${0.45 * 238.7}`}
                          />
                          {/* Database: 15% (Color: #1F215D) -> starts at 70% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#1F215D"
                            strokeWidth="8"
                            strokeDasharray={`${0.15 * 238.7} 238.7`}
                            strokeDashoffset={`-${0.7 * 238.7}`}
                          />
                          {/* Networking: 10% (Color: #111844) -> starts at 85% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#111844"
                            strokeWidth="8"
                            strokeDasharray={`${0.1 * 238.7} 238.7`}
                            strokeDashoffset={`-${0.85 * 238.7}`}
                          />
                          {/* Other: 5% (Color: #DCCBFF) -> starts at 95% */}
                          <circle
                            cx="50"
                            cy="50"
                            r="38"
                            fill="transparent"
                            stroke="#DCCBFF"
                            strokeWidth="8"
                            strokeDasharray={`${0.05 * 238.7} 238.7`}
                            strokeDashoffset={`-${0.95 * 238.7}`}
                          />
                        </svg>
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-[6.5px] text-gray-400 font-bold uppercase tracking-wider leading-none">
                            Total
                          </span>
                          <span className="text-[9.5px] font-black text-[#111844] dark:text-white mt-0.5 leading-none">
                            $14.8k
                          </span>
                        </div>
                      </div>

                      {/* Mini Legend */}
                      <div className="flex flex-col gap-1 text-[7.5px] font-bold text-gray-500 dark:text-slate-400 leading-tight pr-1">
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#792CA2] flex-shrink-0" />
                          <span className="truncate max-w-[48px]">
                            EC2 (45%)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#9A4DCC] flex-shrink-0" />
                          <span className="truncate max-w-[48px]">
                            S3 (25%)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#1F215D] flex-shrink-0" />
                          <span className="truncate max-w-[48px]">
                            RDS (15%)
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#111844] flex-shrink-0" />
                          <span className="truncate max-w-[48px]">
                            Net (10%)
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blurred Overlay when Resources, Recommendations, or Alerts are active */}
                  <AnimatePresence>
                    {activeTab !== "dashboard" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="absolute inset-0 bg-[#F9F7F7]/65 dark:bg-[#080A1A]/75 backdrop-blur-[6px] z-30 flex flex-col items-center justify-center p-6 text-center rounded-2xl border border-gray-200/40 dark:border-slate-800/40"
                      >
                        <motion.div
                          initial={{ scale: 0.9, y: 10 }}
                          animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 0.9, y: 10 }}
                          className="max-w-[280px] flex flex-col items-center"
                        >
                          {/* Interactive Lock Icon */}
                          <div className="w-9 h-9 rounded-full bg-[#792CA2]/10 dark:bg-[#792CA2]/20 border border-[#792CA2]/30 flex items-center justify-center mb-2.5 text-[#792CA2] dark:text-[#B770FF]">
                            <svg
                              className="w-4 h-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              strokeWidth="2.5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
                              />
                            </svg>
                          </div>

                          <h4 className="text-[11px] font-extrabold text-[#111844] dark:text-white capitalize tracking-tight">
                            Sign in to view {activeTab}
                          </h4>

                          <p className="text-[8px] text-gray-500 dark:text-slate-400 mt-1 mb-3.5 leading-relaxed font-medium max-w-[200px]">
                            Access detailed cloud metrics, automated saving
                            insights, and anomaly alerts by logging into your
                            secure vault.
                          </p>

                          <Link href="/auth/signin" passHref legacyBehavior>
                            <a className="px-3.5 py-1.5 rounded-lg bg-[#792CA2] hover:bg-[#9A4DCC] text-[8.5px] text-white font-extrabold tracking-wide transition-all shadow-md hover:shadow-lg active:scale-95 duration-150 cursor-pointer">
                              Sign In
                            </a>
                          </Link>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Glowing background inside card */}
            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-64 h-64 rounded-full bg-[#792CA2]/5 dark:bg-[#792CA2]/10 blur-[100px] pointer-events-none" />
          </div>

            {/* Content (Unlock Full Insights side) */}
            <div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111844] dark:text-white mb-6 transition-colors duration-500">
                Unlock Full Insights
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed transition-colors duration-500">
                Access comprehensive analytics and cloud cost optimization
                recommendations. CloudOptics continuously checks your
                environments to build custom savings profiles.
              </p>

              <ul className="space-y-4 text-base text-[#111844] dark:text-gray-200 font-medium transition-colors duration-500">
                <li className="flex items-center gap-2">
                  <span className="text-[#792CA2] dark:text-[#B770FF] text-xl font-bold">
                    &bull;
                  </span>
                  Live cloud spending visibility across all services
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#792CA2] dark:text-[#B770FF] text-xl font-bold">
                    &bull;
                  </span>
                  Advanced cost breakdowns and analytics dashboards
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#792CA2] dark:text-[#B770FF] text-xl font-bold">
                    &bull;
                  </span>
                  Historical trend tracking and forecasting insights
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#792CA2] dark:text-[#B770FF] text-xl font-bold">
                    &bull;
                  </span>
                  Automated detection of idle and oversized resources
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#792CA2] dark:text-[#B770FF] text-xl font-bold">
                    &bull;
                  </span>
                  Intelligent cost-saving recommendations
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-[#792CA2] dark:text-[#B770FF] text-xl font-bold">
                    &bull;
                  </span>
                  Real-time alerts for risks and anomalies
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      {/* Floating design elements */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#792CA2]/5 blur-[120px] pointer-events-none z-0" />
    </section>
  );
}
