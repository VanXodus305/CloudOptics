"use client";
import React from "react";
import { motion } from "framer-motion";
import { CheckIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";

export default function ResourcesTable({
  resources,
  copiedId,
  handleCopy,
  setIsResourcesModalOpen,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60"
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-[#111844]">
          Top Cost Resources
        </h3>
        <button
          onClick={() => setIsResourcesModalOpen(true)}
          className="text-xs text-[#792CA2] hover:underline font-bold flex items-center gap-0.5 focus:outline-none"
        >
          View All
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black">
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
                className="border-b border-gray-50/50 hover:bg-gray-50/20 transition-all text-xs"
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
                <td className="py-3 text-right font-bold text-gray-700">
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
