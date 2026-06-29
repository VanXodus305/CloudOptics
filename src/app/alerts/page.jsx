"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { BellAlertIcon } from "@heroicons/react/24/outline";

// Shared Components
import ParticleBackground from "../dashboard/components/ParticleBackground";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import Footer from "../landing/components/Footer";
import RestrictedOverlay from "../components/common/RestrictedOverlay";

// Alerts Components
import ActiveAlerts from "./components/ActiveAlerts";
import AlertHistory from "./components/AlertHistory";

export const dynamic = "force-dynamic";

export default function AlertsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userName = session?.user?.name || "Admin User";
  const userImage = session?.user?.image || null;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentDate, setCurrentDate] = useState("");

  // Live Simulation state
  const [isLiveSimulation, setIsLiveSimulation] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("isLiveSimulation") === "true";
    setIsLiveSimulation(saved);
  }, []);

  const handleSetLiveSimulation = (val) => {
    setIsLiveSimulation(val);
    localStorage.setItem("isLiveSimulation", val ? "true" : "false");
  };
  
  const profileRef = useRef(null);

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

  // Close dropdowns on click-away
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect to sign-in page if not authenticated
  useEffect(() => {
    if (status === "unauthenticated" && !isSigningOut) {
      router.push("/auth/signin");
    }
  }, [status, isSigningOut, router]);

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
      {/* SIGN OUT TRANSITION SCREEN */}
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

      {/* DYNAMIC BACKDROP BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#792CA2]/15 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-150px] w-[600px] h-[600px] rounded-full bg-[#DCCBFF]/20 blur-[120px]" />
      </div>

      {/* NAVBAR */}
      <Topbar
        userName={userName}
        userImage={userImage}
        currentDate={currentDate}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        handleSignOut={handleSignOut}
        profileRef={profileRef}
        session={session}
      />

      <div className="flex flex-grow w-full overflow-hidden relative">
        {/* SIDEBAR */}
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isLiveSimulation={isLiveSimulation}
          setIsLiveSimulation={handleSetLiveSimulation}
          handleSignOut={handleSignOut}
          setIsResourcesModalOpen={() => {}}
          setIsAlertsModalOpen={() => {}}
        />

        <div className={`flex-grow flex flex-col h-full overflow-x-hidden relative p-4 pb-28 md:p-8 md:pb-8 ${session?.user?.role === "Viewer" ? "overflow-y-hidden" : "overflow-y-auto"}`}>
          {session?.user?.role === "Viewer" && (
            <RestrictedOverlay pageName="Alert Center" />
          )}
          <div className="flex flex-col flex-grow max-w-[1600px] mx-auto w-full pt-4 gap-6">
            {/* Page Header */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex items-center gap-3 sm:gap-4 mb-2"
            >
              <motion.div 
                whileHover={{ scale: 1.1, rotate: 6 }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="p-3.5 bg-gradient-to-br from-[#792CA2] to-[#9A4DCC] rounded-2xl shadow-xl shadow-[#792CA2]/30 flex items-center justify-center"
              >
                <svg className="w-7 h-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </motion.div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC]">
                  Alerts Center
                </h1>
                <p className="text-sm text-gray-400 dark:text-gray-500 font-medium mt-0.5">
                  Monitor, investigate, and resolve active incidents in real-time
                </p>
              </div>
            </motion.div>
            <ActiveAlerts />
            <AlertHistory />
          </div>
          
          <div className="mt-8 hidden md:block -mx-4 md:-mx-8 -mb-4 md:-mb-8">
            <Footer reduced={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
