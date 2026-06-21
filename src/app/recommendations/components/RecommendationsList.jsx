"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircleIcon, DocumentMagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function RecommendationsList({ activeCategory }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={activeCategory}
        initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        exit={{ opacity: 0, y: -20, filter: "blur(10px)" }}
        transition={{ duration: 0.4, type: "spring", stiffness: 200, damping: 20 }}
        className="bg-white/40 backdrop-blur-3xl border-t border-white/60 p-8 flex-grow rounded-b-3xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center min-h-[400px]"
      >
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-[#792CA2]/10 via-[#111844]/5 to-transparent rounded-full blur-[80px] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col items-center max-w-md text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-white to-gray-50 rounded-full shadow-xl flex items-center justify-center mb-6 border border-white/80 relative">
            <DocumentMagnifyingGlassIcon className="w-12 h-12 text-[#792CA2]" />
            <div className="absolute -bottom-2 -right-2 bg-green-500 rounded-full p-1.5 border-4 border-[#F9F7F7]">
              <CheckCircleIcon className="w-4 h-4 text-white" />
            </div>
          </div>
          
          <h3 className="text-2xl font-black text-[#111844] mb-3">
            System Optimized
          </h3>
          <p className="text-gray-500 font-medium text-sm leading-relaxed mb-8">
            Displaying optimized insights for the <span className="font-bold text-[#792CA2] capitalize">{activeCategory}</span> category. All immediate actions have been cleared.
          </p>
          
          <div className="w-full bg-white/60 rounded-2xl p-4 border border-white/50 shadow-sm flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 w-full bg-gray-100/50 rounded-xl animate-pulse flex items-center px-4">
                <div className="w-6 h-6 bg-gray-200/50 rounded-md mr-3"></div>
                <div className="h-2 bg-gray-200/50 rounded flex-grow max-w-[60%]"></div>
                <div className="h-2 bg-gray-200/50 rounded w-12 ml-auto"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
