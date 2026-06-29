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
import RestrictedOverlay from "../components/common/RestrictedOverlay";

// Recommendations Components
import RecommendationChat from "./components/RecommendationChat";
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

  // State for recommendations data & category
  const [activeCategory, setActiveCategory] = useState("all");
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [error, setError] = useState(null);

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

  const fetchRecommendations = async (regenerate = false) => {
    if (regenerate) {
      setIsRegenerating(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const url = regenerate ? "/api/recommendations?regenerate=true" : "/api/recommendations";
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error("Failed to fetch recommendations");
      }
      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("Error loading recommendations:", err);
      setError(err.message || "Failed to load recommendations");
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

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

  // Fetch initial recommendations when authenticated
  useEffect(() => {
    if (status === "authenticated") {
      fetchRecommendations();
    }
  }, [status]);

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
          setIsResourcesModalOpen={() => { }}
          setIsAlertsModalOpen={() => { }}
        />

        {/* MAIN CONTENT AREA */}
        <div className={`flex-grow flex flex-col h-full overflow-x-hidden relative p-4 pb-24 md:p-8 md:pb-8 ${session?.user?.role === "Viewer" ? "overflow-y-hidden" : "overflow-y-auto"}`}>
          {session?.user?.role === "Viewer" && (
            <RestrictedOverlay pageName="AI Recommendations" />
          )}
          <div className="flex flex-col flex-grow max-w-[1600px] mx-auto w-full pt-4">
            {error && (
              <div className="mb-6 p-4 bg-red-100 border border-red-200 text-red-700 rounded-2xl text-xs font-semibold flex justify-between items-center shadow-sm">
                <span>Error generating AI insights: {error}</span>
                <button onClick={() => fetchRecommendations(false)} className="px-3 py-1 bg-red-200 hover:bg-red-300 rounded-lg transition-all">Retry</button>
              </div>
            )}

            {/* Top Row: AI Summary & Chatbot */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              <div className="lg:col-span-7 flex flex-col">
                <AiSummary
                  aiSummary={data?.aiSummary}
                  isLoading={isLoading}
                  isRegenerating={isRegenerating}
                  onRegenerate={() => fetchRecommendations(true)}
                  totalActions={data?.totalActionsCount}
                  totalSavings={data?.totalPotentialSavings}
                />
              </div>
              <div className="lg:col-span-5 flex flex-col">
                <RecommendationChat />
              </div>
            </div>

            {/* Bottom Section: Tabs & List */}
            <div className="flex flex-col flex-grow mt-6 gap-6">
              <div className="flex items-center justify-center relative">
                <CategoryTabs activeCategory={activeCategory} setActiveCategory={setActiveCategory} />
              </div>

              <div className="flex flex-col flex-grow w-full">
                <RecommendationsList
                  recommendations={data?.recommendations || []}
                  activeCategory={activeCategory}
                  isLoading={isLoading || isRegenerating}
                />
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
