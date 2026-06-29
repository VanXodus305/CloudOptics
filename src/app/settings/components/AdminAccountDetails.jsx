"use client";
import React from "react";
import { motion } from "framer-motion";
import { UserCircleIcon, ShieldCheckIcon, PencilIcon } from "@heroicons/react/24/outline";
import { useSession } from "next-auth/react";

export default function AdminAccountDetails() {
  const { data: session } = useSession();
  const userName = session?.user?.name || "Admin User";
  const userEmail = session?.user?.email || "admin@cloudoptics.io";
  const isViewer = session?.user?.role === "Viewer";

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative flex-grow flex flex-col"
    >

      <div className="bg-white/60 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl rounded-tl-none p-8 shadow-xl border border-white dark:border-white/5 flex flex-col items-center flex-grow relative z-0 overflow-hidden min-h-[400px]">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#792CA2]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#9A4DCC]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full flex justify-between items-center mb-8 relative z-10">
          <h2 className="text-xl font-extrabold text-[#111844] dark:text-[#F9F7F7] tracking-tight">
            {isViewer ? "User Profile details" : "Admin Account details"}
          </h2>
          <button className="p-2 bg-white dark:bg-slate-800 rounded-full shadow-sm border border-gray-100 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors text-gray-500 hover:text-[#792CA2] dark:text-gray-400">
            <PencilIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 relative z-10 w-full mt-4">
          <div className="relative">
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#792CA2] to-[#DCCBFF] p-1 shadow-lg shadow-[#792CA2]/20">
              <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-800">
                {session?.user?.image ? (
                  <img src={session.user.image} alt={userName} className="w-full h-full object-cover" />
                ) : (
                  <UserCircleIcon className="w-20 h-20 text-gray-300 dark:text-slate-600" />
                )}
              </div>
            </div>
            <div className="absolute bottom-1 right-1 bg-green-500 w-6 h-6 rounded-full border-4 border-white dark:border-slate-800 shadow-sm flex items-center justify-center">
              <span className="w-2 h-2 bg-white rounded-full"></span>
            </div>
          </div>

          <div className="text-center mt-2">
            <h3 className="text-2xl font-black text-[#111844] dark:text-[#F9F7F7]">{userName}</h3>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">{userEmail}</p>
          </div>

          <div className="mt-6 bg-white/80 dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 rounded-2xl p-4 w-full flex items-center gap-4 shadow-sm">
            <div className="bg-[#792CA2]/10 p-3 rounded-xl">
              <ShieldCheckIcon className="w-6 h-6 text-[#792CA2]" />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Role & Permissions</p>
              <p className="text-sm font-bold text-[#111844] dark:text-[#F9F7F7] mt-0.5">
                {isViewer ? "Viewer" : "Admin"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
