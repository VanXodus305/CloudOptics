"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  XMarkIcon,
  CheckIcon,
  DocumentDuplicateIcon,
} from "@heroicons/react/24/outline";

export default function Modals({
  isResourcesModalOpen,
  setIsResourcesModalOpen,
  isAlertsModalOpen,
  setIsAlertsModalOpen,
  expandedResources,
  expandedAlerts,
  copiedId,
  handleCopy,
}) {
  return (
    <>
      {/* Resources Modal */}
      <AnimatePresence>
        {isResourcesModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-[#111844] dark:text-[#F9F7F7]"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#ffffff] dark:bg-[#0F122B] rounded-3xl shadow-2xl max-w-4xl w-full border border-gray-100 dark:border-white/5 max-h-[85vh] overflow-hidden flex flex-col"
            >
              
              <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] flex flex-wrap gap-x-1.5 gap-y-0.5">
                    <span>All</span>
                    <span>Cost</span>
                    <span>Resources</span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsResourcesModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              
              <div className="overflow-y-auto flex-1 px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] text-gray-400 uppercase font-black">
                        <th className="pb-3">Resource ID</th>
                        <th className="pb-3">Region</th>
                        <th className="pb-3">Service</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Environment</th>
                        <th className="pb-3 text-right">Cost/mo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expandedResources.map((r) => (
                        <tr
                          key={r.id}
                          className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all text-xs"
                        >
                          <td className="py-3 font-semibold text-gray-850 dark:text-[#F9F7F7]">
                            <div className="flex items-center gap-1.5">
                              <span>{r.name}</span>
                              <button
                                onClick={() => handleCopy(r.name)}
                                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
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
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 dark:bg-purple-950/20 text-purple-600 dark:text-[#C084FC] border border-purple-100/50 dark:border-purple-900/30">
                              {r.service}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                r.status === "Running"
                                  ? "bg-green-50 dark:bg-emerald-950/20 text-green-600 dark:text-emerald-450 border border-green-100 dark:border-emerald-900/30"
                                  : r.status === "Active"
                                  ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                                  : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-350 border border-gray-150 dark:border-slate-700"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                r.environment === "Production"
                                  ? "bg-rose-50 dark:bg-rose-950/20 text-rose-600 dark:text-rose-455 border border-rose-100 dark:border-rose-900/30"
                                  : r.environment === "Staging"
                                  ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                                  : "bg-gray-50 dark:bg-slate-800 text-gray-600 dark:text-slate-350 border border-gray-200 dark:border-slate-700"
                              }`}
                            >
                              {r.environment}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-gray-700 dark:text-slate-200">
                            ${r.cost.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Alerts Modal */}
      <AnimatePresence>
        {isAlertsModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-[#111844] dark:text-[#F9F7F7]"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-[#ffffff] dark:bg-[#0F122B] rounded-3xl shadow-2xl max-w-4xl w-full border border-gray-100 dark:border-white/5 max-h-[85vh] overflow-hidden flex flex-col"
            >
              
              <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 dark:border-white/5 flex-shrink-0">
                <div>
                  <h3 className="text-lg md:text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] flex flex-wrap gap-x-1.5 gap-y-0.5">
                    <span>All</span>
                    <span>Optimization</span>
                    <span>Alerts</span>
                  </h3>
                </div>
                <button
                  onClick={() => setIsAlertsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              
              <div className="overflow-y-auto flex-1 px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 dark:border-white/5 text-[10px] text-gray-400 uppercase font-black">
                        <th className="pb-3">Alert Title</th>
                        <th className="pb-3">Severity</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expandedAlerts.map((a) => (
                        <tr
                          key={a.id}
                          className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/5 transition-all text-xs"
                        >
                          <td className="py-3">
                            <div>
                              <h4 className="font-extrabold text-gray-800 dark:text-[#F9F7F7]">
                                {a.title}
                              </h4>
                              <p className="text-[10px] text-gray-400 dark:text-gray-450 mt-0.5">
                                {a.desc}
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                a.severity === "Critical"
                                  ? "bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                                  : a.severity === "High"
                                  ? "bg-orange-50 dark:bg-orange-950/20 text-orange-700 dark:text-orange-400 border border-orange-100 dark:border-orange-900/30"
                                  : a.severity === "Medium"
                                  ? "bg-yellow-50 dark:bg-yellow-950/20 text-yellow-700 dark:text-yellow-400 border border-yellow-100 dark:border-yellow-900/30"
                                  : "bg-green-50 dark:bg-emerald-950/20 text-green-700 dark:text-emerald-400 border border-green-100 dark:border-emerald-900/30"
                              }`}
                            >
                              {a.severity}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-gray-600 dark:text-slate-300">
                            {a.category}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                a.status === "Active"
                                  ? "bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900/30"
                                  : a.status === "Acknowledged"
                                  ? "bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30"
                                  : "bg-green-50 dark:bg-emerald-950/20 text-green-600 dark:text-emerald-450 border border-green-100 dark:border-emerald-900/30"
                              }`}
                            >
                              {a.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
