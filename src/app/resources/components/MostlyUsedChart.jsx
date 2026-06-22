"use client";
import React, { useState, useEffect, useRef } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ['#792CA2', '#9A4DCC', '#1F215D', '#111844', '#DCCBFF'];

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

const generateMockResources = (serviceType, department) => {
  return Array.from({ length: 15 }).map((_, i) => ({
    resourceId: `${serviceType}-${Math.floor(1000 + Math.random() * 9000)}`,
    region: "us-east-1",
    status: i % 4 === 0 ? "stopped" : "running",
    costPerHour: "$" + (Math.random() * 5).toFixed(2),
    department: department,
  }));
};

export default function TimeResourceChart({ department = "Production" }) {
  const [drilldownService, setDrilldownService] = useState(null);

  useEffect(() => {
    setDrilldownService(null);
  }, [department]);

  const data = mockDataByDept[department] || mockDataByDept["Production"];
  
  const mockResources = drilldownService ? generateMockResources(drilldownService, department) : [];

  return (
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 shadow-xl border border-white/60 h-[380px] w-full flex flex-col relative transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
      <div className="flex justify-between items-center mb-4">
        <h3 className="flex items-center gap-2">
          {drilldownService ? (
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setDrilldownService(null)}
                className="text-gray-400 hover:text-[#792CA2] transition-colors"
                title="Back to Chart"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              </button>
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">{drilldownService} Instances</span>
            </div>
          ) : (
            <div className="flex flex-col items-start">
              <span className="text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[#111844] to-[#792CA2] tracking-tight">Resources Count</span>
              <span className="text-[11px] text-gray-400 font-medium mt-0.5 tracking-normal">Click chart slice for details</span>
            </div>
          )}
        </h3>
      </div>
      <div className="flex-grow w-full relative overflow-hidden">
        {drilldownService ? (
          <div className="overflow-y-auto h-full pr-2 pb-2 custom-scrollbar">
            <table className="w-full text-left text-[11px]">
              <thead className="bg-[#F9F7F7] sticky top-0 z-10 text-gray-600">
                <tr>
                  <th className="p-2 font-semibold rounded-tl-lg">Resource ID</th>
                  <th className="p-2 font-semibold">Region</th>
                  <th className="p-2 font-semibold">Status</th>
                  <th className="p-2 font-semibold">Cost/Hr</th>
                  <th className="p-2 font-semibold rounded-tr-lg">Department</th>
                </tr>
              </thead>
              <tbody>
                {mockResources.map((res, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-[#792CA2]/5 transition-colors">
                    <td className="p-2 font-medium text-[#792CA2]">{res.resourceId}</td>
                    <td className="p-2 text-gray-500">{res.region}</td>
                    <td className="p-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${res.status === 'running' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {res.status}
                      </span>
                    </td>
                    <td className="p-2 text-gray-500">{res.costPerHour}</td>
                    <td className="p-2 text-gray-500">{res.department}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%" className="focus:outline-none">
            <PieChart style={{ outline: 'none' }}>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={5}
                dataKey="count"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} onClick={() => setDrilldownService(entry.name)} className="cursor-pointer hover:opacity-80 transition-opacity" />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} 
              />
              <Legend verticalAlign="bottom" wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
