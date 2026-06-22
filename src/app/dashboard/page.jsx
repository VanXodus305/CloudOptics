"use client";
import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import ParticleBackground from "./components/ParticleBackground";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import WelcomeBanner from "./components/WelcomeBanner";
import KPICards from "./components/KPICards";
import CostTrendsChart from "./components/CostTrendsChart";
import CostDistributionChart from "./components/CostDistributionChart";
import ResourcesTable from "./components/ResourcesTable";
import AlertsTable from "./components/AlertsTable";
import Modals from "./components/Modals";
import Footer from "../landing/components/Footer";
import { generatePDF }  from "../../lib/reports/generatePDF";
import { generateXLSX } from "../../lib/reports/generateXLSX";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const userName = session?.user?.name || "Admin User";
  const userImage = session?.user?.image || null;

  // Dropdown & Hover states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Current Date
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    setCurrentDate(
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    );
  }, []);

  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const profileRef = useRef(null);

  // Clipboard copy state helper
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (idText) => {
    navigator.clipboard.writeText(idText);
    setCopiedId(idText);
    setTimeout(() => setCopiedId(null), 1000);
  };

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

  const handleDownloadPDF = async () => {
    await generatePDF({
      summaryData,
      kpiTrends,
      donutData,
      donutFilter,
      resourcesData,
      formattedAlerts,
      currentChartData,
      chartTimeframe,
    });
  };

  const handleDownloadXLSX = async () => {
    await generateXLSX({
      summaryData,
      kpiTrends,
      donutData,
      donutFilter,
      resourcesData,
      formattedAlerts,
      currentChartData,
      chartTimeframe,
      trendsData,
    });
  };

  // Cost Timeframes & Donut Resource filter state
  const [chartTimeframe, setChartTimeframe] = useState("Monthly");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [donutFilter, setDonutFilter] = useState("All");
  const [donutHoveredSegment, setDonutHoveredSegment] = useState(null);
  const [donutSelectedSegment, setDonutSelectedSegment] = useState(null);

  // Simulation State
  const [isLiveSimulation, setIsLiveSimulation] = useState(false);

  // Database-backed states
  const [summaryData, setSummaryData] = useState(null);
  const [trendsData, setTrendsData] = useState([]);
  const [servicesData, setServicesData] = useState([]);
  const [resourcesData, setResourcesData] = useState([]);
  const [alertsData, setAlertsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Client-side cache and request coordinator
  const cacheRef = useRef({});
  const currentRequestFilter = useRef(null);

  // Fetch function for database data
  const fetchDashboardData = useCallback(async (filter, isPolling = false) => {
    currentRequestFilter.current = filter;

    // Check if we have cached data for instantaneous transition
    const cached = cacheRef.current[filter];
    if (cached && !isPolling) {
      setSummaryData(cached.summary);
      setTrendsData(cached.trends);
      setServicesData(cached.services);
      setResourcesData(cached.resources);
      setAlertsData(cached.alerts);
      setIsLoading(false);
    } else {
      if (!isPolling) setIsLoading(true);
    }

    try {
      const envParam = filter === "All" ? "" : `?environment=${filter}`;
      
      const [summaryRes, trendsRes, servicesRes, resourcesRes, alertsRes] = await Promise.all([
        fetch(`/api/dashboard/summary${envParam}`),
        fetch(`/api/dashboard/trends${envParam}`),
        fetch(`/api/dashboard/services${envParam}`),
        fetch(`/api/resources${envParam}`),
        fetch(`/api/optimization/alerts${envParam}`)
      ]);

      if (!summaryRes.ok || !trendsRes.ok || !servicesRes.ok || !resourcesRes.ok || !alertsRes.ok) {
        throw new Error("One or more dashboard API requests failed");
      }

      // Check if this response belongs to the current selected filter
      if (currentRequestFilter.current !== filter) {
        return;
      }

      const [summaryJson, trendsJson, servicesJson, resourcesJson, alertsJson] = await Promise.all([
        summaryRes.json(),
        trendsRes.json(),
        servicesRes.json(),
        resourcesRes.json(),
        alertsRes.json()
      ]);

      // Cache the result
      cacheRef.current[filter] = {
        summary: summaryJson,
        trends: trendsJson,
        services: servicesJson,
        resources: resourcesJson,
        alerts: alertsJson,
      };

      setSummaryData(summaryJson);
      setTrendsData(trendsJson);
      setServicesData(servicesJson);
      setResourcesData(resourcesJson);
      setAlertsData(alertsJson);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      if (currentRequestFilter.current === filter) {
        setError(err.message || "Failed to load dashboard data");
      }
    } finally {
      if (currentRequestFilter.current === filter && !isPolling) {
        setIsLoading(false);
      }
    }
  }, []);

  // Initial and environment change fetch
  useEffect(() => {
    if (status === "authenticated") {
      fetchDashboardData(donutFilter);
    }
  }, [status, donutFilter, fetchDashboardData]);

  // Polling simulation when toggle is active
  useEffect(() => {
    if (!isLiveSimulation || status !== "authenticated") return;

    const interval = setInterval(() => {
      fetchDashboardData(donutFilter, true);
    }, 5000);

    return () => clearInterval(interval);
  }, [isLiveSimulation, status, donutFilter, fetchDashboardData]);

  // Dynamic KPI trends calculation from trendsData
  const kpiTrends = useMemo(() => {
    if (!trendsData || trendsData.length === 0) {
      return {
        totalSpend: { trend: "0.0%", type: "neutral", label: "vs last week" },
        computeSpend: { trend: "0.0%", type: "neutral", label: "vs last week" },
        storageSpend: { trend: "0.0%", type: "neutral", label: "vs last week" },
        totalSavings: { trend: "0.0%", type: "positive", label: "of spend" },
      };
    }

    const calcTrend = (key) => {
      // Sum last 7 days (Week 4)
      const week4Slice = trendsData.slice(-7);
      const week4Sum = week4Slice.reduce((sum, t) => sum + (t[key] || 0), 0);

      // Sum previous 7 days (Week 3, days 15 to 21 ago)
      const week3Slice = trendsData.slice(-14, -7);
      const week3Sum = week3Slice.reduce((sum, t) => sum + (t[key] || 0), 0);

      if (week3Sum === 0) {
        return { trend: "0.0%", type: "neutral", label: "vs last week" };
      }

      const pctChange = ((week4Sum - week3Sum) / week3Sum) * 100;
      const type = pctChange < 0 ? "positive" : pctChange > 0 ? "negative" : "neutral";
      const sign = pctChange > 0 ? "+" : "";

      return {
        trend: `${sign}${pctChange.toFixed(1)}%`,
        type,
        label: "vs last week"
      };
    };

    // Calculate spend trends (lower is positive/green, higher is negative/red)
    const totalSpendTrend = calcTrend("spend");
    const computeSpendTrend = calcTrend("computeSpend");
    const storageSpendTrend = calcTrend("storageSpend");

    // For savings, we show percentage of total spend
    const totalSpendVal = summaryData?.totalSpend || 1;
    const savingsVal = summaryData?.totalSavings || 0;
    const savingsPct = totalSpendVal > 0 ? (savingsVal / totalSpendVal) * 100 : 0;

    return {
      totalSpend: totalSpendTrend,
      computeSpend: computeSpendTrend,
      storageSpend: storageSpendTrend,
      totalSavings: {
        trend: `${savingsPct.toFixed(1)}%`,
        type: "positive",
        label: "of spend"
      }
    };
  }, [trendsData, summaryData]);

  // Chart datasets compiled dynamically from trendsData
  const chartDatasets = useMemo(() => {
    if (!trendsData || trendsData.length === 0) {
      return { Monthly: [], Weekly: [], Daily: [] };
    }

    // Daily: Last 7 days from daily trends
    const daily = trendsData.slice(-7).map((t) => {
      const d = new Date(t.date);
      const label = d.toLocaleDateString("en-US", { weekday: "short" });
      return { label, value: Math.round(t.spend) };
    });

    // Weekly: Group last 28 days of trends into 4 weeks (7 days each)
    const weekly = [];
    const fmt = (dateStr) => {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    };
    for (let i = 0; i < 4; i++) {
      const startIndex = Math.max(0, trendsData.length - (4 - i) * 7);
      const endIndex = trendsData.length - (3 - i) * 7;
      const weekSlice = trendsData.slice(startIndex, endIndex);
      const weekSum = weekSlice.reduce((sum, t) => sum + t.spend, 0);
      const rangeLabel =
        weekSlice.length > 0
          ? `${fmt(weekSlice[0].date)}–${fmt(weekSlice[weekSlice.length - 1].date)}`
          : `Week ${i + 1}`;
      weekly.push({ label: rangeLabel, value: Math.round(weekSum) });
    }

    // Monthly: Group by calendar month name
    const monthlyMap = {};
    trendsData.forEach((t) => {
      const d = new Date(t.date);
      const monthName = d.toLocaleDateString("en-US", { month: "short" });
      monthlyMap[monthName] = (monthlyMap[monthName] || 0) + t.spend;
    });
    const monthly = Object.keys(monthlyMap).map((month) => ({
      label: month,
      value: Math.round(monthlyMap[month]),
    }));

    return { Monthly: monthly, Weekly: weekly, Daily: daily };
  }, [trendsData]);

  const currentChartData = useMemo(() => {
    return chartDatasets[chartTimeframe] || [];
  }, [chartDatasets, chartTimeframe]);

  const maxChartValue = useMemo(() => {
    if (currentChartData.length === 0) return 100;
    return Math.max(...currentChartData.map((d) => d.value)) * 1.1 || 100;
  }, [currentChartData]);

  // Donut data compiled dynamically from servicesData
  const donutData = useMemo(() => {
    if (!servicesData || servicesData.length === 0) {
      return [
        { name: "Compute (EC2)", value: 0, colorHex: "#792CA2" },
        { name: "Storage (S3)", value: 0, colorHex: "#9A4DCC" },
        { name: "Database (RDS)", value: 0, colorHex: "#1F215D" },
      ];
    }

    const total = servicesData.reduce((sum, item) => sum + item.value, 0);

    const nameMap = {
      EC2: "Compute (EC2)",
      S3: "Storage (S3)",
      RDS: "Database (RDS)",
    };

    const colorMap = {
      EC2: "#792CA2",
      S3: "#9A4DCC",
      RDS: "#1F215D",
    };

    return servicesData.map((item) => {
      const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
      return {
        name: nameMap[item.service] || item.service,
        value: percentage,
        rawCost: item.value,
        colorHex: colorMap[item.service] || "#DCCBFF",
      };
    });
  }, [servicesData]);

  const donutTotal = useMemo(() => {
    return donutData.reduce((acc, curr) => acc + curr.value, 0);
  }, [donutData]);

  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;

  // Alerts array formatted for view layout
  const formattedAlerts = useMemo(() => {
    if (!alertsData || alertsData.length === 0) return [];

    return alertsData.map((a, idx) => {
      let title = "";
      if (a.type === "Idle") title = "Underutilized Instance";
      else if (a.type === "Oversized") title = "Oversized Instance";
      else if (a.type === "UnattachedStorage") title = "Unattached Storage";
      else title = `${a.type} Alert`;

      return {
        id: `${a.resourceId}-${idx}`,
        title,
        desc: `${a.message} (Potential savings: $${Math.round(a.potentialSavings)}/mo)`,
        severity: a.severity,
        category: a.type === "UnattachedStorage" ? "Storage" : a.type === "Idle" || a.type === "Oversized" ? "Compute" : "Networking",
        status: "Active",
      };
    });
  }, [alertsData]);

  const alerts = useMemo(() => formattedAlerts.slice(0, 3), [formattedAlerts]);
  const expandedAlerts = formattedAlerts;

  // Top Cost Resources
  const resources = useMemo(() => {
    if (!resourcesData || resourcesData.length === 0) return [];
    const sorted = [...resourcesData].sort((a, b) => b.cost - a.cost);
    return sorted.slice(0, 3);
  }, [resourcesData]);

  const expandedResources = resourcesData;

  if (status === "loading" || (status === "unauthenticated" && !isSigningOut) || (isLoading && !summaryData)) {
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

      {/* CANVAS BACKGROUND DRAPES */}
      <ParticleBackground />

      {/* DYNAMIC BACKDROP BLOBS */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full bg-[#792CA2]/15 blur-[120px]" />
        <div className="absolute bottom-[-200px] right-[-150px] w-[600px] h-[600px] rounded-full bg-[#DCCBFF]/20 blur-[120px]" />
      </div>

      {/* NAVBAR (TOPBAR) */}
      <Topbar
        userName={userName}
        userImage={userImage}
        currentDate={currentDate}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        handleSignOut={handleSignOut}
        profileRef={profileRef}
        session={session}
        onDownloadPDF={handleDownloadPDF}
        onDownloadXLSX={handleDownloadXLSX}
      />

      {/* LOWER AREA (SIDEBAR + MAIN CONTENT AREA) */}
      <div className="flex flex-grow w-full overflow-hidden relative">
        {/* SIDEBAR */}
        <Sidebar
          isSidebarExpanded={isSidebarExpanded}
          setIsSidebarExpanded={setIsSidebarExpanded}
          isLiveSimulation={isLiveSimulation}
          setIsLiveSimulation={setIsLiveSimulation}
          handleSignOut={handleSignOut}
          setIsResourcesModalOpen={setIsResourcesModalOpen}
          setIsAlertsModalOpen={setIsAlertsModalOpen}
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow flex flex-col h-full overflow-y-auto overflow-x-hidden relative">
          {/* MAIN DASHBOARD CONTENT */}
          <main className="flex-grow p-4 md:p-6 pb-24 md:pb-8 relative">
            <div className="flex flex-col gap-6 max-w-[1600px] mx-auto w-full">
              {/* WELCOME BANNER */}
              <WelcomeBanner userName={userName} />

              {/* KPI CARDS */}
              <KPICards summaryData={summaryData} kpiTrends={kpiTrends} isLoading={isLoading} />

              {/* ANALYTICS SECTION */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Cost Trends Card */}
                <CostTrendsChart
                  chartTimeframe={chartTimeframe}
                  setChartTimeframe={setChartTimeframe}
                  currentChartData={currentChartData}
                  maxChartValue={maxChartValue}
                  hoveredBar={hoveredBar}
                  setHoveredBar={setHoveredBar}
                  isLoading={isLoading}
                />

                {/* Cost Distribution Card */}
                <CostDistributionChart
                  donutFilter={donutFilter}
                  setDonutFilter={setDonutFilter}
                  donutData={donutData}
                  donutTotal={donutTotal}
                  donutRadius={donutRadius}
                  donutCircumference={donutCircumference}
                  donutHoveredSegment={donutHoveredSegment}
                  setDonutHoveredSegment={setDonutHoveredSegment}
                  donutSelectedSegment={donutSelectedSegment}
                  setDonutSelectedSegment={setDonutSelectedSegment}
                  donutTotalSpend={summaryData?.totalSpend || 0}
                  isLoading={isLoading}
                />
              </div>

              {/* LOWER GRIDS: TABLES & ALERTS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Top Cost Resources Table */}
                <ResourcesTable
                  resources={resources}
                  copiedId={copiedId}
                  handleCopy={handleCopy}
                  setIsResourcesModalOpen={setIsResourcesModalOpen}
                  isLoading={isLoading}
                />

                {/* Optimization Alerts */}
                <AlertsTable
                  alerts={alerts}
                  setIsAlertsModalOpen={setIsAlertsModalOpen}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </main>

          <div className="hidden md:block">
            <Footer reduced={true} />
          </div>

          {/* VIEW ALL MODALS */}
          <Modals
            isResourcesModalOpen={isResourcesModalOpen}
            setIsResourcesModalOpen={setIsResourcesModalOpen}
            isAlertsModalOpen={isAlertsModalOpen}
            setIsAlertsModalOpen={setIsAlertsModalOpen}
            expandedResources={expandedResources}
            expandedAlerts={expandedAlerts}
            copiedId={copiedId}
            handleCopy={handleCopy}
          />
        </div>
      </div>
    </div>
  );
}
