"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, BellAlertIcon, CheckCircleIcon, ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ActiveAlerts() {
  const [activeTab, setActiveTab] = useState("Unresolved");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Critical");
  
  const tabs = ["Resolved", "In progress", "Unresolved"];
  const sortOptions = ["Critical", "High", "Medium", "Low"];

  // Mock data for the visual list
  const mockAlerts = [
    { id: 1, text: "High CPU utilization on instances", type: "High" },
    { id: 2, text: "Database connection spike", type: "Critical" },
    { id: 3, text: "S3 Bucket unusually accessed", type: "Medium" },
    { id: 4, text: "Route53 latency detected", type: "Low" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative mb-10 mt-6"
    >

      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white flex flex-col md:flex-row gap-6 relative z-0">
        
        {/* Sort Dropdown - positioned top right internally */}
        <div className="absolute top-4 right-6 z-20 flex items-center gap-2">
          <span className="text-xs font-bold text-gray-500 uppercase">Sort by:</span>
          <div className="relative">
            <button 
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 hover:bg-gray-50"
            >
              {sortOption}
              <ChevronDownIcon className="w-3 h-3" />
            </button>
            {isSortOpen && (
              <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden">
                {sortOptions.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setSortOption(opt); setIsSortOpen(false); }}
                    className={`block w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#792CA2]/10 hover:text-[#792CA2] ${sortOption === opt ? "bg-[#792CA2]/5 text-[#792CA2]" : "text-gray-600"}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Left Side: Show the alerts */}
        <div className="flex-1 bg-gradient-to-br from-[#F9F7F7] to-white rounded-2xl p-8 border border-gray-100 flex flex-col items-center justify-center min-h-[280px] relative overflow-hidden mt-8 md:mt-0">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#9A4DCC]/10 rounded-full blur-3xl pointer-events-none" />
          
          <motion.div 
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 relative"
          >
            <ExclamationTriangleIcon className="w-10 h-10 text-[#792CA2]" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full animate-ping" />
            <span className="absolute top-0 right-0 w-4 h-4 bg-red-500 border-2 border-white rounded-full" />
          </motion.div>
          
          <h3 className="text-xl font-black text-[#111844]">Show the Alerts</h3>
          <p className="text-sm text-gray-500 font-medium text-center max-w-[80%] mt-2">
            Select an alert on the right to view its full details and mitigation steps here.
          </p>
        </div>

        {/* Right Side: List and Filters */}
        <div className="flex-1 flex flex-col pt-8 md:pt-0">
          <div className="flex gap-2 mb-4 bg-gray-100/50 p-1 rounded-xl w-fit">
            {tabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative px-4 py-1.5 text-xs font-bold rounded-lg transition-all z-10 ${
                  activeTab === tab ? "text-[#111844]" : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {activeTab === tab && (
                  <motion.div
                    layoutId="alertTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-sm"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  />
                )}
                <span className="relative z-10">{tab}</span>
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 flex-grow">
            <AnimatePresence mode="popLayout">
              {mockAlerts.map((alert, i) => (
                <motion.div
                  key={alert.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-gray-100 p-3 rounded-xl shadow-sm hover:shadow-md hover:border-[#792CA2]/30 transition-all cursor-pointer flex items-center justify-between group"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      alert.type === 'Critical' ? 'bg-red-500' :
                      alert.type === 'High' ? 'bg-orange-500' :
                      alert.type === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                    }`} />
                    <span className="text-sm font-semibold text-gray-700 group-hover:text-[#792CA2] transition-colors">{alert.text}</span>
                  </div>
                  <ChevronDownIcon className="w-4 h-4 text-gray-300 -rotate-90 group-hover:translate-x-1 transition-transform" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
        
      </div>
    </motion.div>
  );
}
