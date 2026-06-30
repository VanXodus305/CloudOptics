"use client";
import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import {
  HomeIcon,
  CalendarIcon,
  ArrowDownTrayIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  DocumentChartBarIcon,
  TableCellsIcon,
  ChevronDownIcon,
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
  onDownloadPDF,
  onDownloadXLSX,
}) {
  const router = useRouter();
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(null);
  const reportRef = useRef(null);

  // Close report dropdown on outside click
  React.useEffect(() => {
    function handler(e) {
      if (reportRef.current && !reportRef.current.contains(e.target)) {
        setIsReportOpen(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  async function handlePDF() {
    setIsReportOpen(false);
    setIsGenerating("pdf");
    try { await onDownloadPDF?.(); } finally { setIsGenerating(null); }
  }

  async function handleXLSX() {
    setIsReportOpen(false);
    setIsGenerating("xlsx");
    try { await onDownloadXLSX?.(); } finally { setIsGenerating(null); }
  }

  const reportOptions = [
    {
      label: "PDF Report",
      sub: "Formatted multi-page document",
      icon: DocumentChartBarIcon,
      action: handlePDF,
      key: "pdf",
    },
    {
      label: "Excel (XLSX)",
      sub: "Spreadsheet with 5 data sheets",
      icon: TableCellsIcon,
      action: handleXLSX,
      key: "xlsx",
    },
  ];

  return (
    <div className="px-4 md:px-8 pt-4 pb-2 w-full flex-shrink-0 z-50">
      <header className="h-16 w-full bg-white/60 dark:bg-[#0F122B]/60 backdrop-blur-xl border border-white/30 dark:border-white/5 rounded-full flex items-center justify-between px-4 md:px-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] transition-all duration-500">
        <div className="flex items-center gap-2 md:gap-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Logo"
              className="h-14 md:h-16 object-contain cursor-pointer"
              onClick={() => router.push("/")}
            />
          </div>

          {/* Go Back to Home Tab */}
          <button
            onClick={() => router.push("/")}
            className="hidden md:flex text-xs font-bold text-gray-500 dark:text-gray-300 hover:text-[#792CA2] dark:hover:text-[#C084FC] transition-colors items-center gap-1.5 px-2.5 py-2 rounded-xl hover:bg-gray-100/50 dark:hover:bg-slate-800/50"
          >
            <HomeIcon className="w-6 h-6 text-gray-400 dark:text-gray-500 font-bold" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </div>

        <div className="flex items-center gap-3 md:gap-4">
          {/* Current Date Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700 text-xs font-bold text-gray-500 dark:text-gray-300 shadow-sm whitespace-nowrap">
            <CalendarIcon className="w-4 h-4 text-[#792CA2] dark:text-[#C084FC]" />
            <span>{currentDate}</span>
          </div>

          {/* ── Report Dropdown ── */}
          {!hideReportButton && (
            <div className="hidden md:block relative" ref={reportRef}>
              <button
                onClick={() => setIsReportOpen((v) => !v)}
                className="flex bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white text-xs px-4 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm font-semibold items-center gap-2 select-none"
              >
                {isGenerating ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    <span>Generating…</span>
                  </>
                ) : (
                  <>
                    <span>Report</span>
                    <ArrowDownTrayIcon className="w-4 h-4 text-white" />
                    <ChevronDownIcon
                      className={`w-3 h-3 text-white/80 transition-transform duration-200 ${isReportOpen ? "rotate-180" : ""}`}
                    />
                  </>
                )}
              </button>

              <AnimatePresence>
                {isReportOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-2 w-64 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 z-[999]"
                  >
                    <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-2.5 pt-1 pb-2">
                      Download Format
                    </p>
                    {reportOptions.map((opt) => (
                      <button
                        key={opt.key}
                        onClick={opt.action}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-purple-50 dark:hover:bg-purple-950/40 transition-colors group text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#792CA2]/10 to-[#9A4DCC]/10 flex items-center justify-center flex-shrink-0 group-hover:from-[#792CA2]/20 group-hover:to-[#9A4DCC]/20 transition-all">
                          <opt.icon className="w-4 h-4 text-[#792CA2] dark:text-[#C084FC]" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-[#111844] dark:text-[#F9F7F7]">{opt.label}</p>
                          <p className="text-[9px] text-gray-400 dark:text-gray-500 font-medium">{opt.sub}</p>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
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
                  className="w-10 h-10 rounded-full border border-gray-200 dark:border-slate-700 shadow-md object-cover hover:scale-105 active:scale-95 transition-transform"
                />
              ) : (
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#792CA2] to-[#DCCBFF] p-0.5 shadow-md active:scale-95 transition-transform hover:brightness-105 flex items-center justify-center">
                  <div className="w-full h-full bg-white dark:bg-slate-800 rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-[#792CA2] dark:text-[#C084FC]" />
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
                  className="absolute right-0 mt-3 w-56 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-100 dark:border-slate-800 p-2 z-[999] text-left"
                >
                  <div className="p-2.5 border-b border-gray-100 dark:border-slate-800">
                    <p className="font-bold text-xs text-[#111844] dark:text-[#F9F7F7] truncate">{userName}</p>
                    <p className="text-[10px] text-gray-400 dark:text-gray-500 truncate">{session?.user?.email}</p>
                  </div>

                  {/* Mobile-Only section */}
                  <div className="md:hidden border-b border-gray-100 dark:border-slate-800 py-2 flex flex-col gap-2">
                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-gray-50/80 dark:bg-slate-800/80 border border-gray-100/50 dark:border-slate-700/50 text-[10px] font-bold text-gray-500 dark:text-gray-300">
                      <CalendarIcon className="w-4 h-4 text-[#792CA2] dark:text-[#C084FC]" />
                      <span>{currentDate}</span>
                    </div>

                    {!hideReportButton && (
                      <div className="flex flex-col gap-1">
                        <button
                          onClick={() => { setIsProfileOpen(false); handlePDF(); }}
                          className="w-full bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white text-[10px] px-3.5 py-2 rounded-xl active:scale-95 hover:scale-[1.02] transition-all font-semibold flex items-center justify-between h-9 shadow-sm"
                        >
                          <span>PDF Report</span>
                          <DocumentChartBarIcon className="w-3.5 h-3.5 text-white" />
                        </button>
                        <button
                          onClick={() => { setIsProfileOpen(false); handleXLSX(); }}
                          className="w-full bg-gradient-to-r from-[#5B21B6] to-[#792CA2] text-white text-[10px] px-3.5 py-2 rounded-xl active:scale-95 hover:scale-[1.02] transition-all font-semibold flex items-center justify-between h-9 shadow-sm"
                        >
                          <span>Excel Report</span>
                          <TableCellsIcon className="w-3.5 h-3.5 text-white" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => { setIsProfileOpen(false); router.push("/"); }}
                      className="w-full text-left text-xs px-2.5 py-2 rounded-xl hover:bg-[#792CA2]/10 dark:hover:bg-[#C084FC]/10 text-gray-600 dark:text-gray-300 hover:text-[#792CA2] dark:hover:text-[#C084FC] transition-colors flex items-center gap-2 font-medium"
                    >
                      <HomeIcon className="w-4 h-4 text-gray-400" />
                      Go to Home
                    </button>
                  </div>

                  <div className="pt-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left text-xs px-2.5 py-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 transition-colors flex items-center gap-2 font-medium"
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
