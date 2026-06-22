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
  Area
} from "recharts";

const mockDataByDept = {
  Production: [
    { name: "EC2", usage: 120 },
    { name: "S3", usage: 80 },
    { name: "RDS", usage: 45 },
    { name: "Lambda", usage: 200 },
    { name: "VPC", usage: 10 },
  ],
  Staging: [
    { name: "EC2", usage: 50 },
    { name: "S3", usage: 60 },
    { name: "RDS", usage: 20 },
    { name: "Lambda", usage: 150 },
    { name: "VPC", usage: 5 },
  ],
  Development: [
    { name: "EC2", usage: 80 },
    { name: "S3", usage: 95 },
    { name: "RDS", usage: 30 },
    { name: "Lambda", usage: 180 },
    { name: "VPC", usage: 15 },
  ],
  Management: [
    { name: "EC2", usage: 10 },
    { name: "S3", usage: 15 },
    { name: "RDS", usage: 12 },
    { name: "Lambda", usage: 18 },
    { name: "VPC", usage: 4 },
  ],
  Finance: [
    { name: "EC2", usage: 25 },
    { name: "S3", usage: 20 },
    { name: "RDS", usage: 30 },
    { name: "Lambda", usage: 35 },
    { name: "VPC", usage: 6 },
  ],
};

const COLORS = ['#792CA2', '#9A4DCC', '#1F215D', '#111844', '#DCCBFF'];

export default function CostResourceChart({ department = "Production" }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [timeFilter, setTimeFilter] = useState("Hourly");
  const [showDetails, setShowDetails] = useState(false);
  const [drilldownResource, setDrilldownResource] = useState(null);
  const filterRef = useRef(null);

  useEffect(() => {
    setDrilldownResource(null);
  }, [department, timeFilter]);

  useEffect(() => {
    setShowDetails(false);
    const timer = setTimeout(() => {
      setShowDetails(true);
    }, 2000);
    return () => clearTimeout(timer);
  }, [department, timeFilter]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const baseData = mockDataByDept[department] || mockDataByDept["Production"];
  let multiplier = 1;
  if (timeFilter === "Daily") multiplier = 24;
  if (timeFilter === "Weekly") multiplier = 168;
  if (timeFilter === "Monthly") multiplier = 720;

  const data = baseData.map(item => ({
    name: item.name,
    usage: item.usage * multiplier
  }));

  const handleBarClick = (entry) => {
    if (entry && entry.name) {
      setDrilldownResource(entry.name);
    }
  };

  const getTrendData = () => {
    let labels = [];
    if (timeFilter === "Hourly") {
      labels = ['10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', 'Now'];
    } else if (timeFilter === "Daily") {
      labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Today'];
    } else if (timeFilter === "Weekly") {
      labels = ['Wk-5', 'Wk-4', 'Wk-3', 'Wk-2', 'Wk-1', 'This Wk'];
    } else if (timeFilter === "Monthly") {
      labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'This Mo'];
    } else {
      labels = ['T-5', 'T-4', 'T-3', 'T-2', 'T-1', 'Now'];
    }
    return labels.map(label => ({
      time: label,
      value: Math.floor(Math.random() * 100) + 50
    }));
  };

  const drilldownTrendData = getTrendData();

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 h-[380px] w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2">
          {drilldownResource ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDrilldownResource(null)}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title="Back to Chart"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">{drilldownResource} Usage Details</span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">Resources Mostly Used</span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5 tracking-normal">Click chart bar for details</span>
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
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
              {["Hourly", "Daily", "Weekly", "Monthly"].map(option => (
                <button 
                  key={option}
                  onClick={() => { setTimeFilter(option); setFilterOpen(false); }}
                  className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors"
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
                { label: "Active Instances", value: Math.floor(Math.random() * 50) + 10, color: "text-[#792CA2]", bg: "bg-[#792CA2]/10" },
                { label: "Avg Load", value: (Math.random() * 80 + 10).toFixed(1) + "%", color: "text-[#9A4DCC]", bg: "bg-[#9A4DCC]/10" },
                { label: "Est. Cost", value: "$" + (Math.random() * 500).toFixed(0), color: "text-[#1F215D]", bg: "bg-[#1F215D]/10" },
                { label: "Health", value: "99.9%", color: "text-green-600", bg: "bg-green-50" }
              ].map((kpi, idx) => (
                <div key={idx} className={`rounded-xl p-3 flex flex-col justify-center items-start ${kpi.bg}`}>
                  <p className="text-[10px] font-semibold text-gray-500 mb-0.5">{kpi.label}</p>
                  <p className={`text-lg font-bold ${kpi.color}`}>{kpi.value}</p>
                </div>
              ))}
            </div>
            <div className="flex-grow w-full relative min-h-[120px]">
              {/* Y-axis label */}
              <div className="absolute left-[-15px] top-[40%]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)', fontSize: 11, fontWeight: 700, color: '#111844', userSelect: 'none', pointerEvents: 'none', zIndex: 10 }}>Usage ➔</div>
              <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
                <AreaChart style={{ outline: 'none' }} data={drilldownTrendData} margin={{ top: 20, right: 10, left: -5, bottom: 35 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#792CA2" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#792CA2" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={10}>
                    <Label value="Time ➔" offset={-25} position="insideBottom" style={{ fill: '#111844', fontSize: 11, fontWeight: 'bold' }} />
                  </XAxis>
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dx={-10} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="value" stroke="#792CA2" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" isAnimationActive={true} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full">
            {/* Y-axis label */}
            <div className="absolute left-[-15px] top-[40%]" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)', fontSize: 13, fontWeight: 700, color: '#111844', userSelect: 'none', pointerEvents: 'none', zIndex: 10 }}>Usage ➔</div>
            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
              <BarChart style={{ outline: 'none' }} key={`${department}-${timeFilter}`} data={data} margin={{ top: 30, right: 20, left: -5, bottom: 45 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={10}>
                <Label value="Resources ➔" offset={-30} position="insideBottom" style={{ fill: '#111844', fontSize: 13, fontWeight: 'bold' }} />
              </XAxis>
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dx={-10} />
              <Tooltip 
                cursor={{ fill: 'rgba(121, 44, 162, 0.05)' }} 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} 
                formatter={(value) => [value, "Usage"]} 
              />
              <Bar dataKey="usage" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={2000} animationEasing="ease-in-out">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} onClick={() => handleBarClick(entry)} className="cursor-pointer hover:opacity-80 transition-opacity" />
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
