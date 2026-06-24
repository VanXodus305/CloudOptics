"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClockIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/optimization/alerts");
      if (!res.ok) throw new Error("Failed to fetch alerts");
      const data = await res.json();
      setAlerts(data);
    } catch (err) {
      console.error("Error loading alert history:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const totalAlerts = alerts.length;
  const unresolvedAlerts = alerts.filter(a => a.status === "unresolved").length;
  const inProgressAlerts = alerts.filter(a => a.status === "in progress").length;
  const resolvedAlerts = alerts.filter(a => a.status === "resolved").length;

  const recentAlerts = [...alerts]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      className="relative mb-24 md:mb-0"
    >
      <div className="bg-white/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white flex flex-col relative z-0 min-h-[250px]">
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-2 justify-center sm:justify-start">
            <ClockIcon className="w-5 h-5 text-[#792CA2]" />
            <h3 className="text-lg font-black text-[#111844] tracking-tight text-center sm:text-left">Alert History & Stats</h3>
          </div>
          <button 
            onClick={fetchAlerts}
            className="w-full sm:w-auto justify-center p-1.5 bg-white border border-gray-200 text-gray-500 hover:text-[#792CA2] hover:border-[#792CA2]/30 rounded-lg shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowPathIcon className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
            Refresh History
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 border border-gray-150 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Alerts</p>
            <p className="text-2xl font-black text-[#111844] mt-1">{totalAlerts}</p>
          </div>
          <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-rose-500 uppercase tracking-wider">Unresolved</p>
            <p className="text-2xl font-black text-rose-600 mt-1">{unresolvedAlerts}</p>
          </div>
          <div className="bg-amber-500/5 border border-amber-500/10 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-black text-amber-600 mt-1">{inProgressAlerts}</p>
          </div>
          <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider">Resolved</p>
            <p className="text-2xl font-black text-emerald-600 mt-1">{resolvedAlerts}</p>
          </div>
        </div>

        <div className="bg-white/80 rounded-2xl p-6 border border-white shadow-inner flex-grow">
          <h4 className="text-xs font-black text-[#111844] uppercase tracking-wider mb-4 border-b border-gray-100 pb-2">Recent Status Changes</h4>
          
          {isLoading ? (
            <div className="space-y-3">
              {[0, 1, 2].map(i => (
                <div key={i} className="h-10 bg-gray-100 animate-pulse rounded-xl w-full" />
              ))}
            </div>
          ) : recentAlerts.length === 0 ? (
            <p className="text-gray-400 font-medium text-center py-6 text-xs">No recent alert updates found.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {recentAlerts.map((alert) => (
                <div key={alert._id} className="py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      alert.severity === 'Critical' ? 'bg-red-100 text-red-700' :
                      alert.severity === 'High' ? 'bg-orange-100 text-orange-700' :
                      alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {alert.severity}
                    </span>
                    <span className="font-semibold text-gray-700 leading-snug">{alert.message}</span>
                  </div>
                  <div className="flex items-center gap-3 self-end sm:self-auto text-[10px] font-bold">
                    <span className="text-gray-400 uppercase tracking-wider">{alert.environment}</span>
                    <span className="text-gray-400">•</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                      alert.status === 'resolved' ? 'bg-green-100 text-green-700' :
                      alert.status === 'in progress' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {alert.status}
                    </span>
                    <span className="text-gray-400 font-medium">{new Date(alert.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
