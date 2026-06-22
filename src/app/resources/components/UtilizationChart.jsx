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
  Label,
  Cell,
  LabelList
} from "recharts";

const mockDataByDept = {
  Production: [
    { name: "Prod-App-01", cpu: 85, memory: 65, storage: 45, network: 30 },
    { name: "Prod-DB-Primary", cpu: 45, memory: 90, storage: 80, network: 50 },
    { name: "Prod-Redis-Cache", cpu: 20, memory: 85, storage: 10, network: 60 },
    { name: "Prod-Web-Node", cpu: 60, memory: 40, storage: 30, network: 70 },
  ],
  Staging: [
    { name: "Stage-App-01", cpu: 40, memory: 50, storage: 30, network: 20 },
    { name: "Stage-DB-Replica", cpu: 30, memory: 60, storage: 40, network: 25 },
    { name: "Stage-Cache", cpu: 15, memory: 50, storage: 8, network: 30 },
    { name: "Stage-Web-Node", cpu: 35, memory: 30, storage: 20, network: 40 },
  ],
  Development: [
    { name: "Dev-App-Container", cpu: 70, memory: 55, storage: 60, network: 45 },
    { name: "Dev-DB-Instance", cpu: 65, memory: 75, storage: 70, network: 55 },
    { name: "Dev-Memcached", cpu: 25, memory: 60, storage: 15, network: 40 },
    { name: "Dev-Web-Service", cpu: 55, memory: 45, storage: 35, network: 60 },
  ],
  Management: [
    { name: "Mgmt-API-Server", cpu: 15, memory: 20, storage: 10, network: 5 },
    { name: "Mgmt-Auth-DB", cpu: 10, memory: 25, storage: 15, network: 8 },
    { name: "Mgmt-Gateway", cpu: 5, memory: 15, storage: 5, network: 10 },
    { name: "Mgmt-Bastion", cpu: 20, memory: 15, storage: 12, network: 15 },
  ],
  Finance: [
    { name: "Fin-Core-Engine", cpu: 25, memory: 35, storage: 25, network: 15 },
    { name: "Fin-Ledger-DB", cpu: 20, memory: 40, storage: 30, network: 20 },
    { name: "Fin-Audit-Cache", cpu: 10, memory: 30, storage: 12, network: 25 },
    { name: "Fin-Gateway", cpu: 30, memory: 25, storage: 20, network: 35 },
  ],
};

export default function UtilizationChart({ department = "Production" }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState("CPU Utilization");
  const [drilldownServer, setDrilldownServer] = useState(null);
  const coordsRef = useRef({});
  const filterRef = useRef(null);

  useEffect(() => {
    setDrilldownServer(null);
  }, [department]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const data = mockDataByDept[department] || mockDataByDept["Production"];

  const handleBarClick = (data) => {
    if (data && data.name) {
      setDrilldownServer(data.name);
    }
  };

  const renderBar = () => {
    const commonProps = {
      onClick: handleBarClick,
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
        return <Bar dataKey="network" name="Network (MB/s)" fill="#792CA2" {...commonProps} />;
      case "CPU Utilization":
      default:
        return <Bar dataKey="cpu" name="CPU (%)" fill="#792CA2" {...commonProps} />;
    }
  };

  let drilldownData = [];
  let serverObj = null;
  if (drilldownServer) {
    serverObj = data.find(s => s.name === drilldownServer);
    if (serverObj) {
      drilldownData = [
        { name: "CPU", value: serverObj.cpu, fill: "#792CA2" },
        { name: "Memory", value: serverObj.memory, fill: "#9A4DCC" },
        { name: "Storage", value: serverObj.storage, fill: "#1F215D" },
        { name: "Network", value: serverObj.network, fill: "#DCCBFF" }
      ];
    }
  }

  return (
    <div className={`bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 mt-8 ${drilldownServer ? 'h-auto min-h-[500px]' : 'h-[350px]'}`}>
      <div className="flex justify-between items-center mb-6">
        <h3 className="flex items-center gap-2">
          {drilldownServer ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDrilldownServer(null)}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title="Back to Servers"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">{drilldownServer} Details</span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">Utilization Metrics</span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5 tracking-normal">Click chart bar for details</span>
            </div>
          )}
        </h3>
        {!drilldownServer && (
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
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
        )}
      </div>
      <div className="flex-grow w-full relative">
        {drilldownServer && serverObj ? (
          <div className="flex flex-col h-full gap-4">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-2">
              {[
                { label: "CPU", value: serverObj.cpu, color: "text-[#792CA2]", bg: "bg-[#792CA2]/10" },
                { label: "Memory", value: serverObj.memory, color: "text-[#9A4DCC]", bg: "bg-[#9A4DCC]/10" },
                { label: "Storage", value: serverObj.storage, color: "text-[#1F215D]", bg: "bg-[#1F215D]/10" },
                { label: "Network", value: serverObj.network, color: "text-[#792CA2]", bg: "bg-[#DCCBFF]/40" }
              ].map((kpi, idx) => (
                <div key={idx} className={`rounded-xl p-4 flex flex-col justify-center items-start ${kpi.bg}`}>
                  <p className="text-xs font-semibold text-gray-500 mb-1">{kpi.label} Usage</p>
                  <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}%</p>
                </div>
              ))}
            </div>
            
            {/* Detailed Chart */}
            <div className="flex-grow w-full relative" style={{ height: 260 }}>
              {/* Y-axis label */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)', fontSize: 12, fontWeight: 700, color: '#111844', userSelect: 'none', pointerEvents: 'none' }}>Percentage ➔</div>
              <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
                <BarChart style={{ outline: 'none' }} data={drilldownData} margin={{ top: 20, right: 10, left: 40, bottom: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={6} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dx={-4} />
                  <Tooltip cursor={{ fill: 'rgba(121, 44, 162, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]} isAnimationActive={true} animationDuration={2000} animationEasing="ease-in-out">
                    {drilldownData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              {/* X-axis label */}
              <div className="text-center" style={{ fontSize: 12, fontWeight: 700, color: '#111844', marginTop: 2 }}>Metric ➔</div>
            </div>
          </div>
        ) : (
          <div className="relative w-full h-full flex flex-col">
            {/* Y-axis label (Server) */}
            <div className="absolute left-0 top-1/2" style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg) translateY(50%)', fontSize: 12, fontWeight: 700, color: '#111844', userSelect: 'none', pointerEvents: 'none' }}>Server ➔</div>
            <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
              <BarChart 
                style={{ outline: 'none' }} 
                layout="vertical" 
                data={data} 
                margin={{ top: 30, right: 10, left: 20, bottom: 30 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} dy={6} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} width={140} dx={-6} interval={0} />
                <Tooltip 
                  cursor={{ fill: 'rgba(121, 44, 162, 0.05)' }} 
                  position={{ x: 0, y: 0 }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const name = payload[0].payload.name;
                      const pos = coordsRef.current[name];
                      if (!pos) return null;
                      return (
                        <div style={{ position: 'absolute', left: pos.x, top: pos.y, transform: 'translate(0%, -50%)', marginLeft: '10px' }}>
                          <div className="bg-[#111844] text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-lg whitespace-nowrap">
                            {payload[0].value}%
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
                {renderBar()}
              </BarChart>
            </ResponsiveContainer>
            {/* X-axis label (Percentage) */}
            <div className="text-center pb-1" style={{ fontSize: 12, fontWeight: 700, color: '#111844' }}>Percentage ➔</div>
          </div>
        )}
      </div>
    </div>
  );
}
