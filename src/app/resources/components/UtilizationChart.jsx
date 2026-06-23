"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
  Label
} from "recharts";

export default function UtilizationChart({
  environment = "Production",
  resources = [],
  utilizationTrends = [],
  isLoading = false,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [serviceFilterOpen, setServiceFilterOpen] = useState(false);
  const [timeFilterOpen, setTimeFilterOpen] = useState(false);

  const [selectedMetric, setSelectedMetric] = useState("CPU Utilization");
  const [serviceFilter, setServiceFilter] = useState("All");
  const [timeFilter, setTimeFilter] = useState("Hourly");

  const [drilldownServer, setDrilldownServer] = useState(null);
  const [drilldownMetric, setDrilldownMetric] = useState(null);
  const [showAllInstances, setShowAllInstances] = useState(false);

  const coordsRef = useRef({});
  const filterRef = useRef(null);

  useEffect(() => {
    setDrilldownServer(null);
    setDrilldownMetric(null);
  }, [environment, serviceFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
        setServiceFilterOpen(false);
        setTimeFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filter instances by service
  const serverResources = resources.filter((r) => {
    if (r.service !== "EC2" && r.service !== "RDS" && r.service !== "S3") return false;
    if (serviceFilter === "All") return true;
    return r.service === serviceFilter;
  });

  const fullData = serverResources.map((r) => ({
    name: r.resourceId,
    cpu: r.cpu,
    memory: r.memory,
    storage: r.storage,
    network: r.network,
  }));

  const data = showAllInstances ? fullData : fullData.slice(0, 5);

  const handleBarClick = (item) => {
    if (item && item.name) {
      setDrilldownServer(item.name);
    }
  };

  const handleDrilldownBarClick = (item) => {
    if (item && item.name) {
      setDrilldownMetric(item.name);
    }
  };

  const renderBar = () => {
    const commonProps = {
      onClick: handleBarClick,
      barSize: 14,
      className: "cursor-pointer hover:opacity-80 transition-opacity",
      shape: (props) => {
        const { x, y, width, height, fill, payload, onClick, className } = props;
        if (payload && payload.name) {
          coordsRef.current[payload.name] = { x: x + width, y: y + height / 2 };
        }
        const r = 4;
        if (width < r) {
          return <rect x={x} y={y} width={width} height={height} fill={fill} onClick={onClick} className={className} />;
        }
        const d = `M${x},${y} L${x+width-r},${y} A${r},${r} 0 0,1 ${x+width},${y+r} L${x+width},${y+height-r} A${r},${r} 0 0,1 ${x+width-r},${y+height} L${x},${y+height} Z`;
        return <path d={d} fill={fill} onClick={onClick} className={className} />;
      }
    };

    switch (selectedMetric) {
      case "Memory Utilization":
        return <Bar dataKey="memory" name="Memory (%)" fill="#792CA2" {...commonProps} />;
      case "Storage":
        return <Bar dataKey="storage" name="Storage (%)" fill="#792CA2" {...commonProps} />;
      case "Network":
        return <Bar dataKey="network" name="Network (%)" fill="#792CA2" {...commonProps} />;
      case "CPU Utilization":
      default:
        return <Bar dataKey="cpu" name="CPU (%)" fill="#792CA2" {...commonProps} />;
    }
  };

  let drilldownData = [];
  let serverObj = null;
  if (drilldownServer && !drilldownMetric) {
    serverObj = data.find((s) => s.name === drilldownServer);
    if (serverObj) {
      drilldownData = [
        { name: "CPU", value: serverObj.cpu, fill: "#792CA2" },
        { name: "Memory", value: serverObj.memory, fill: "#9A4DCC" },
        { name: "Storage", value: serverObj.storage, fill: "#1F215D" },
        { name: "Network", value: serverObj.network, fill: "#DCCBFF" },
      ];
    }
  }

  // Generate LineChart data if Level 2 drilldown is active
  const getTrendData = () => {
    if (!drilldownServer || !drilldownMetric) return [];
    
    // Filter trends for this specific server
    const serverTrends = utilizationTrends.filter(t => t.resourceId === drilldownServer);
    
    const getMetricValue = (t) => {
      if (drilldownMetric === "CPU") return t.cpu || 0;
      if (drilldownMetric === "Memory") return t.memory || 0;
      if (drilldownMetric === "Storage") return t.storage || 0;
      if (drilldownMetric === "Network") return Math.min(100, Math.round(((t.readOps || 0) + (t.writeOps || 0)) / 400));
      return 0;
    };

    if (timeFilter === "Hourly") {
      const hourlyMap = {};
      serverTrends.forEach(t => {
        const key = `${t.year}-${t.month}-${t.day}-${t.hour}`;
        if (!hourlyMap[key]) {
          hourlyMap[key] = { year: t.year, month: t.month, day: t.day, hour: t.hour, val: 0, count: 0 };
        }
        hourlyMap[key].val += getMetricValue(t);
        hourlyMap[key].count += 1;
      });
      const sorted = Object.values(hourlyMap).sort((a, b) => {
        return new Date(a.year, a.month - 1, a.day, a.hour) - new Date(b.year, b.month - 1, b.day, b.hour);
      });
      const slice = sorted.slice(-24);
      return slice.map((t) => {
        const ampm = t.hour >= 12 ? "pm" : "am";
        let displayHour = t.hour % 12;
        if (displayHour === 0) displayHour = 12;
        return {
          name: `${displayHour} ${ampm}`,
          value: Math.round(t.val / t.count),
        };
      });
    }

    if (timeFilter === "Daily") {
      const dailyMap = {};
      serverTrends.forEach((t) => {
        const key = `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
        if (!dailyMap[key]) dailyMap[key] = { val: 0, count: 0 };
        dailyMap[key].val += getMetricValue(t);
        dailyMap[key].count += 1;
      });
      const sortedKeys = Object.keys(dailyMap).sort().slice(-7);
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return sortedKeys.map((key) => {
        const d = new Date(key);
        return {
          name: daysOfWeek[d.getDay()] || key,
          value: Math.round(dailyMap[key].val / dailyMap[key].count),
        };
      });
    }

    if (timeFilter === "Weekly") {
      const dailyMap = {};
      serverTrends.forEach((t) => {
        const key = `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
        if (!dailyMap[key]) dailyMap[key] = { val: 0, count: 0 };
        dailyMap[key].val += getMetricValue(t);
        dailyMap[key].count += 1;
      });
      const sortedKeys = Object.keys(dailyMap).sort();
      const weekly = [];
      for (let i = 0; i < 4; i++) {
        const startIndex = Math.max(0, sortedKeys.length - (4 - i) * 7);
        const endIndex = sortedKeys.length - (3 - i) * 7;
        const weekSliceKeys = sortedKeys.slice(startIndex, endIndex);
        
        let sum = 0;
        let count = 0;
        weekSliceKeys.forEach(k => {
          sum += dailyMap[k].val;
          count += dailyMap[k].count;
        });
        
        weekly.push({
          name: `Week ${i + 1}`,
          value: count > 0 ? Math.round(sum / count) : 0,
        });
      }
      return weekly;
    }

    if (timeFilter === "Monthly") {
      const monthlyMap = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      serverTrends.forEach((t) => {
        const key = months[t.month - 1] || `Month ${t.month}`;
        if (!monthlyMap[key]) monthlyMap[key] = { val: 0, count: 0 };
        monthlyMap[key].val += getMetricValue(t);
        monthlyMap[key].count += 1;
      });
      return Object.keys(monthlyMap).map((name) => ({
        name,
        value: Math.round(monthlyMap[name].val / monthlyMap[name].count),
      }));
    }

    return [];
  };

  const trendData = drilldownMetric ? getTrendData() : [];
  const chartHeight = drilldownServer ? 500 : data.length * 40 + 80;

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 mt-8 h-auto`} style={{ minHeight: drilldownServer ? 500 : 250 }}>
      {/* Subtle loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 rounded-3xl flex items-center justify-center z-[999] backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center gap-2">
          {drilldownServer ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  if (drilldownMetric) {
                    setDrilldownMetric(null);
                  } else {
                    setDrilldownServer(null);
                  }
                }}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title={drilldownMetric ? "Back to Server Metrics" : "Back to Servers"}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">
                {drilldownMetric ? `${drilldownServer} - ${drilldownMetric} Trend` : `${drilldownServer} Details`}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">
                Utilization Metrics
              </span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5 tracking-normal">
                Click chart bar for details
              </span>
            </div>
          )}
        </h3>
        <div className="relative flex items-center gap-3" ref={filterRef}>
          {drilldownMetric ? (
            <div className="relative">
              <button
                onClick={() => setTimeFilterOpen(!timeFilterOpen)}
                className="bg-[#F9F7F7] border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-xs font-semibold text-[#111844] hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                {timeFilter} <ChevronDownIcon className="w-4 h-4 text-gray-500" />
              </button>
              {timeFilterOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-[999] py-1 overflow-hidden">
                  {["Hourly", "Daily", "Weekly", "Monthly"].map((option) => (
                    <button
                      key={option}
                      onClick={() => {
                        setTimeFilter(option);
                        setTimeFilterOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : !drilldownServer ? (
            <>
              <div className="relative">
                <button
                  onClick={() => { setServiceFilterOpen(!serviceFilterOpen); setFilterOpen(false); }}
                  className="bg-[#F9F7F7] border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-xs font-semibold text-[#111844] hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {serviceFilter} <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </button>
                {serviceFilterOpen && (
                  <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-[999] py-1 overflow-hidden">
                    {["All", "EC2", "RDS", "S3"].map((option) => (
                      <button
                        key={option}
                        onClick={() => {
                          setServiceFilter(option);
                          setServiceFilterOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors"
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div className="relative">
                <button
                  onClick={() => { setFilterOpen(!filterOpen); setServiceFilterOpen(false); }}
                  className="bg-[#F9F7F7] border border-gray-200 px-4 py-2 rounded-xl shadow-sm text-xs font-semibold text-[#111844] hover:bg-gray-50 transition-colors flex items-center gap-2"
                >
                  {selectedMetric} <ChevronDownIcon className="w-4 h-4 text-gray-500" />
                </button>
                {filterOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-[999] py-1 overflow-hidden">
                    {["CPU Utilization", "Memory Utilization", "Storage", "Network"].map((metric) => (
                      <button
                        key={metric}
                        onClick={() => {
                          setSelectedMetric(metric);
                          setFilterOpen(false);
                        }}
                        className={`block w-full text-left px-4 py-2 text-xs font-medium hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors ${selectedMetric === metric ? "bg-[#792CA2]/5 text-[#792CA2]" : "text-gray-700"}`}
                      >
                        {metric}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : null}
        </div>
      </div>
      
      {drilldownServer && drilldownMetric ? (
        <div className="flex-grow w-full relative flex flex-col">
          <div className="absolute left-[10px] top-1/2" style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)", fontSize: 13, fontWeight: "bold", color: "#111844", userSelect: "none", pointerEvents: "none", zIndex: 10 }}>
            {drilldownMetric} (%) ➔
          </div>
          <ResponsiveContainer width="100%" height={380} className="focus:outline-none">
            <LineChart
              style={{ outline: "none" }}
              data={trendData}
              margin={{ top: 30, right: 30, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 10 }}
                interval={timeFilter === "Hourly" ? 2 : 0}
                dy={10}
              >
                <Label
                  value="Time ➔"
                  offset={-15}
                  position="insideBottom"
                  style={{ fill: "#111844", fontSize: 13, fontWeight: "bold" }}
                />
              </XAxis>
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 12 }}
                tickFormatter={(value) => `${value}%`}
                dx={-10}
              />
              <Tooltip
                cursor={{ stroke: "rgba(121, 44, 162, 0.1)", strokeWidth: 2 }}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-[#111844] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap flex flex-col items-center gap-0.5" style={{ transform: "translate(-50%, -100%)", marginTop: "-10px" }}>
                        <span className="text-[10px] text-[#DCCBFF] font-medium">{label}</span>
                        <span>{payload[0].value}%</span>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#792CA2"
                strokeWidth={4}
                dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#792CA2" }}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#9A4DCC" }}
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : drilldownServer && !drilldownMetric ? (
        <div className="flex flex-col h-full gap-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
            {[
              { label: "CPU", value: serverObj?.cpu || 0, color: "text-[#792CA2]", bg: "bg-[#792CA2]/10" },
              { label: "Memory", value: serverObj?.memory || 0, color: "text-[#9A4DCC]", bg: "bg-[#9A4DCC]/10" },
              { label: "Storage", value: serverObj?.storage || 0, color: "text-[#1F215D]", bg: "bg-[#1F215D]/10" },
              { label: "Network", value: serverObj?.network || 0, color: "text-[#792CA2]", bg: "bg-[#DCCBFF]/40" },
            ].map((kpi, idx) => (
              <div key={idx} className={`rounded-xl p-4 flex flex-col justify-center items-start ${kpi.bg}`}>
                <p className="text-xs font-semibold text-gray-500 mb-1">{kpi.label} Usage</p>
                <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}%</p>
              </div>
            ))}
          </div>

          <div className="flex-grow w-full relative" style={{ height: 260 }}>
            <div className="absolute left-[10px] top-1/2 -translate-y-1/2 -translate-x-1" style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)", fontSize: 12, fontWeight: 700, color: "#111844", userSelect: "none", pointerEvents: "none" }}>
              Percentage ➔
            </div>
            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
              <BarChart style={{ outline: "none" }} data={drilldownData} margin={{ top: 20, right: 10, left: 40, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} dy={6} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 11 }} dx={-4} />
                <Tooltip cursor={{ fill: "rgba(121, 44, 162, 0.05)" }} contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)" }} />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={1000} animationEasing="ease-in-out" onClick={(data) => handleDrilldownBarClick(data)} className="cursor-pointer hover:opacity-80 transition-opacity">
                  {drilldownData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="text-center" style={{ fontSize: 12, fontWeight: 700, color: "#111844", marginTop: 2 }}>
              Metric ➔
            </div>
          </div>
        </div>
      ) : (
        <div className={`relative w-full ${showAllInstances ? "overflow-y-auto max-h-[400px] pr-2 custom-scrollbar" : ""}`}>
          <div className="absolute left-[10px] top-1/2" style={{ writingMode: "vertical-rl", transform: "rotate(180deg) translateY(50%)", fontSize: 11, fontWeight: 700, color: "#111844", userSelect: "none", pointerEvents: "none", zIndex: 10 }}>
            Server ➔
          </div>
          <ResponsiveContainer width="100%" height={chartHeight} className="focus:outline-none">
            <BarChart
              style={{ outline: "none" }}
              layout="vertical"
              data={data}
              margin={{ top: 0, right: 10, left: 30, bottom: 20 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: "#6B7280", fontSize: 10 }} dy={6} />
              <YAxis
                dataKey="name"
                type="category"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#6B7280", fontSize: 10, fontWeight: 600 }}
                width={90}
                dx={-4}
                interval={0}
                tickFormatter={(val) => val.length > 14 ? `${val.slice(0, 11)}...` : val}
              />
               <Tooltip
                cursor={{ fill: "rgba(121, 44, 162, 0.05)" }}
                position={{ x: 0, y: 0 }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const name = payload[0].payload.name;
                    const value = payload[0].value;
                    const pos = coordsRef.current[name];
                    if (!pos) return null;
                    
                    // If the bar value is high, it's near the right edge. Flip tooltip to the left side.
                    const isNearEdge = value >= 70;
                    const translateX = isNearEdge ? "-100%" : "0%";
                    const marginLeft = isNearEdge ? "-10px" : "10px";
                    
                    return (
                      <div style={{ position: "absolute", left: pos.x, top: pos.y, transform: `translate(${translateX}, -50%)`, marginLeft }}>
                        <div className="bg-[#111844] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap flex flex-col items-start gap-0.5">
                          <span className="text-[10px] text-[#DCCBFF] font-medium">{name}</span>
                          <span>{value}%</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: "12px" }} />
              {renderBar()}
            </BarChart>
          </ResponsiveContainer>
          <div className="flex flex-col items-center justify-center pt-2 pb-1 relative z-10 w-full">
            <div className="text-center" style={{ fontSize: 12, fontWeight: 700, color: "#111844" }}>
              Percentage ➔
            </div>
            {fullData.length > 5 && (
              <button
                onClick={() => setShowAllInstances(!showAllInstances)}
                className="mt-3 px-4 py-1.5 text-xs font-bold text-[#792CA2] bg-[#792CA2]/10 hover:bg-[#792CA2]/20 rounded-full transition-colors flex items-center gap-1.5"
              >
                {showAllInstances ? "Show Less" : `View All (${fullData.length})`}
                <ChevronDownIcon className={`w-3 h-3 transition-transform ${showAllInstances ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
