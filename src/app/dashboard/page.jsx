"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

// Sub-components
import ParticleBackground from "./components/ParticleBackground";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import WelcomeBanner from "./components/WelcomeBanner";
import PerformanceMetricsHeader from "./components/PerformanceMetricsHeader";
import KPICards from "./components/KPICards";
import CostTrendsChart from "./components/CostTrendsChart";
import CostDistributionChart from "./components/CostDistributionChart";
import ResourcesTable from "./components/ResourcesTable";
import AlertsTable from "./components/AlertsTable";
import Modals from "./components/Modals";
import Footer from "../landing/components/Footer";

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

  // Cost Timeframes & Donut Resource filter state
  const [chartTimeframe, setChartTimeframe] = useState("Monthly");
  const [hoveredBar, setHoveredBar] = useState(null);
  const [donutFilter, setDonutFilter] = useState("All");
  const [donutHoveredSegment, setDonutHoveredSegment] = useState(null);
  const [donutSelectedSegment, setDonutSelectedSegment] = useState(null);

  // Hardcoded chart data switcher
  const chartDatasets = {
    Monthly: [
      { label: "Jan", value: 12500 },
      { label: "Feb", value: 14200 },
      { label: "Mar", value: 13800 },
      { label: "Apr", value: 15100 },
      { label: "May", value: 16400 },
      { label: "Jun", value: 14800 },
    ],
    Weekly: [
      { label: "Week 1", value: 3200 },
      { label: "Week 2", value: 3800 },
      { label: "Week 3", value: 3500 },
      { label: "Week 4", value: 4392 },
    ],
    Daily: [
      { label: "Mon", value: 510 },
      { label: "Tue", value: 480 },
      { label: "Wed", value: 620 },
      { label: "Thu", value: 580 },
      { label: "Fri", value: 650 },
      { label: "Sat", value: 420 },
      { label: "Sun", value: 390 },
    ],
  };

  const [isLiveSimulation, setIsLiveSimulation] = useState(false);
  const [liveChartData, setLiveChartData] = useState(null);
  const [liveDonutData, setLiveDonutData] = useState(null);

  const currentChartData = useMemo(() => {
    if (isLiveSimulation && liveChartData) {
      return liveChartData[chartTimeframe];
    }
    return chartDatasets[chartTimeframe];
  }, [isLiveSimulation, liveChartData, chartTimeframe]);

  const maxChartValue = useMemo(() => {
    return Math.max(...currentChartData.map((d) => d.value)) * 1.1;
  }, [currentChartData]);

  // Donut data changes according to dropdown filter
  const donutDatasets = {
    All: [
      { name: "Compute (EC2)", value: 45, colorHex: "#792CA2" },
      { name: "Storage (S3)", value: 25, colorHex: "#9A4DCC" },
      { name: "Database (RDS)", value: 15, colorHex: "#1F215D" },
      { name: "Networking", value: 10, colorHex: "#111844" },
      { name: "Other Services", value: 5, colorHex: "#DCCBFF" },
    ],
    Production: [
      { name: "Compute (EC2)", value: 60, colorHex: "#792CA2" },
      { name: "Storage (S3)", value: 15, colorHex: "#9A4DCC" },
      { name: "Database (RDS)", value: 15, colorHex: "#1F215D" },
      { name: "Networking", value: 8, colorHex: "#111844" },
      { name: "Other Services", value: 2, colorHex: "#DCCBFF" },
    ],
    Staging: [
      { name: "Compute (EC2)", value: 40, colorHex: "#792CA2" },
      { name: "Storage (S3)", value: 30, colorHex: "#9A4DCC" },
      { name: "Database (RDS)", value: 12, colorHex: "#1F215D" },
      { name: "Networking", value: 12, colorHex: "#111844" },
      { name: "Other Services", value: 6, colorHex: "#DCCBFF" },
    ],
    Development: [
      { name: "Compute (EC2)", value: 30, colorHex: "#792CA2" },
      { name: "Storage (S3)", value: 35, colorHex: "#9A4DCC" },
      { name: "Database (RDS)", value: 10, colorHex: "#1F215D" },
      { name: "Networking", value: 15, colorHex: "#111844" },
      { name: "Other Services", value: 10, colorHex: "#DCCBFF" },
    ],
    Management: [
      { name: "Compute (EC2)", value: 15, colorHex: "#792CA2" },
      { name: "Storage (S3)", value: 25, colorHex: "#9A4DCC" },
      { name: "Database (RDS)", value: 12, colorHex: "#1F215D" },
      { name: "Networking", value: 17, colorHex: "#111844" },
      { name: "Other Services", value: 10, colorHex: "#DCCBFF" },
    ],
    Finance: [
      { name: "Compute (EC2)", value: 18, colorHex: "#792CA2" },
      { name: "Storage (S3)", value: 22, colorHex: "#9A4DCC" },
      { name: "Database (RDS)", value: 16, colorHex: "#1F215D" },
      { name: "Networking", value: 27, colorHex: "#111844" },
      { name: "Other Services", value: 40, colorHex: "#DCCBFF" },
    ],
  };

  // Live Simulation effect
  useEffect(() => {
    if (!isLiveSimulation) {
      setLiveChartData(null);
      setLiveDonutData(null);
      return;
    }

    setLiveChartData(JSON.parse(JSON.stringify(chartDatasets)));
    setLiveDonutData(JSON.parse(JSON.stringify(donutDatasets)));

    const interval = setInterval(() => {
      setLiveChartData((prev) => {
        if (!prev) return prev;
        const copy = JSON.parse(JSON.stringify(prev));
        Object.keys(copy).forEach((key) => {
          copy[key] = copy[key].map((item) => {
            const changePercent = 1 + (Math.random() * 0.1 - 0.05); // +/- 5%
            return {
              ...item,
              value: Math.max(10, Math.round(item.value * changePercent)),
            };
          });
        });
        return copy;
      });

      setLiveDonutData((prev) => {
        if (!prev) return prev;
        const copy = JSON.parse(JSON.stringify(prev));
        Object.keys(copy).forEach((key) => {
          copy[key] = copy[key].map((item) => {
            const changePercent = 1 + (Math.random() * 0.08 - 0.04); // +/- 4%
            return {
              ...item,
              value: Math.max(2, Math.round(item.value * changePercent)),
            };
          });
        });
        return copy;
      });
    }, 1500);

    return () => clearInterval(interval);
  }, [isLiveSimulation]);

  const donutData = useMemo(() => {
    if (isLiveSimulation && liveDonutData) {
      return liveDonutData[donutFilter];
    }
    return donutDatasets[donutFilter];
  }, [isLiveSimulation, liveDonutData, donutFilter]);

  const donutTotal = useMemo(() => {
    return donutData.reduce((acc, curr) => acc + curr.value, 0);
  }, [donutData]);

  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;

  // Alerts array with criteria-severity levels (Only 3 items shown in dashboard)
  const alerts = [
    {
      id: "a1",
      title: "Underutilized EC2 Instance",
      desc: "Instance i-09f482d8c3 has average CPU < 5%",
      savings: 180,
      severity: "Critical",
      category: "Compute",
      status: "Active",
    },
    {
      id: "a2",
      title: "Unattached EBS Volume found",
      desc: "Volume vol-028a49c has been unattached for 15 days",
      savings: 45,
      severity: "High",
      category: "Storage",
      status: "Active",
    },
    {
      id: "a3",
      title: "Idle Elastic IP detected",
      desc: "EIP 54.210.12.89 is unassociated with any instance",
      savings: 15,
      severity: "Low",
      category: "Networking",
      status: "Acknowledged",
    },
  ];

  const expandedAlerts = [
    {
      id: "a1",
      title: "Underutilized EC2 Instance",
      desc: "Instance i-09f482d8c3 has average CPU < 5%",
      savings: 180,
      severity: "Critical",
      category: "Compute",
      status: "Active",
    },
    {
      id: "a2",
      title: "Unattached EBS Volume found",
      desc: "Volume vol-028a49c has been unattached for 15 days",
      savings: 45,
      severity: "High",
      category: "Storage",
      status: "Active",
    },
    {
      id: "a3",
      title: "Idle Elastic IP detected",
      desc: "EIP 54.210.12.89 is unassociated with any instance",
      savings: 15,
      severity: "Low",
      category: "Networking",
      status: "Acknowledged",
    },
    {
      id: "a4",
      title: "Unused Redshift Cluster",
      desc: "Cluster dw-staging has had no connections for 30 days",
      savings: 350,
      severity: "Critical",
      category: "Database",
      status: "Active",
    },
    {
      id: "a5",
      title: "Unused Route53 Hosted Zone",
      desc: "Hosted zone sandbox.dev has had no queries for 3 months",
      savings: 10,
      severity: "Low",
      category: "Networking",
      status: "Resolved",
    },
    {
      id: "a6",
      title: "Idle Load Balancer",
      desc: "ELB app-lb-dev has had no traffic for 10 days",
      savings: 25,
      severity: "Medium",
      category: "Networking",
      status: "Active",
    },
  ];

  // Resources list with regions (Only 3 items shown in dashboard)
  const resources = [
    {
      id: "1",
      name: "i-09f482d8c3",
      service: "EC2",
      cost: 1420.5,
      status: "Running",
      region: "us-east-1",
      environment: "Production",
    },
    {
      id: "2",
      name: "s3-archive-media",
      service: "S3",
      cost: 980.2,
      status: "Active",
      region: "us-west-2",
      environment: "Production",
    },
    {
      id: "3",
      name: "db-prod-replica",
      service: "RDS",
      cost: 850.0,
      status: "Running",
      region: "eu-west-1",
      environment: "Staging",
    },
  ];

  const expandedResources = [
    {
      id: "1",
      name: "i-09f482d8c3",
      service: "EC2",
      cost: 1420.5,
      status: "Running",
      region: "us-east-1",
      environment: "Production",
    },
    {
      id: "2",
      name: "s3-archive-media",
      service: "S3",
      cost: 980.2,
      status: "Active",
      region: "us-west-2",
      environment: "Production",
    },
    {
      id: "3",
      name: "i-04f811a2d4",
      service: "EC2",
      cost: 620.0,
      status: "Stopped",
      region: "us-east-1",
      environment: "Development",
    },
    {
      id: "4",
      name: "s3-backup-logs",
      service: "S3",
      cost: 95.1,
      status: "Active",
      region: "ap-southeast-1",
      environment: "Staging",
    },
    {
      id: "5",
      name: "i-09ab723cd8",
      service: "EC2",
      cost: 310.0,
      status: "Running",
      region: "us-east-1",
      environment: "Development",
    },
    {
      id: "6",
      name: "s3-billing-exports",
      service: "S3",
      cost: 45.0,
      status: "Active",
      region: "us-east-1",
      environment: "Management",
    },
  ];

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
        />

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow flex flex-col h-full overflow-y-auto overflow-x-hidden relative">
          {/* MAIN DASHBOARD CONTENT */}
          <main className="flex-grow p-8 relative">
            {/* WELCOME BANNER */}
            <WelcomeBanner userName={userName} />

            {/* PERFORMANCE METRICS HEADER */}
            <PerformanceMetricsHeader />

            {/* KPI CARDS */}
            <KPICards />

            {/* ANALYTICS SECTION */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
              {/* Cost Trends Card */}
              <CostTrendsChart
                chartTimeframe={chartTimeframe}
                setChartTimeframe={setChartTimeframe}
                currentChartData={currentChartData}
                maxChartValue={maxChartValue}
                hoveredBar={hoveredBar}
                setHoveredBar={setHoveredBar}
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
              />
            </div>

            {/* LOWER GRIDS: TABLES & ALERTS */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Top Cost Resources Table */}
              <ResourcesTable
                resources={resources}
                copiedId={copiedId}
                handleCopy={handleCopy}
                setIsResourcesModalOpen={setIsResourcesModalOpen}
              />

              {/* Optimization Alerts */}
              <AlertsTable
                alerts={alerts}
                setIsAlertsModalOpen={setIsAlertsModalOpen}
              />
            </div>
          </main>

          <Footer reduced={true} />

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
