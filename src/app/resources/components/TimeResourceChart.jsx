"use client";
import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#F43F5E', '#8B5CF6'];

const mockDataByDept = {
  Production: [
    { name: "EC2", count: 120 },
    { name: "S3", count: 80 },
    { name: "RDS", count: 45 },
    { name: "Lambda", count: 200 },
    { name: "VPC", count: 10 },
  ],
  Staging: [
    { name: "EC2", count: 50 },
    { name: "S3", count: 60 },
    { name: "RDS", count: 20 },
    { name: "Lambda", count: 150 },
    { name: "VPC", count: 5 },
  ],
  Development: [
    { name: "EC2", count: 200 },
    { name: "S3", count: 150 },
    { name: "RDS", count: 80 },
    { name: "Lambda", count: 350 },
    { name: "VPC", count: 15 },
  ],
  Management: [
    { name: "EC2", count: 5 },
    { name: "S3", count: 20 },
    { name: "RDS", count: 2 },
    { name: "Lambda", count: 10 },
    { name: "VPC", count: 1 },
  ],
  Finance: [
    { name: "EC2", count: 10 },
    { name: "S3", count: 40 },
    { name: "RDS", count: 5 },
    { name: "Lambda", count: 20 },
    { name: "VPC", count: 2 },
  ],
};

export default function TimeResourceChart({ department = "Production" }) {
  const [filterOpen, setFilterOpen] = useState(false);
  const data = mockDataByDept[department] || mockDataByDept["Production"];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 h-[300px] w-full flex flex-col relative transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-[#111844]">
          Resources Count
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
              <button className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors">Last 24h</button>
              <button className="block w-full text-left px-4 py-2 text-xs font-medium text-gray-700 hover:bg-[#792CA2]/10 hover:text-[#792CA2] transition-colors">Last 7 Days</button>
            </div>
          )}
        </div>
      </div>
      <div className="flex-grow w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={90}
              paddingAngle={5}
              dataKey="count"
              stroke="none"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} 
            />
            <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: '12px' }} iconType="circle" />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
