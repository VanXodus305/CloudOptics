"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, FunnelIcon } from "@heroicons/react/24/outline";

// Shared Components
import ParticleBackground from "../dashboard/components/ParticleBackground";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import Footer from "../landing/components/Footer";

// Resources Components
import MostlyUsedChart from "./components/MostlyUsedChart";
import TimeResourceChart from "./components/TimeResourceChart";
import CostResourceChart from "./components/CostResourceChart";
import UtilizationChart from "./components/UtilizationChart";

export const dynamic = "force-dynamic";

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
  const [selectedDepartment, setSelectedDepartment] = useState("Production");

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
      <div className="min-h-screen bg-[#F9F7F7] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="h-screen relative overflow-hidden bg-[#F9F7F7] text-[#111844] transition-colors duration-300 flex flex-col">
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
        hideReportButton={true}
      />

      <div className="flex flex-grow w-full overflow-hidden relative">
        {/* SIDEBAR */}
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isLiveSimulation={false}
          setIsLiveSimulation={() => {}}
          handleSignOut={handleSignOut}
          setIsResourcesModalOpen={() => {}}
          setIsAlertsModalOpen={() => {}}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow flex flex-col h-full overflow-y-auto overflow-x-hidden relative p-4 md:p-8">
          <div className="flex justify-end items-center mb-6 relative z-50">

            <div className="relative">
              <button 
                onClick={() => setIsTopFilterOpen(!isTopFilterOpen)}
                className="bg-white text-[#792CA2] p-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center border border-gray-100"
              >
                <ChevronDownIcon className="w-5 h-5" />
              </button>
              {isTopFilterOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 z-[999] py-2 overflow-hidden">
                  {["Production", "Staging", "Development", "Management", "Finance"].map((dept) => (
                    <button 
                      key={dept}
                      onClick={() => {
                        setSelectedDepartment(dept);
                        setIsTopFilterOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2.5 text-xs font-semibold hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors ${selectedDepartment === dept ? "text-[#792CA2] bg-[#792CA2]/5" : "text-gray-700"}`}
                    >
                      {dept}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
            {/* Top Chart (Span full width) */}
            <MostlyUsedChart department={selectedDepartment} />

            {/* Middle Grid (2 columns on large screens) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TimeResourceChart department={selectedDepartment} />
              <CostResourceChart department={selectedDepartment} />
            </div>

            {/* Bottom Chart (Span full width) */}
            <UtilizationChart department={selectedDepartment} />
          </div>
          
          <div className="mt-12 hidden md:block">
            <Footer reduced={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
