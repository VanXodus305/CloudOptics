"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, BellAlertIcon, CheckCircleIcon, ArrowPathIcon, ExclamationTriangleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { FlagIcon } from "@heroicons/react/24/solid";

export default function ActiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("Unresolved");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Critical");
  const [isEnvOpen, setIsEnvOpen] = useState(false);
  const [envFilter, setEnvFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const sortRef = useRef(null);
  const envRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
      if (envRef.current && !envRef.current.contains(event.target)) {
        setIsEnvOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const tabs = ["Resolved", "In progress", "Unresolved"];
  const sortOptions = ["Critical", "High", "Medium", "Low"];
  const uniqueEnvs = ["All", ...new Set(alerts.map(a => a.environment || "Unknown"))];

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/optimization/alerts");
      if (!res.ok) throw new Error("Failed to fetch alerts");
      const data = await res.json();
      setAlerts(data);

      // The new useEffect will handle selecting the default alert
    } catch (err) {
      console.error("Error loading alerts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const tabStatusMap = {
      "Resolved": "resolved",
      "In progress": "in progress",
      "Unresolved": "unresolved"
    };
    const baseAlerts = searchQuery ? alerts : alerts.filter(alert => alert.status === tabStatusMap[activeTab]);
    const severityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
    const currentSorted = [...baseAlerts]
      .filter(a => searchQuery ? true : (sortOption === "All" || a.severity === sortOption))
      .filter(a => searchQuery ? true : (envFilter === "All" || a.environment === envFilter))
      .filter(a => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase();
        return a.message?.toLowerCase().includes(q) || 
               a.resourceId?.toLowerCase().includes(q) || 
               a.type?.toLowerCase().includes(q);
      })
      .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

    if (currentSorted.length > 0) {
      setSelectedAlert(prev => {
        const isSelectedInList = prev && currentSorted.some(a => a._id === prev._id);
        return isSelectedInList ? prev : currentSorted[0];
      });
    } else {
      setSelectedAlert(null);
    }
  }, [activeTab, sortOption, envFilter, searchQuery, alerts, isLoading]);

  const updateAlertStatus = async (alertId, newStatus) => {
    try {
      const res = await fetch("/api/optimization/alerts", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ alertId, status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      // Snappily update state in UI
      setAlerts(prev => prev.map(a => a._id === alertId ? updated : a));
      setSelectedAlert(updated);
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  const tabStatusMap = {
    "Resolved": "resolved",
    "In progress": "in progress",
    "Unresolved": "unresolved"
  };

  const baseAlerts = searchQuery ? alerts : alerts.filter(alert => alert.status === tabStatusMap[activeTab]);

  const severityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
  const sortedAlerts = [...baseAlerts]
    .filter(a => searchQuery ? true : (sortOption === "All" || a.severity === sortOption))
    .filter(a => searchQuery ? true : (envFilter === "All" || a.environment === envFilter))
    .filter(a => {
      if (!searchQuery) return true;
      const q = searchQuery.toLowerCase();
      return a.message?.toLowerCase().includes(q) || 
             a.resourceId?.toLowerCase().includes(q) || 
             a.type?.toLowerCase().includes(q);
    })
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative mb-12"
    >
      <div className="bg-white/70 dark:bg-[#0F122B]/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white dark:border-white/10 flex flex-col md:flex-row gap-6 relative z-0">


        {/* Left Side: Details View */}
        <div className="hidden md:flex order-2 md:order-1 flex-1 bg-gradient-to-br from-white to-[#F9F7F7] dark:from-[#111844] dark:to-[#080A1A] rounded-2xl p-6 md:p-8 border border-gray-100 dark:border-white/10 flex-col min-h-[350px] relative overflow-hidden shadow-inner">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#9A4DCC]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          {selectedAlert ? (
            <motion.div
              key={selectedAlert._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full gap-5 relative z-10 w-full"
            >
              <div className="flex justify-center pb-2">
                <div className="flex items-center gap-2 bg-gray-50/80 dark:bg-white/5 p-1.5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm w-full xl:w-auto">
                  <button
                    onClick={() => updateAlertStatus(selectedAlert._id, "unresolved")}
                    className={`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${selectedAlert.status === "unresolved" ? "bg-red-100 border border-red-200 shadow-sm" : "hover:bg-red-50 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                      }`}
                    title="Mark Unresolved"
                  >
                    <FlagIcon className={`w-4 h-4 ${selectedAlert.status === "unresolved" ? "text-red-500" : "text-gray-400"}`} />
                    <span className={`text-[10px] font-bold ${selectedAlert.status === "unresolved" ? "text-red-700" : "text-gray-500"}`}>Unresolved</span>
                  </button>

                  <button
                    onClick={() => updateAlertStatus(selectedAlert._id, "in progress")}
                    className={`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${selectedAlert.status === "in progress" ? "bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30 shadow-sm" : "hover:bg-yellow-50 dark:hover:bg-white/5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                      }`}
                    title="Start Progress"
                  >
                    <FlagIcon className={`w-4 h-4 ${selectedAlert.status === "in progress" ? "text-yellow-500" : "text-gray-400"}`} />
                    <span className={`text-[10px] font-bold ${selectedAlert.status === "in progress" ? "text-yellow-700" : "text-gray-500"}`}>In Progress</span>
                  </button>

                  <button
                    onClick={() => updateAlertStatus(selectedAlert._id, "resolved")}
                    className={`flex-1 xl:flex-none flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg transition-all ${selectedAlert.status === "resolved" ? "bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 shadow-sm" : "hover:bg-green-50 dark:hover:bg-white/5 opacity-60 hover:opacity-100 grayscale hover:grayscale-0"
                      }`}
                    title="Mark Resolved"
                  >
                    <FlagIcon className={`w-4 h-4 ${selectedAlert.status === "resolved" ? "text-green-500" : "text-gray-400"}`} />
                    <span className={`text-[10px] font-bold ${selectedAlert.status === "resolved" ? "text-green-700" : "text-gray-500"}`}>Resolved</span>
                  </button>
                </div>
              </div>



              <div>
                <h3 className="text-base font-black text-[#111844] dark:text-white leading-snug">{selectedAlert.message}</h3>
                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                  <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-200/40 dark:border-white/10 flex items-center gap-1">
                    Resource ID: <strong className="text-gray-700 dark:text-gray-200 ml-0.5">{selectedAlert.resourceId}</strong>
                    <button
                      onClick={() => navigator.clipboard.writeText(selectedAlert.resourceId)}
                      className="p-0.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-0.5"
                      title="Copy Resource ID"
                    >
                      <DocumentDuplicateIcon className="w-3.5 h-3.5" />
                    </button>
                  </span>
                  <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-200/40 dark:border-white/10 flex items-center">
                    Type: <strong className="text-gray-700 dark:text-gray-200 ml-1">{selectedAlert.type}</strong>
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                <div className="bg-white dark:bg-transparent border border-gray-150 dark:border-white/10 p-3 rounded-xl shadow-sm">
                  <p className="text-[9px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Current Cost</p>
                  <p className="text-base font-extrabold text-gray-600 dark:text-gray-300 mt-0.5">${Math.round(selectedAlert.currentCost || 0)}/mo</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 dark:border-emerald-500/30 p-3 rounded-xl shadow-sm">
                  <p className="text-[9px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide">Potential Savings</p>
                  <p className="text-base font-black text-emerald-600 dark:text-emerald-500 mt-0.5">${Math.round(selectedAlert.potentialSavings || 0)}/mo</p>
                </div>
              </div>

              <div className="bg-white dark:bg-transparent border border-gray-150 dark:border-white/10 rounded-xl p-4 shadow-sm flex-grow">
                <h4 className="text-[10px] font-black text-[#111844] dark:text-gray-200 uppercase tracking-wider mb-2">Recommended Mitigation</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  {selectedAlert.type === "Idle" && "This resource has average CPU utilization below 5% for the past 7 days, indicating it is currently not being utilized. To optimize costs, terminate the instance or configure standard scheduling to shut it down during off-hours."}
                  {selectedAlert.type === "Oversized" && "The instance's maximum CPU and memory utilization are low, indicating it is oversized for its workload. Downsizing the instance to a smaller family (e.g. t3.medium to t3.small) will safely save up to 40% of compute cost."}
                  {selectedAlert.type === "UnattachedStorage" && "This S3 bucket has zero read/write operations over the past 7 days, indicating it is likely abandoned. Archive data to Glacier or delete the bucket completely to eliminate storage overhead."}
                </p>
              </div>

              <div className="mt-auto pt-4 flex flex-col sm:flex-row justify-center gap-3 border-t border-gray-100 dark:border-white/10">
                {selectedAlert.status === "unresolved" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateAlertStatus(selectedAlert._id, "in progress")}
                    className="w-full sm:w-auto bg-[#111844] dark:bg-[#792CA2] hover:bg-[#1F215D] dark:hover:bg-[#9A4DCC] text-white px-8 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Start Progress
                  </motion.button>
                )}
                {selectedAlert.status === "in progress" && (
                  <div className="flex w-full sm:w-auto justify-center gap-3">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateAlertStatus(selectedAlert._id, "unresolved")}
                      className="flex-1 sm:flex-none bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Mark Unresolved
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => updateAlertStatus(selectedAlert._id, "resolved")}
                      className="flex-1 sm:flex-none bg-[#111844] dark:bg-[#792CA2] hover:bg-[#1F215D] dark:hover:bg-[#9A4DCC] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Mark Resolved
                    </motion.button>
                  </div>
                )}
                {selectedAlert.status === "resolved" && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => updateAlertStatus(selectedAlert._id, "archived")}
                    className="w-full sm:w-auto bg-white dark:bg-transparent hover:bg-[#792CA2]/5 dark:hover:bg-[#792CA2]/10 text-[#792CA2] dark:text-[#C084FC] border border-[#792CA2]/20 dark:border-[#792CA2]/30 px-8 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Done
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full flex-grow py-12">

              <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2]">
                {sortedAlerts.length === 0 ? "No alerts" : "Show the Alerts"}
              </h3>
              <p className="text-sm text-gray-500 font-medium text-center max-w-[80%] mt-2">
                {sortedAlerts.length === 0
                  ? "There are no alerts in this category to display."
                  : "Select an alert on the right to view its full details and mitigation steps here."}
              </p>
            </div>
          )}
        </div>

        {/* Right Side: List and Filters */}
        <div className="order-1 md:order-2 flex-grow flex-1 flex flex-col pt-4 md:pt-0">
          <div className="mb-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search alerts by message, resource ID, or type..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white dark:bg-[#111844]/50 border border-gray-200 dark:border-white/10 rounded-xl pl-4 pr-10 py-2.5 text-sm text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#792CA2]/50 transition-shadow"
              />
              {searchQuery ? (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <svg className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              )}
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex gap-1.5 bg-gray-100/50 dark:bg-white/5 p-1 rounded-xl w-fit flex-nowrap whitespace-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => {
                const isUnresolvedTab = tab === "Unresolved";
                const hasUnresolvedAlerts = alerts.some(a => a.status === "unresolved");
                const shouldBlink = isUnresolvedTab && hasUnresolvedAlerts;

                return (
                  <motion.button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative px-2.5 sm:px-3 py-1 text-[11px] font-bold rounded-lg transition-all z-10 ${activeTab === tab ? "text-[#111844] dark:text-white" : "text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      }`}
                  >
                    {activeTab === tab && (
                      <motion.div
                        layoutId="alertTab"
                        className="absolute inset-0 bg-white dark:bg-[#792CA2] rounded-lg shadow-sm"
                        initial={false}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                      />
                    )}
                    <span className={`relative z-10 ${shouldBlink ? "animate-pulse text-red-500 font-black drop-shadow-sm" : ""}`}>
                      {tab}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {/* Sort & Refresh controls */}
            <div className="flex items-center gap-2.5">
              <div className="relative" ref={envRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsEnvOpen(!isEnvOpen)}
                  className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-sm flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap"
                >
                  {envFilter}
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </motion.button>
                {isEnvOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#111844] rounded-lg shadow-xl border border-gray-100 dark:border-white/10 py-1 overflow-hidden z-30">
                    {uniqueEnvs.map(env => (
                      <button
                        key={env}
                        onClick={() => { setEnvFilter(env); setIsEnvOpen(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#792CA2]/10 hover:text-[#792CA2] ${envFilter === env ? "bg-[#792CA2]/5 text-[#792CA2] dark:bg-[#792CA2]/20 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                      >
                        {env}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative" ref={sortRef}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-lg text-[11px] font-semibold shadow-sm flex items-center gap-1.5 hover:bg-gray-50 dark:hover:bg-white/5 whitespace-nowrap"
                >
                  {sortOption}
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </motion.button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white dark:bg-[#111844] rounded-lg shadow-xl border border-gray-100 dark:border-white/10 py-1 overflow-hidden z-30">
                    {sortOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortOption(opt); setIsSortOpen(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#792CA2]/10 hover:text-[#792CA2] ${sortOption === opt ? "bg-[#792CA2]/5 text-[#792CA2] dark:bg-[#792CA2]/20 dark:text-white" : "text-gray-600 dark:text-gray-400"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.9 }}
                onClick={fetchAlerts}
                className="p-1.5 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 font-semibold hover:text-[#792CA2] dark:hover:text-[#DCCBFF] hover:bg-gray-50 dark:hover:bg-white/5 hover:border-[#792CA2]/30 rounded-lg shadow-sm transition-all flex items-center justify-center flex-shrink-0"
                title="Refresh alerts list"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </motion.button>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-grow overflow-y-auto custom-scrollbar p-3 bg-[#F9F7F7]/80 dark:bg-transparent backdrop-blur-md border border-gray-150 dark:border-white/5 rounded-2xl max-h-[400px] md:max-h-none md:h-0 shadow-inner">
            <AnimatePresence mode="popLayout">
              {isLoading ? (
                [0, 1, 2, 3].map(i => (
                  <div key={i} className="bg-white border border-gray-100 p-3 rounded-xl flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3 w-full">
                      <div className="w-2.5 h-2.5 rounded-full bg-gray-200 flex-shrink-0" />
                      <div className="h-4 bg-gray-250 rounded w-2/3" />
                    </div>
                  </div>
                ))
              ) : sortedAlerts.length === 0 ? (
                <div className="text-center py-12 px-4 text-xs font-semibold text-gray-400 dark:text-gray-500 bg-gray-50/50 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 rounded-xl flex flex-col items-center justify-center gap-1.5">
                  <p>No {activeTab.toLowerCase()} alerts in this category</p>
                  {activeTab === "In progress" && (
                    <p className="font-medium text-gray-500">
                      Check the <button onClick={() => setActiveTab("Unresolved")} className="text-[#792CA2] hover:underline font-bold transition-all">Unresolved</button> tab for new alerts to work on.
                    </p>
                  )}
                </div>
              ) : (
                sortedAlerts.map((alert, i) => (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.01, x: -4 }}
                    transition={{ delay: i * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => setSelectedAlert(selectedAlert?._id === alert._id ? null : alert)}
                    className={`bg-white dark:bg-[#111844]/50 border p-3.5 rounded-xl shadow-sm hover:shadow-md transition-colors duration-250 cursor-pointer flex flex-col group ${selectedAlert?._id === alert._id ? 'border-2 border-[#792CA2] dark:border-[#9A4DCC] bg-[#792CA2]/5 dark:bg-[#9A4DCC]/10' : 'border-gray-100 dark:border-white/10 hover:border-[#792CA2]/30 dark:hover:border-white/30'
                      }`}
                  >
                    <div className="flex flex-col gap-1.5 w-full">
                      <div className="flex items-start justify-between w-full">
                        <div className="flex items-center gap-2">
                          <FlagIcon className={`w-4 h-4 flex-shrink-0 ${
                            alert.status === 'unresolved' ? 'text-red-500' : 
                            alert.status === 'in progress' ? 'text-yellow-500' : 
                            'text-green-500'
                          }`} />
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-[#792CA2] dark:group-hover:text-white transition-colors line-clamp-1">{alert.message}</span>
                        </div>
                        <ChevronDownIcon className={`w-4 h-4 text-gray-300 dark:text-gray-500 transition-transform flex-shrink-0 mt-0.5 ${selectedAlert?._id === alert._id ? 'rotate-0 text-[#792CA2] dark:text-[#9A4DCC]' : '-rotate-90 group-hover:translate-x-1'
                          }`} />
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${alert.severity === 'Critical' ? 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-500/30' :
                            alert.severity === 'High' ? 'bg-orange-100 dark:bg-orange-500/20 text-orange-700 dark:text-orange-400 border border-orange-200 dark:border-orange-500/30' :
                              alert.severity === 'Medium' ? 'bg-yellow-100 dark:bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-500/30' :
                                'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/30'
                          }`}>
                          {alert.severity}
                        </span>
                        <span className="px-2 py-0.5 rounded-lg text-[9px] font-black text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 uppercase tracking-wider shadow-sm">
                          {alert.environment}
                        </span>
                      </div>
                    </div>

                    {/* Collapsible Mobile Accordion Details View */}
                    <AnimatePresence initial={false}>
                      {selectedAlert?._id === alert._id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: "easeInOut" }}
                          onClick={(e) => e.stopPropagation()}
                          className="md:hidden w-full mt-4 pt-4 border-t border-gray-100 flex flex-col gap-4 text-left cursor-default overflow-hidden"
                        >
                          <div className="flex justify-center pb-2">
                            <div className="flex items-center justify-between bg-gray-50/80 dark:bg-white/5 p-1.5 rounded-xl border border-gray-100 dark:border-white/10 shadow-sm w-full">
                              <button
                                onClick={() => updateAlertStatus(alert._id, "unresolved")}
                                className={`flex items-center justify-center flex-1 py-1.5 rounded-lg transition-all ${alert.status === "unresolved" ? "bg-red-100 dark:bg-red-500/20 border border-red-200 dark:border-red-500/30 shadow-sm" : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-red-50 dark:hover:bg-white/5"
                                  }`}
                                title="Mark Unresolved"
                              >
                                <FlagIcon className={`w-4 h-4 ${alert.status === "unresolved" ? "text-red-500" : "text-gray-400"}`} />
                              </button>

                              <button
                                onClick={() => updateAlertStatus(alert._id, "in progress")}
                                className={`flex items-center justify-center flex-1 mx-1.5 py-1.5 rounded-lg transition-all ${alert.status === "in progress" ? "bg-yellow-100 dark:bg-yellow-500/20 border border-yellow-200 dark:border-yellow-500/30 shadow-sm" : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-yellow-50 dark:hover:bg-white/5"
                                  }`}
                                title="Start Progress"
                              >
                                <FlagIcon className={`w-4 h-4 ${alert.status === "in progress" ? "text-yellow-500" : "text-gray-400"}`} />
                              </button>

                              <button
                                onClick={() => updateAlertStatus(alert._id, "resolved")}
                                className={`flex items-center justify-center flex-1 py-1.5 rounded-lg transition-all ${alert.status === "resolved" ? "bg-green-100 dark:bg-green-500/20 border border-green-200 dark:border-green-500/30 shadow-sm" : "opacity-60 grayscale hover:opacity-100 hover:grayscale-0 hover:bg-green-50 dark:hover:bg-white/5"
                                  }`}
                                title="Mark Resolved"
                              >
                                <FlagIcon className={`w-4 h-4 ${alert.status === "resolved" ? "text-green-500" : "text-gray-400"}`} />
                              </button>
                            </div>
                          </div>



                          <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-gray-500 dark:text-gray-400">
                            <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-200/40 dark:border-white/10 flex items-center gap-1">
                              Resource ID: <strong className="text-gray-700 dark:text-gray-200 ml-0.5">{alert.resourceId}</strong>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigator.clipboard.writeText(alert.resourceId);
                                }}
                                className="p-0.5 hover:bg-gray-200 dark:hover:bg-white/10 rounded transition-colors text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 ml-0.5"
                                title="Copy Resource ID"
                              >
                                <DocumentDuplicateIcon className="w-3 h-3" />
                              </button>
                            </span>
                            <span className="bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded-md border border-gray-200/40 dark:border-white/10 flex items-center">
                              Type: <strong className="text-gray-700 dark:text-gray-200 ml-1">{alert.type}</strong>
                            </span>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-white dark:bg-transparent border border-gray-150 dark:border-white/10 p-2.5 rounded-xl shadow-sm">
                              <p className="text-[8px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wide">Current Cost</p>
                              <p className="text-xs font-extrabold text-gray-600 dark:text-gray-300 mt-0.5">${Math.round(alert.currentCost || 0)}/mo</p>
                            </div>
                            <div className="bg-emerald-500/5 border border-emerald-500/15 dark:border-emerald-500/30 p-2.5 rounded-xl shadow-sm">
                              <p className="text-[8px] font-bold text-emerald-600 dark:text-emerald-500 uppercase tracking-wide">Potential Savings</p>
                              <p className="text-xs font-black text-emerald-600 dark:text-emerald-500 mt-0.5">${Math.round(alert.potentialSavings || 0)}/mo</p>
                            </div>
                          </div>

                          <div className="bg-white dark:bg-transparent border border-gray-150 dark:border-white/10 rounded-xl p-3 shadow-sm">
                            <h4 className="text-[9px] font-black text-[#111844] dark:text-gray-200 uppercase tracking-wider mb-1">Recommended Mitigation</h4>
                            <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                              {alert.type === "Idle" && "This resource has average CPU utilization below 5% for the past 7 days, indicating it is currently not being utilized. To optimize costs, terminate the instance or configure standard scheduling to shut it down during off-hours."}
                              {alert.type === "Oversized" && "The instance's maximum CPU and memory utilization are low, indicating it is oversized for its workload. Downsizing the instance to a smaller family (e.g. t3.medium to t3.small) will safely save up to 40% of compute cost."}
                              {alert.type === "UnattachedStorage" && "This S3 bucket has zero read/write operations over the past 7 days, indicating it is likely abandoned. Archive data to Glacier or delete the bucket completely to eliminate storage overhead."}
                            </p>
                          </div>

                          <div className="flex flex-col gap-2 mt-2">
                            {alert.status === "unresolved" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert._id, "in progress"); }}
                                className="w-full bg-[#111844] dark:bg-[#792CA2] hover:bg-[#1F215D] dark:hover:bg-[#9A4DCC] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Start Progress
                              </button>
                            )}
                            {alert.status === "in progress" && (
                              <div className="flex gap-2">
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert._id, "unresolved"); }}
                                  className="flex-1 bg-white dark:bg-transparent hover:bg-gray-50 dark:hover:bg-white/5 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-white/10 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                                >
                                  Mark Unresolved
                                </button>
                                <button
                                  onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert._id, "resolved"); }}
                                  className="flex-1 bg-[#111844] dark:bg-[#792CA2] hover:bg-[#1F215D] dark:hover:bg-[#9A4DCC] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                                >
                                  Mark Resolved
                                </button>
                              </div>
                            )}
                            {alert.status === "resolved" && (
                              <button
                                onClick={(e) => { e.stopPropagation(); updateAlertStatus(alert._id, "archived"); }}
                                className="w-full bg-white dark:bg-transparent hover:bg-[#792CA2]/5 dark:hover:bg-[#792CA2]/10 text-[#792CA2] dark:text-[#C084FC] border border-[#792CA2]/20 dark:border-[#792CA2]/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Done
                              </button>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </motion.div>
  );
}