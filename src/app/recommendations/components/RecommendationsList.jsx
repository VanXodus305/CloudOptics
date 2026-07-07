"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, DocumentMagnifyingGlassIcon, DocumentDuplicateIcon, CheckIcon, ChevronDownIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function RecommendationsList({ recommendations = [], activeCategory, isLoading = false }) {
  const impactPriority = { High: 3, Medium: 2, Low: 1 };
  const [copiedId, setCopiedId] = useState(null);
  const [expandedSteps, setExpandedSteps] = useState({});
  const [searchQuery, setSearchQuery] = useState("");

  const toggleSteps = (id) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCopy = (idText, recId) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(recId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const categoryRecs = recommendations.filter((rec) => {
    if (activeCategory === "all") return true;
    return rec.category === activeCategory;
  });

  const filteredRecs = categoryRecs
    .filter((rec) => {
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = rec.title?.toLowerCase().includes(query);
        const matchesDesc = rec.description?.toLowerCase().includes(query);
        const matchesService = rec.service?.toLowerCase().includes(query);
        const matchesId = rec.resourceId?.toLowerCase().includes(query);
        return matchesTitle || matchesDesc || matchesService || matchesId;
      }
      return true;
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/40 dark:bg-[#0F122B]/40 backdrop-blur-3xl border-t border-white/60 dark:border-white/5 p-6 md:p-8 flex-grow rounded-b-3xl shadow-2xl relative overflow-hidden flex flex-col min-h-[400px] will-change-transform"
      >
     
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#792CA2]/10 via-[#111844]/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
        
        {isLoading ? (
          <div className="relative z-10 w-full max-w-4xl mx-auto bg-white/60 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/50 dark:border-white/5 shadow-lg flex flex-col gap-4 animate-pulse">
            <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-1/4 mb-2" />
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full bg-gray-150/50 dark:bg-slate-800/40 rounded-2xl flex items-center px-4 border border-gray-100 dark:border-slate-800">
                <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-xl mr-4 flex-shrink-0"></div>
                <div className="space-y-2 flex-grow">
                  <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded w-1/3"></div>
                  <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded w-2/3"></div>
                </div>
                <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-16 ml-auto flex-shrink-0"></div>
              </div>
            ))}
          </div>
        ) : categoryRecs.length === 0 ? (
          <div className="relative z-10 flex flex-col items-center justify-center flex-grow max-w-md text-center mx-auto">
            <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-900 rounded-full shadow-xl flex items-center justify-center mb-6 border border-white/80 dark:border-slate-800 relative">
              <DocumentMagnifyingGlassIcon className="w-12 h-12 text-[#792CA2] dark:text-[#C084FC]" />
              <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-[#F9F7F7] dark:border-[#080A1A]">
                <CheckCircleIcon className="w-4 h-4 text-white" />
              </div>
            </div>
            
            <h3 className="text-2xl font-black text-[#111844] dark:text-[#F9F7F7] mb-3">
              System Optimized
            </h3>
            <p className="text-gray-500 dark:text-slate-350 font-medium text-sm leading-relaxed mb-4">
              Displaying optimized insights for the <span className="font-bold text-[#792CA2] dark:text-[#C084FC] capitalize">{activeCategory === "all" ? "All Insights" : activeCategory}</span> category. All immediate actions have been cleared.
            </p>
          </div>
        ) : (
          <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col gap-4">
      
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2 px-1">
              <div className="relative w-full md:w-96 shadow-sm rounded-xl">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  placeholder="Search recommendations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-9 pr-10 py-2 border border-gray-200 dark:border-slate-700 rounded-xl leading-5 bg-[#ffffff] dark:bg-slate-800 placeholder-gray-400 focus:outline-none focus:bg-[#ffffff] dark:focus:bg-slate-900 text-[#111844] dark:text-[#F9F7F7] focus:ring-2 focus:ring-[#792CA2]/50 focus:border-transparent sm:text-sm transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                  >
                    <svg className="w-4 h-4 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 rounded-full p-0.5 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>

              {/* Impact Summary Indicator */}
              <div className="flex flex-wrap items-center justify-center md:justify-end gap-3">
                <span className="text-[11px] font-black text-[#111844] dark:text-[#F9F7F7] uppercase tracking-widest">Impact Summary:</span>
              <div className="flex gap-2">
                <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  High: {filteredRecs.filter(r => r.impact === 'High').length}
                </span>
                <span className="bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 border border-amber-100 dark:border-amber-900/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Medium: {filteredRecs.filter(r => r.impact === 'Medium').length}
                </span>
                <span className="bg-green-50 dark:bg-emerald-950/30 text-green-600 dark:text-emerald-450 border border-green-100 dark:border-emerald-900/30 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm">
                  Low: {filteredRecs.filter(r => r.impact === 'Low').length}
                </span>
              </div>
            </div>
            </div>

            <div className="flex flex-col gap-4 overflow-y-auto custom-scrollbar pr-2 pb-24 md:pb-4 max-h-[60vh] md:max-h-[calc(100vh-350px)]">
            {filteredRecs.length === 0 ? (
              <div className="relative z-10 flex flex-col items-center justify-center py-12 text-center bg-[#ffffff] dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl border border-gray-100 dark:border-slate-800">
                <DocumentMagnifyingGlassIcon className="w-12 h-12 text-gray-300 dark:text-gray-600 mb-4" />
                <h3 className="text-lg font-bold text-gray-700 dark:text-[#F9F7F7] mb-1">No results found</h3>
                <p className="text-gray-500 dark:text-slate-400 text-sm">We couldn't find anything matching "{searchQuery}".</p>
              </div>
            ) : filteredRecs.map((rec) => {
              return (
                <div
                  key={rec.id}
                  className={`bg-[#ffffff] dark:bg-[#0F122B]/60 hover:bg-[#ffffff] dark:hover:bg-[#0F122B]/80 rounded-2xl p-5 md:p-6 shadow-md dark:shadow-black/20 border-l-4 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ease-out will-change-transform flex flex-col md:flex-row gap-4 justify-between items-start md:items-center ${
                    rec.impact === "High"
                      ? "border-l-red-500"
                      : rec.impact === "Medium"
                      ? "border-l-amber-500"
                      : "border-l-green-500"
                  }`}
                >
                  <div className="flex gap-4 items-start flex-grow w-full md:w-auto">
                    {/* Icon or Service Logo */}
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-100 dark:border-purple-900/30 flex flex-col items-center justify-center flex-shrink-0 shadow-sm">
                      <span className="text-[10px] md:text-xs font-black text-[#792CA2] dark:text-[#C084FC] uppercase">{rec.service}</span>
                    </div>

                    <div className="space-y-1 flex-grow">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          rec.impact === "High"
                            ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                            : rec.impact === "Medium"
                            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 border border-amber-100 dark:border-amber-900/30"
                            : "bg-green-50 dark:bg-emerald-950/30 text-green-600 dark:text-emerald-400 border border-green-100 dark:border-emerald-900/30"
                        }`}>
                          {rec.impact} 
                        </span>
                        <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider bg-gray-50 dark:bg-slate-800 border border-gray-150 dark:border-slate-700 text-gray-500 dark:text-slate-350 font-mono">
                          ID: {rec.resourceId}
                          <button
                            onClick={() => handleCopy(rec.resourceId, rec.id)}
                            className="text-gray-400 hover:text-[#792CA2] transition-colors focus:outline-none"
                            title="Copy ID"
                          >
                            {copiedId === rec.id ? (
                              <CheckIcon className="w-3 h-3 text-green-500" />
                            ) : (
                              <DocumentDuplicateIcon className="w-3 h-3" />
                            )}
                          </button>
                        </span>
                      </div>

                      <h4 className="text-sm md:text-base font-extrabold text-[#111844] dark:text-[#F9F7F7] tracking-tight mt-1">{rec.title}</h4>
                      <p className="text-xs md:text-sm text-gray-500 dark:text-slate-300 font-medium leading-relaxed max-w-2xl mt-0.5">{rec.description}</p>
                      
                      {rec.actionableSteps && (
                        <div className="mt-3 bg-[#792CA2]/5 dark:bg-[#792CA2]/10 border border-[#792CA2]/20 dark:border-[#792CA2]/30 rounded-xl overflow-hidden transition-all duration-300">
                          <button 
                            onClick={() => toggleSteps(rec.id)}
                            className="w-full flex items-center justify-between p-3 focus:outline-none hover:bg-[#792CA2]/10 dark:hover:bg-[#792CA2]/20 transition-colors"
                          >
                            <span className="font-bold text-[#792CA2] dark:text-[#C084FC] uppercase tracking-wider text-[10px] font-sans">
                              Actionable Steps
                            </span>
                            <ChevronDownIcon className={`w-4 h-4 text-[#792CA2] dark:text-[#C084FC] transition-transform duration-300 ${expandedSteps[rec.id] ? "rotate-180" : ""}`} />
                          </button>
                          
                          <AnimatePresence>
                            {expandedSteps[rec.id] && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="px-3 pb-3 text-[11px] md:text-xs text-gray-700 dark:text-slate-200 font-sans max-h-60 overflow-y-auto custom-scrollbar"
                              >
                                <ol className="list-decimal pl-5 space-y-2 font-mono">
                                  {(() => {
                                    let raw = rec.actionableSteps || "";
                                    if (!/\n|\*|(?:\s|^)\d+\.\s/.test(raw)) {
                                      raw = raw.replace(/\.\s+/g, '.\n');
                                    }
                                    const parts = raw.split(/(?:\n|\*|(?:\s|^)\d+\.\s)/);
                                    return parts.map((step, idx) => {
                                      const cleanStep = step.replace(/^[\*\-\s]+/, '').replace(/^\d+[\.\)]\s*/, '').trim();
                                      if (!cleanStep) return null;
                                      
                                      const finalStep = cleanStep.endsWith('.') ? cleanStep : cleanStep + '.';
                                      return <li key={idx} className="leading-relaxed pl-1 text-gray-600 dark:text-slate-350">{finalStep}</li>;
                                    });
                                  })()}
                                </ol>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto mt-2 md:mt-0 pt-3 md:pt-0 border-t md:border-t-0 border-gray-100/80 dark:border-slate-800 flex-shrink-0">
                    <div className="text-left md:text-right">
                      <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500 block uppercase tracking-wider">Est. Savings</span>
                      <span className="text-lg md:text-xl font-black text-emerald-600">-${Math.round(rec.potentialSavings)}/mo</span>
                    </div>
                  </div>
                </div>
              );
            })}
            </div>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
