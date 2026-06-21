"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const mockDataByDept = {
  Production: [
    { name: "Week 1", cost: 1200 },
    { name: "Week 2", cost: 2100 },
    { name: "Week 3", cost: 1500 },
    { name: "Week 4", cost: 3200 },
  ],
  Staging: [
    { name: "Week 1", cost: 400 },
    { name: "Week 2", cost: 600 },
    { name: "Week 3", cost: 550 },
    { name: "Week 4", cost: 800 },
  ],
  Development: [
    { name: "Week 1", cost: 800 },
    { name: "Week 2", cost: 950 },
    { name: "Week 3", cost: 1100 },
    { name: "Week 4", cost: 1400 },
  ],
  Management: [
    { name: "Week 1", cost: 100 },
    { name: "Week 2", cost: 150 },
    { name: "Week 3", cost: 120 },
    { name: "Week 4", cost: 180 },
  ],
  Finance: [
    { name: "Week 1", cost: 250 },
    { name: "Week 2", cost: 200 },
    { name: "Week 3", cost: 300 },
    { name: "Week 4", cost: 350 },
  ],
};

export default function CostResourceChart({ department = "Production" }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const data = mockDataByDept[department] || mockDataByDept["Production"];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 h-[300px] w-full flex flex-col relative transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#111844]">
          Resource Costs
        </h3>
        <div className="relative">
          <button
            onClick={() => setFilterOpen(!filterOpen)}
            className="bg-[#F9F7F7] border border-gray-200 px-3 py-1.5 rounded-lg shadow-sm text-xs font-semibold text-[#111844] hover:bg-gray-50 transition-colors flex items-center gap-1"
          >
            Filter <ChevronDownIcon className="w-3 h-3 text-gray-500" />
          </button>
          {filterOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-20 py-1 overflow-hidden">
              <button className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors">Monthly</button>
              <button className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors">Yearly</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} />
            <Line type="monotone" dataKey="cost" stroke="#F43F5E" strokeWidth={3} dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#F43F5E" }} activeDot={{ r: 6, strokeWidth: 0, fill: "#E11D48" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
