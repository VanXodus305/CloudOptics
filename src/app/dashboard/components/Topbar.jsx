"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

export default function Topbar({
  userName,
  userImage,
  currentDate,
  isProfileOpen,
  setIsProfileOpen,
  handleSignOut,
  profileRef,
  session,
  hideReportButton = false,
}) {
  const router = useRouter();

  return (
    <div className="px-4 md:px-8 pt-4 pb-2 w-full flex-shrink-0 z-50">
      <header className="h-16 w-full bg-white/60 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-between px-4 md:px-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-500">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-14 md:h-16 object-contain cursor-pointer"
              onClick={() => router.push("/dashboard")}
            />
          </div>

          {/* Go Back to Home Tab */}
          <button
            onClick={() => router.push("/")}
            className="hidden md:flex text-xs font-bold text-gray-500 hover:text-[#792CA2] transition-colors items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-gray-100/50"
          >
            <HomeIcon className="w-6 h-6 text-gray-400 font-bold" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Current Date Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-500 shadow-sm whitespace-nowrap">
            <CalendarIcon className="w-4 h-4 text-[#792CA2]" />
            <span>{currentDate}</span>
          </div>

          {/* Download Symbol in Report Button */}
          {!hideReportButton && (
            <button className="hidden md:flex bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white text-xs px-4 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm font-semibold items-center gap-2">
              <span>Report</span>
              <ArrowDownTrayIcon className="w-4 h-4 text-white" />
            </button>
          )}

          {/* User Image Logo in Navbar */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center focus:outline-none"
            >
              {userImage ? (
                <img
                  src={userImage}
                  alt={userName}
                  className="w-10 h-10 rounded-full border border-gray-200 shadow-md object-cover hover:scale-105 active:scale-95 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#792CA2] to-[#DCCBFF] p-0.5 shadow-md active:scale-95 transition-transform hover:brightness-105 flex items-center justify-center">
                  <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-[#792CA2]" />
                  </div>
                </div>
              )}
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-100 p-2 z-[999] text-left"
                >
                  <div className="p-2.5 border-b border-gray-100">
                    <p className="font-bold text-xs text-[#111844] truncate">
                      {userName}
                    </p>
                    <p className="text-[10px] text-gray-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>

                  {/* Mobile-Only Dropdown Navigation Drawer */}
                  <div className="md:hidden border-b border-gray-100 py-2 flex flex-col gap-2">
                    {/* Date badge */}
                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-gray-50/80 border border-gray-100/50 text-[10px] font-bold text-gray-500">
                      <CalendarIcon className="w-4 h-4 text-[#792CA2]" />
                      <span>{currentDate}</span>
                    </div>

                    {/* Report Download */}
                    {!hideReportButton && (
                      <button
                        onClick={() => setIsProfileOpen(false)}
                        className="w-full bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white text-[10px] px-3.5 py-2 rounded-xl active:scale-95 hover:scale-[1.02] transition-all font-semibold flex items-center justify-between h-9 shadow-sm"
                      >
                        <span>Download Report</span>
                        <ArrowDownTrayIcon className="w-3.5 h-3.5 text-white" />
                      </button>
                    )}

                    {/* Home Navigation link */}
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        router.push("/");
                      }}
                      className="w-full text-left text-xs px-2.5 py-2 rounded-xl hover:bg-[#792CA2]/10 text-gray-600 hover:text-[#792CA2] transition-colors flex items-center gap-2 font-medium"
                    >
                      <HomeIcon className="w-4 h-4 text-gray-400" />
                      Go to Home
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-xs px-2.5 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 font-medium"
                    >
                      <ArrowRightOnRectangleIcon className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>
    </div>
  );
}
