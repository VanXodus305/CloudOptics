"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";


import ParticleBackground from "../dashboard/components/ParticleBackground";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import Footer from "../landing/components/Footer";
import RestrictedOverlay from "../components/common/RestrictedOverlay";
import { generatePDF } from "../../lib/reports/generatePDF";
import { generateXLSX } from "../../lib/reports/generateXLSX";


import MostlyUsedChart from "./components/MostlyUsedChart";
import TopCostChart from "./components/TopCostChart";
import CostResourceChart from "./components/CostResourceChart";
import UtilizationChart from "./components/UtilizationChart";

export const dynamic = "force-dynamic";

const KPI_DATA = [
  {
    label: "Total Resources",
    value: "142",
    change: "+12 this month",
    positive: true,
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
    ),
    gradient: "from-[#792CA2] to-[#9A4DCC]",
    shadow: "shadow-[#792CA2]/20",
  },
  {
    label: "Monthly Cost",
    value: "$18,420",
    change: "-3.4% vs last month",
    positive: true,
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-2.21 0-4 1.343-4 3s1.79 3 4 3 4 1.343 4 3-1.79 3-4 3m0-18v2m0 16v2" />
      </svg>
    ),
    gradient: "from-[#1F215D] to-[#3A3D8F]",
    shadow: "shadow-[#1F215D]/20",
  },
  {
    label: "Avg CPU Usage",
    value: "67.3%",
    change: "+5.1% vs yesterday",
    positive: false,
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18" />
      </svg>
    ),
    gradient: "from-[#5B21B6] to-[#7C3AED]",
    shadow: "shadow-[#5B21B6]/20",
  },
  {
    label: "Health Score",
    value: "98.6%",
    change: "All systems nominal",
    positive: true,
    icon: (
      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-[#059669] to-[#10B981]",
    shadow: "shadow-[#059669]/20",
  },
];

const ENVIRONMENTS = ["All", "Production", "Testing", "Development"];

export default function ResourcesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userName = session?.user?.name || "Admin User";
  const userImage = session?.user?.image || null;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  const [isTopFilterOpen, setIsTopFilterOpen] = useState(false);
  const [selectedEnvironment, setSelectedEnvironment] = useState("All");
  const [dashboardData, setDashboardData] = useState(null);
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Live Simulation 
  const [isLiveSimulation, setIsLiveSimulation] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("isLiveSimulation") === "true";
    setIsLiveSimulation(saved);
  }, []);

  const handleSetLiveSimulation = (val) => {
    setIsLiveSimulation(val);
    localStorage.setItem("isLiveSimulation", val ? "true" : "false");
  };

  // Poll for resources simulation updates when active
  useEffect(() => {
    if (!isLiveSimulation || status !== "authenticated") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/resources/dashboard?environment=${selectedEnvironment}`);
        if (res.ok) {
          const json = await res.json();
          setDashboardData(json);
        }
      } catch (err) {
        console.error("Simulation polling error:", err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveSimulation, status, selectedEnvironment]);

  const profileRef = useRef(null);
  const filterRef = useRef(null);

  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    );
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setIsTopFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (status === "unauthenticated" && !isSigningOut) {
      router.push("/auth/signin");
    }
  }, [status, isSigningOut, router]);

  useEffect(() => {
    if (status !== "authenticated") return;

    let active = true;
    async function fetchData() {
      setIsDataLoading(true);
      try {
        const res = await fetch(`/api/resources/dashboard?environment=${selectedEnvironment}`);
        if (!res.ok) throw new Error("Failed to fetch dashboard data");
        const json = await res.json();
        if (active) {
          setDashboardData(json);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) {
          setIsDataLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      active = false;
    };
  }, [status, selectedEnvironment]);

  const handleSignOut = () => {
    setIsProfileOpen(false);
    setIsSigningOut(true);
    setTimeout(() => {
      signOut({ callbackUrl: "/auth/signin" });
    }, 1500);
  };

  if (status === "loading" || (status === "unauthenticated" && !isSigningOut)) {
    return (
      <div className="min-h-screen bg-[#F9F7F7] dark:bg-[#080A1A] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden bg-[#F9F7F7] dark:bg-[#080A1A] text-[#111844] dark:text-[#F9F7F7] transition-colors duration-300 flex flex-col dashboard-layout">
      {/* Sign Out Transition Screen */}
      <AnimatePresence>
        {isSigningOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#111844]/80 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white"
          >
            <motion.div
              initial={{ scale: 0.9, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-center max-w-sm flex flex-col items-center shadow-2xl"
            >
              <div className="w-12 h-12 rounded-full border-4 border-[#DCCBFF] border-t-transparent animate-spin mb-4" />
              <h3 className="text-lg font-bold tracking-tight">Signing Out</h3>
              <p className="text-xs text-white/70 mt-2">
                Clearing session credentials and closing CloudOptics vault...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ParticleBackground />

      {/* Animated Background */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.15, 1], x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#792CA2]/10 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.2, 1], x: [0, -25, 0], y: [0, 25, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-[-200px] right-[-150px] w-[700px] h-[700px] rounded-full bg-[#DCCBFF]/15 blur-[130px]"
        />
        <motion.div
          animate={{ scale: [1, 1.1, 1], y: [0, -30, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 6 }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[#1F215D]/5 blur-[100px]"
        />
      </div>

      {/* Navigation Bar */}
      <Topbar
        userName={userName}
        userImage={userImage}
        currentDate={currentDate}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        handleSignOut={handleSignOut}
        profileRef={profileRef}
        session={session}
        onDownloadPDF={async () => generatePDF()}
        onDownloadXLSX={async () => generateXLSX()}
      />

      <div className="flex flex-grow w-full overflow-hidden relative">
        {/* Sidebar */}
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isLiveSimulation={isLiveSimulation}
          setIsLiveSimulation={handleSetLiveSimulation}
          handleSignOut={handleSignOut}
          setIsResourcesModalOpen={() => {}}
          setIsAlertsModalOpen={() => {}}
        />

        {/* Main content area */}
        <div className={`flex-grow flex flex-col h-full overflow-x-hidden relative p-4 pb-24 md:p-8 ${session?.user?.role === "Viewer" ? "overflow-y-hidden" : "overflow-y-auto"}`}>
          {session?.user?.role === "Viewer" && (
            <RestrictedOverlay pageName="Resource Center" />
          )}
              {/* Hero Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 relative z-50 max-w-[1600px] mx-auto w-full">
                <motion.div
                  initial={{ opacity: 0, y: -16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className="flex items-center gap-4"
                >
                  {/* Animated Icon */}
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 6 }}
                    transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    className="p-3.5 bg-gradient-to-br from-[#792CA2] to-[#9A4DCC] rounded-2xl shadow-xl shadow-[#792CA2]/30 flex items-center justify-center"
                  >
                    <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </motion.div>
                    <div>
                      <h1 className="inline-block text-[20px] xs:text-[22px] sm:text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] pb-2">
                        <span className="mr-2">Resource</span>
                        <span>Center</span>
                      </h1>
                    <p className="text-xs sm:text-sm text-gray-400 font-medium mt-0.5">
                      Real-time analytics · <span className="text-[#792CA2] font-semibold">{selectedEnvironment === "All" ? "All " : `${selectedEnvironment} `}</span>
                    </p>
                  </div>
                </motion.div>

                {/* Environment Filter */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="relative w-full sm:w-auto"
                  ref={filterRef}
                >
                  <div className="hidden sm:block">
                    <button
                      onClick={() => setIsTopFilterOpen(!isTopFilterOpen)}
                      className="bg-white/90 dark:bg-[#0F122B]/90 backdrop-blur-sm text-[#792CA2] dark:text-[#C084FC] px-5 py-2.5 rounded-2xl shadow-lg shadow-[#792CA2]/10 hover:shadow-xl hover:shadow-[#792CA2]/20 transition-all duration-300 flex items-center gap-2.5 border border-[#792CA2]/15 dark:border-[#C084FC]/25 font-semibold text-sm hover:-translate-y-0.5"
                    >
                      <span className="w-2 h-2 rounded-full bg-[#792CA2] dark:bg-[#C084FC] animate-pulse" />
                      {selectedEnvironment}
                      <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${isTopFilterOpen ? "rotate-180" : ""}`} />
                    </button>
                    <AnimatePresence>
                      {isTopFilterOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: -8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -8, scale: 0.96 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 bg-white/95 dark:!bg-slate-900 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100/80 dark:border-slate-800 z-[999] py-2 overflow-hidden"
                        >
                          {ENVIRONMENTS.map((env) => (
                            <button
                              key={env}
                              onClick={() => { setSelectedEnvironment(env); setIsTopFilterOpen(false); }}
                              className={`flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-xs font-semibold transition-all ${selectedEnvironment === env ? "text-[#792CA2] dark:text-[#C084FC] bg-[#792CA2]/8 dark:bg-[#C084FC]/15" : "text-gray-650 dark:text-slate-300 hover:bg-[#792CA2]/6 dark:hover:bg-slate-800/60 hover:text-[#792CA2] dark:hover:text-[#C084FC]"}`}
                            >
                              <span className={`w-1.5 h-1.5 rounded-full transition-colors ${selectedEnvironment === env ? "bg-[#792CA2] dark:bg-[#C084FC]" : "bg-gray-300 dark:bg-gray-600"}`} />
                              {env}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Horizontal Scroll Buttons for Mobile Responsiveness*/}
                  <div className="flex sm:hidden overflow-x-auto gap-2 pb-2 scrollbar-hide snap-x w-full">
                    {ENVIRONMENTS.map((env) => (
                      <button
                        key={env}
                        onClick={() => setSelectedEnvironment(env)}
                        className={`snap-start flex-shrink-0 whitespace-nowrap px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                          selectedEnvironment === env 
                            ? "bg-[#792CA2] text-white shadow-md shadow-[#792CA2]/30" 
                            : "bg-white/80 text-gray-600 border border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* CHARTS GRID  */}
              <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">

                {/* Top Chart */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                >
                  <TopCostChart
                    environment={selectedEnvironment}
                    costTrendsDaily={dashboardData?.costTrends?.daily || []}
                    costTrendsHourly={dashboardData?.costTrends?.hourly || []}
                    costTrendsLive={dashboardData?.costTrends?.live || []}
                    isLiveSimulation={isLiveSimulation}
                    resources={dashboardData?.resources || []}
                    isLoading={isDataLoading}
                  />
                </motion.div>

                {/* Middle Grid — 2 columns */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
                    className="lg:col-span-5 flex flex-col h-full"
                  >
                    <MostlyUsedChart
                      environment={selectedEnvironment}
                      serviceCounts={dashboardData?.serviceCounts || []}
                      resources={dashboardData?.resources || []}
                      isLoading={isDataLoading}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                    className="lg:col-span-7 flex flex-col h-full"
                  >
                    <CostResourceChart
                      environment={selectedEnvironment}
                      resources={dashboardData?.resources || []}
                      costTrendsDaily={dashboardData?.costTrends?.daily || []}
                      costTrendsHourly={dashboardData?.costTrends?.hourly || []}
                      isLoading={isDataLoading}
                    />
                  </motion.div>
                </div>

                {/* Bottom Chart — full width */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
                >
                  <UtilizationChart
                    environment={selectedEnvironment}
                    resources={dashboardData?.resources || []}
                    isLoading={isDataLoading}
                  />
                </motion.div>
              </div>

          <div className="mt-12 hidden md:block -mx-4 md:-mx-8 -mb-4 md:-mb-8">
            <Footer reduced={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
