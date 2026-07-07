"use client";
import React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { LockClosedIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function RestrictedOverlay({ pageName = "this page" }) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-[100] flex flex-col items-center justify-start md:justify-center p-6 bg-white/10 dark:bg-slate-950/5 backdrop-blur-md pointer-events-auto overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 15 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="mb-20 md:my-auto bg-white/45 dark:bg-slate-950/20 backdrop-blur-xl border border-white dark:border-white/5 p-8 md:p-12 rounded-3xl text-center max-w-lg w-full shadow-2xl relative z-10 flex flex-col items-center"
      >
        {/* Floating Icon*/}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-20 h-20 bg-gradient-to-br from-[#792CA2] to-[#9A4DCC] rounded-2xl shadow-xl shadow-[#792CA2]/30 flex items-center justify-center mb-6 relative group"
        >
          <LockClosedIcon className="w-10 h-10 text-white" />
          <span className="absolute -inset-1.5 rounded-2xl border-2 border-[#9A4DCC]/30 animate-pulse pointer-events-none" />
        </motion.div>

        {/* Access Restriction Messages */}
        <h2 className="text-2xl md:text-3xl font-black text-[#111844] tracking-tight">
          Access Restricted
        </h2>
        
        <div className="mt-3 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-600 font-extrabold text-[10px] uppercase tracking-wider w-fit">
          Viewer Role
        </div>

        <p className="text-sm text-gray-500 font-medium leading-relaxed mt-4 max-w-[90%]">
          This portal ({pageName}) is reserved for administrator accounts only. Your current credentials provide a read-only <strong>Viewer</strong> access level, which excludes cloud configuration controls, recommendation engines, and alert configurations.
        </p>

        {/* Return Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push("/dashboard")}
          className="mt-8 bg-[#111844] hover:bg-[#1F215D] text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg flex items-center gap-2 justify-center w-full sm:w-auto"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Return to Dashboard
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
