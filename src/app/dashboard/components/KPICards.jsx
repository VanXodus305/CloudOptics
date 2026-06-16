"use client";
import React from "react";
import { motion } from "framer-motion";
import CountUp from "react-countup";

export default function KPICards() {
  const cards = [
    {
      title: "Total Spend",
      value: 14892.45,
      prefix: "$",
      border: "border-t-[#982598]",
      trend: "+12.4%",
      trendType: "negative",
    },
    {
      title: "Compute Spend",
      value: 8430.12,
      prefix: "$",
      border: "border-t-[#9A4DCC]",
      trend: "-2.4%",
      trendType: "positive",
    },
    {
      title: "Storage Spend",
      value: 4120.30,
      prefix: "$",
      border: "border-t-[#792CA2]",
      trend: "+4.1%",
      trendType: "negative",
    },
    {
      title: "Total Savings",
      value: 2342.03,
      prefix: "$",
      border: "border-t-[#1F215D]",
      trend: "+18.7%",
      trendType: "positive",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
      {cards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            type: "spring",
            stiffness: 100,
            damping: 15,
            delay: index * 0.08,
          }}
          whileHover={{
            y: -6,
            scale: 1.02,
            boxShadow: "0 15px 35px rgba(121, 44, 162, 0.1)",
          }}
          className={`bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 border-t-4 ${card.border} flex flex-col justify-between min-h-[140px]`}
        >
          <div>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              {card.title}
            </h3>
            <p className="text-2xl font-black text-[#111844] mt-2 font-mono">
              {card.prefix}
              <CountUp
                end={card.value}
                decimals={2}
                duration={1.5}
                separator=","
              />
            </p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
