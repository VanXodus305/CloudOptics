"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function RecommendationsList({ recommendations = [], activeCategory, isLoading = false }) {
  const impactPriority = { High: 3, Medium: 2, Low: 1 };

  const filteredRecs = recommendations
    .filter((rec) => {
      if (activeCategory === "all") return true;
      return rec.category === activeCategory;
    })
    .sort((a, b) => {
      const priorityA = impactPriority[a.impact] || 0;
      const priorityB = impactPriority[b.impact] || 0;
      if (priorityB !== priorityA) {
        return priorityB - priorityA;
      }
      return (b.potentialSavings || 0) - (a.potentialSavings || 0);
    });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory + "-" + isLoading}
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/40 backdrop-blur-3xl border-t border-white/60 p-6 md:p-8 flex-grow rounded-b-3xl shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]"
      >
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#792CA2]/10 via-[#111844]/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
        
        {isLoading ? (
          <div className="relative z-10 w-full max-w-4xl mx-auto bg-white/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 shadow-lg flex flex-col gap-4 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-gray-150/50 rounded-2xl flex items-center px-4 border border-gray-100">
                <div className="w-10 h-10 bg-gray-200 rounded-xl mr-4 flex-shrink-0"></div>
                <div className="space-y-2 flex-grow">
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-2 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-16 ml-auto flex-shrink-0"></div>
              </div>
            ))}
          </div>
        ) : filteredRecs.length === 0 ? (
          <div className="relative z-10 flex flex-col items-center justify-center flex-grow max-w-md text-center mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-xl flex items-center justify-center mb-6 border border-white/80 relative">
              <DocumentMagnifyingGlassIcon className="w-12 h-12 text-[#792CA2]" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-[#F9F7F7]">
                <CheckCircleIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-[#111844] mb-3">
              System Optimized
            </h3>
            <p className="text-gray-500 font-medium text-sm leading-relaxed mb-4">
              Displaying optimized insights for the <span className="font-bold text-[#792CA2] capitalize">{activeCategory === "all" ? "All Insights" : activeCategory}</span> category. All immediate actions have been cleared.
            </p>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-4">
            {filteredRecs.map((rec) => {
              return (
                <div
                  key={rec.id}
                  className={`bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl p-5 md:p-6 shadow-md border-l-4 hover:shadow-xl hover:-translate-y-0.5 transition-all flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${
                    rec.impact === "High"
                      ? "border-l-red-500"
                      : rec.impact === "Medium"
                      ? "border-l-amber-500"
                      : "border-l-blue-500"
                  }`}
                >
                  <div className="flex gap-4 items-start flex-grow w-full md:w-auto">
                    {/* Icon or Service Badge */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-50 border border-purple-100 flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[10px] md:text-xs font-black text-[#792CA2] uppercase">{rec.service}</span>
                    </div>

                    <div className="space-y-1 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          rec.impact === "High"
                            ? "bg-red-50 text-red-600 border border-red-100"
                            : rec.impact === "Medium"
                            ? "bg-amber-50 text-amber-600 border border-amber-100"
                            : "bg-blue-50 text-blue-600 border border-blue-100"
                        }`}>
                          {rec.impact} Impact
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-gray-50 border border-gray-150 text-gray-500 font-mono">
                          ID: {rec.resourceId}
                        </span>
                      </div>

                      <h4 className="text-sm md:text-base font-extrabold text-[#111844] tracking-tight mt-1">{rec.title}</h4>
                      <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed max-w-2xl mt-0.5">{rec.description}</p>
                      
                      {rec.actionableSteps && (
                        <div className="mt-3 bg-gray-50/70 border border-gray-100 rounded-xl p-3 text-[11px] md:text-xs text-gray-600 space-y-1 font-mono">
                          <p className="font-bold text-gray-400 uppercase tracking-wider text-[9px] mb-1.5 font-sans">Actionable Steps:</p>
                          {rec.actionableSteps.split("\n").map((step, idx) => (
                            <p key={idx} className="leading-tight">{step}</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100/80 flex-shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-wider">Est. Savings</span>
                      <span className="text-lg md:text-xl font-black text-emerald-600">-${Math.round(rec.potentialSavings)}/mo</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
