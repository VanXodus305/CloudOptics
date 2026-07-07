"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export default function ResourcesTable({
  resources,
  copiedId,
  handleCopy,
  setIsResourcesModalOpen,
  isLoading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 dark:border-white/5 relative"
    >
      
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-[#080A1A]/40 rounded-3xl flex items-center justify-center z-30 backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] flex flex-wrap gap-x-1.5 gap-y-0.5">
          <span>Top</span>
          <span>Cost</span>
          <span>Resources</span>
        </h3>
        <button
          onClick={() => setIsResourcesModalOpen(true)}
          className="text-xs text-[#792CA2] dark:text-[#C084FC] hover:underline font-bold flex items-center gap-0.5 focus:outline-none"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-800 text-[10px] text-gray-400 dark:text-gray-500 uppercase font-black">
              <th className="pb-3">Resource ID</th>
              <th className="pb-3">Region</th>
              <th className="pb-3">Service</th>
              <th className="pb-3 text-right">Cost/mo</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((r) => (
              <tr
                key={r.id}
                className="border-b border-gray-50/50 dark:border-slate-800/40 hover:bg-gray-50/20 dark:hover:bg-slate-800/20 transition-all text-xs"
              >
                <td className="py-3 font-semibold text-gray-800 dark:text-gray-200">
                  <div className="flex items-center gap-1.5">
                    <span>{r.name}</span>
                    <button
                      onClick={() => handleCopy(r.name)}
                      className="p-1 rounded hover:bg-gray-100 dark:hover:bg-slate-700 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      title="Copy ID"
                    >
                      {copiedId === r.name ? (
                        <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                      ) : (
                        <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </td>
                <td className="py-3 text-gray-500 dark:text-gray-400">{r.region}</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 border border-purple-100/50 dark:border-purple-900/30">
                    {r.service}
                  </span>
                </td>
                <td className="py-3 text-right font-bold text-gray-700 dark:text-gray-300">
                  ${r.cost.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
