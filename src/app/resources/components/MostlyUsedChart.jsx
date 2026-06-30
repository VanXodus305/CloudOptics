"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const COLORS = ['#792CA2', '#9A4DCC', '#1F215D', '#111844', '#DCCBFF'];

export default function MostlyUsedChart({ environment = "Production", serviceCounts = [], resources = [], isLoading = false }) {
  const [drilldownService, setDrilldownService] = useState(null);
  const [hoveredSegment, setHoveredSegment] = useState(null);
  const [selectedSegment, setSelectedSegment] = useState(null);

  useEffect(() => {
    setDrilldownService(null);
    setHoveredSegment(null);
    setSelectedSegment(null);
  }, [environment]);

  const rawData = serviceCounts && serviceCounts.length > 0 ? serviceCounts : [
    { name: "EC2", count: 0 },
    { name: "S3", count: 0 },
    { name: "RDS", count: 0 }
  ];
  const total = rawData.reduce((sum, d) => sum + d.count, 0);

  // Enrich data with percentage and color
  const data = rawData.map((d, i) => {
    const percentage = total > 0 ? Math.round((d.count / total) * 100) : 0;
    return {
      ...d,
      value: percentage,
      colorHex: COLORS[i % COLORS.length],
    };
  });

  const drilldownResources = drilldownService
    ? resources.filter((r) => r.service === drilldownService)
    : [];

  // SVG donut params
  const donutRadius = 38;
  const donutCircumference = 2 * Math.PI * donutRadius;

  return (
    <div className="bg-white/90 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 dark:border-white/5 h-[380px] w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      {/* Subtle loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-[#080A1A]/40 rounded-3xl flex items-center justify-center z-[999] backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2">
          {drilldownService ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setDrilldownService(null);
                  setSelectedSegment(null);
                  setHoveredSegment(null);
                }}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title="Back to Chart"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] tracking-tight">
                {drilldownService} Instances
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] tracking-tight flex flex-wrap gap-x-1.5 gap-y-0.5">
                <span>Resources</span>
                <span>Count</span> 
              </span>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 font-medium mt-0.5 tracking-normal">
                Click chart slice for details
              </span>
            </div>
          )}
        </h3>
      </div>

      <div className="flex-grow w-full relative overflow-hidden">
        {drilldownService ? (
          <div className="overflow-y-auto h-full pr-2 pb-2 custom-scrollbar">
            <table className="w-full text-left text-[11px] table-fixed">
              <thead className="bg-[#F9F7F7] dark:bg-slate-800 sticky top-0 z-10 text-gray-600 dark:text-gray-400">
                <tr>
                  <th className="px-2 py-1.5 font-semibold rounded-tl-lg w-[38%]">Resource ID</th>
                  <th className="px-2 py-1.5 font-semibold w-[22%]">Region</th>
                  <th className="px-2 py-1.5 font-semibold w-[20%]">Status</th>
                  <th className="px-2 py-1.5 font-semibold w-[20%]">Cost/Hr</th>
                  <th className="px-2 py-1.5 font-semibold rounded-tr-lg hidden sm:table-cell lg:hidden xl:table-cell w-[20%]">Environment</th>
                </tr>
              </thead>
              <tbody>
                {drilldownResources.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-2 py-4 text-center text-gray-400 font-medium">No resources found</td>
                  </tr>
                ) : (
                  drilldownResources.map((res, i) => (
                    <tr key={i} className="border-b border-gray-50 dark:border-slate-800 hover:bg-[#792CA2]/5 dark:hover:bg-[#C084FC]/5 transition-colors">
                      <td className="px-2 py-1.5 font-medium text-[#792CA2] dark:text-[#C084FC] break-all whitespace-normal">{res.resourceId}</td>
                      <td className="px-2 py-1.5 text-gray-500 dark:text-gray-400 truncate">{res.region}</td>
                      <td className="px-2 py-1.5">
                        <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold ${res.status === 'Running' || res.status === 'running' ? 'bg-green-100 dark:bg-green-950/45 text-green-700 dark:text-green-400' : 'bg-red-100 dark:bg-red-950/45 text-red-700 dark:text-red-400'}`}>
                          {res.status}
                        </span>
                      </td>
                      <td className="px-2 py-1.5 text-gray-500 dark:text-gray-400">${typeof res.costPerHour === 'number' ? res.costPerHour.toFixed(3) : res.costPerHour}/hr</td>
                      <td className="px-2 py-1.5 text-gray-500 dark:text-gray-400 hidden sm:table-cell lg:hidden xl:table-cell truncate">{res.environment}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-around gap-6 sm:gap-2 h-full py-2">
            {/* Custom SVG Donut */}
            <div className="relative w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 flex-shrink-0 flex items-center justify-center">
              <svg
                className="w-full h-full transform -rotate-90"
                viewBox="0 0 100 100"
                style={{ pointerEvents: "none" }}
              >
                {/* Decorative rings */}
                <circle cx="50" cy="50" r={donutRadius + 7} fill="transparent" stroke="rgba(121, 44, 162, 0.18)" strokeWidth="0.75" strokeDasharray="2 2" />
                <circle cx="50" cy="50" r={donutRadius - 7} fill="transparent" stroke="rgba(121, 44, 162, 0.18)" strokeWidth="0.75" strokeDasharray="2 2" />
                {/* Track ring */}
                <circle cx="50" cy="50" r={donutRadius} fill="transparent" stroke="rgba(200,200,200,0.25)" strokeWidth={10} />
                
                {(() => {
                  let accumPercent = 0;
                  return data.map((item, idx) => {
                    const percentage = item.value;
                    const strokeLength = (percentage / 100) * donutCircumference;
                    const rotation = (accumPercent / 100) * 360;
                    accumPercent += percentage;
                    const isHovered = hoveredSegment === idx;
                    const isSelected = selectedSegment === idx;
                    return (
                      <motion.circle
                        key={item.name}
                        cx="50" cy="50" r={donutRadius}
                        fill="transparent"
                        stroke={item.colorHex}
                        strokeDashoffset={0}
                        transform={`rotate(${rotation} 50 50)`}
                        style={{ pointerEvents: "stroke", cursor: "pointer" }}
                        initial={{ strokeDasharray: `0 ${donutCircumference}`, strokeWidth: 8 }}
                        animate={{
                          strokeDasharray: `${strokeLength} ${donutCircumference}`,
                          strokeWidth: isHovered || isSelected ? 12 : 8,
                          filter: isHovered || isSelected
                            ? "drop-shadow(0 0 4px rgba(121,44,162,0.5))"
                            : "none",
                        }}
                        transition={{ duration: 1.2, ease: "easeOut" }}
                        onMouseEnter={() => setHoveredSegment(idx)}
                        onMouseLeave={() => setHoveredSegment(null)}
                        onClick={() => {
                          const newSel = isSelected ? null : idx;
                          setSelectedSegment(newSel);
                          if (!isSelected) setDrilldownService(item.name);
                        }}
                      />
                    );
                  });
                })()}
              </svg>

              {/* Center label */}
              <div className="absolute flex flex-col items-center text-center pointer-events-none">
                <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
                  {selectedSegment !== null && data[selectedSegment] ? data[selectedSegment].name : "Total"}
                </span>
                <span className="text-base font-black text-[#111844] font-mono mt-0.5">
                  {selectedSegment !== null && data[selectedSegment] ? `${data[selectedSegment].value}%` : total.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Side legend */}
            <div className="flex flex-col gap-1.5 w-full sm:flex-1 sm:max-w-[155px]">
              {data.map((item, idx) => {
                const isHovered = hoveredSegment === idx;
                const isSelected = selectedSegment === idx;
                return (
                  <div
                    key={item.name}
                    onMouseEnter={() => setHoveredSegment(idx)}
                    onMouseLeave={() => setHoveredSegment(null)}
                    onClick={() => {
                      const newSel = isSelected ? null : idx;
                      setSelectedSegment(newSel);
                      if (!isSelected) setDrilldownService(item.name);
                    }}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 ${
                      isHovered || isSelected
                        ? "bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-slate-700"
                        : "hover:bg-white/40 dark:hover:bg-slate-800/40"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: item.colorHex }} />
                      <span className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold truncate max-w-[120px] sm:max-w-[80px]">{item.name}</span>
                    </div>
                    <span className="text-xs font-extrabold text-[#111844] dark:text-[#F9F7F7]">{item.value}%</span>
                  </div>
                );
              })}
            </div>
          </div>
        ) }
      </div>
    </div>
  );
}
