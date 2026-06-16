"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Footer from "../components/home/Footer";
import {
  BellAlertIcon,
  ArrowRightOnRectangleIcon,
  Squares2X2Icon,
  CpuChipIcon,
  LightBulbIcon,
  Cog6ToothIcon,
  ArrowUpRightIcon,
  CheckIcon,
  XMarkIcon,
  ArrowDownTrayIcon,
  InformationCircleIcon,
  DocumentDuplicateIcon,
  UserIcon,
  Bars3Icon,
  CalendarIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import CountUp from "react-countup";
function ParticleBackground() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let animationFrameId;
    let particles = [];
    const maxParticles = 40;

    const isMobile = window.innerWidth < 768;

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();

        // draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = ((150 - dist) / 150) * 0.05;
            ctx.strokeStyle = `rgba(121, 44, 162, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
    };

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      if (window.innerWidth < 768) {
        drawStatic();
      }
    };
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.4; // slow drift
        this.vy = (Math.random() - 0.5) * 0.4;
        this.radius = Math.random() * 2 + 1;
        this.color = "rgba(121, 44, 162, 0.12)"; // matching landing page purple theme
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        // draw connections
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = ((150 - dist) / 150) * 0.05;
            ctx.strokeStyle = `rgba(121, 44, 162, ${opacity})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (isMobile) {
      drawStatic();
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  // Access actual next-auth session context
  const { data: session, status } = useSession();
  const router = useRouter();
  const userName = session?.user?.name || "Admin User";
  const userImage = session?.user?.image || null;

  // Dropdown & Hover states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isBellHovered, setIsBellHovered] = useState(false);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  // Current Date 
  const [currentDate, setCurrentDate] = useState("");
  useEffect(() => {
    setCurrentDate(new Date().toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric"
    }));
  }, []);
  const [isResourcesModalOpen, setIsResourcesModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationsRef = useRef(null);

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
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect to sign-in page if not authenticated (and not in the process of signing out)
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
    return Math.max(...currentChartData.map(d => d.value)) * 1.1;
  }, [currentChartData]);

  // Donut data changes according to dropdown filter (Hardcoded splits)
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
    { id: "a1", title: "Underutilized EC2 Instance", desc: "Instance i-09f482d8c3 has average CPU < 5%", savings: 180, severity: "Critical", category: "Compute", status: "Active" },
    { id: "a2", title: "Unattached EBS Volume found", desc: "Volume vol-028a49c has been unattached for 15 days", savings: 45, severity: "High", category: "Storage", status: "Active" },
    { id: "a3", title: "Idle Elastic IP detected", desc: "EIP 54.210.12.89 is unassociated with any instance", savings: 15, severity: "Low", category: "Networking", status: "Acknowledged" }
  ];

  const expandedAlerts = [
    { id: "a1", title: "Underutilized EC2 Instance", desc: "Instance i-09f482d8c3 has average CPU < 5%", savings: 180, severity: "Critical", category: "Compute", status: "Active" },
    { id: "a2", title: "Unattached EBS Volume found", desc: "Volume vol-028a49c has been unattached for 15 days", savings: 45, severity: "High", category: "Storage", status: "Active" },
    { id: "a3", title: "Idle Elastic IP detected", desc: "EIP 54.210.12.89 is unassociated with any instance", savings: 15, severity: "Low", category: "Networking", status: "Acknowledged" },
    { id: "a4", title: "Unused Redshift Cluster", desc: "Cluster dw-staging has had no connections for 30 days", savings: 350, severity: "Critical", category: "Database", status: "Active" },
    { id: "a5", title: "Unused Route53 Hosted Zone", desc: "Hosted zone sandbox.dev has had no queries for 3 months", savings: 10, severity: "Low", category: "Networking", status: "Resolved" },
    { id: "a6", title: "Idle Load Balancer", desc: "ELB app-lb-dev has had no traffic for 10 days", savings: 25, severity: "Medium", category: "Networking", status: "Active" },
  ];

  // Resources list with regions (Only 3 items shown in dashboard)
  const resources = [
    { id: "1", name: "i-09f482d8c3", service: "EC2", cost: 1420.50, status: "Running", region: "us-east-1", environment: "Production" },
    { id: "2", name: "s3-archive-media", service: "S3", cost: 980.20, status: "Active", region: "us-west-2", environment: "Production" },
    { id: "3", name: "db-prod-replica", service: "RDS", cost: 850.00, status: "Running", region: "eu-west-1", environment: "Staging" }
  ];

  const expandedResources = [
    { id: "1", name: "i-09f482d8c3", service: "EC2", cost: 1420.50, status: "Running", region: "us-east-1", environment: "Production" },
    { id: "2", name: "s3-archive-media", service: "S3", cost: 980.20, status: "Active", region: "us-west-2", environment: "Production" },
    { id: "3", name: "i-04f811a2d4", service: "EC2", cost: 620.00, status: "Stopped", region: "us-east-1", environment: "Development" },
    { id: "4", name: "s3-backup-logs", service: "S3", cost: 95.10, status: "Active", region: "ap-southeast-1", environment: "Staging" },
    { id: "5", name: "i-09ab723cd8", service: "EC2", cost: 310.00, status: "Running", region: "us-east-1", environment: "Development" },
    { id: "6", name: "s3-billing-exports", service: "S3", cost: 45.00, status: "Active", region: "us-east-1", environment: "Management" },
   
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
              <p className="text-xs text-white/70 mt-2">Clearing session credentials and closing CloudOptics vault...</p>
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
      <div className="px-8 pt-4 pb-2 w-full flex-shrink-0 z-50">
        <header className="h-16 w-full bg-white/60 backdrop-blur-xl border border-white/30 rounded-full flex items-center justify-between px-8 shadow-[0_8px_30px_rgba(0,0,0,0.03)] transition-all duration-500">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <img
                src="/logo.png"
                alt="Logo"
                className="h-8 object-contain cursor-pointer"
                onClick={() => router.push("/dashboard")}
              />
            </div>
            
            {/* Go Back to Home Tab */}
            <button
              onClick={() => router.push("/")}
              className="text-xs font-bold text-gray-500 hover:text-[#792CA2] transition-colors flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-gray-100/50"
            >
              <HomeIcon className="w-4 h-4 text-gray-400" />
              <span>Home</span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            {/* Current Date Badge */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-bold text-gray-500 shadow-sm whitespace-nowrap">
              <CalendarIcon className="w-4 h-4 text-[#792CA2]" />
              <span>{currentDate}</span>
            </div>

            {/* Download Symbol in Report Button */}
            <button
              className="bg-gradient-to-r from-[#792CA2] to-[#9A4DCC] text-white text-xs px-4 py-2.5 rounded-xl hover:scale-105 active:scale-95 transition-all shadow-sm font-semibold flex items-center gap-2"
            >
              <span>Report</span>
              <ArrowDownTrayIcon className="w-4 h-4 text-white" />
            </button>

            {/* User Image Logo in Navbar */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center focus:outline-none"
              >
                {userImage ? (
                  <img
                    src={userImage}
                    alt={userName}
                    className="w-10 h-10 rounded-full border border-gray-200 shadow-md object-cover hover:scale-105 active:scale-95 transition-transform"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#792CA2] to-[#DCCBFF] p-0.5 shadow-md active:scale-95 transition-transform hover:brightness-105 flex items-center justify-center">
                    <div className="w-full h-full bg-white rounded-full flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-[#792CA2]" />
                    </div>
                  </div>
                )}
              </button>

              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-52 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-xl border border-gray-100 p-2 z-[999] text-left"
                  >
                    <div className="p-2.5 border-b border-gray-100">
                      <p className="font-bold text-xs text-[#111844] truncate">{userName}</p>
                      <p className="text-[10px] text-gray-400 truncate">{session?.user?.email || "alex.carter@cloudoptics.io"}</p>
                      <span className="inline-block text-[8px] font-bold px-1.5 py-0.5 rounded-full mt-1.5 bg-[#792CA2] text-white">
                        Google Session Active
                      </span>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left text-xs px-2.5 py-2 rounded-xl hover:bg-red-50 text-red-600 transition-colors flex items-center gap-2 font-medium"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>
      </div>

      {/* LOWER AREA (SIDEBAR + MAIN CONTENT AREA) */}
      <div className="flex flex-grow w-full overflow-hidden relative">

        {/* SIDEBAR */}
        <motion.aside
          animate={{ width: isSidebarExpanded ? 240 : 76 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="flex-shrink-0 h-full bg-[#111844] text-white p-5 flex flex-col overflow-y-auto z-40 border-r border-[#1F215D]/20 rounded-tr-2xl"
        >
          <div className="flex items-center justify-between mb-8">
            {isSidebarExpanded && (
              <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="font-semibold text-lg tracking-wide text-gray-200 uppercase text-xs font-bold"
              >
                Navigation
              </motion.h2>
            )}
            <button
              onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
              className={`p-1.5 rounded-lg hover:bg-white/10 text-white transition-colors focus:outline-none ${!isSidebarExpanded ? "mx-auto" : ""}`}
              title={isSidebarExpanded ? "Collapse Menu" : "Expand Menu"}
            >
              <Bars3Icon className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-grow flex flex-col justify-between pb-12">
            <div className="space-y-4">
              <button
                className={`text-xs font-semibold text-white relative flex items-center transition-all duration-150 ${
                  isSidebarExpanded
                    ? "w-full text-left px-4 py-3 rounded-xl bg-[#792CA2] gap-3 shadow-md hover:bg-[#9A4DCC]"
                    : "w-11 h-11 rounded-xl bg-[#792CA2] mx-auto justify-center hover:brightness-110 active:translate-y-[2px] active:shadow-[0_2px_0_#5c1f7e,0_2px_6px_rgba(121,44,162,0.3)] shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.4)] border border-[#9A4DCC]/30"
                }`}
              >
                <Squares2X2Icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    Dashboard
                  </motion.span>
                )}
              </button>

              {[
                { name: "Resources", icon: CpuChipIcon },
                { name: "Recommendations", icon: LightBulbIcon },
                { name: "Alerts", icon: BellAlertIcon },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    className={`text-xs transition-all duration-150 font-medium flex items-center ${
                      isSidebarExpanded
                        ? "w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/25 gap-3"
                        : "w-11 h-11 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/15 border border-gray-700/40 bg-white/5 mx-auto justify-center active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(0,0,0,0.2)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"
                    }`}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {isSidebarExpanded && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="truncate"
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Simulation Toggle */}
            <div className={`transition-all duration-300 ${
              isSidebarExpanded
                ? "py-3 px-4 bg-[#792CA2]/10 border border-[#792CA2]/25 rounded-xl my-4 flex flex-col items-stretch"
                : "w-11 h-11 rounded-xl bg-white/5 border border-gray-700/40 mx-auto my-4 flex items-center justify-center shadow-[0_3px_0_rgba(0,0,0,0.4),0_4px_8px_rgba(0,0,0,0.2)]"
            }`}>
              <div className={`flex items-center justify-between w-full ${isSidebarExpanded ? "" : "justify-center"}`}>
                {isSidebarExpanded && (
                  <div className="flex flex-col">
                    <span className="text-[9px] text-[#DCCBFF] font-bold uppercase tracking-wider">Simulation</span>
                  </div>
                )}
                <button
                  onClick={() => setIsLiveSimulation(!isLiveSimulation)}
                  className={`rounded-full p-0.5 transition-colors duration-300 focus:outline-none flex-shrink-0 ${
                    isSidebarExpanded ? "w-9 h-5" : "w-8 h-4.5"
                  } ${
                    isLiveSimulation ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-gray-600"
                  }`}
                >
                  <motion.div
                    layout
                    className={`${isSidebarExpanded ? "w-4 h-4" : "w-3 h-3"} bg-white rounded-full shadow-md`}
                    animate={{ x: isLiveSimulation ? (isSidebarExpanded ? 16 : 14) : 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                </button>
              </div>
              {isLiveSimulation && isSidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="flex items-center gap-1.5 mt-1.5 w-full justify-start animate-pulse"
                >
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                  </span>
                </motion.div>
              )}
            </div>

            <div className="space-y-4">
              <button
                className={`text-xs font-medium flex items-center transition-all duration-150 ${
                  isSidebarExpanded
                    ? "w-full text-left px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/25 gap-3"
                    : "w-11 h-11 rounded-xl text-gray-400 hover:text-white hover:bg-[#792CA2]/15 border border-gray-700/40 bg-white/5 mx-auto justify-center active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(0,0,0,0.2)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(0,0,0,0.3)] hover:shadow-[0_4px_0_#5c1f7e,0_4px_10px_rgba(121,44,162,0.25)] hover:border-[#9A4DCC]/20"
                }`}
              >
                <Cog6ToothIcon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    Settings
                  </motion.span>
                )}
              </button>

              <button
                onClick={handleSignOut}
                className={`text-xs font-medium flex items-center transition-all duration-150 ${
                  isSidebarExpanded
                    ? "w-full text-left px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/20 gap-3"
                    : "w-11 h-11 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-950/25 border border-red-950/40 bg-red-950/10 mx-auto justify-center active:translate-y-[2px] active:shadow-[0_2px_0_#0d1235,0_2px_6px_rgba(239,68,68,0.1)] shadow-[0_4px_0_#0d1235,0_4px_10px_rgba(239,68,68,0.15)] hover:shadow-[0_4px_0_#991b1b,0_4px_10px_rgba(239,68,68,0.25)] hover:border-red-500/30"
                }`}
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 flex-shrink-0" />
                {isSidebarExpanded && (
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
        </motion.aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-grow flex flex-col h-full overflow-y-auto overflow-x-hidden relative">
          {/* MAIN DASHBOARD CONTENT */}
          <main className="flex-grow p-8 relative">

          {/* WELCOME BANNER (Dynamic Background & Orbital Animation) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="rounded-3xl p-8 mb-8 bg-gradient-to-r from-[#792CA2] via-[#9A4DCC] to-[#1F215D] text-white shadow-xl relative overflow-hidden"
          >
            {/* Custom Interactive SVG Background Pattern */}
            <div className="absolute inset-0 opacity-15 pointer-events-none">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="banner-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                    <circle cx="2" cy="2" r="1.5" fill="#fff" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#banner-dots)" />
                <path d="M-100 80 C 150 -20, 200 130, 500 60 C 800 -10, 850 130, 1200 80" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
                <path d="M-50 110 C 200 20, 150 150, 600 80 C 900 10, 800 160, 1250 100" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="1.5" />
              </svg>
            </div>

            {/* Glowing Orbital graphics filling the empty right banner spot */}
            <div className="absolute right-14 top-1/2 -translate-y-1/2 w-28 h-28 hidden md:block pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border border-dashed border-white/20 flex items-center justify-center"
              >
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 9, repeat: Infinity, ease: "linear" }}
                  className="w-18 h-18 rounded-full border border-dotted border-white/40 flex items-center justify-center"
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#DCCBFF] to-white/40 blur-[2px]"
                  />
                </motion.div>
              </motion.div>
              <div className="absolute inset-5 rounded-full bg-white/5 blur-md animate-pulse" />
            </div>

            <div className="relative z-10">
              <h2 className="text-2xl font-bold">Welcome, {userName} </h2>
              <p className="mt-2 text-sm opacity-90 max-w-xl leading-relaxed">
                Monitor cloud spending, identify optimization opportunities, and reduce unnecessary costs.
              </p>
            </div>
          </motion.div>

          <div className="mb-6 bg-gradient-to-r from-white/80 via-[#792CA2]/5 to-white/40 backdrop-blur-xl rounded-2xl p-5 border border-white/60 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-1.5 h-8 bg-gradient-to-b from-[#792CA2] to-[#1F215D] rounded-full mr-3.5 shadow-md shadow-[#792CA2]/20" />
              <div className="flex flex-col">
                <h2 className="text-xl font-black bg-gradient-to-r from-[#111844] via-[#792CA2] to-[#1F215D] bg-clip-text text-transparent tracking-tight leading-none ">
                  Performance&nbsp;&nbsp;&nbsp;Metrics
                </h2>
                <p className="text-[10px] text-gray-400 font-bold tracking-wider mt-1">
                  Real-time Cloud Operations
                </p>
              </div>
            </div>

          
          </div>

          {/* ENHANCED KPI CARDS (Removed sparklines, added custom trend indicators) */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
            {[
              { title: "Total Spend", value: 14892.45, prefix: "$", border: "border-t-[#982598]", trend: "+12.4%", trendType: "negative" },
              { title: "Compute Spend", value: 8430.12, prefix: "$", border: "border-t-[#9A4DCC]", trend: "-2.4%", trendType: "positive" },
              { title: "Storage Spend", value: 4120.30, prefix: "$", border: "border-t-[#792CA2]", trend: "+4.1%", trendType: "negative" },
              { title: "Total Savings", value: 2342.03, prefix: "$", border: "border-t-[#1F215D]", trend: "+18.7%", trendType: "positive" },
            ].map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.08 }}
                whileHover={{
                  y: -6,
                  scale: 1.02,
                  boxShadow: "0 15px 35px rgba(121, 44, 162, 0.1)",
                }}
                className={`bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 border-t-4 ${card.border} flex flex-col justify-between min-h-[140px]`}
              >
                <div>
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    {card.title}
                  </h3>
                  <p className="text-2xl font-black text-[#111844] mt-2 font-mono">
                    {card.prefix}
                    <CountUp
                      end={card.value}
                      decimals={2}
                      duration={1.5}
                      separator=","
                    />
                  </p>
                </div>


              </motion.div>
            ))}
          </div>

          {/* ANALYTICS SECTION (Added Filter to Cost Distribution) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">

            {/* Cost Trends Card */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#111844]">{chartTimeframe} Cost Trends</h3>
                </div>
                <div className="bg-gray-100 rounded-lg p-0.5 flex text-[10px]">
                  {["Monthly", "Weekly", "Daily"].map((p) => (
                    <button
                      key={p}
                      onClick={() => setChartTimeframe(p)}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${chartTimeframe === p ? "bg-white text-[#111844] shadow-sm" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-64 relative border-b border-gray-100">
                {[0.25, 0.5, 0.75, 1.0].map((ratio) => (
                  <div
                    key={ratio}
                    className="absolute left-0 right-0 border-t border-dashed border-gray-100 pointer-events-none"
                    style={{ bottom: `${ratio * 100}%` }}
                  />
                ))}

                <div className="flex h-56 items-end justify-between px-2 pt-6">
                  {currentChartData.map((item, index) => {
                    const heightPercent = (item.value / maxChartValue) * 100;
                    const isHovered = hoveredBar === index;

                    return (
                      <div
                        key={item.label}
                        className="flex flex-col items-center flex-1 relative group cursor-pointer"
                        onMouseEnter={() => setHoveredBar(index)}
                        onMouseLeave={() => setHoveredBar(null)}
                      >
                        <AnimatePresence>
                          {isHovered && (
                            <motion.div
                              initial={{ opacity: 0, y: 10, scale: 0.95 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: 10, scale: 0.95 }}
                              className="absolute -top-12 z-20 bg-[#111844] text-white px-3 py-1.5 rounded-xl shadow-lg text-[10px] font-bold whitespace-nowrap"
                            >
                              ${item.value.toLocaleString()}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="w-full h-36 flex items-end justify-center">
                          <motion.div
                            className={`w-7 sm:w-9 rounded-t-lg bg-gradient-to-t from-[#792CA2] to-[#9A4DCC] relative transition-all duration-300 ${isHovered ? "brightness-110 shadow-md scale-x-[1.03]" : "opacity-85"
                              }`}
                            initial={{ height: 0 }}
                            animate={{ height: `${heightPercent}%` }}
                            transition={{ type: "spring", stiffness: 100, damping: 15 }}
                          />
                        </div>
                        <span className="text-[10px] text-gray-400 font-semibold mt-2">{item.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Cost Distribution */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 flex flex-col justify-between"
            >
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-base font-bold text-[#111844]">Cost Distribution</h3>
                  
                </div>

                {/* Resource filter*/}
                <div className="bg-gray-100 rounded-xl px-2.5 py-1.5 flex items-center border border-gray-200/30 text-[10px]">
                  <span className="text-gray-400 mr-1.5 font-semibold">Filter:</span>
                  <select
                    value={donutFilter}
                    onChange={(e) => setDonutFilter(e.target.value)}
                    className="bg-transparent outline-none text-[#111844] font-bold cursor-pointer"
                  >
                    <option value="All">All Clusters</option>
                    <option value="Production">Production</option>
                    <option value="Staging">Staging</option>
                    <option value="Development">Development</option>
                    <option value="Management">Management</option>
                    <option value="Finance">Finance</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">

                <div className="relative w-36 h-36 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Concentric Double Outline Rings to make it visually impressive */}
                    <circle
                      cx="50"
                      cy="50"
                      r={donutRadius + 7}
                      fill="transparent"
                      stroke="rgba(121, 44, 162, 0.18)"
                      strokeWidth="0.75"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={donutRadius - 7}
                      fill="transparent"
                      stroke="rgba(121, 44, 162, 0.18)"
                      strokeWidth="0.75"
                      strokeDasharray="2 2"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r={donutRadius}
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.25)"
                      strokeWidth={10}
                      className="pointer-events-none"
                    />

                    {(() => {
                      let accumPercent = 0;
                      return donutData.map((item, idx) => {
                        const percentage = (item.value / donutTotal) * 100;
                        const strokeLength = (percentage / 100) * donutCircumference;
                        const rotation = (accumPercent / 100) * 360;
                        accumPercent += percentage;

                        const isHovered = donutHoveredSegment === idx;
                        const isSelected = donutSelectedSegment === idx;

                        return (
                          <motion.circle
                            key={item.name}
                            cx="50"
                            cy="50"
                            r={donutRadius}
                            fill="transparent"
                            stroke={item.colorHex}
                            strokeWidth={isHovered || isSelected ? 11 : 8}
                            strokeDasharray={`${strokeLength} ${donutCircumference}`}
                            strokeDashoffset={0}
                            transform={`rotate(${rotation} 50 50)`}
                            className="cursor-pointer transition-all"
                            onMouseEnter={() => setDonutHoveredSegment(idx)}
                            onMouseLeave={() => setDonutHoveredSegment(null)}
                            onClick={() => setDonutSelectedSegment(isSelected ? null : idx)}
                            initial={{ strokeDasharray: `0 ${donutCircumference}` }}
                            animate={{ strokeDasharray: `${strokeLength} ${donutCircumference}` }}
                            transition={{ duration: 1.2, ease: "easeOut" }}
                          />
                        );
                      });
                    })()}
                  </svg>

                  <div className="absolute flex flex-col items-center text-center">
                    <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                      {donutSelectedSegment !== null ? donutData[donutSelectedSegment].name.split(" ")[0] : "Total"}
                    </span>
                    <span className="text-base font-black text-[#111844] font-mono mt-0.5">
                      {donutSelectedSegment !== null ? `${donutData[donutSelectedSegment].value}%` : `$14,892`}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 flex-1 w-full max-w-[200px]">
                  {donutData.map((item, idx) => {
                    const isHovered = donutHoveredSegment === idx;
                    const isSelected = donutSelectedSegment === idx;
                    return (
                      <div
                        key={item.name}
                        onMouseEnter={() => setDonutHoveredSegment(idx)}
                        onMouseLeave={() => setDonutHoveredSegment(null)}
                        onClick={() => setDonutSelectedSegment(isSelected ? null : idx)}
                        className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 ${isHovered || isSelected ? "bg-white shadow-md border border-gray-100" : "hover:bg-white/40"
                          }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 rounded-full h-2" style={{ backgroundColor: item.colorHex }} />
                          <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[120px]">{item.name}</span>
                        </div>
                        <span className="text-xs font-extrabold text-[#111844]">{item.value}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </div>

          {/* LOWER GRIDS: TABLES & ALERTS (Added view all and severity color tracks) */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Top Cost Resources Table */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-base font-bold text-[#111844]">Top Cost Resources</h3>
                <button
                  onClick={() => setIsResourcesModalOpen(true)}
                  className="text-xs text-[#792CA2] hover:underline font-bold flex items-center gap-0.5 focus:outline-none"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black">
                      <th className="pb-3">Resource ID</th>
                      <th className="pb-3">Region</th>
                      <th className="pb-3">Service</th>
                      <th className="pb-3 text-right">Cost/mo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {resources.map((r) => (
                      <tr key={r.id} className="border-b border-gray-50/50 hover:bg-gray-50/20 transition-all text-xs">
                        <td className="py-3 font-semibold text-gray-800">
                          <div className="flex items-center gap-1.5">
                            <span>{r.name}</span>
                            <button
                              onClick={() => handleCopy(r.name)}
                              className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                              title="Copy ID"
                            >
                              {copiedId === r.name ? (
                                <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                              ) : (
                                <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </td>
                        <td className="py-3 text-gray-500">{r.region}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-100/50">
                            {r.service}
                          </span>
                        </td>
                        <td className="py-3 text-right font-bold text-gray-700">${r.cost.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Optimization Alerts*/}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-base font-bold text-[#111844]">Optimization Alerts</h3>
                </div>
                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setIsAlertsModalOpen(true)}
                    className="text-xs text-[#792CA2] hover:underline font-bold flex items-center gap-0.5 focus:outline-none"
                  >
                    View All
                  </button>
                  {/* Color Symbols Legend for Alerts Category */}
                  <div className="flex items-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-wider">
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Critical</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> High</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Medium</span>
                    <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Low</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mt-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="bg-gray-50 border border-gray-100/80 rounded-2xl flex items-stretch overflow-hidden shadow-sm"
                  >
                    <div className="p-3 flex justify-between items-center flex-grow">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          {/* Alert bullet representing severity category colour */}
                          <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${alert.severity === "Critical" ? "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" :
                              alert.severity === "High" ? "bg-orange-500 shadow-[0_0_8px_rgba(249,115,22,0.5)]" :
                                alert.severity === "Medium" ? "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.5)]" :
                                  "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                            }`} title={alert.severity} />
                          <h4 className="text-xs font-extrabold text-gray-800">{alert.title}</h4>
                        </div>
                        <p className="text-[10px] text-gray-400 leading-normal">{alert.desc}</p>
                      </div>

                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

        </main>
        <Footer reduced={true} />

        {/* MODALS */}
        <AnimatePresence>
          {isResourcesModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-[#111844]"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl p-6 shadow-2xl max-w-4xl w-full border border-gray-100 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-[#111844]">All Cost Resources</h3>
                    
                  </div>
                  <button
                    onClick={() => setIsResourcesModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black">
                        <th className="pb-3">Resource ID</th>
                        <th className="pb-3">Region</th>
                        <th className="pb-3">Service</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3">Environment</th>
                        <th className="pb-3 text-right">Cost/mo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {expandedResources.map((r) => (
                        <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all text-xs">
                          <td className="py-3 font-semibold text-gray-800">
                            <div className="flex items-center gap-1.5">
                              <span>{r.name}</span>
                              <button
                                onClick={() => handleCopy(r.name)}
                                className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                                title="Copy ID"
                              >
                                {copiedId === r.name ? (
                                  <CheckIcon className="w-3.5 h-3.5 text-green-500" />
                                ) : (
                                  <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                                )}
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-gray-500">{r.region}</td>
                          <td className="py-3">
                            <span className="px-2 py-0.5 rounded-md text-[9px] font-bold bg-purple-50 text-purple-600 border border-purple-100/50">
                              {r.service}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              r.status === "Running" 
                              ?"bg-green-50 text-green-600 border border-green-100"
                              : r.status ==="Active"
                              ?"bg-red-50 text-red-600 border border-red-100":
                              "bg-black-50 text-black-600 border border-black-100"
                            }`}>
                              {r.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              r.environment === "Production" 
                                ? "bg-black-50 text-white-600 border border-white-100" 
                                : r.environment === "Staging"
                                  ? "bg-black-50 text-white-600 border border-white-100"
                                  : "bg-black-50 text-white-600 border border-white-100"
                            }`}>
                              {r.environment}
                            </span>
                          </td>
                          <td className="py-3 text-right font-bold text-gray-700">${r.cost.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {isAlertsModalOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-[#111844]"
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-white rounded-3xl p-6 shadow-2xl max-w-4xl w-full border border-gray-100 max-h-[85vh] overflow-y-auto"
              >
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
                  <div>
                    <h3 className="text-lg font-bold text-[#111844]">All Optimization Alerts</h3>

                  </div>
                  <button
                    onClick={() => setIsAlertsModalOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <XMarkIcon className="w-5 h-5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase font-black">
                        <th className="pb-3">Alert Title</th>
                        <th className="pb-3">Severity</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Status</th>
                 
                      </tr>
                    </thead>
                    <tbody>
                      {expandedAlerts.map((a) => (
                        <tr key={a.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-all text-xs">
                          <td className="py-3">
                            <div>
                              <h4 className="font-extrabold text-gray-800">{a.title}</h4>
                              <p className="text-[10px] text-gray-400 mt-0.5">{a.desc}</p>
                            </div>
                          </td>
                          <td className="py-3">
                            <span className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                              a.severity === "Critical" 
                                ? "bg-red-50 text-red-700 border border-red-100" 
                                : a.severity === "High" 
                                  ? "bg-orange-50 text-orange-700 border-orange-100" 
                                  : a.severity === "Medium"
                                    ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                                    : "bg-green-50 text-green-700 border border-green-100"
                            }`}>{a.severity}</span>
                          </td>
                          <td className="py-3 font-medium text-gray-600">{a.category}</td>
                          <td className="py-3">
                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                              a.status === "Active" 
                                ? "bg-red-50 text-red-600 border border-red-100" 
                                : a.status === "Acknowledged"
                                  ? "bg-blue-50 text-blue-600 border border-blue-100"
                                  : "bg-green-50 text-green-600 border border-green-100"
                            }`}>
                              {a.status}
                            </span>
                          </td>
                          
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
  );
}