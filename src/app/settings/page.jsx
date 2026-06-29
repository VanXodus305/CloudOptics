"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Shared Components
import ParticleBackground from "../dashboard/components/ParticleBackground";
import Sidebar from "../dashboard/components/Sidebar";
import Topbar from "../dashboard/components/Topbar";
import Footer from "../landing/components/Footer";

// Settings Components
import AdminAccountDetails from "./components/AdminAccountDetails";
import SettingsOptions from "./components/SettingsOptions";
import UserAccessManagement from "./components/UserAccessManagement";

export const dynamic = "force-dynamic";

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userName = session?.user?.name || "Admin User";
  const userImage = session?.user?.image || null;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  
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

  const isAdmin = session?.user?.role === "Admin";

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
          isLiveSimulation={false}
          setIsLiveSimulation={() => {}}
          handleSignOut={handleSignOut}
          setIsResourcesModalOpen={() => {}}
          setIsAlertsModalOpen={() => {}}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow flex flex-col h-full overflow-x-hidden relative p-4 md:p-8 overflow-y-auto">
          <div className="flex flex-col flex-grow max-w-[1600px] mx-auto w-full pb-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow pt-4">
              
              {/* Left Column (Profile details & Options) */}
              <div className="lg:col-span-4 flex flex-col h-full">
                <AdminAccountDetails />
                <SettingsOptions />
              </div>

              {/* Right Column (User Management or Restricted state) */}
              <div className="lg:col-span-8 flex flex-col h-full">
                <div className="flex-1 min-h-[400px]">
                  {isAdmin ? (
                    <UserAccessManagement />
                  ) : (
                    <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white dark:border-white/5 rounded-3xl p-8 md:p-12 text-center h-full flex flex-col items-center justify-center shadow-xl relative overflow-hidden min-h-[400px]">
                      {/* Glow */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
                      
                      <div className="w-16 h-16 bg-[#792CA2]/10 dark:bg-[#792CA2]/20 rounded-2xl flex items-center justify-center mb-6">
                        <svg className="w-8 h-8 text-[#792CA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-extrabold text-[#111844] dark:text-[#F9F7F7] tracking-tight">User Management Restricted</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm mt-3 leading-relaxed font-medium">
                        You are signed in as a Viewer. Managing user access levels, viewing permission logs, and sending team invitations are exclusive to Administrator accounts.
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
          
          <div className="mt-8 hidden md:block -mx-4 md:-mx-8 -mb-4 md:-mb-8">
            <Footer reduced={true} />
          </div>
        </div>
      </div>
    </div>
  );
}
