"use client";
import React from "react";
import { motion } from "framer-motion";
import { SparklesIcon, ArrowPathIcon, ExclamationTriangleIcon, BoltIcon, DocumentTextIcon } from "@heroicons/react/24/outline";

export default function AiSummary({ 
  aiSummary = null, 
  isLoading = false, 
  isRegenerating = false, 
  onRegenerate = () => {},
  totalActions = 0,
  totalSavings = 0
}) {
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
        <h2 className="text-xl font-extrabold text-[#111844] dark:text-[#F9F7F7] tracking-tight">AI-Recommended Summary</h2>
      </div>
      
      <div className="relative mt-2 flex-grow flex flex-col">
        {/* Glowing backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#792CA2]/5 to-[#9A4DCC]/10 rounded-3xl blur-xl" />

        {/* Main Box */}
        <div className="bg-white/60 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-4 sm:p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-white/5 flex-grow flex flex-col gap-4 sm:gap-5 relative z-0">
          <div className="flex justify-between items-center w-full border-b border-gray-100 dark:border-slate-800 pb-4">
            <div className="bg-gray-100/80 dark:bg-slate-800 rounded-lg px-4 py-1.5 shadow-inner border border-gray-200/60 dark:border-slate-700 font-bold text-[#111844] dark:text-[#F9F7F7] text-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              AI Insights
            </div>
            <button 
              onClick={onRegenerate}
              disabled={isRegenerating || isLoading}
              className="bg-[#ffffff] dark:bg-slate-800 text-[#792CA2] dark:text-[#C084FC] font-bold px-4 py-1.5 rounded-lg shadow-sm border border-[#792CA2]/20 dark:border-slate-700 hover:bg-[#792CA2]/5 dark:hover:bg-[#C084FC]/10 hover:border-[#792CA2]/40 dark:hover:border-[#C084FC]/40 transition-all text-xs flex items-center gap-1.5 group disabled:opacity-50"
            >
              <ArrowPathIcon className={`w-4 h-4 ${(isRegenerating || isLoading) ? "animate-spin" : "group-hover:rotate-180 transition-transform duration-500"}`} />
              Regenerate
            </button>
          </div>

          {/* Highlights Banner */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Actions Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-purple-500/10 to-indigo-500/5 dark:from-purple-950/20 dark:to-indigo-950/10 p-3 rounded-2xl border border-[#792CA2]/15 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#792CA2] to-[#9A4DCC] flex items-center justify-center text-white shadow-md shadow-[#792CA2]/20 flex-shrink-0">
                <SparklesIcon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Actions</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-[#111844] dark:text-[#F9F7F7] tracking-tight">
                    {isLoading || isRegenerating ? (
                      <span className="w-6 h-5 block bg-gray-200/50 animate-pulse rounded" />
                    ) : (
                      totalActions || 0
                    )}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500">actions found</span>
                </div>
              </div>
            </div>

            {/* Savings Card */}
            <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500/10 to-teal-500/5 dark:from-emerald-950/20 dark:to-teal-950/10 p-3 rounded-2xl border border-emerald-500/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 flex-shrink-0">
                <span className="text-base font-black font-mono text-white">$</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Potential Savings</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-emerald-600 dark:text-emerald-450 tracking-tight">
                    {isLoading || isRegenerating ? (
                      <span className="w-12 h-5 block bg-gray-200/50 animate-pulse rounded" />
                    ) : (
                      `$${Math.round(totalSavings || 0).toLocaleString()}`
                    )}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-500">/ mo</span>
                </div>
              </div>
            </div>
          </div>

          
          <div className="bg-white/80 dark:bg-[#0F122B]/40 backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-sm border border-white dark:border-white/5 flex-grow min-h-[120px] relative overflow-hidden flex flex-col justify-center">
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
                  <div className="flex gap-3 items-start bg-purple-50/30 dark:bg-purple-950/15 border border-purple-100/50 dark:border-purple-900/30 p-4 rounded-xl">
                    <DocumentTextIcon className="w-5 h-5 text-[#792CA2] mt-0.5 flex-shrink-0" />
                    <p className="text-gray-650 dark:text-slate-200 font-medium text-xs md:text-sm leading-relaxed">
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
                        <h4 className="text-[11px] font-bold text-amber-600 dark:text-amber-500 uppercase tracking-wider flex items-center gap-1">
                          <ExclamationTriangleIcon className="w-4 h-4" />
                          Key Findings
                        </h4>
                        <ul className="space-y-1.5">
                          {keyFindings.map((finding, idx) => (
                            <li key={idx} className="text-gray-500 dark:text-slate-350 text-xs font-medium leading-tight flex items-start gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 flex-shrink-0" />
                              <span>{finding}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {nextSteps.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-[11px] font-bold text-[#792CA2] dark:text-[#C084FC] uppercase tracking-wider flex items-center gap-1">
                          <BoltIcon className="w-4 h-4" />
                          Recommended Actions
                        </h4>
                        <ul className="space-y-1.5">
                          {nextSteps.map((step, idx) => (
                            <li key={idx} className="text-gray-500 dark:text-slate-350 text-xs font-medium leading-tight flex items-start gap-1.5">
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
