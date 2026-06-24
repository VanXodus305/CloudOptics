"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDownIcon, BellAlertIcon, CheckCircleIcon, ArrowPathIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function ActiveAlerts() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("Unresolved");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState("Critical");
  
  const tabs = ["Resolved", "In progress", "Unresolved"];
  const sortOptions = ["Critical", "High", "Medium", "Low"];

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/optimization/alerts");
      if (!res.ok) throw new Error("Failed to fetch alerts");
      const data = await res.json();
      setAlerts(data);
      
      // Update selected alert with latest data
      if (selectedAlert) {
        const updated = data.find(a => a._id === selectedAlert._id);
        setSelectedAlert(updated || null);
      }
    } catch (err) {
      console.error("Error loading alerts:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

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

  const filteredAlerts = alerts.filter(alert => alert.status === tabStatusMap[activeTab]);

  const severityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
  const sortedAlerts = [...filteredAlerts].sort((a, b) => {
    const aMatch = a.severity === sortOption;
    const bMatch = b.severity === sortOption;
    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;
    return severityOrder[a.severity] - severityOrder[b.severity];
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative mb-12"
    >
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white flex flex-col md:flex-row gap-6 relative z-0">
        

        {/* Left Side: Details View */}
        <div className="hidden md:flex order-2 md:order-1 flex-1 bg-gradient-to-br from-white to-[#F9F7F7] rounded-2xl p-6 md:p-8 border border-gray-100 flex-col min-h-[350px] relative overflow-hidden shadow-inner">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-[#9A4DCC]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
          
          {selectedAlert ? (
            <motion.div 
              key={selectedAlert._id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col h-full gap-5 relative z-10 w-full"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-4">
                <div className="flex items-center gap-2.5 flex-nowrap whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider ${
                    selectedAlert.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                    selectedAlert.severity === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                    selectedAlert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                    'bg-blue-100 text-blue-700 border border-blue-200'
                  }`}>
                    {selectedAlert.severity} Severity
                  </span>
                  <span className="text-[10px] font-bold text-gray-400">•</span>
                  <span className="text-xs font-bold text-gray-500 uppercase">{selectedAlert.environment}</span>
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase w-fit ${
                  selectedAlert.status === 'resolved' ? 'bg-green-100 text-green-700 border border-green-200/50' :
                  selectedAlert.status === 'in progress' ? 'bg-amber-100 text-amber-700 border border-amber-200/50' :
                  'bg-rose-100 text-rose-700 border border-rose-200/50'
                }`}>
                  {selectedAlert.status}
                </div>
              </div>

              <div>
                <h3 className="text-base font-black text-[#111844] leading-snug">{selectedAlert.message}</h3>
                <div className="mt-2.5 flex flex-wrap gap-2 text-[11px] font-semibold text-gray-500">
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/40">Resource ID: <strong className="text-gray-700">{selectedAlert.resourceId}</strong></span>
                  <span className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/40">Type: <strong className="text-gray-700">{selectedAlert.type}</strong></span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-2">
                <div className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wide">Current Cost</p>
                  <p className="text-base font-extrabold text-gray-600 mt-0.5">${Math.round(selectedAlert.currentCost || 0)}/mo</p>
                </div>
                <div className="bg-emerald-500/5 border border-emerald-500/15 p-3 rounded-xl shadow-sm">
                  <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-wide">Potential Savings</p>
                  <p className="text-base font-black text-emerald-600 mt-0.5">${Math.round(selectedAlert.potentialSavings || 0)}/mo</p>
                </div>
              </div>

              <div className="bg-white border border-gray-150 rounded-xl p-4 shadow-sm flex-grow">
                <h4 className="text-[10px] font-black text-[#111844] uppercase tracking-wider mb-2">Recommended Mitigation</h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  {selectedAlert.type === "Idle" && "This resource has average CPU utilization below 5% for the past 7 days, indicating it is currently not being utilized. To optimize costs, terminate the instance or configure standard scheduling to shut it down during off-hours."}
                  {selectedAlert.type === "Oversized" && "The instance's maximum CPU and memory utilization are low, indicating it is oversized for its workload. Downsizing the instance to a smaller family (e.g. t3.medium to t3.small) will safely save up to 40% of compute cost."}
                  {selectedAlert.type === "UnattachedStorage" && "This S3 bucket has zero read/write operations over the past 7 days, indicating it is likely abandoned. Archive data to Glacier or delete the bucket completely to eliminate storage overhead."}
                </p>
              </div>

              <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col sm:flex-row gap-3">
                {selectedAlert.status === "unresolved" && (
                  <>
                    <button 
                      onClick={() => updateAlertStatus(selectedAlert._id, "in progress")}
                      className="flex-1 bg-white hover:bg-[#792CA2]/5 text-[#792CA2] border border-[#792CA2]/20 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Start Progress
                    </button>
                    <button 
                      onClick={() => updateAlertStatus(selectedAlert._id, "resolved")}
                      className="flex-1 bg-[#111844] hover:bg-[#1F215D] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Resolve Alert
                    </button>
                  </>
                )}
                {selectedAlert.status === "in progress" && (
                  <>
                    <button 
                      onClick={() => updateAlertStatus(selectedAlert._id, "unresolved")}
                      className="flex-1 bg-white hover:bg-gray-50 text-gray-500 border border-gray-300 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Mark Unresolved
                    </button>
                    <button 
                      onClick={() => updateAlertStatus(selectedAlert._id, "resolved")}
                      className="flex-1 bg-[#111844] hover:bg-[#1F215D] text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                    >
                      Resolve Alert
                    </button>
                  </>
                )}
                {selectedAlert.status === "resolved" && (
                  <button 
                    onClick={() => updateAlertStatus(selectedAlert._id, "unresolved")}
                    className="w-full bg-white hover:bg-[#792CA2]/5 text-[#792CA2] border border-[#792CA2]/20 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm"
                  >
                    Reopen Alert
                  </button>
                )}
              </div>
            </motion.div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full flex-grow py-12">
              <motion.div 
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center mb-4 relative"
              >
                <ExclamationTriangleIcon className="w-10 h-10 text-[#792CA2]" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#792CA2] border-2 border-white rounded-full animate-ping" />
                <span className="absolute top-0 right-0 w-4 h-4 bg-[#792CA2] border-2 border-white rounded-full" />
              </motion.div>
              
              <h3 className="text-xl font-black text-[#111844]">Show the Alerts</h3>
              <p className="text-sm text-gray-500 font-medium text-center max-w-[80%] mt-2">
                Select an alert on the right to view its full details and mitigation steps here.
              </p>
            </div>
          )}
        </div>

        {/* Right Side: List and Filters */}
        <div className="order-1 md:order-2 flex-grow flex-1 flex flex-col pt-4 md:pt-0">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-4 mb-4">
            <div className="flex gap-1.5 bg-gray-100/50 p-1 rounded-xl w-fit flex-nowrap whitespace-nowrap overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => { setActiveTab(tab); setSelectedAlert(null); }}
                  className={`relative px-3 sm:px-4 py-1.5 text-xs font-bold rounded-lg transition-all z-10 ${
                    activeTab === tab ? "text-[#111844]" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {activeTab === tab && (
                    <motion.div
                      layoutId="alertTab"
                      className="absolute inset-0 bg-white rounded-lg shadow-sm"
                      initial={false}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="relative z-10">{tab}</span>
                </button>
              ))}
            </div>

            {/* Sort & Refresh controls */}
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-bold text-gray-500 uppercase whitespace-nowrap">Sort by:</span>
              <div className="relative">
                <button 
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="bg-white border border-gray-200 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold shadow-sm flex items-center gap-2 hover:bg-gray-50 whitespace-nowrap"
                >
                  {sortOption}
                  <ChevronDownIcon className="w-3.5 h-3.5" />
                </button>
                {isSortOpen && (
                  <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 py-1 overflow-hidden z-30">
                    {sortOptions.map(opt => (
                      <button
                        key={opt}
                        onClick={() => { setSortOption(opt); setIsSortOpen(false); }}
                        className={`block w-full text-left px-3 py-1.5 text-xs font-medium hover:bg-[#792CA2]/10 hover:text-[#792CA2] ${sortOption === opt ? "bg-[#792CA2]/5 text-[#792CA2]" : "text-gray-600"}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <button 
                onClick={fetchAlerts}
                className="p-1.5 bg-white border border-gray-200 text-gray-500 hover:text-[#792CA2] hover:border-[#792CA2]/30 rounded-lg shadow-sm transition-all flex-shrink-0"
                title="Refresh alerts list"
              >
                <ArrowPathIcon className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-grow overflow-visible md:overflow-y-auto custom-scrollbar pr-2 h-auto md:h-0">
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
                <div className="text-center py-12 text-xs font-semibold text-gray-400 bg-gray-50/50 border border-dashed border-gray-200 rounded-xl">
                  No {activeTab.toLowerCase()} alerts in this category
                </div>
              ) : (
                sortedAlerts.map((alert, i) => (
                  <motion.div
                    key={alert._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    onClick={() => setSelectedAlert(selectedAlert?._id === alert._id ? null : alert)}
                    className={`bg-white border p-3.5 rounded-xl shadow-sm hover:shadow-md transition-colors duration-250 cursor-pointer flex flex-col group ${
                      selectedAlert?._id === alert._id ? 'border-2 border-[#792CA2] bg-[#792CA2]/5' : 'border-gray-100 hover:border-[#792CA2]/30'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          alert.severity === 'Critical' ? 'bg-red-500 animate-pulse' :
                          alert.severity === 'High' ? 'bg-orange-500' :
                          alert.severity === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <span className="text-sm font-semibold text-gray-700 group-hover:text-[#792CA2] transition-colors line-clamp-1">{alert.message}</span>
                      </div>
                      <ChevronDownIcon className={`w-4 h-4 text-gray-300 transition-transform ${
                        selectedAlert?._id === alert._id ? 'rotate-0 text-[#792CA2]' : '-rotate-90 group-hover:translate-x-1'
                      }`} />
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
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                          <div className="flex items-center gap-2.5 flex-nowrap whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                              alert.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                              alert.severity === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                              alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 
                              'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                              {alert.severity} Severity
                            </span>
                            <span className="text-[10px] font-bold text-gray-400">•</span>
                            <span className="text-xs font-bold text-gray-500 uppercase">{alert.environment}</span>
                          </div>
                          <div className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase w-fit ${
                            alert.status === 'resolved' ? 'bg-green-100 text-green-700 border border-green-200/50' :
                            alert.status === 'in progress' ? 'bg-amber-100 text-amber-700 border border-amber-200/50' :
                            'bg-rose-100 text-rose-700 border border-rose-200/50'
                          }`}>
                            {alert.status}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 text-[10px] font-semibold text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/40">Resource ID: <strong className="text-gray-700">{alert.resourceId}</strong></span>
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md border border-gray-200/40">Type: <strong className="text-gray-700">{alert.type}</strong></span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div className="bg-white border border-gray-150 p-2.5 rounded-xl shadow-sm">
                            <p className="text-[8px] font-bold text-gray-400 uppercase tracking-wide">Current Cost</p>
                            <p className="text-xs font-extrabold text-gray-600 mt-0.5">${Math.round(alert.currentCost || 0)}/mo</p>
                          </div>
                          <div className="bg-emerald-500/5 border border-emerald-500/15 p-2.5 rounded-xl shadow-sm">
                            <p className="text-[8px] font-bold text-emerald-600 uppercase tracking-wide">Potential Savings</p>
                            <p className="text-xs font-black text-emerald-600 mt-0.5">${Math.round(alert.potentialSavings || 0)}/mo</p>
                          </div>
                        </div>

                        <div className="bg-white border border-gray-150 rounded-xl p-3 shadow-sm">
                          <h4 className="text-[9px] font-black text-[#111844] uppercase tracking-wider mb-1">Recommended Mitigation</h4>
                          <p className="text-[11px] text-gray-500 leading-relaxed font-medium">
                            {alert.type === "Idle" && "This resource has average CPU utilization below 5% for the past 7 days, indicating it is currently not being utilized. To optimize costs, terminate the instance or configure standard scheduling to shut it down during off-hours."}
                            {alert.type === "Oversized" && "The instance's maximum CPU and memory utilization are low, indicating it is oversized for its workload. Downsizing the instance to a smaller family (e.g. t3.medium to t3.small) will safely save up to 40% of compute cost."}
                            {alert.type === "UnattachedStorage" && "This S3 bucket has zero read/write operations over the past 7 days, indicating it is likely abandoned. Archive data to Glacier or delete the bucket completely to eliminate storage overhead."}
                          </p>
                        </div>

                        <div className="pt-2 flex flex-col gap-2">
                          {alert.status === "unresolved" && (
                            <>
                              <button 
                                onClick={() => updateAlertStatus(alert._id, "in progress")}
                                className="w-full bg-white hover:bg-[#792CA2]/5 text-[#792CA2] border border-[#792CA2]/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Start Progress
                              </button>
                              <button 
                                onClick={() => updateAlertStatus(alert._id, "resolved")}
                                className="w-full bg-[#111844] hover:bg-[#1F215D] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Resolve Alert
                              </button>
                            </>
                          )}
                          {alert.status === "in progress" && (
                            <>
                              <button 
                                onClick={() => updateAlertStatus(alert._id, "unresolved")}
                                className="w-full bg-white hover:bg-gray-50 text-gray-500 border border-gray-300 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Mark Unresolved
                              </button>
                              <button 
                                onClick={() => updateAlertStatus(alert._id, "resolved")}
                                className="w-full bg-[#111844] hover:bg-[#1F215D] text-white px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                              >
                                Resolve Alert
                              </button>
                            </>
                          )}
                          {alert.status === "resolved" && (
                            <button 
                              onClick={() => updateAlertStatus(alert._id, "unresolved")}
                              className="w-full bg-white hover:bg-[#792CA2]/5 text-[#792CA2] border border-[#792CA2]/20 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                              Reopen Alert
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
