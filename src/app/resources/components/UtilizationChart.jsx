"use client";
import React, { useState } from "react";
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
  const data = mockDataByDept[department] || mockDataByDept["Production"];

  const renderBar = () => {
    switch (selectedMetric) {
      case "Memory Utilization":
        return <Bar dataKey="memory" name="Memory (%)" fill="#10B981" radius={[0, 4, 4, 0]} />;
      case "Storage":
        return <Bar dataKey="storage" name="Storage (%)" fill="#F59E0B" radius={[0, 4, 4, 0]} />;
      case "Network":
        return <Bar dataKey="network" name="Network (MB/s)" fill="#8B5CF6" radius={[0, 4, 4, 0]} />;
      case "CPU Utilization":
      default:
        return <Bar dataKey="cpu" name="CPU (%)" fill="#3B82F6" radius={[0, 4, 4, 0]} />;
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-lg border border-white/60 h-[400px] w-full flex flex-col relative transition-all hover:shadow-xl mt-8">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-base font-bold text-[#111844]">
          Utilization Metrics
        </h3>
        <div className="relative">
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
      </div>
      <div className="flex-grow w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart layout="vertical" data={data} margin={{ top: 10, right: 10, left: 30, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" />
            <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} />
            <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 11 }} width={100} />
            <Tooltip cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }} />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '12px' }} />
            {renderBar()}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
