"use client";
import React from "react";
import { motion } from "framer-motion";
import { Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from "@heroui/react";

const filterMap = {
  All: "All Clusters",
  Production: "Production",
  Development: "Development",
  Testing: "Testing",
};

export default function CostDistributionChart({
  donutFilter,
  setDonutFilter,
  donutData,
  donutTotal,
  donutRadius,
  donutCircumference,
  donutHoveredSegment,
  setDonutHoveredSegment,
  donutSelectedSegment,
  setDonutSelectedSegment,
  donutTotalSpend = 0,
  isLoading,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white/80 dark:bg-[#0F122B]/60 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 dark:border-white/5 flex flex-col justify-between relative"
    >
      {/* Subtle loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 dark:bg-[#080A1A]/40 rounded-3xl flex items-center justify-center z-30 backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex flex-row justify-between items-center sm:items-start gap-2 mb-4 flex-wrap">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-[#111844] via-[#1F215D] to-[#792CA2] dark:from-white dark:via-[#DCCBFF] dark:to-[#9A4DCC] flex flex-wrap gap-x-1.5 gap-y-0.5">
            <span>Cost</span>
            <span>Distribution</span>
          </h3>
          <span className="text-[10px] text-gray-400 dark:text-gray-500 font-semibold mt-0.5 sm:mt-1 block">
            Resource share breakdown by service category.
          </span>
        </div>

        {/* Resource filter*/}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              size="sm"
              variant="flat"
              className="bg-[#792CA2]/10 hover:bg-[#792CA2]/20 dark:bg-[#792CA2]/20 dark:hover:bg-[#792CA2]/30 border border-[#792CA2]/20 text-[10px] sm:text-xs font-bold text-[#792CA2] dark:text-[#C084FC] rounded-xl px-2.5 sm:px-3 h-8 min-w-0 flex items-center gap-1.5 transition-all select-none whitespace-nowrap"
            >
              <span className="truncate">{filterMap[donutFilter]}</span>
              <span className="text-[8px] opacity-75">▼</span>
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Filter Clusters"
            variant="flat"
            disallowEmptySelection
            selectionMode="single"
            selectedKeys={new Set([donutFilter])}
            onSelectionChange={(keys) => {
              const selected = Array.from(keys)[0];
              setDonutFilter(selected);
            }}
            className="text-xs text-[#111844] dark:text-[#F9F7F7]"
          >
            <DropdownItem key="All">All Clusters</DropdownItem>
            <DropdownItem key="Production">Production</DropdownItem>
            <DropdownItem key="Development">Development</DropdownItem>
            <DropdownItem key="Testing">Testing</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Information Banner */}
      {(() => {
        const primaryService = donutData && donutData.length > 0
          ? [...donutData].sort((a, b) => b.value - a.value)[0]
          : null;

        const allocationMsg = primaryService && primaryService.value > 0
          ? `${primaryService.name} is the primary cost driver (${primaryService.value}% of share).`
          : "Cost allocation is evenly distributed.";

        return (
          <div className="bg-gradient-to-r from-[#792CA2]/5 to-[#9A4DCC]/5 dark:from-[#792CA2]/10 dark:to-[#9A4DCC]/10 border border-purple-500/10 dark:border-purple-500/20 rounded-2xl p-3 mb-2 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-gray-500 dark:text-gray-400 font-semibold">{allocationMsg}</span>
            </div>
            <div className="text-[#792CA2] dark:text-[#C084FC] font-bold">
              Active Services: {donutData?.length || 3}
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
        {/* Donut — bigger (w-48/h-48) and hover-safe: only the arc strokes receive pointer events */}
        <div className="relative w-48 h-48 flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-full h-full transform -rotate-90"
            viewBox="0 0 100 100"
            style={{ pointerEvents: "none" }}
          >
            {/* Decorative rings — no events */}
            <circle
              cx="50" cy="50" r={donutRadius + 7}
              fill="transparent"
              stroke="rgba(121, 44, 162, 0.18)"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            <circle
              cx="50" cy="50" r={donutRadius - 7}
              fill="transparent"
              stroke="rgba(121, 44, 162, 0.18)"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            {/* Track ring */}
            <circle
              cx="50" cy="50" r={donutRadius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth={10}
            />

            {(() => {
              let accumPercent = 0;
              return donutData.map((item, idx) => {
                const percentage = (item.value / donutTotal) * 100;
                const strokeLength = (percentage / 100) * donutCircumference;
                const rotation = (accumPercent / 100) * 360;
                accumPercent += percentage;

                const isHovered = donutHoveredSegment === idx;
                const isSelected = donutSelectedSegment === idx;

                return (
                  <motion.circle
                    key={item.name}
                    cx="50" cy="50" r={donutRadius}
                    fill="transparent"
                    stroke={item.colorHex}
                    strokeDasharray={`${strokeLength} ${donutCircumference}`}
                    strokeDashoffset={0}
                    transform={`rotate(${rotation} 50 50)`}
                    style={{
                      /* re-enable events only on the arc itself */
                      pointerEvents: "stroke",
                      cursor: "pointer",
                    }}
                    animate={{
                      strokeWidth: isHovered || isSelected ? 12 : 8,
                      strokeDasharray: `${strokeLength} ${donutCircumference}`,
                      filter: isHovered || isSelected
                        ? "drop-shadow(0 0 4px rgba(121,44,162,0.5))"
                        : "none",
                    }}
                    initial={{ strokeDasharray: `0 ${donutCircumference}`, strokeWidth: 8 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    onMouseEnter={() => setDonutHoveredSegment(idx)}
                    onMouseLeave={() => setDonutHoveredSegment(null)}
                    onClick={() => setDonutSelectedSegment(isSelected ? null : idx)}
                  />
                );
              });
            })()}
          </svg>

          {/* Centre label — sits above the SVG */}
          <div className="absolute flex flex-col items-center text-center pointer-events-none">
            <span className="text-[9px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">
              {donutSelectedSegment !== null
                ? donutData[donutSelectedSegment].name.split(" ")[0]
                : "Total"}
            </span>
            <span className="text-base font-black text-[#111844] dark:text-[#F9F7F7] font-mono mt-0.5">
              {donutSelectedSegment !== null
                ? `${donutData[donutSelectedSegment].value}%`
                : `$${Math.round(donutTotalSpend).toLocaleString()}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-2 flex-1 w-full max-w-[200px]">
          {donutData.map((item, idx) => {
            const isHovered = donutHoveredSegment === idx;
            const isSelected = donutSelectedSegment === idx;
            return (
              <div
                key={item.name}
                onMouseEnter={() => setDonutHoveredSegment(idx)}
                onMouseLeave={() => setDonutHoveredSegment(null)}
                onClick={() => setDonutSelectedSegment(isSelected ? null : idx)}
                className={`flex items-center justify-between p-2 rounded-xl cursor-pointer transition-all duration-200 ${
                  isHovered || isSelected
                    ? "bg-white dark:bg-slate-800 shadow-md border border-gray-100 dark:border-slate-700"
                    : "hover:bg-white/40 dark:hover:bg-slate-800/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 rounded-full h-2"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <span className="text-[10px] text-gray-600 dark:text-gray-300 font-semibold truncate max-w-[120px]">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#111844] dark:text-[#F9F7F7]">
                  {item.value}%
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
