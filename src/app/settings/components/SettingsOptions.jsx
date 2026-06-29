"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LanguageIcon,
  SwatchIcon,
  ArrowRightOnRectangleIcon,
  ChevronRightIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from "@heroicons/react/24/outline";
import { signOut } from "next-auth/react";
import { useTheme } from "../../../contexts/ThemeContext";

export default function SettingsOptions() {
  const { theme, setTheme } = useTheme();
  const [expandedOption, setExpandedOption] = useState(null);
  const [currentLanguage, setCurrentLanguage] = useState("en");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentLanguage(localStorage.getItem("language") || "en");
    }
  }, []);

  const handleLanguageChange = (langCode) => {
    setCurrentLanguage(langCode);
    const cookieValue = langCode === "en" ? "" : `/en/${langCode}`;

    // Clear any existing cookies first
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;

    if (langCode !== "en") {
      document.cookie = `googtrans=${cookieValue}; path=/;`;
      document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    }

    localStorage.setItem("language", langCode);
    
    // Smooth reload to apply translation across the entire app
    window.location.reload();
  };

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español (Spanish)" },
    { code: "fr", name: "Français (French)" },
    { code: "de", name: "Deutsch (German)" },
    { code: "zh-CN", name: "中文 (Chinese)" },
    { code: "ja", name: "日本語 (Japanese)" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "pt", name: "Português (Portuguese)" },
  ];

  const handleOptionClick = (optionId) => {
    if (expandedOption === optionId) {
      setExpandedOption(null);
    } else {
      setExpandedOption(optionId);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.1 }}
      className="mt-6 flex flex-col gap-3"
    >
      {/* ── LANGUAGE OPTION ── */}
      <div className="bg-white/70 dark:bg-[#0F122B]/60 backdrop-blur-xl border border-white dark:border-white/5 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
        <button
          onClick={() => handleOptionClick("language")}
          className="w-full p-4 flex items-center justify-between group focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className="bg-blue-500/10 text-blue-500 dark:text-blue-400 p-2.5 rounded-xl">
              <LanguageIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-[#111844] dark:text-[#F9F7F7] block">Language</span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Active: {languages.find(l => l.code === currentLanguage)?.name || "English"}
              </span>
            </div>
          </div>
          <ChevronRightIcon className={`w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#792CA2] dark:group-hover:text-[#C084FC] transition-transform ${expandedOption === "language" ? "rotate-90 text-[#792CA2] dark:text-[#C084FC]" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {expandedOption === "language" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 p-4"
            >
              <div className="grid grid-cols-2 gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold text-left transition-all border flex items-center justify-between ${
                      currentLanguage === lang.code
                        ? "bg-[#792CA2] border-[#792CA2] text-white shadow-sm"
                        : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-[#792CA2]/30 dark:hover:border-[#C084FC]/30"
                    }`}
                  >
                    <span>{lang.name}</span>
                    {currentLanguage === lang.code && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full"></span>
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── THEME OPTION ── */}
      <div className="bg-white/70 dark:bg-[#0F122B]/60 backdrop-blur-xl border border-white dark:border-white/5 rounded-2xl shadow-sm overflow-hidden transition-all duration-300">
        <button
          onClick={() => handleOptionClick("theme")}
          className="w-full p-4 flex items-center justify-between group focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className="bg-orange-500/10 text-orange-500 dark:text-orange-400 p-2.5 rounded-xl">
              <SwatchIcon className="w-5 h-5" />
            </div>
            <div className="text-left">
              <span className="font-bold text-[#111844] dark:text-[#F9F7F7] block">Theme Mode</span>
              <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                Active: {theme}
              </span>
            </div>
          </div>
          <ChevronRightIcon className={`w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-[#792CA2] dark:group-hover:text-[#C084FC] transition-transform ${expandedOption === "theme" ? "rotate-90 text-[#792CA2] dark:text-[#C084FC]" : ""}`} />
        </button>

        <AnimatePresence initial={false}>
          {expandedOption === "theme" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/30 p-4"
            >
              <div className="flex flex-col gap-2">
                {[
                  { id: "light", label: "Light Theme", icon: SunIcon },
                  { id: "dark", label: "Dark Theme", icon: MoonIcon },
                  { id: "system", label: "System Default", icon: ComputerDesktopIcon },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isActive = theme === mode.id;
                  return (
                    <button
                      key={mode.id}
                      onClick={() => setTheme(mode.id)}
                      className={`w-full p-3 rounded-xl text-xs font-bold transition-all border flex items-center gap-3 ${
                        isActive
                          ? "bg-[#792CA2] border-[#792CA2] text-white shadow-sm"
                          : "bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 text-gray-600 dark:text-gray-300 hover:border-[#792CA2]/30 dark:hover:border-[#C084FC]/30"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── LOGOUT OPTION ── */}
      <motion.button
        whileHover={{ scale: 1.01, x: 2 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => signOut({ callbackUrl: "/auth/signin" })}
        className="w-full bg-red-50/80 dark:bg-red-950/20 backdrop-blur-xl border border-red-100 dark:border-red-900/30 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all flex items-center justify-between group mt-2"
      >
        <div className="flex items-center gap-4">
          <div className="bg-red-500/10 text-red-500 p-2.5 rounded-xl group-hover:bg-red-500 group-hover:text-white transition-colors">
            <ArrowRightOnRectangleIcon className="w-5 h-5" />
          </div>
          <span className="font-bold text-red-600 dark:text-red-400">Log out</span>
        </div>
      </motion.button>
    </motion.div>
  );
}
