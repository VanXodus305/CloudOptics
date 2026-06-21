"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { WrenchScrewdriverIcon, ArrowDownTrayIcon } from "@heroicons/react/24/outline";

export default function EditAccess() {
  const [toggles, setToggles] = useState({
    billing: true,
    resources: false,
    alerts: true,
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.3 }}
      className="relative mt-8 h-full flex flex-col"
    >

      <div className="bg-white/60 backdrop-blur-xl rounded-3xl rounded-tl-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col relative z-0 flex-grow">
        <div className="flex justify-between items-center mb-6 relative z-10">
          <div className="flex items-center gap-2">
            <div className="bg-[#792CA2]/10 p-2 rounded-lg">
              <WrenchScrewdriverIcon className="w-5 h-5 text-[#792CA2]" />
            </div>
            <h2 className="text-lg font-extrabold text-[#111844]">Edit access for users</h2>
          </div>
          <button className="bg-white px-4 py-1.5 rounded-lg text-xs font-bold text-gray-700 shadow-sm border border-gray-200 hover:bg-gray-50 flex items-center gap-1.5 transition-colors">
            <ArrowDownTrayIcon className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>

        <div className="bg-white/80 rounded-2xl p-6 border border-white shadow-inner flex-grow flex flex-col gap-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gray-200/50 rounded-full blur-3xl pointer-events-none" />
          
          <p className="text-sm text-gray-500 font-medium mb-2 relative z-10">Configure default permissions for new User roles.</p>

          {[
            { id: "billing", label: "View Billing & Cost Data" },
            { id: "resources", label: "Modify Cloud Resources (EC2, S3)" },
            { id: "alerts", label: "Acknowledge & Resolve Alerts" },
          ].map(item => (
            <div key={item.id} className="flex justify-between items-center p-3 rounded-xl hover:bg-gray-50/50 transition-colors relative z-10 border border-transparent hover:border-gray-100">
              <span className="text-sm font-bold text-[#111844]">{item.label}</span>
              <button 
                onClick={() => setToggles(prev => ({ ...prev, [item.id]: !prev[item.id] }))}
                className={`w-12 h-6 rounded-full p-1 transition-colors relative ${toggles[item.id] ? "bg-green-500" : "bg-gray-300"}`}
              >
                <motion.div 
                  className="w-4 h-4 bg-white rounded-full shadow-sm"
                  animate={{ x: toggles[item.id] ? 24 : 0 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
