"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CostTrendsChart({
  chartTimeframe,
  setChartTimeframe,
  currentChartData,
  maxChartValue,
  hoveredBar,
  setHoveredBar,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60"
    >
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-base font-bold text-[#111844]">
            {chartTimeframe} Cost Trends
          </h3>
        </div>
        <div className="bg-gray-100 rounded-lg p-0.5 flex text-[10px]">
          {["Monthly", "Weekly", "Daily"].map((p) => (
            <button
              key={p}
              onClick={() => setChartTimeframe(p)}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                chartTimeframe === p
                  ? "bg-white text-[#111844] shadow-sm"
                  : "text-gray-400 hover:text-gray-600"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 relative border-b border-gray-100">
        {[0.25, 0.5, 0.75, 1.0].map((ratio) => (
          <div
            key={ratio}
            className="absolute left-0 right-0 border-t border-dashed border-gray-100 pointer-events-none"
            style={{ bottom: `${ratio * 100}%` }}
          />
        ))}

        <div className="flex h-56 items-end justify-between px-2 pt-6">
          {currentChartData.map((item, index) => {
            const heightPercent = (item.value / maxChartValue) * 100;
            const isHovered = hoveredBar === index;

            return (
              <div
                key={item.label}
                className="flex flex-col items-center flex-1 relative group cursor-pointer"
                onMouseEnter={() => setHoveredBar(index)}
                onMouseLeave={() => setHoveredBar(null)}
              >
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute -top-12 z-20 bg-[#111844] text-white px-3 py-1.5 rounded-xl shadow-lg text-[10px] font-bold whitespace-nowrap"
                    >
                      ${item.value.toLocaleString()}
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="w-full h-36 flex items-end justify-center">
                  <motion.div
                    className={`w-7 sm:w-9 rounded-t-lg bg-gradient-to-t from-[#792CA2] to-[#9A4DCC] relative transition-all duration-300 ${
                      isHovered
                        ? "brightness-110 shadow-md scale-x-[1.03]"
                        : "opacity-85"
                    }`}
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-semibold mt-2">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
