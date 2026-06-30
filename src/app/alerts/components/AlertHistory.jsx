"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ClockIcon, ArrowPathIcon, ChartBarIcon, CheckCircleIcon, ExclamationTriangleIcon, BoltIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from "recharts";

export default function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const checkDark = () => setIsDark(document.documentElement.classList.contains('dark'));
    checkDark();
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

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
  const resolvedAlerts = alerts.filter(a => a.status === "resolved" || a.status === "archived").length;

  const envDataMap = {};
  alerts.forEach(a => {
    const env = a.environment || 'Unknown';
    if (!envDataMap[env]) {
      envDataMap[env] = { name: env, "Potential Savings ($)": 0, "Current Cost ($)": 0 };
    }
    envDataMap[env]["Potential Savings ($)"] += Math.round(a.potentialSavings || 0);
    envDataMap[env]["Current Cost ($)"] += Math.round(a.currentCost || 0);
  });
  const chartData = Object.values(envDataMap);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-[#111844] rounded-2xl border border-gray-100 dark:border-white/10 shadow-[0_10px_25px_rgba(0,0,0,0.05)] dark:shadow-xl px-4 py-2 text-center -translate-x-1/2 -translate-y-full flex flex-col items-center justify-center pointer-events-none min-w-max">
          <p className="text-[11px] font-black" style={{ color: payload[0].fill }}>
            {payload[0].name.replace(' ($)', '')} : ${payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15, delay: 0.2 }}
      className="relative mb-24 md:mb-0"
    >
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4 pl-2">
        <div className="flex items-center gap-3 justify-center sm:justify-start">
          <motion.div
            whileHover={{ scale: 1.1, rotate: -10 }}
            className="p-2 bg-gradient-to-br from-[#792CA2] to-[#9A4DCC] rounded-xl shadow-lg shadow-[#792CA2]/20 flex items-center justify-center"
          >
            <ClockIcon className="w-5 h-5 text-white" strokeWidth={2.5} />
          </motion.div>
          <h3 className="text-xl md:text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC]">Alert History & Stats</h3>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={fetchAlerts}
          className="w-full sm:w-auto justify-center p-1.5 px-3 bg-white dark:bg-transparent border border-gray-200 dark:border-white/10 text-gray-500 dark:text-gray-400 hover:text-[#792CA2] dark:hover:text-[#DCCBFF] hover:border-[#792CA2]/30 dark:hover:border-white/30 rounded-lg shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowPathIcon className={`w-3.5 h-3.5 ${isLoading ? "animate-spin" : ""}`} />
          Refresh History
        </motion.button>
      </div>

      <div className="bg-white/50 dark:bg-[#0F122B]/50 backdrop-blur-md rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white dark:border-white/10 flex flex-col relative z-0 min-h-[250px]">

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white/80 dark:bg-white/5 border border-gray-150 dark:border-white/10 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Total Alerts</p>
            <p className="text-2xl font-black text-[#111844] dark:text-white mt-1">{totalAlerts}</p>
          </div>
          <div className="bg-rose-500/5 dark:bg-rose-500/10 border border-rose-500/10 dark:border-rose-500/20 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-rose-500 dark:text-rose-400 uppercase tracking-wider">Unresolved</p>
            <p className="text-2xl font-black text-rose-600 dark:text-rose-500 mt-1">{unresolvedAlerts}</p>
          </div>
          <div className="bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10 dark:border-amber-500/20 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-amber-500 dark:text-amber-400 uppercase tracking-wider">In Progress</p>
            <p className="text-2xl font-black text-amber-600 dark:text-amber-500 mt-1">{inProgressAlerts}</p>
          </div>
          <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/10 dark:border-emerald-500/20 p-4 rounded-2xl shadow-sm text-center">
            <p className="text-[10px] font-bold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">Resolved</p>
            <p className="text-2xl font-black text-emerald-600 dark:text-emerald-500 mt-1">{resolvedAlerts}</p>
          </div>
        </div>

        <div className="bg-white/80 dark:bg-transparent rounded-2xl p-6 border border-white dark:border-white/10 shadow-inner dark:shadow-none flex-grow flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <ChartBarIcon className="w-4 h-4 text-[#792CA2] dark:text-[#DCCBFF]" />
              <h4 className="text-sm font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] uppercase">Optimization Impact Analysis</h4>
            </div>
          </div>
          
          {isLoading ? (
            <div className="flex-grow flex items-center justify-center min-h-[250px]">
              <div className="w-8 h-8 border-2 border-[#792CA2] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : chartData.length === 0 ? (
            <div className="flex-grow flex items-center justify-center min-h-[250px]">
              <p className="text-gray-400 font-medium text-xs">No data available for analysis.</p>
            </div>
          ) : selectedEnv ? (
            <div className="flex-grow flex flex-col w-full h-[300px] mt-4 overflow-y-auto overflow-x-hidden pr-2 custom-scrollbar">
              <div className="flex items-center gap-3 mb-4 sticky top-0 bg-white/90 dark:bg-[#111844]/90 backdrop-blur-md z-10 py-2 border-b border-gray-100 dark:border-white/10">
                <motion.button 
                  whileHover={{ scale: 1.05, x: -2 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEnv(null)} 
                  className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-md transition-colors flex items-center gap-1 text-gray-500 dark:text-gray-300 font-bold text-xs"
                >
                  <ArrowLeftIcon className="w-4 h-4" /> Back to Chart
                </motion.button>
                <h5 className="text-[11px] font-black text-[#111844] dark:text-white uppercase tracking-wider ml-auto">{selectedEnv} Environment Alerts</h5>
              </div>
              <div className="flex flex-col gap-3">
                {alerts.filter(a => a.environment === selectedEnv).map((alert, index) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    whileHover={{ scale: 1.02, x: 4 }}
                    transition={{ delay: index * 0.05, type: "spring", stiffness: 300, damping: 20 }}
                    key={alert._id} 
                    className="group bg-white dark:bg-[#111844]/50 border border-gray-150 dark:border-white/10 p-4 rounded-xl shadow-sm hover:shadow-md hover:border-[#792CA2]/40 dark:hover:border-white/30 transition-all duration-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 cursor-default relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b opacity-0 group-hover:opacity-100 transition-opacity duration-300 from-[#792CA2] to-[#2B3074]" />
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm border ${
                        (alert.status === 'resolved' || alert.status === 'archived') ? 'bg-emerald-50 text-emerald-500 border-emerald-100' :
                        alert.status === 'in progress' ? 'bg-amber-50 text-amber-500 border-amber-100' : 'bg-rose-50 text-rose-500 border-rose-100'
                      }`}>
                        {(alert.status === 'resolved' || alert.status === 'archived') ? <CheckCircleIcon className="w-5 h-5" /> :
                         alert.status === 'in progress' ? <BoltIcon className="w-5 h-5" /> : <ExclamationTriangleIcon className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider ${alert.severity === 'Critical' ? 'bg-red-100 text-red-700 border border-red-200' :
                              alert.severity === 'High' ? 'bg-orange-100 text-orange-700 border border-orange-200' :
                                alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700 border border-yellow-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
                            }`}>
                            {alert.severity}
                          </span>
                          <span className="text-gray-400 font-bold text-[10px] bg-gray-50 dark:bg-white/5 px-2 py-0.5 rounded border border-gray-100 dark:border-white/10">
                            {new Date(alert.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <span className="font-extrabold text-gray-700 dark:text-gray-300 text-xs leading-snug line-clamp-1 group-hover:text-[#111844] dark:group-hover:text-white transition-colors">{alert.message}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-start sm:items-end gap-2 ml-14 sm:ml-0">
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-sm border ${(alert.status === 'resolved' || alert.status === 'archived') ? 'bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border-emerald-500/20 text-emerald-700' :
                          alert.status === 'in progress' ? 'bg-gradient-to-r from-amber-500/10 to-amber-500/5 border-amber-500/20 text-amber-700' : 'bg-gradient-to-r from-rose-500/10 to-rose-500/5 border-rose-500/20 text-rose-700'
                        }`}>
                        <div className={`w-1.5 h-1.5 rounded-full shadow-sm ${(alert.status === 'resolved' || alert.status === 'archived') ? 'bg-emerald-500' : alert.status === 'in progress' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        {alert.status === 'archived' ? 'resolved' : alert.status}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-[300px] mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? "rgba(255,255,255,0.05)" : "#f4f4f5"} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 700 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: '#9CA3AF', fontWeight: 600 }}
                    tickFormatter={(value) => `$${value}`}
                  />
                  <Tooltip 
                    shared={false}
                    cursor={{ fill: isDark ? 'rgba(255,255,255,0.05)' : '#f9fafb' }}
                    content={<CustomTooltip />}
                    position={activeTooltip ? { x: activeTooltip.x, y: activeTooltip.y - 4 } : undefined}
                    wrapperStyle={{ zIndex: 100, pointerEvents: 'none' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', fontWeight: 700, paddingTop: '15px' }} />
                  <Bar 
                    dataKey="Current Cost ($)" 
                    fill={isDark ? "#93C5FD" : "#111844"} 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={40} 
                    onClick={(data) => setSelectedEnv(data.name)} 
                    onMouseEnter={(data) => setActiveTooltip({ x: data.x + data.width / 2, y: data.y })}
                    onMouseLeave={() => setActiveTooltip(null)}
                    cursor="pointer" 
                  />
                  <Bar 
                    dataKey="Potential Savings ($)" 
                    fill={isDark ? "#C084FC" : "#792CA2"} 
                    radius={[6, 6, 0, 0]} 
                    maxBarSize={40} 
                    onClick={(data) => setSelectedEnv(data.name)} 
                    onMouseEnter={(data) => setActiveTooltip({ x: data.x + data.width / 2, y: data.y })}
                    onMouseLeave={() => setActiveTooltip(null)}
                    cursor="pointer" 
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
