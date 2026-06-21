"use client";
import React from "react";
import { motion } from "framer-motion";
import { LanguageIcon, DocumentTextIcon, SwatchIcon, ArrowRightOnRectangleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";

export default function SettingsOptions() {
  const options = [
    { id: "language", label: "Language", icon: LanguageIcon, color: "text-blue-500", bg: "bg-blue-500/10" },
    { id: "policies", label: "Policies", icon: DocumentTextIcon, color: "text-purple-500", bg: "bg-purple-500/10" },
    { id: "theme", label: "Theme", icon: SwatchIcon, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      className="mt-6 flex flex-col gap-3"
    >
      {options.map((opt, i) => {
        const Icon = opt.icon;
        return (
          <motion.button
            key={opt.id}
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-white/70 backdrop-blur-xl border border-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group"
          >
            <div className="flex items-center gap-4">
              <div className={`${opt.bg} ${opt.color} p-2.5 rounded-xl`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-[#111844]">{opt.label}</span>
            </div>
            <ChevronRightIcon className="w-4 h-4 text-gray-400 group-hover:text-[#792CA2] transition-colors" />
          </motion.button>
        );
      })}

      <motion.button
        whileHover={{ scale: 1.02, x: 5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="w-full bg-red-50/80 backdrop-blur-xl border border-red-100 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group mt-2"
      >
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 text-red-500 p-2.5 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-red-600">Log out</span>
        </div>
      </motion.button>
    </motion.div>
  );
}
