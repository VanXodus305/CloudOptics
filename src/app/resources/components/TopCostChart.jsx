"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Label,
} from "recharts";

export default function TopCostChart({
  environment = "Production",
  costTrendsDaily = [],
  costTrendsHourly = [],
  costTrendsLive = [],
  isLiveSimulation = false,
  resources = [],
  isLoading = false,
}) {
  const [timeFilterOpen, setTimeFilterOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("Hourly");

  useEffect(() => {
    if (!isLiveSimulation && timeFilter === "Live") {
      setTimeFilter("Hourly");
    }
  }, [isLiveSimulation, timeFilter]);

  const [resourceFilterOpen, setResourceFilterOpen] = useState(false);
  const [resourceFilter, setResourceFilter] = useState("All");
  const [showDetails, setShowDetails] = useState(false);
  const [drilldownTime, setDrilldownTime] = useState(null);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setDrilldownTime(null);
  }, [environment, timeFilter, resourceFilter]);

  const filterRef = useRef(null);

  useEffect(() => {
    setShowDetails(false);
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [environment, timeFilter, resourceFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setTimeFilterOpen(false);
        setResourceFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getChartData = () => {
    if (timeFilter === "Select Time" || resourceFilter === "Select Resource")
      return [];

    if (timeFilter === "Live") {
      const filteredLive =
        resourceFilter === "All"
          ? costTrendsLive
          : costTrendsLive.filter((t) => t.service === resourceFilter);

      const liveMap = {};
      filteredLive.forEach((t) => {
        const d = new Date(t.timestamp);
        const key = d.getTime();
        const name = d.toLocaleTimeString("en-US", {
          hour12: false,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        });
        if (!liveMap[key]) {
          liveMap[key] = {
            timestamp: t.timestamp,
            name,
            cost: 0,
          };
        }
        liveMap[key].cost += t.cost;
      });

      const sortedLive = Object.entries(liveMap)
        .sort((a, b) => Number(a[0]) - Number(b[0]))
        .map((entry) => ({
          name: entry[1].name,
          cost: Math.round(entry[1].cost * 100) / 100,
        }));

      return sortedLive.slice(-15);
    }

    // Filter trends by resource type
    const trendsToUse =
      timeFilter === "Hourly" ? costTrendsHourly : costTrendsDaily;
    const filteredTrends =
      resourceFilter === "All"
        ? trendsToUse
        : trendsToUse.filter((t) => t.service === resourceFilter);

    if (timeFilter === "Hourly") {
      // Group by hour
      const hourlyMap = {};
      filteredTrends.forEach((t) => {
        const key = `${t.year}-${t.month}-${t.day}-${t.hour}`;
        if (!hourlyMap[key]) {
          hourlyMap[key] = {
            year: t.year,
            month: t.month,
            day: t.day,
            hour: t.hour,
            cost: 0,
          };
        }
        hourlyMap[key].cost += t.cost;
      });
      const sorted = Object.values(hourlyMap).sort((a, b) => {
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
          name: `${displayHour} ${ampm}`,
          cost: Math.round(t.cost * 100) / 100,
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
      const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
      return sortedKeys.map((key) => {
        const d = new Date(key);
        const name = daysOfWeek[d.getDay()];
        return {
          name: name || key,
          cost: Math.round(dailyMap[key] * 100) / 100,
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
        const weekSum = weekSliceKeys.reduce(
          (sum, k) => sum + dailyCosts[k],
          0,
        );

        let weekLabel = `Week ${i + 1}`;
        if (weekSliceKeys.length > 0) {
          const firstDay = weekSliceKeys[0];
          const lastDay = weekSliceKeys[weekSliceKeys.length - 1];
          const months = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];

          const [y1, m1, d1] = firstDay.split("-");
          const startStr = `${months[parseInt(m1, 10) - 1]} ${parseInt(d1, 10)}`;

          const [y2, m2, d2] = lastDay.split("-");
          const endStr = `${months[parseInt(m2, 10) - 1]} ${parseInt(d2, 10)}`;

          weekLabel = `${startStr} - ${endStr}`;
        }

        weekly.push({
          name: weekLabel,
          cost: Math.round(weekSum * 100) / 100,
        });
      }
      return weekly;
    }

    if (timeFilter === "Monthly") {
      // Group by month name
      const monthlyMap = {};
      const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      filteredTrends.forEach((t) => {
        const key = months[t.month - 1] || `Month ${t.month}`;
        monthlyMap[key] = (monthlyMap[key] || 0) + t.cost;
      });
      return Object.keys(monthlyMap).map((name) => ({
        name,
        cost: Math.round(monthlyMap[name] * 100) / 100,
      }));
    }

    return [];
  };

  const data = getChartData();
  const timeOptions = isLiveSimulation
    ? ["Live", "Hourly", "Daily", "Weekly", "Monthly"]
    : ["Hourly", "Daily", "Weekly", "Monthly"];
  const resourceOptions = ["All", "EC2", "S3", "RDS"];

  // Actual drilldown resources list
  const drilldownPieData = drilldownTime
    ? resources
        .filter((r) => resourceFilter === "All" || r.service === resourceFilter)
        .map((r) => ({
          name: r.resourceId,
          value: Math.round(r.totalCost || r.projectedMonthlyCost),
        }))
    : [];

  const totalCostVal = drilldownPieData.reduce((a, b) => a + b.value, 0);
  const sortedResources = [...drilldownPieData].sort(
    (a, b) => b.value - a.value,
  );
  const topSpender = sortedResources[0]?.name || "N/A";
  const lowestSpender =
    sortedResources[sortedResources.length - 1]?.name || "N/A";
  const avgCostVal =
    drilldownPieData.length > 0 ? totalCostVal / drilldownPieData.length : 0;

  const COLORS = ["#792CA2", "#9A4DCC", "#1F215D", "#111844", "#DCCBFF"];

  return (
    <div className="bg-white/90 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 dark:border-white/5 h-[400px] w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
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
      {/* Subtle loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-[#080A1A]/40 rounded-3xl flex items-center justify-center z-[999] backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="flex items-center gap-2">
          {drilldownTime ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDrilldownTime(null)}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title="Back to Chart"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] tracking-tight">
                {drilldownTime} Cost Details
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] tracking-tight flex flex-wrap gap-x-1.5 gap-y-0.5">
                <span>Resources</span>
                <span>Cost</span>
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 tracking-normal">
                Click data point for details
              </span>
            </div>
          )}
        </h3>
        {!drilldownTime && (
          <div className="relative flex flex-wrap items-center gap-2.5 sm:gap-3 w-full sm:w-auto" ref={filterRef}>
            {/* Resource Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setResourceFilterOpen(!resourceFilterOpen);
                  setTimeFilterOpen(false);
                }}
                className="bg-[#F9F7F7] dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-[#111844] dark:text-[#F9F7F7] hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
              >
                <span>{resourceFilter}</span>{" "}
                <ChevronDownIcon className="w-3 h-3 text-gray-500" />
              </button>
              {resourceFilterOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#ffffff] dark:!bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-20 py-1 overflow-hidden">
                  {resourceOptions.map((resOption) => (
                    <button
                      key={resOption}
                      onClick={() => {
                        setResourceFilter(resOption);
                        setResourceFilterOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-xs font-semibold text-gray-750 dark:!text-slate-350 hover:bg-[#792CA2]/10 dark:hover:bg-[#C084FC]/15 hover:text-[#792CA2] dark:hover:text-[#C084FC] transition-colors"
                    >
                      {resOption}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Time Filter */}
            <div className="relative">
              <button
                onClick={() => {
                  setTimeFilterOpen(!timeFilterOpen);
                  setResourceFilterOpen(false);
                }}
                className="bg-[#F9F7F7] dark:bg-slate-800 border border-gray-200 dark:border-slate-700 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-[#111844] dark:text-[#F9F7F7] hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1"
              >
                <span>{timeFilter}</span>{" "}
                <ChevronDownIcon className="w-3 h-3 text-gray-500" />
              </button>
              {timeFilterOpen && (
                <div className="absolute right-0 mt-2 w-36 bg-[#ffffff] dark:!bg-slate-900 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700 z-20 py-1 overflow-hidden">
                  {timeOptions.map((timeOption) => (
                    <button
                      key={timeOption}
                      onClick={() => {
                        setTimeFilter(timeOption);
                        setTimeFilterOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-xs font-semibold text-gray-750 dark:!text-slate-350 hover:bg-[#792CA2]/10 dark:hover:bg-[#C084FC]/15 hover:text-[#792CA2] dark:hover:text-[#C084FC] transition-colors"
                    >
                      {timeOption}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex-grow w-full relative">
        {drilldownTime ? (
          <div className="flex flex-col h-full gap-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {[
                {
                  label: "Total Cost (30d)",
                  value: "$" + Math.round(totalCostVal).toLocaleString(),
                  color: "text-[#792CA2] dark:text-[#C084FC]",
                  bg: "bg-[#792CA2]/10 dark:bg-[#792CA2]/20",
                },
                {
                  label: "Top Spender",
                  value: topSpender,
                  color: "text-[#111844] dark:text-[#F9F7F7]",
                  bg: "bg-gray-100 dark:bg-slate-800/80",
                },
                {
                  label: "Lowest Spender",
                  value: lowestSpender,
                  color: "text-[#111844] dark:text-[#F9F7F7]",
                  bg: "bg-gray-100 dark:bg-slate-800/80",
                },
                {
                  label: "Avg Cost/Resource",
                  value: "$" + Math.round(avgCostVal).toLocaleString(),
                  color: "text-[#9A4DCC] dark:text-[#E0A9FF]",
                  bg: "bg-[#9A4DCC]/10 dark:bg-[#9A4DCC]/20",
                },
              ].map((kpi, idx) => (
                <div
                  key={idx}
                  className={`rounded-xl p-4 flex flex-col justify-center items-start ${kpi.bg}`}
                >
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                    {kpi.label}
                  </p>
                  <p
                    className={`text-sm md:text-lg font-bold truncate max-w-full ${kpi.color}`}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex-grow w-full relative h-0 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3 mt-2">
                {sortedResources.map((item, index) => {
                  const maxVal = Math.max(
                    ...drilldownPieData.map((d) => d.value),
                  );
                  const percentage =
                    maxVal > 0 ? (item.value / maxVal) * 100 : 0;
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F9F7F7] dark:bg-slate-800/80 border border-gray-100 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-750 hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-1/2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                        <span className="font-semibold text-xs text-gray-700 dark:text-gray-300 group-hover:text-[#111844] dark:group-hover:text-[#F9F7F7] transition-colors truncate">
                          {item.name}
                        </span>
                      </div>

                      <div className="w-full mx-4 h-1.5 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden flex-grow hidden md:block">
                        <div
                          className="h-full rounded-full transition-all duration-1000 ease-out"
                          style={{
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length],
                          }}
                        />
                      </div>

                      <div className="w-1/2 md:w-1/4 text-right">
                        <span className="font-bold text-xs text-[#111844] dark:text-[#F9F7F7] group-hover:text-[#792CA2] dark:group-hover:text-[#C084FC] transition-colors">
                          ${item.value.toLocaleString()}
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : timeFilter === "Select Time" ||
          resourceFilter === "Select Resource" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 font-medium text-sm bg-[#F9F7F7] px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              Please select a Resource and Time Period to view the trend.
            </p>
          </div>
        ) : (
          <ResponsiveContainer
            width="100%"
            height="100%"
            className="focus:outline-none"
          >
            <LineChart
              style={{ outline: "none" }}
              key={`${environment}-${timeFilter}-${resourceFilter}`}
              data={data}
              margin={isMobile ? { top: 20, right: 15, left: 15, bottom: 15 } : { top: 30, right: 45, left: 45, bottom: 20 }}
              onClick={(e) => {
                if (e && e.activeLabel) setDrilldownTime(e.activeLabel);
              }}
              className="cursor-pointer"
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                interval={timeFilter === "Hourly" ? 2 : 0}
                dy={isMobile ? 5 : 10}
                tick={({ x, y, payload }) => (
                  <g transform={`translate(${x},${y})`}>
                    <text
                      x={0}
                      y={0}
                      dy={isMobile ? 5 : 10}
                      textAnchor="middle"
                      fill="currentColor"
                      style={{ fontSize: isMobile ? 8 : 10 }}
                      className="tick-text text-gray-450 dark:text-slate-400"
                    >
                      {payload.value}
                    </text>
                  </g>
                )}
              >
                <Label
                  value="Time ➔"
                  offset={isMobile ? -5 : -15}
                  position="insideBottom"
                  className="fill-[#111844] dark:fill-[#F9F7F7] font-bold text-xs md:text-sm"
                />
              </XAxis>
              <YAxis
                axisLine={false}
                tickLine={false}
                width={isMobile ? 35 : 50}
                tick={{ fill: "currentColor", fontSize: isMobile ? 9 : 12 }}
                className="text-gray-450 dark:text-slate-400"
                tickFormatter={(value) => `$${value}`}
                dx={isMobile ? -2 : -10}
              >
                <Label
                  value="Cost ➔"
                  angle={-90}
                  position="insideLeft"
                  offset={isMobile ? -5 : -15}
                  className="fill-[#111844] dark:fill-[#F9F7F7] font-bold text-xs md:text-sm"
                />
              </YAxis>
              {showDetails && (
                <Tooltip
                  cursor={{ stroke: "rgba(121, 44, 162, 0.1)", strokeWidth: 2 }}
                  offset={0}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div
                          className="bg-[#111844] text-white text-xs font-bold px-3 py-2 rounded-xl shadow-lg whitespace-nowrap flex flex-col items-center gap-0.5"
                          style={{
                            transform: "translate(-50%, -100%)",
                            marginTop: "-10px",
                          }}
                        >
                          <span className="text-[10px] text-[#DCCBFF] font-medium">
                            {label}
                          </span>
                          <span>${payload[0].value.toLocaleString()}</span>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              )}
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#792CA2"
                strokeWidth={4}
                dot={
                  showDetails
                    ? { r: 4, strokeWidth: 2, fill: "#fff", stroke: "#792CA2" }
                    : false
                }
                activeDot={
                  showDetails
                    ? { r: 6, strokeWidth: 0, fill: "#9A4DCC" }
                    : false
                }
                isAnimationActive={true}
                animationDuration={1000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
