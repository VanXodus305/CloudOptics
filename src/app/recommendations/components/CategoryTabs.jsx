"use client";
import React from "react";
import { motion } from "framer-motion";

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  const categories = [
    { id: "all", label: "All Insights", section: "Overview" },
    { id: "allocate", label: "Allocation", section: "Compute" },
    { id: "sizing", label: "Right-sizing", section: "Optimization" },
    { id: "usage", label: "Usage Patterns", section: "Analytics" },
  ];

  return (
    <div className="flex gap-4 md:gap-6 mt-4 overflow-x-auto pb-4 scrollbar-hide px-2">
      {categories.map((cat, idx) => {
        const isActive = activeCategory === cat.id;
        
        return (
          <div key={cat.id} className="flex flex-col items-center relative min-w-max">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-t-lg mb-[-1px] z-10 transition-colors duration-300 ${
                isActive ? "bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white" : "bg-white border border-gray-200 text-gray-400"
              }`}
            >
              {cat.section}
            </motion.div>
            <button
              onClick={() => setActiveCategory(cat.id)}
              className={`relative px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 z-20 overflow-hidden ${
                isActive
                  ? "text-white shadow-lg shadow-[#792CA2]/20"
                  : "bg-white text-gray-500 border border-gray-200 hover:bg-gray-50 hover:text-gray-700"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeCategoryBg"
                  className="absolute inset-0 bg-gradient-to-r from-[#111844] to-[#1F215D] rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                />
              )}
              <span className="relative z-10">{cat.label}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
}
