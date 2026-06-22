"use client";
import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function KPICards({ summaryData, kpiTrends, isLoading }) {
  const cards = [
    {
      title: "Total Spend",
      value: summaryData?.totalSpend ?? 0,
      prefix: "$",
      border: "border-t-[#982598]",
      trend: kpiTrends?.totalSpend?.trend ?? "0.0%",
      trendType: kpiTrends?.totalSpend?.type ?? "neutral",
      trendLabel: kpiTrends?.totalSpend?.label ?? "vs last week",
      description: "Projected monthly cloud budget",
    },
    {
      title: "Compute Spend",
      value: summaryData?.computeSpend ?? 0,
      prefix: "$",
      border: "border-t-[#9A4DCC]",
      trend: kpiTrends?.computeSpend?.trend ?? "0.0%",
      trendType: kpiTrends?.computeSpend?.type ?? "neutral",
      trendLabel: kpiTrends?.computeSpend?.label ?? "vs last week",
      description: "EC2 core usage fees",
    },
    {
      title: "Storage Spend",
      value: summaryData?.storageSpend ?? 0,
      prefix: "$",
      border: "border-t-[#792CA2]",
      trend: kpiTrends?.storageSpend?.trend ?? "0.0%",
      trendType: kpiTrends?.storageSpend?.type ?? "neutral",
      trendLabel: kpiTrends?.storageSpend?.label ?? "vs last week",
      description: "S3 buckets & snapshot storage",
    },
    {
      title: "Total Savings",
      value: summaryData?.totalSavings ?? 0,
      prefix: "$",
      border: "border-t-[#1F215D]",
      trend: kpiTrends?.totalSavings?.trend ?? "0.0%",
      trendType: kpiTrends?.totalSavings?.type ?? "positive",
      trendLabel: kpiTrends?.totalSavings?.label ?? "of spend",
      description: "Actionable saving opportunities",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-6 md:mb-10">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 22,
            delay: index * 0.06,
          }}
          whileHover={{
            y: -5,
            scale: 1.02,
            boxShadow: "0 15px 35px rgba(121, 44, 162, 0.12)",
            transition: { duration: 0.15, ease: "easeOut" },
          }}
          className={`relative bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl p-4 md:p-6 shadow-lg border border-white/60 border-t-4 ${card.border} flex flex-col justify-between min-h-[110px] md:min-h-[160px]`}
        >
          {/* Subtle loading overlay */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/40 rounded-2xl md:rounded-3xl flex items-center justify-center z-10 backdrop-blur-[0.5px]">
              <div className="w-5 h-5 border-2 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div>
            <div className="flex justify-between items-start mb-1 md:mb-2">
              <h3 className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider">
                {card.title}
              </h3>
              {/* Trend Badge and Label */}
              <div className="flex flex-col items-center">
                <span
                  className={`text-[8px] md:text-[9.5px] px-1.5 py-0.5 rounded-full font-bold select-none ${
                    card.trend.startsWith("-")
                      ? "bg-rose-50 text-rose-600 border border-rose-100"
                      : card.trend.startsWith("+")
                      ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                      : "bg-gray-50 text-gray-500 border border-gray-100"
                  }`}
                >
                  {card.trend}
                </span>
                <span className="text-[7px] md:text-[8px] text-gray-400 font-semibold mt-0.5 whitespace-nowrap">
                  {card.trendLabel}
                </span>
              </div>
            </div>

            <p className="text-base sm:text-xl md:text-2xl font-black text-[#111844] mt-0.5 md:mt-2 font-mono">
              {card.prefix}
              <CountUp
                end={card.value}
                decimals={2}
                duration={1.5}
                separator=","
              />
            </p>
          </div>

          <div className="mt-2 pt-2 border-t border-gray-100/50">
            <span className="text-[8px] md:text-[10px] text-gray-400 font-semibold block leading-tight">
              {card.description}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
