"use client";
import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

export default function CategoryTabs({ activeCategory, setActiveCategory }) {
  const categories = [
    { id: "all", label: "All Insights", section: "Overview" },
    { id: "allocate", label: "Allocation", section: "Compute" },
    { id: "sizing", label: "Right-sizing", section: "Optimization" },
    { id: "usage", label: "Usage Patterns", section: "Analytics" },
  ];

  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeCategoryObj = categories.find(c => c.id === activeCategory) || categories[0];

  return (
    <div className="w-full mt-4 px-2">
      {/* Mobile Custom Dropdown */}
      <div className="block md:hidden mb-4 relative z-30" ref={dropdownRef}>
        <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1">
          Select Category
        </label>
        <div className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between bg-white border border-gray-200 text-[#111844] font-bold py-3 px-4 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-[#792CA2]/50 focus:border-[#792CA2]/50 transition-all text-left"
          >
            <span className="truncate">{activeCategoryObj.label} <span className="font-normal text-gray-500">({activeCategoryObj.section})</span></span>
            <ChevronDownIcon className={`w-4 h-4 text-gray-400 transition-transform duration-300 flex-shrink-0 ${isOpen ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="absolute z-[150] w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
              >
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveCategory(cat.id);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-bold transition-colors ${activeCategory === cat.id ? "bg-[#792CA2]/10 text-[#792CA2]" : "text-gray-700 hover:bg-gray-50"
                      }`}
                  >
                    {cat.label} <span className={`font-normal ${activeCategory === cat.id ? "text-[#792CA2]/70" : "text-gray-500"}`}>({cat.section})</span>
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Desktop Tabs */}
      <div className="hidden md:flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
        {categories.map((cat, idx) => {
          const isActive = activeCategory === cat.id;

          return (
            <div key={cat.id} className="flex flex-col items-center relative min-w-max">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className={`px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-t-lg mb-[-1px] z-10 transition-colors duration-300 ${isActive ? "bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white" : "bg-white border border-gray-200 text-gray-400"
                  }`}
              >
                {cat.section}
              </motion.div>
              <button
                onClick={() => setActiveCategory(cat.id)}
                className={`relative px-6 py-2.5 text-sm font-bold rounded-xl transition-all duration-300 z-20 overflow-hidden ${isActive
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
    </div>
  );
}
