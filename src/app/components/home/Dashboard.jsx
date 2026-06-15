"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";

export default function DashboardPreview() {
  return (
    <section
      id="dashboard"
      className="
      py-28
      bg-[#F9F7F7]
      rounded-t-[50px]
      border-t
      border-[#EEEEEE]
      relative
      overflow-hidden
      "
    >
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <motion.div
          initial={{
            opacity: 0,
            y: 60,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: false,
          }}
          transition={{
            duration: 0.8,
          }}
          className="
          grid
          lg:grid-cols-2
          gap-12
          lg:gap-20
          items-center
          "
        >

          {/* SaaS Dashboard Mockup Panel */}
          <div
            className="
            h-[480px]
            rounded-3xl
            bg-slate-950
            border
            border-slate-800
            flex
            flex-col
            shadow-2xl
            overflow-hidden
            relative
            "
          >
            {/* Dashboard Header */}
            <div className="bg-slate-900/80 border-b border-slate-800/80 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[10px] text-slate-500 font-mono ml-2">cloudoptics.io/dashboard</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-800" />
                <div className="w-12 h-2 rounded bg-slate-800" />
              </div>
            </div>

            {/* Dashboard Body */}
            <div className="flex-grow p-4 grid grid-cols-12 gap-4 bg-slate-950">
              {/* Mockup Sidebar */}
              <div className="hidden sm:flex col-span-3 border-r border-slate-900 pr-2 flex-col gap-2.5">
                <div className="h-4 bg-slate-900 rounded w-4/5" />
                <div className="h-8 bg-[#792CA2]/20 border border-[#792CA2]/40 rounded w-full flex items-center px-2">
                  <div className="w-3 h-3 rounded bg-[#792CA2]" />
                  <div className="w-12 h-2 bg-[#792CA2]/80 rounded ml-2" />
                </div>
                <div className="h-8 bg-slate-900/50 rounded w-full" />
                <div className="h-8 bg-slate-900/50 rounded w-full" />
                <div className="h-8 bg-slate-900/50 rounded w-full" />
              </div>

              {/* Main Contents */}
              <div className="col-span-12 sm:col-span-9 flex flex-col gap-4">
                {/* 3 KPI Cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-slate-900/50 border border-slate-800/60 p-3 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Cloud Spend</span>
                    <p className="text-sm xs:text-base sm:text-lg font-bold text-white mt-0.5">$14,235</p>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "75%" }} transition={{ duration: 1.5 }} className="h-full bg-rose-500" />
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800/60 p-3 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Savings</span>
                    <p className="text-sm xs:text-base sm:text-lg font-bold text-emerald-400 mt-0.5">$3,410</p>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "88%" }} transition={{ duration: 1.5 }} className="h-full bg-emerald-500" />
                    </div>
                  </div>
                  <div className="bg-slate-900/50 border border-slate-800/60 p-3 rounded-xl">
                    <span className="text-[9px] text-slate-500 uppercase font-semibold">Optimization</span>
                    <p className="text-sm xs:text-base sm:text-lg font-bold text-[#B770FF] mt-0.5">92%</p>
                    <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                      <motion.div initial={{ width: 0 }} whileInView={{ width: "92%" }} transition={{ duration: 1.5 }} className="h-full bg-[#B770FF]" />
                    </div>
                  </div>
                </div>

                {/* Graph mockup */}
                <div className="bg-slate-900/50 border border-slate-800/60 p-4 rounded-xl flex-grow flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-slate-300">Cost Trend (Last 7 Days)</span>
                    <div className="flex gap-2">
                      <div className="w-8 h-3 bg-slate-800 rounded" />
                      <div className="w-12 h-3 bg-[#792CA2]/30 rounded" />
                    </div>
                  </div>

                  {/* Graph bars */}
                  <div className="flex items-end justify-between h-36 px-2 mt-4">
                    {[65, 45, 80, 55, 95, 70, 85].map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1.5 flex-1 mx-1 h-full">
                        <div className="w-full bg-slate-850 rounded-md flex-1 flex items-end justify-center overflow-hidden">
                          <motion.div
                            initial={{ height: 0 }}
                            whileInView={{ height: `${val}%` }}
                            transition={{ duration: 1, delay: idx * 0.08 }}
                            className="w-full bg-gradient-to-t from-[#792CA2] to-[#B770FF] rounded-t-md"
                          />
                        </div>
                        <span className="text-[8px] text-slate-600">Day {idx + 1}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Glowing background inside card */}
            <div className="absolute top-1/2 left-1/2 translate-x-[-50%] translate-y-[-50%] w-64 h-64 rounded-full bg-[#792CA2]/10 blur-[100px] pointer-events-none" />
          </div>

          {/* Content */}

          <div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111844] mb-6">
              Unlock Full Insights
            </h2>

            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Access comprehensive analytics and cloud cost optimization recommendations. CloudOptics continuously checks your environments to build custom savings profiles.
            </p>

            <ul className="space-y-4 text-base text-[#111844] font-medium">
              <li className="flex items-center gap-2">
                <span className="text-[#792CA2] text-xl font-bold">&bull;</span>
                Live cloud spending visibility across all services
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#792CA2] text-xl font-bold">&bull;</span>
                Advanced cost breakdowns and analytics dashboards
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#792CA2] text-xl font-bold">&bull;</span>
                Historical trend tracking and forecasting insights
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#792CA2] text-xl font-bold">&bull;</span>
                Automated detection of idle and oversized resources
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#792CA2] text-xl font-bold">&bull;</span>
                Intelligent cost-saving recommendations
              </li>
              <li className="flex items-center gap-2">
                <span className="text-[#792CA2] text-xl font-bold">&bull;</span>
                Real-time alerts for risks and anomalies
              </li>
            </ul>

          </div>

        </motion.div>

      </div>

      {/* Floating design elements */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#792CA2]/5 blur-[120px] pointer-events-none z-0" />
    </section>
  );
}