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
      className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 flex flex-col justify-between relative"
    >
      {/* Subtle loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/40 rounded-3xl flex items-center justify-center z-30 backdrop-blur-[0.5px]">
          <div className="w-8 h-8 border-3 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}

      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-[#111844]">
            Cost Distribution
          </h3>
          <span className="text-[10px] text-gray-400 font-semibold mt-1 block">
            Resource share breakdown by service category.
          </span>
        </div>

        {/* Resource filter*/}
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Button
              size="sm"
              variant="flat"
              className="bg-gray-100 hover:bg-gray-200/60 border border-gray-200/30 text-[10px] font-bold text-[#111844] rounded-xl px-3 h-8 min-w-0"
            >
              <span className="text-gray-400 font-semibold mr-1">Filter:</span>
              {filterMap[donutFilter]}
              <span className="text-[8px] ml-1 text-gray-500">▼</span>
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
            className="text-xs text-[#111844]"
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
          <div className="bg-gradient-to-r from-[#792CA2]/5 to-[#9A4DCC]/5 border border-purple-500/10 rounded-2xl p-3 mb-2 flex items-center justify-between text-[10px]">
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-gray-500 font-semibold">{allocationMsg}</span>
            </div>
            <div className="text-[#792CA2] font-bold">
              Active Services: {donutData?.length || 3}
            </div>
          </div>
        );
      })()}

      <div className="flex flex-col sm:flex-row items-center justify-around gap-6 py-4">
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            {/* Concentric Double Outline Rings to make it visually impressive */}
            <circle
              cx="50"
              cy="50"
              r={donutRadius + 7}
              fill="transparent"
              stroke="rgba(121, 44, 162, 0.18)"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            <circle
              cx="50"
              cy="50"
              r={donutRadius - 7}
              fill="transparent"
              stroke="rgba(121, 44, 162, 0.18)"
              strokeWidth="0.75"
              strokeDasharray="2 2"
            />
            <circle
              cx="50"
              cy="50"
              r={donutRadius}
              fill="transparent"
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth={10}
              className="pointer-events-none"
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
                    cx="50"
                    cy="50"
                    r={donutRadius}
                    fill="transparent"
                    stroke={item.colorHex}
                    strokeWidth={isHovered || isSelected ? 11 : 8}
                    strokeDasharray={`${strokeLength} ${donutCircumference}`}
                    strokeDashoffset={0}
                    transform={`rotate(${rotation} 50 50)`}
                    className="cursor-pointer transition-all"
                    onMouseEnter={() => setDonutHoveredSegment(idx)}
                    onMouseLeave={() => setDonutHoveredSegment(null)}
                    onClick={() => setDonutSelectedSegment(isSelected ? null : idx)}
                    initial={{ strokeDasharray: `0 ${donutCircumference}` }}
                    animate={{ strokeDasharray: `${strokeLength} ${donutCircumference}` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                  />
                );
              });
            })()}
          </svg>

          <div className="absolute flex flex-col items-center text-center">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">
              {donutSelectedSegment !== null
                ? donutData[donutSelectedSegment].name.split(" ")[0]
                : "Total"}
            </span>
            <span className="text-base font-black text-[#111844] font-mono mt-0.5">
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
                    ? "bg-white shadow-md border border-gray-100"
                    : "hover:bg-white/40"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-2 rounded-full h-2"
                    style={{ backgroundColor: item.colorHex }}
                  />
                  <span className="text-[10px] text-gray-600 font-semibold truncate max-w-[120px]">
                    {item.name}
                  </span>
                </div>
                <span className="text-xs font-extrabold text-[#111844]">
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
