"use client";
import React, { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Squares2X2Icon,
  CpuChipIcon,
  LightBulbIcon,
  BellAlertIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  PlayIcon,
} from "@heroicons/react/24/outline";

export default function Sidebar({
  isSidebarExpanded,
  setIsSidebarExpanded,
  isLiveSimulation,
  setIsLiveSimulation,
  handleSignOut,
  setIsResourcesModalOpen,
  setIsAlertsModalOpen,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [isNavigatingTo, setIsNavigatingTo] = useState(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsNavigatingTo(null);
    if (pathname === "/resources") setActiveTab("Resources");
    else if (pathname === "/dashboard") setActiveTab("Dashboard");
    else if (pathname === "/recommendations") setActiveTab("Recommendations");
    else if (pathname === "/alerts") setActiveTab("Alerts");
    else if (pathname === "/settings") setActiveTab("Settings");
  }, [pathname]);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const mobileItems = [
    {
      name: "Dashboard",
      icon: Squares2X2Icon,
      href: "/dashboard",
    },
    {
      name: "Resources",
      icon: CpuChipIcon,
      href: "/resources",
    },
    {
      name: "Recommendations",
      icon: LightBulbIcon,
      href: "/recommendations",
    },
    {
      name: "Alerts",
      icon: BellAlertIcon,
      href: "/alerts",
    },
    {
      name: "Simulation",
      icon: PlayIcon,
      isSimulation: true,
      action: () => {
        setIsLiveSimulation(!isLiveSimulation);
      },
    },
    {
      name: "Settings",
      icon: Cog6ToothIcon,
      href: "/settings",
    },
    {
      name: "Sign Out",
      icon: ArrowRightOnRectangleIcon,
      isSignOut: true,
      action: handleSignOut,
    },
  ];

  const shouldBeExpanded = !isMobile && (isSidebarExpanded || isHovered);

  return (
    <motion.aside
      animate={
        isMobile
          ? { width: "100%", height: 64, borderRightWidth: 0, borderTopWidth: 1 }
          : { width: shouldBeExpanded ? 240 : 76, height: "100%" }
      }
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      onMouseEnter={() => !isMobile && !isSidebarExpanded && setIsHovered(true)}
      onMouseLeave={() => !isMobile && setIsHovered(false)}
      className={`bg-[#111844] text-white flex border-[#1F215D]/20 ${
        isMobile
          ? "fixed bottom-0 left-0 right-0 flex-row h-14 px-2 border-t justify-between items-center shadow-[0_-4px_20px_rgba(0,0,0,0.15)] z-[150]"
          : `flex-shrink-0 h-full py-5 flex-col overflow-y-auto border-r rounded-tr-2xl z-40 ${
              shouldBeExpanded ? "px-5" : "px-3"
            }`
      }` }
    >
      {!isMobile && (
        <div className={`flex items-center mb-8 ${shouldBeExpanded ? "gap-3" : "justify-center"}`}>
          <button
            onClick={() => {
              setIsSidebarExpanded(!isSidebarExpanded);
              setIsHovered(false);
            }}
            className="w-10 h-10 rounded-full hover:bg-white/10 text-white flex items-center justify-center transition-colors focus:outline-none flex-shrink-0"
            title={isSidebarExpanded ? "Collapse Menu" : "Expand Menu"}
          >
            <Bars3Icon className="w-5 h-5" />
          </button>
          {shouldBeExpanded && (
            <motion.h2
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="font-semibold text-lg tracking-wide text-gray-200 uppercase text-xs font-bold whitespace-nowrap"
            >
              Navigation
            </motion.h2>
          )}
        </div>
      )}

      {isMobile ? (
        <nav className="flex flex-row justify-between items-center w-full h-full">
          <div className="flex flex-row items-center justify-between w-full gap-1">
            {mobileItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.name;

              let btnClass = "";
              if (isActive) {
                if (item.isSimulation && isLiveSimulation) {
                  btnClass = "bg-green-500/15 text-green-400 border border-green-500/30 px-2 py-1 rounded-xl flex items-center gap-1 h-8 shadow-[0_0_10px_rgba(34,197,94,0.1)] font-bold text-[9.5px]";
                } else if (item.isSignOut) {
                  btnClass = "bg-red-500/15 text-red-400 border border-red-500/30 px-2 py-1 rounded-xl flex items-center gap-1 h-8 shadow-[0_0_10px_rgba(239,68,68,0.1)] font-bold text-[9.5px]";
                } else {
                  btnClass = "bg-[#792CA2] text-white px-2 py-1 rounded-xl flex items-center gap-1 h-8 shadow-[0_2px_4px_rgba(121,44,162,0.2)] border border-[#9A4DCC]/30 font-bold text-[9.5px]";
                }
              } else {
                if (item.isSimulation && isLiveSimulation) {
                  btnClass = "w-8 h-8 rounded-xl text-green-400 bg-green-500/10 border border-green-500/30 flex items-center justify-center relative shadow-sm";
                } else if (item.isSignOut) {
                  btnClass = "w-8 h-8 rounded-xl text-red-400/80 hover:text-red-300 hover:bg-red-950/20 flex items-center justify-center bg-transparent border border-transparent";
                } else {
                  btnClass = "w-8 h-8 rounded-xl text-gray-400 hover:text-white flex items-center justify-center bg-transparent border border-transparent";
                }
              }

              const innerContent = (
                <>
                  {isNavigatingTo === item.name ? (
                    <svg className="animate-spin w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <Icon className="w-5 h-5 flex-shrink-0" />
                  )}
                  
                  {item.isSimulation && isLiveSimulation && !isActive && (
                    <span className="absolute top-1 right-1 flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                  )}

                  {isActive && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: "auto" }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.15 }}
                      className="whitespace-nowrap text-[9.5px] tracking-tighter font-black ml-0.5"
                    >
                      {item.name}
                    </motion.span>
                  )}
                </>
              );

              return item.href ? (
                <Link href={item.href} passHref legacyBehavior key={item.name}>
                  <motion.a
                    layout
                    transition={{ type: "spring", stiffness: 350, damping: 25 }}
                    onClick={() => {
                      setActiveTab(item.name);
                      if (pathname !== item.href) setIsNavigatingTo(item.name);
                    }}
                    className={`${btnClass} relative focus:outline-none flex-shrink-0`}
                    title={item.name}
                  >
                    {innerContent}
                  </motion.a>
                </Link>
              ) : (
                <motion.button
                  key={item.name}
                  layout
                  transition={{ type: "spring", stiffness: 350, damping: 25 }}
                  onClick={() => {
                    setActiveTab(item.name);
                    if (item.action) item.action();
                  }}
                  className={`${btnClass} relative focus:outline-none flex-shrink-0`}
                  title={item.name}
                >
                  {innerContent}
                </motion.button>
              );
            })}
          </div>
        </nav>
      ) : (
        <nav className="flex-grow flex flex-col justify-between pb-12">
          <div className="space-y-4">
            <Link href="/dashboard" passHref legacyBehavior>
              <a
                onClick={() => {
                  if (pathname !== "/dashboard") setIsNavigatingTo("Dashboard");
                }}
                className={`text-xs font-semibold relative flex items-center transition-all duration-150 ${
                  shouldBeExpanded
                    ? `w-full text-left px-4 py-3 rounded-xl gap-3 shadow-md border border-transparent ${activeTab === "Dashboard" ? "bg-[#792CA2] text-white hover:bg-[#9A4DCC]" : "text-gray-400 hover:text-white hover:bg-[#792CA2]/25"}`
                    : `w-11 h-11 rounded-xl mx-auto justify-center active:translate-y-[2px] ${activeTab === "Dashboard" ? "bg-[#792CA2] text-white shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.4)] border border-[#9A4DCC]/30" : "text-gray-400 bg-white/5 border border-gray-700/40 hover:text-white hover:bg-[#792CA2]/15 shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"}`
                }`}
              >
                {isNavigatingTo === "Dashboard" ? (
                  <svg className="animate-spin w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Squares2X2Icon className="w-5 h-5 flex-shrink-0" />
                )}
                {shouldBeExpanded && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Dashboard
                  </motion.span>
                )}
              </a>
            </Link>

            {[
              { name: "Resources", icon: CpuChipIcon, href: "/resources" },
              { name: "Recommendations", icon: LightBulbIcon, href: "/recommendations" },
              { name: "Alerts", icon: BellAlertIcon, href: "/alerts" },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.name} href={item.href} passHref legacyBehavior>
                  <a
                    onClick={() => {
                      if (pathname !== item.href) setIsNavigatingTo(item.name);
                    }}
                    className={`text-xs transition-all duration-150 font-medium flex items-center ${
                      shouldBeExpanded
                        ? `w-full text-left px-4 py-3 rounded-xl gap-3 border border-transparent ${activeTab === item.name ? "bg-[#792CA2] text-white hover:bg-[#9A4DCC] shadow-md" : "text-gray-400 hover:text-white hover:bg-[#792CA2]/25"}`
                        : `w-11 h-11 rounded-xl mx-auto justify-center active:translate-y-[2px] ${activeTab === item.name ? "bg-[#792CA2] text-white shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.4)] border border-[#9A4DCC]/30" : "text-gray-400 bg-white/5 border border-gray-700/40 hover:text-white hover:bg-[#792CA2]/15 shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"}`
                    }`}
                  >
                    {isNavigatingTo === item.name ? (
                      <svg className="animate-spin w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <Icon className="w-5 h-5 flex-shrink-0" />
                    )}
                    {shouldBeExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </a>
                </Link>
              );
            })}
          </div>

          {/* Live Simulation Toggle */}
          {shouldBeExpanded ? (
            <div className={`py-3 px-4 rounded-xl my-4 flex flex-col items-stretch transition-all duration-300 border ${
              isLiveSimulation
                ? "bg-green-500/5 border-green-500/20 shadow-[0_0_12px_rgba(34,197,94,0.05)]"
                : "bg-[#792CA2]/10 border-[#792CA2]/25"
            }`}>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  <PlayIcon className={`w-4 h-4 transition-colors duration-300 ${isLiveSimulation ? "text-green-400 animate-pulse" : "text-gray-400"}`} />
                  <span className="text-[10px] text-[#DCCBFF] font-black uppercase tracking-wider">Simulation</span>
                  {isLiveSimulation && (
                    <span className="relative flex h-1.5 w-1.5 ml-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                    </span>
                  )}
                </div>
                <button
                  onClick={() => setIsLiveSimulation(!isLiveSimulation)}
                  className={`rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex-shrink-0 w-9 h-5 ${
                    isLiveSimulation ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-600"
                  }`}
                >
                  <motion.div
                    layout
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                    animate={{ x: isLiveSimulation ? 16 : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setIsLiveSimulation(!isLiveSimulation)}
              className={`w-11 h-11 rounded-xl mx-auto my-4 flex items-center justify-center transition-all duration-150 relative focus:outline-none ${
                isLiveSimulation
                  ? "text-green-400 bg-green-500/10 border border-green-500/30 active:translate-y-[2px] active:shadow-[0_2px_0_#15803d,0_2px_6px_rgba(34,197,94,0.2)] shadow-[0_4px_0_#15803d,0_4px_10px_rgba(34,197,94,0.25)] hover:shadow-[0_4px_0_#16a34a,0_4px_12px_rgba(34,197,94,0.4)]"
                  : "text-gray-400 hover:text-white hover:bg-[#792CA2]/15 border border-gray-700/40 bg-white/5 active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(0,0,0,0.2)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"
              }`}
              title={isLiveSimulation ? "Pause Simulation" : "Start Live Simulation"}
            >
              <PlayIcon className={`w-5 h-5 flex-shrink-0 ${isLiveSimulation ? "animate-pulse" : ""}`} />
              {isLiveSimulation && (
                <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
              )}
            </button>
          )}

          <div className="space-y-4">
            <Link href="/settings" passHref legacyBehavior>
              <a
                onClick={() => {
                  if (pathname !== "/settings") setIsNavigatingTo("Settings");
                }}
                className={`text-xs font-medium flex items-center transition-all duration-150 ${
                  shouldBeExpanded
                    ? `w-full text-left px-4 py-3 rounded-xl gap-3 border border-transparent ${activeTab === "Settings" ? "bg-[#792CA2] text-white hover:bg-[#9A4DCC] shadow-md" : "text-gray-400 hover:text-white hover:bg-[#792CA2]/25"}`
                    : `w-11 h-11 rounded-xl mx-auto justify-center active:translate-y-[2px] ${activeTab === "Settings" ? "bg-[#792CA2] text-white shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.4)] border border-[#9A4DCC]/30" : "text-gray-400 bg-white/5 border border-gray-700/40 hover:text-white hover:bg-[#792CA2]/15 shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"}`
                }`}
              >
                {isNavigatingTo === "Settings" ? (
                  <svg className="animate-spin w-5 h-5 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : (
                  <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
                )}
                {shouldBeExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    Settings
                  </motion.span>
                )}
              </a>
            </Link>

            <button
              onClick={handleSignOut}
              className={`text-xs font-medium flex items-center transition-all duration-150 ${
                shouldBeExpanded
                  ? "w-full text-left px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 gap-3 border border-transparent"
                  : "w-11 h-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/25 border border-red-950/40 bg-red-950/10 mx-auto justify-center active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(239,68,68,0.1)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(239,68,68,0.15)] hover:shadow-[0_4px_0_#991b1b,0_4px_10px_rgba(239,68,68,0.25)] hover:border-red-500/30"
              }`}
            >
              <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
              {shouldBeExpanded && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="truncate"
                >
                  Sign Out
                </motion.span>
              )}
            </button>
          </div>
        </nav>
      )}
    </motion.aside>
  );
}
