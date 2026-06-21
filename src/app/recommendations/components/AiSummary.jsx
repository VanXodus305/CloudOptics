"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { SparklesIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function AiSummary() {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = () => {
    setIsRegenerating(true);
    setTimeout(() => setIsRegenerating(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      className="flex flex-col h-full"
    >
      <div className="flex items-center gap-2 mb-3 px-2">
        <div className="bg-[#792CA2]/10 p-1.5 rounded-lg border border-[#792CA2]/20">
          <SparklesIcon className="w-5 h-5 text-[#792CA2]" />
        </div>
        <h2 className="text-xl font-extrabold text-[#111844] tracking-tight">AI-Recommended Summary</h2>
      </div>
      
      {/* Container with "Section 21" tab sticking out */}
      <div className="relative mt-2 flex-grow flex flex-col">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#792CA2]/5 to-[#9A4DCC]/10 rounded-3xl blur-xl" />
        

        {/* Main Box */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl rounded-tr-none p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex-grow flex flex-col gap-5 relative z-0">
          <div className="flex justify-between items-center w-full border-b border-gray-100 pb-4">
            <div className="bg-gray-100/80 rounded-lg px-4 py-1.5 shadow-inner border border-gray-200/60 font-bold text-[#111844] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Insights
            </div>
            <button 
              onClick={handleRegenerate}
              className="bg-white text-[#792CA2] font-bold px-4 py-1.5 rounded-lg shadow-sm border border-[#792CA2]/20 hover:bg-[#792CA2]/5 hover:border-[#792CA2]/40 transition-all text-xs flex items-center gap-1.5 group"
            >
              <ArrowPathIcon className={`w-4 h-4 ${isRegenerating ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              Regenerate
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-6 shadow-sm border border-white flex-grow min-h-[120px] relative overflow-hidden">
            {/* Inner glowing element */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            
            {isRegenerating ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3">
                <div className="flex gap-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.2 }}
                      className="w-2 h-2 rounded-full bg-[#792CA2]"
                    />
                  ))}
                </div>
                <p className="text-xs font-semibold text-[#792CA2]">Analyzing resources...</p>
              </div>
            ) : (
              <p className="text-gray-600 font-medium text-sm leading-relaxed relative z-10">
                Based on recent usage patterns, there is an opportunity to optimize <span className="font-bold text-[#111844]">EC2 instance allocation</span> in the US-East region. Downgrading 4 instances from <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">t3.xlarge</code> to <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">t3.large</code> will maintain performance requirements while reducing costs. Additionally, consider archiving stale S3 buckets highlighted in the usage report.
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
