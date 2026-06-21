"use client";
import React from "react";
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
    { name: "Jan", usage: 4000 },
    { name: "Feb", usage: 3000 },
    { name: "Mar", usage: 2000 },
    { name: "Apr", usage: 2780 },
    { name: "May", usage: 1890 },
    { name: "Jun", usage: 2390 },
    { name: "Jul", usage: 3490 },
  ],
  Staging: [
    { name: "Jan", usage: 2000 },
    { name: "Feb", usage: 1500 },
    { name: "Mar", usage: 3000 },
    { name: "Apr", usage: 2000 },
    { name: "May", usage: 2500 },
    { name: "Jun", usage: 1800 },
    { name: "Jul", usage: 2200 },
  ],
  Development: [
    { name: "Jan", usage: 1500 },
    { name: "Feb", usage: 2800 },
    { name: "Mar", usage: 1800 },
    { name: "Apr", usage: 3100 },
    { name: "May", usage: 1200 },
    { name: "Jun", usage: 2600 },
    { name: "Jul", usage: 1900 },
  ],
  Management: [
    { name: "Jan", usage: 500 },
    { name: "Feb", usage: 800 },
    { name: "Mar", usage: 600 },
    { name: "Apr", usage: 900 },
    { name: "May", usage: 750 },
    { name: "Jun", usage: 1000 },
    { name: "Jul", usage: 850 },
  ],
  Finance: [
    { name: "Jan", usage: 200 },
    { name: "Feb", usage: 150 },
    { name: "Mar", usage: 300 },
    { name: "Apr", usage: 250 },
    { name: "May", usage: 400 },
    { name: "Jun", usage: 350 },
    { name: "Jul", usage: 280 },
  ],
};

export default function MostlyUsedChart({ department = "Production" }) {
  const data = mockDataByDept[department] || mockDataByDept["Production"];

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 h-[350px] w-full flex flex-col relative transition-all hover:shadow-xl">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-[#111844]">
          Resources mostly used
        </h3>
      </div>
      <div className="flex-grow w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
            />
            <Line
              type="monotone"
              dataKey="usage"
              stroke="#0EA5E9"
              strokeWidth={4}
              dot={{ r: 4, strokeWidth: 2, fill: "#fff", stroke: "#0EA5E9" }}
              activeDot={{ r: 6, strokeWidth: 0, fill: "#0284C7" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
