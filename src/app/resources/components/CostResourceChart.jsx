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
  ResponsiveContainer,
  Cell,
  Label,
  AreaChart,
  Area,
} from "recharts";

export default function CostResourceChart({
  environment = "Production",
  resources = [],
  costTrendsDaily = [],
  costTrendsHourly = [],
  isLoading = false,
}) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("Hourly");
  const [showDetails, setShowDetails] = useState(false);
  const [drilldownResource, setDrilldownResource] = useState(null);
  const coordsRef = useRef({});
  const filterRef = useRef(null);

  useEffect(() => {
    setDrilldownResource(null);
  }, [environment, timeFilter]);

  useEffect(() => {
    setShowDetails(false);
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [environment, timeFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getServiceCost = (service) => {
    const serviceResources = resources.filter((r) => r.service === service);
    return serviceResources.reduce((sum, r) => sum + r.costPerHour, 0);
  };

  const getChartData = () => {
    const services = ["EC2", "S3", "RDS"];
    let multiplier = 1;
    if (timeFilter === "Daily") multiplier = 24;
    else if (timeFilter === "Weekly") multiplier = 168;
    else if (timeFilter === "Monthly") multiplier = 720;

    return services.map((service) => {
      const hourlyCost = getServiceCost(service);
      return {
        name: service,
        usage: Math.round(hourlyCost * multiplier * 100) / 100,
      };
    });
  };

  const handleBarClick = (entry) => {
    if (entry && entry.name) {
      setDrilldownResource(entry.name);
    }
  };

  // Get trend data for the selected service type (drilldownResource)
  const getTrendData = () => {
    if (!drilldownResource) return [];

    const trendsToUse = timeFilter === "Hourly" ? costTrendsHourly : costTrendsDaily;
    const filteredTrends = trendsToUse.filter((t) => t.service === drilldownResource);


    if (timeFilter === "Hourly") {
      // Last 24 hours of data
      const sorted = [...filteredTrends].sort((a, b) => {
        const dateA = new Date(a.year, a.month - 1, a.day, a.hour);
        const dateB = new Date(b.year, b.month - 1, b.day, b.hour);
        return dateA - dateB;
      });
      const slice = sorted.slice(-24);
      return slice.map((t) => {
        const ampm = t.hour >= 12 ? "pm" : "am";
        let displayHour = t.hour % 12;
        if (displayHour === 0) displayHour = 12;
        return {
          time: `${displayHour} ${ampm}`,
          value: Math.round(t.cost * 100) / 100,
        };
      });
    }

    if (timeFilter === "Daily") {
      // Group by day for the last 7 days
      const dailyMap = {};
      filteredTrends.forEach((t) => {
        const key = `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
        dailyMap[key] = (dailyMap[key] || 0) + t.cost;
      });
      const sortedKeys = Object.keys(dailyMap).sort().slice(-7);
      const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
      return sortedKeys.map((key) => {
        const d = new Date(key);
        const name = daysOfWeek[d.getDay() === 0 ? 6 : d.getDay() - 1];
        return {
          time: name || key,
          value: Math.round(dailyMap[key] * 100) / 100,
        };
      });
    }

    if (timeFilter === "Weekly") {
      // Group last 28 days of trends into 4 weeks (7 days each)
      const dailyCosts = {};
      filteredTrends.forEach((t) => {
        const key = `${t.year}-${String(t.month).padStart(2, "0")}-${String(t.day).padStart(2, "0")}`;
        dailyCosts[key] = (dailyCosts[key] || 0) + t.cost;
      });
      const sortedKeys = Object.keys(dailyCosts).sort();
      const weekly = [];
      for (let i = 0; i < 4; i++) {
        const startIndex = Math.max(0, sortedKeys.length - (4 - i) * 7);
        const endIndex = sortedKeys.length - (3 - i) * 7;
        const weekSliceKeys = sortedKeys.slice(startIndex, endIndex);
        const weekSum = weekSliceKeys.reduce((sum, k) => sum + dailyCosts[k], 0);
        
        let weekLabel = `Week ${i + 1}`;
        if (weekSliceKeys.length > 0) {
          const firstDay = weekSliceKeys[0];
          const lastDay = weekSliceKeys[weekSliceKeys.length - 1];
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          
          const [y1, m1, d1] = firstDay.split("-");
          const startStr = `${months[parseInt(m1, 10) - 1]} ${parseInt(d1, 10)}`;
          
          const [y2, m2, d2] = lastDay.split("-");
          const endStr = `${months[parseInt(m2, 10) - 1]} ${parseInt(d2, 10)}`;
          
          weekLabel = `${startStr} - ${endStr}`;
        }

        weekly.push({
          time: weekLabel,
          value: Math.round(weekSum * 100) / 100,
        });
      }
      return weekly;
    }

    if (timeFilter === "Monthly") {
      // Group by month name
      const monthlyMap = {};
      const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      filteredTrends.forEach((t) => {
        const key = months[t.month - 1] || `Month ${t.month}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + t.cost;
      });
      return Object.keys(monthlyMap).map((name) => ({
        time: name,
        value: Math.round(monthlyMap[name] * 100) / 100,
      }));
    }

    return [];
  };

  const data = getChartData();
  const drilldownTrendData = getTrendData();

  // calculations for drilldown KPIs
  const serviceResources = resources.filter((r) => r.service === drilldownResource);
  const activeCount = serviceResources.filter((r) => r.status === "Running" || r.status === "running").length;
  const avgLoad = serviceResources.length > 0 ? serviceResources.reduce((sum, r) => sum + (r.cpu || 0), 0) / serviceResources.length : 0;
  const estCost = serviceResources.reduce((sum, r) => sum + (r.totalCost || r.projectedMonthlyCost), 0);
  const healthPercent = serviceResources.length > 0 ? (activeCount / serviceResources.length) * 100 : 0;

  const COLORS = ["#792CA2", "#9A4DCC", "#1F215D", "#111844", "#DCCBFF"];

  return (
    <div className="bg-white/90 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 dark:border-white/5 h-[380px] w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <style>{`
        .tick-text {
          font-size: 8px;
        }
        @media (min-width: 768px) {
          .tick-text {
            font-size: 10px;
          }
        }
      `}</style>
  
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-[#080A1A]/40 rounded-3xl flex items-center justify-center z-[999] backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2">
          {drilldownResource ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrilldownResource(null)}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title="Back to Chart"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] tracking-tight">
                {drilldownResource} Usage Details
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] tracking-tight flex flex-wrap gap-x-1.5 gap-y-0.5">
                <span>Resources </span>
                <span>Average</span>
                <span>Cost</span>
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 tracking-normal">
                Click chart bar for details
              </span>
            </div>
          )}
        </h3>
        {!drilldownResource && (
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              className="bg-[#F9F7F7] border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-[#111844] hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              {timeFilter} <ChevronDownIcon className="w-3 h-3 text-gray-500" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-2 w-32 bg-[#ffffff] dark:!bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-20 py-1 overflow-hidden">
                {["Hourly", "Daily", "Weekly", "Monthly"].map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      setTimeFilter(option);
                      setFilterOpen(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-xs font-semibold text-gray-700 dark:text-slate-300 hover:bg-[#792CA2]/10 dark:hover:bg-[#C084FC]/15 hover:text-[#792CA2] dark:hover:text-[#C084FC] transition-colors"
                  >
                    {option}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="flex-grow w-full relative">
        {drilldownResource ? (
          <div className="flex flex-col h-full gap-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-2">
              {[
                {
                  label: "Active Instances",
                  value: activeCount,
                  color: "text-[#792CA2] dark:text-[#C084FC]",
                  bg: "bg-[#792CA2]/10 dark:bg-[#792CA2]/20",
                },
                {
                  label: "Avg CPU Load",
                  value: avgLoad.toFixed(1) + "%",
                  color: "text-[#9A4DCC] dark:text-[#E0A9FF]",
                  bg: "bg-[#9A4DCC]/10 dark:bg-[#9A4DCC]/20",
                },
                {
                  label: "Est. Cost (30d)",
                  value: "$" + Math.round(estCost).toLocaleString(),
                  color: "text-[#1F215D] dark:text-[#93C5FD]",
                  bg: "bg-[#1F215D]/10 dark:bg-[#1e293b]/60",
                },
                {
                  label: "Health",
                  value: healthPercent.toFixed(1) + "%",
                  color: "text-green-600 dark:text-green-400",
                  bg: "bg-green-50 dark:bg-green-950/30",
                },
              ].map((kpi, idx) => (
                <div key={idx} className={`rounded-xl p-3 flex flex-col justify-center items-start ${kpi.bg}`}>
                  <p className="text-[10px] font-semibold text-gray-500 dark:text-gray-400 mb-0.5">{kpi.label}</p>
                  <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="flex-grow w-full relative min-h-[120px]">
            {/* Y-axis label */}
            <div
              className="absolute left-[10px] top-[40%] text-[#111844] dark:text-[#F9F7F7]"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg) translateY(50%)",
                fontSize: 11,
                fontWeight: 700,
                userSelect: "none",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              Cost ($) ➔
            </div>
              <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
                <AreaChart style={{ outline: "none" }} data={drilldownTrendData} margin={{ top: 20, right: 45, left: 45, bottom: 35 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#792CA2" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#792CA2" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis 
                    dataKey="time" 
                    axisLine={false} 
                    tickLine={false} 
                    interval={timeFilter === "Hourly" ? 2 : 0} 
                    dy={10}
                    tick={({ x, y, payload }) => (
                      <g transform={`translate(${x},${y})`}>
                        <text x={0} y={0} dy={10} textAnchor="middle" fill="currentColor" className="tick-text text-gray-450 dark:text-slate-400">
                          {payload.value}
                        </text>
                      </g>
                    )}
                  >
                    <Label
                      value="Time ➔"
                      offset={-15}
                      position="insideBottom"
                      className="fill-[#111844] dark:fill-[#F9F7F7] font-bold text-[10px] md:text-[13px]"
                    />
                  </XAxis>
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 10 }} className="text-gray-450 dark:text-slate-400" dx={-10} />
                  <Tooltip
                    cursor={{ fill: "rgba(121, 44, 162, 0.05)" }}
                    offset={0}
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div
                            className="bg-[#111844] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap flex flex-col items-center gap-0.5"
                            style={{ transform: "translate(-50%, -100%)", marginTop: "-10px" }}
                          >
                            <span className="text-[10px] text-[#DCCBFF] font-medium">{label}</span>
                            <span>${payload[0].value.toLocaleString()}</span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area type="monotone" dataKey="value" stroke="#792CA2" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Y-axis label */}
            <div
              className="absolute left-[10px] top-[40%] text-[#111844] dark:text-[#F9F7F7]"
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg) translateY(50%)",
                fontSize: 13,
                fontWeight: 700,
                userSelect: "none",
                pointerEvents: "none",
                zIndex: 10,
              }}
            >
              Cost ($) ➔
            </div>
            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
              <BarChart
                style={{ outline: "none" }}
                key={`${environment}-${timeFilter}`}
                data={data}
                margin={{ top: 30, right: 20, left: 15, bottom: 45 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-gray-450 dark:text-slate-400" dy={10}>
                  <Label
                    value="Resources ➔"
                    offset={-30}
                    position="insideBottom"
                    className="fill-[#111844] dark:fill-[#F9F7F7] font-bold text-xs md:text-sm"
                  />
                </XAxis>
                <YAxis axisLine={false} tickLine={false} tick={{ fill: "currentColor", fontSize: 11 }} className="text-gray-450 dark:text-slate-400" dx={-10} />
                <Tooltip
                  cursor={{ fill: "rgba(121, 44, 162, 0.05)" }}
                  position={{ x: 0, y: 0 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const name = payload[0].payload.name;
                      const pos = coordsRef.current[name];
                      if (!pos) return null;
                      return (
                        <div style={{ position: "absolute", left: pos.x, top: pos.y, transform: "translate(-50%, -100%)", marginTop: "-10px" }}>
                          <div className="bg-[#111844] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap flex flex-col items-center gap-0.5">
                            <span className="text-[10px] text-[#DCCBFF] font-medium">{name}</span>
                            <span>${payload[0].value.toLocaleString()}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar
                  dataKey="usage"
                  isAnimationActive={true}
                  animationDuration={1000}
                  animationEasing="ease-in-out"
                  shape={(props) => {
                    const { x, y, width, height, fill, payload, onClick, className } = props;
                    if (payload && payload.name) {
                      coordsRef.current[payload.name] = { x: x + width / 2, y };
                    }
                    const r = 4;
                    if (height < r) {
                      return <rect x={x} y={y} width={width} height={height} fill={fill} onClick={onClick} className={className} />;
                    }
                    const d = `M${x},${y+height} L${x},${y+r} A${r},${r} 0 0,1 ${x+r},${y} L${x+width-r},${y} A${r},${r} 0 0,1 ${x+width},${y+r} L${x+width},${y+height} Z`;
                    return <path d={d} fill={fill} onClick={onClick} className={className} />;
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      onClick={() => handleBarClick(entry)}
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  );
}
