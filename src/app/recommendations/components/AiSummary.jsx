"use client";
import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon, ArrowPathIcon, ExclamationTriangleIcon, BoltIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function AiSummary({ aiSummary = null, isLoading = false, isRegenerating = false, onRegenerate = () => {} }) {
  const isObject = aiSummary && typeof aiSummary === "object";
  const overview = isObject ? aiSummary.overview : (typeof aiSummary === "string" ? aiSummary : "");
  const keyFindings = isObject ? aiSummary.keyFindings : [];
  const nextSteps = isObject ? aiSummary.nextSteps : [];

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
      
      <div className="relative mt-2 flex-grow flex flex-col">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#792CA2]/5 to-[#9A4DCC]/10 rounded-3xl blur-xl" />

        {/* Main Box */}
        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex-grow flex flex-col gap-5 relative z-0">
          <div className="flex justify-between items-center w-full border-b border-gray-100 pb-4">
            <div className="bg-gray-100/80 rounded-lg px-4 py-1.5 shadow-inner border border-gray-200/60 font-bold text-[#111844] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Insights
            </div>
            <button 
              onClick={onRegenerate}
              disabled={isRegenerating || isLoading}
              className="bg-white text-[#792CA2] font-bold px-4 py-1.5 rounded-lg shadow-sm border border-[#792CA2]/20 hover:bg-[#792CA2]/5 hover:border-[#792CA2]/40 transition-all text-xs flex items-center gap-1.5 group disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${(isRegenerating || isLoading) ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              Regenerate
            </button>
          </div>
          
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm border border-white flex-grow min-h-[120px] relative overflow-hidden flex flex-col justify-center">
            {/* Inner glowing element */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
            
            {isRegenerating || isLoading ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-3 py-6">
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
              <div className="space-y-5 relative z-10 w-full">
                {overview ? (
                  <div className="flex gap-3 items-start bg-purple-50/30 border border-purple-100/50 p-4 rounded-xl">
                    <DocumentTextIcon className="w-5 h-5 text-[#792CA2] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-600 font-medium text-xs md:text-sm leading-relaxed">
                      {overview}
                    </p>
                  </div>
                ) : (
                  <p className="text-gray-400 font-medium text-sm leading-relaxed text-center py-4">
                    No AI insights generated yet. Click Regenerate to compile cost optimizations.
                  </p>
                )}

                {isObject && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                    {keyFindings.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-amber-600 uppercase tracking-wider flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Key Findings
                        </h4>
                        <ul className="space-y-1.5">
                          {keyFindings.map((finding, idx) => (
                            <li key={idx} className="text-gray-500 text-xs font-medium leading-tight flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {nextSteps.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-[#792CA2] uppercase tracking-wider flex items-center gap-1">
                          <BoltIcon className="w-4 h-4" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-1.5">
                          {nextSteps.map((step, idx) => (
                            <li key={idx} className="text-gray-500 text-xs font-medium leading-tight flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#792CA2] mt-1.5 flex-shrink-0" />
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
