"use client";

import { motion } from "framer-motion";

const widgets = [
  {
    id: 1,
    type: "metric",
    title: "Total Savings",
    value: "$14,250",
    change: "+12.5%",
    trend: "up",
  },
  {
    id: 2,
    type: "bar-chart",
    title: "Cost by Region",
  },
  {
    id: 3,
    type: "alert",
    title: "Anomaly Detected",
    desc: "Unusual spike in EC2 usage in us-east-1.",
  },
  {
    id: 4,
    type: "line-chart",
    title: "Usage Trend",
  },
  {
    id: 5,
    type: "metric",
    title: "Active Resources",
    value: "1,248",
    change: "-4.2%",
    trend: "down",
  },
  {
    id: 6,
    type: "status",
    title: "System Health",
    status: "All Systems Operational",
  },
  {
    id: 7,
    type: "optimization",
    title: "Idle DB Instance",
    desc: "Terminate to save $420/mo",
  },
  {
    id: 8,
    type: "node-graph",
    title: "Network Flow",
  },
  {
    id: 9,
    type: "security-score",
    title: "Security Score",
    score: 98,
  },
  {
    id: 10,
    type: "db-usage",
    title: "RDS Write IOPS",
  }
];


const row1Widgets = [...widgets, ...widgets].sort(() => Math.random() - 0.5);
const row2Widgets = [...widgets, ...widgets].sort(() => Math.random() - 0.5);

function MetricWidget({ title, value, change, trend }) {
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-black text-[#111844] dark:text-white">{value}</span>
        <span className={`text-sm font-bold ${trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend === 'up' ? '↑' : '↓'} {change}
        </span>
      </div>
    </div>
  );
}

function BarChartWidget({ title }) {
  const bars = [40, 70, 45, 90, 60, 30, 85];
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-4">{title}</h4>
      <div className="flex items-end justify-between h-16 gap-1">
        {bars.map((h, i) => (
          <motion.div 
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ duration: 1.5, delay: i * 0.1, ease: "easeOut" }}
            className="w-full bg-gradient-to-t from-[#792CA2] to-[#B770FF] rounded-sm opacity-80"
          />
        ))}
      </div>
    </div>
  );
}

function LineChartWidget({ title }) {
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-3">{title}</h4>
      <div className="relative h-16 w-full flex items-center">
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible" preserveAspectRatio="none">
          <motion.path
            d="M0 30 Q 15 10, 30 25 T 60 15 T 100 5"
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="3"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
          />
          <defs>
            <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#792CA2" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

function AlertWidget({ title, desc }) {
  return (
    <div className="flex-shrink-0 w-72 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-rose-500/30 dark:border-rose-500/20 shadow-[0_8px_30px_rgba(244,63,94,0.1)]">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
        <h4 className="text-xs font-bold text-rose-500 uppercase tracking-wider">{title}</h4>
      </div>
      <p className="text-sm text-[#111844] dark:text-slate-300 font-medium">{desc}</p>
    </div>
  );
}

function StatusWidget({ title, status }) {
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-gradient-to-br from-[#792CA2] to-[#5E1A86] text-white shadow-xl border border-white/10">
      <h4 className="text-xs font-semibold text-white/70 uppercase tracking-wider mb-2">{title}</h4>
      <div className="flex items-center gap-3">
        <div className="p-2 bg-white/20 rounded-lg">
          <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <span className="font-bold text-lg">{status}</span>
      </div>
    </div>
  );
}

function OptimizationWidget({ title, desc }) {
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-emerald-500/30 shadow-[0_8px_30px_rgba(16,185,129,0.05)]">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">{title}</h4>
        <span className="text-lg">💡</span>
      </div>
      <p className="text-sm text-[#111844] dark:text-slate-300 font-medium">{desc}</p>
    </div>
  );
}

function NodeGraphWidget({ title }) {
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="h-16 w-full flex items-center justify-center relative">
        <svg viewBox="0 0 100 40" className="w-full h-full overflow-visible">
          <motion.path d="M 20 20 L 50 10 L 80 20 L 50 30 Z" fill="none" stroke="currentColor" className="text-indigo-500" strokeWidth="1" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
          <circle cx="20" cy="20" r="4" className="fill-[#792CA2]" />
          <circle cx="50" cy="10" r="5" className="fill-emerald-500" />
          <circle cx="80" cy="20" r="4" className="fill-[#792CA2]" />
          <circle cx="50" cy="30" r="3" className="fill-rose-500" />
        </svg>
      </div>
    </div>
  );
}

function SecurityScoreWidget({ title, score }) {
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="flex items-center gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full transform -rotate-90">
            <circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" className="text-gray-200 dark:text-slate-700" />
            <motion.circle cx="24" cy="24" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="125" strokeLinecap="round" className="text-emerald-500" initial={{ strokeDashoffset: 125 }} animate={{ strokeDashoffset: 125 - (125 * score) / 100 }} transition={{ duration: 2, ease: "easeOut" }} />
          </svg>
          <span className="font-bold text-[#111844] dark:text-white text-xs">{score}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm font-bold text-emerald-500">A+ Rating</span>
          <span className="text-[10px] text-gray-500">Fully Compliant</span>
        </div>
      </div>
    </div>
  );
}

function DbUsageWidget({ title }) {
  return (
    <div className="flex-shrink-0 w-64 p-5 rounded-2xl bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/60 dark:border-slate-800/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
      <h4 className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-2">{title}</h4>
      <div className="flex flex-col gap-2 mt-3">
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500">
          <span>Read</span>
          <span>450/s</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div className="h-full bg-blue-500" animate={{ width: ["40%", "70%", "45%", "80%"] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
        </div>
        <div className="flex items-center justify-between text-[10px] font-mono text-gray-500 mt-1">
          <span>Write</span>
          <span>820/s</span>
        </div>
        <div className="h-1.5 w-full bg-gray-200 dark:bg-slate-800 rounded-full overflow-hidden">
          <motion.div className="h-full bg-rose-500" animate={{ width: ["60%", "90%", "65%", "95%"] }} transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }} />
        </div>
      </div>
    </div>
  );
}

function WidgetRenderer({ widget }) {
  switch (widget.type) {
    case "metric": return <MetricWidget {...widget} />;
    case "bar-chart": return <BarChartWidget {...widget} />;
    case "line-chart": return <LineChartWidget {...widget} />;
    case "alert": return <AlertWidget {...widget} />;
    case "status": return <StatusWidget {...widget} />;
    case "optimization": return <OptimizationWidget {...widget} />;
    case "node-graph": return <NodeGraphWidget {...widget} />;
    case "security-score": return <SecurityScoreWidget {...widget} />;
    case "db-usage": return <DbUsageWidget {...widget} />;
    default: return null;
  }
}

export default function FloatingShowcase() {
  return (
    <div className="py-24 relative overflow-hidden bg-transparent">
      
     
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#792CA2]/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-[#B770FF]/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 mb-16 text-center relative z-10">
        <h3 className="text-3xl md:text-4xl font-black text-[#111844] dark:text-white mb-4">
          Unprecedented Visibility.
        </h3>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
          See exactly where every dollar goes with highly visual, real-time widgets that make cloud complexity simple.
        </p>
      </div>

      
      <div className="relative flex overflow-hidden group pb-8">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 30,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-6 px-3 flex-nowrap w-max group-hover:[animation-play-state:paused]"
        >
          {row1Widgets.map((w, idx) => (
            <WidgetRenderer key={`row1-${idx}`} widget={w} />
          ))}
        </motion.div>
      </div>

      
      <div className="relative flex overflow-hidden group">
        <motion.div
          animate={{ x: ["-50%", "0%"] }}
          transition={{
            duration: 35,
            ease: "linear",
            repeat: Infinity,
          }}
          className="flex gap-6 px-3 flex-nowrap w-max group-hover:[animation-play-state:paused]"
        >
          {row2Widgets.map((w, idx) => (
            <WidgetRenderer key={`row2-${idx}`} widget={w} />
          ))}
        </motion.div>
      </div>

     
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#F9F7F7] dark:from-[#05050F] to-transparent pointer-events-none z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#F9F7F7] dark:from-[#05050F] to-transparent pointer-events-none z-10" />
    </div>
  );
}
