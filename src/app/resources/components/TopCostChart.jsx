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
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

const basePatterns = {
  Monthly: [
    { name: "Jan", factor: 0.8 }, { name: "Feb", factor: 0.85 },
    { name: "Mar", factor: 0.9 }, { name: "Apr", factor: 0.95 },
    { name: "May", factor: 1.1 }, { name: "Jun", factor: 1.05 },
    { name: "Jul", factor: 1.2 }, { name: "Aug", factor: 1.15 },
    { name: "Sep", factor: 1.0 }, { name: "Oct", factor: 1.05 },
    { name: "Nov", factor: 0.9 }, { name: "Dec", factor: 0.95 }
  ],
  Weekly: [
    { name: "Week 1", factor: 0.9 },
    { name: "Week 2", factor: 1.0 },
    { name: "Week 3", factor: 0.95 },
    { name: "Week 4", factor: 1.1 },
  ],
  Daily: [
    { name: "Mon", factor: 0.8 },
    { name: "Tue", factor: 0.85 },
    { name: "Wed", factor: 1.1 },
    { name: "Thu", factor: 1.0 },
    { name: "Fri", factor: 1.2 },
    { name: "Sat", factor: 0.7 },
    { name: "Sun", factor: 0.6 },
  ]
};

const getHourlyPattern = () => {
  const currentHour = new Date().getHours();
  const pattern = [];
  const seededFactors = [0.5, 0.6, 0.55, 0.7, 0.65, 0.8, 0.9, 0.85, 1.0, 1.1, 1.05, 1.2, 1.15, 1.0, 0.9, 0.85, 0.8, 0.75, 0.8, 0.9, 0.95, 1.0, 0.9, 0.85];
  for(let i=0; i<=currentHour; i++) {
    let ampm = i >= 12 ? 'pm' : 'am';
    let displayHour = i % 12;
    if (displayHour === 0) displayHour = 12;
    pattern.push({ name: `${displayHour} ${ampm}`, factor: seededFactors[i] });
  }
  return pattern;
};

export default function MostlyUsedChart({ department = "Production" }) {
  const [timeFilterOpen, setTimeFilterOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("Hourly");
  
  const [resourceFilterOpen, setResourceFilterOpen] = useState(false);
  const [resourceFilter, setResourceFilter] = useState("EC2");
  const [showDetails, setShowDetails] = useState(false);
  const [drilldownTime, setDrilldownTime] = useState(null);

  useEffect(() => {
    setDrilldownTime(null);
  }, [department, timeFilter, resourceFilter]);

  const filterRef = useRef(null);

  useEffect(() => {
    setShowDetails(false);
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [department, timeFilter, resourceFilter]);

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
     if (timeFilter === "Select Time" || resourceFilter === "Select Resource") return [];
     
     let baseCost = 1000;
     // department multiplier
     if (department === "Production") baseCost = 10000;
     else if (department === "Staging") baseCost = 5000;
     else if (department === "Development") baseCost = 4000;
     else if (department === "Management") baseCost = 2000;
     else baseCost = 1500;
  
     // resource multiplier
     if (resourceFilter === "EC2") baseCost *= 0.4;
     else if (resourceFilter === "S3") baseCost *= 0.2;
     else if (resourceFilter === "RDS") baseCost *= 0.25;
     else if (resourceFilter === "Lambda") baseCost *= 0.1;
     else if (resourceFilter === "VPC") baseCost *= 0.05;
  
     // time multiplier
     if (timeFilter === "Monthly") baseCost *= 1; 
     else if (timeFilter === "Weekly") baseCost *= 0.25;
     else if (timeFilter === "Daily") baseCost *= 0.033;
     else if (timeFilter === "Hourly") baseCost *= 0.001;
  
     let pattern = [];
     if (timeFilter === "Hourly") {
        pattern = getHourlyPattern();
     } else {
        pattern = basePatterns[timeFilter] || basePatterns["Monthly"];
     }
     
     return pattern.map(p => ({
       name: p.name,
       cost: Math.round(baseCost * p.factor)
     }));
  }

  const data = getChartData();
  const timeOptions = ["Hourly", "Daily", "Weekly", "Monthly"];
  const resourceOptions = ["EC2", "S3", "RDS", "Lambda", "VPC"];

  const drilldownPieData = drilldownTime ? [
    { name: 'EC2', value: Math.floor(Math.random() * 5000) + 1000 },
    { name: 'RDS', value: Math.floor(Math.random() * 4000) + 1000 },
    { name: 'S3', value: Math.floor(Math.random() * 3000) + 500 },
    { name: 'Lambda', value: Math.floor(Math.random() * 2000) + 200 },
    { name: 'VPC', value: Math.floor(Math.random() * 1000) + 100 }
  ] : [];
  
  const COLORS = ['#792CA2', '#9A4DCC', '#1F215D', '#111844', '#DCCBFF'];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 h-[400px] w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center gap-2">
          {drilldownTime ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDrilldownTime(null)}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title="Back to Chart"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">{drilldownTime} Cost Details</span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">Resources Cost</span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5 tracking-normal">Click data point for details</span>
            </div>
          )}
        </h3>
        {!drilldownTime && (
          <div className="relative flex items-center gap-3" ref={filterRef}>
          {/* Resource Filter */}
          <div className="relative">
            <button
              onClick={() => { setResourceFilterOpen(!resourceFilterOpen); setTimeFilterOpen(false); }}
              className="bg-[#F9F7F7] border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-[#111844] hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              {resourceFilter} <ChevronDownIcon className="w-3 h-3 text-gray-500" />
            </button>
            {resourceFilterOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
                {resourceOptions.map(resOption => (
                  <button 
                    key={resOption}
                    onClick={() => { setResourceFilter(resOption); setResourceFilterOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors"
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
              onClick={() => { setTimeFilterOpen(!timeFilterOpen); setResourceFilterOpen(false); }}
              className="bg-[#F9F7F7] border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-[#111844] hover:bg-gray-50 transition-colors flex items-center gap-1"
            >
              {timeFilter} <ChevronDownIcon className="w-3 h-3 text-gray-500" />
            </button>
            {timeFilterOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
                {timeOptions.map(timeOption => (
                  <button 
                    key={timeOption}
                    onClick={() => { setTimeFilter(timeOption); setTimeFilterOpen(false); }}
                    className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors"
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
                { label: "Total Cost", value: "$" + (drilldownPieData.reduce((a, b) => a + b.value, 0)).toLocaleString(), color: "text-[#792CA2]", bg: "bg-[#792CA2]/10" },
                { label: "Top Spender", value: "EC2", color: "text-[#111844]", bg: "bg-gray-100" },
                { label: "Lowest Spender", value: "VPC", color: "text-[#111844]", bg: "bg-gray-100" },
                { label: "Avg Cost/Service", value: "$" + (drilldownPieData.reduce((a, b) => a + b.value, 0) / 5).toLocaleString(), color: "text-[#9A4DCC]", bg: "bg-[#9A4DCC]/10" }
              ].map((kpi, idx) => (
                <div key={idx} className={`rounded-xl p-4 flex flex-col justify-center items-start ${kpi.bg}`}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{kpi.label}</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="flex-grow w-full relative h-0 min-h-0 overflow-y-auto pr-2 custom-scrollbar">
              <div className="space-y-3 mt-2">
                {drilldownPieData.sort((a,b) => b.value - a.value).map((item, index) => {
                  const maxVal = Math.max(...drilldownPieData.map(d => d.value));
                  const percentage = (item.value / maxVal) * 100;
                  return (
                    <motion.div 
                      key={index} 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F9F7F7] border border-gray-100 hover:bg-white hover:shadow-md transition-all group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 w-1/3">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span className="font-semibold text-gray-700 group-hover:text-[#111844] transition-colors">{item.name}</span>
                      </div>
                      
                      <div className="w-full mx-4 h-1.5 bg-gray-200 rounded-full overflow-hidden flex-grow hidden md:block">
                        <div 
                          className="h-full rounded-full transition-all duration-1000 ease-out" 
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: COLORS[index % COLORS.length] 
                          }}
                        />
                      </div>
                      
                      <div className="w-1/3 md:w-1/4 text-right">
                        <span className="font-bold text-[#111844] group-hover:text-[#792CA2] transition-colors">${item.value.toLocaleString()}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : timeFilter === "Select Time" || resourceFilter === "Select Resource" ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-gray-500 font-medium text-sm bg-[#F9F7F7] px-4 py-2 rounded-lg shadow-sm border border-gray-100">
              Please select a Resource and Time Period to view the trend.
            </p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
            <LineChart
              style={{ outline: 'none' }}
              key={`${department}-${timeFilter}-${resourceFilter}`}
              data={data}
              margin={{ top: 30, right: 30, left: 30, bottom: 20 }}
              onClick={(e) => { if(e && e.activeLabel) setDrilldownTime(e.activeLabel); }}
              className="cursor-pointer"
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10}>
                <Label value="Time ➔" offset={-15} position="insideBottom" style={{ fill: '#111844', fontSize: 13, fontWeight: 'bold' }} />
              </XAxis>
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} tickFormatter={(value) => `$${value}`} dx={-10}>
                <Label value="Cost ➔" angle={-90} position="insideLeft" offset={-15} style={{ fill: '#111844', fontSize: 13, fontWeight: 'bold' }} />
              </YAxis>
              {showDetails && (
                <Tooltip 
                  cursor={{ stroke: 'rgba(121, 44, 162, 0.1)', strokeWidth: 2 }}
                  offset={0}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-[#111844] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap" style={{ transform: 'translate(-50%, -100%)', marginTop: '-10px' }}>
                          ${payload[0].value.toLocaleString()}
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
                dot={showDetails ? { r: 4, strokeWidth: 2, fill: "#fff", stroke: "#792CA2" } : false}
                activeDot={showDetails ? { r: 6, strokeWidth: 0, fill: "#9A4DCC" } : false}
                isAnimationActive={true}
                animationDuration={2000}
                animationEasing="ease-in-out"
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
