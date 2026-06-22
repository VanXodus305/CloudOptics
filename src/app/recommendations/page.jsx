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

// Recommendations Components
import TotalInsights from "./components/TotalInsights";
import AiSummary from "./components/AiSummary";
import CategoryTabs from "./components/CategoryTabs";
import RecommendationsList from "./components/RecommendationsList";

export const dynamic = "force-dynamic";

export default function RecommendationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userName = session?.user?.name || "Admin User";
  const userImage = session?.user?.image || null;

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
  const [currentDate, setCurrentDate] = useState("");
  
  // State for recommendations category
  const [activeCategory, setActiveCategory] = useState("all");

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
          <div className="flex flex-col flex-grow max-w-[1600px] mx-auto w-full pt-4">
            {/* Top Row: Insights & AI Summary */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TotalInsights />
              <AiSummary />
            </div>

            {/* Bottom Section: Tabs & List */}
            <div className="flex flex-col flex-grow mt-6 gap-6">
              <div className="flex items-center justify-center relative z-50">
                <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              </div>
              
              <div className="flex flex-col flex-grow w-full">
                <RecommendationsList activeCategory={activeCategory} />
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
