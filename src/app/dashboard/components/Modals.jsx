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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-[#111844]"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-gray-100 max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Sticky header */}
              <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-[#111844]">
                    All Cost Resources
                  </h3>
                </div>
                <button
                  onClick={() => setIsResourcesModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body — scrollbar stays inside rounded corners */}
              <div className="overflow-y-auto flex-1 px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black">
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
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-all text-xs"
                        >
                          <td className="py-3 font-semibold text-gray-800">
                            <div className="flex items-center gap-1.5">
                              <span>{r.name}</span>
                              <button
                                onClick={() => handleCopy(r.name)}
                                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
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
                          <td className="py-3 text-gray-500">{r.region}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-100/50">
                              {r.service}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                r.status === "Running"
                                  ? "bg-green-50 text-green-600 border border-green-100"
                                  : r.status === "Active"
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : "bg-black-50 text-black-600 border border-black-100"
                              }`}
                            >
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                r.environment === "Production"
                                  ? "bg-black-50 text-white-600 border border-white-100"
                                  : r.environment === "Staging"
                                  ? "bg-black-50 text-white-600 border border-white-100"
                                  : "bg-black-50 text-white-600 border border-white-100"
                              }`}
                            >
                              {r.environment}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-gray-700">
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-[#111844]"
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full border border-gray-100 max-h-[85vh] overflow-hidden flex flex-col"
            >
              {/* Sticky header */}
              <div className="flex justify-between items-center px-6 pt-6 pb-4 border-b border-gray-100 flex-shrink-0">
                <div>
                  <h3 className="text-lg font-bold text-[#111844]">
                    All Optimization Alerts
                  </h3>
                </div>
                <button
                  onClick={() => setIsAlertsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <XMarkIcon className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable body — scrollbar stays inside rounded corners */}
              <div className="overflow-y-auto flex-1 px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black">
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
                          className="border-b border-gray-50 hover:bg-gray-50/50 transition-all text-xs"
                        >
                          <td className="py-3">
                            <div>
                              <h4 className="font-extrabold text-gray-800">
                                {a.title}
                              </h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">
                                {a.desc}
                              </p>
                            </div>
                          </td>
                          <td className="py-3">
                            <span
                              className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                                a.severity === "Critical"
                                  ? "bg-red-50 text-red-700 border border-red-100"
                                  : a.severity === "High"
                                  ? "bg-orange-50 text-orange-700 border-orange-100"
                                  : a.severity === "Medium"
                                  ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                  : "bg-green-50 text-green-700 border border-green-100"
                              }`}
                            >
                              {a.severity}
                            </span>
                          </td>
                          <td className="py-3 font-medium text-gray-600">
                            {a.category}
                          </td>
                          <td className="py-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                                a.status === "Active"
                                  ? "bg-red-50 text-red-600 border border-red-100"
                                  : a.status === "Acknowledged"
                                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                                  : "bg-green-50 text-green-600 border border-green-100"
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
