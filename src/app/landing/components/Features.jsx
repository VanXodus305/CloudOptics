"use client";

import { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Card, CardBody } from "@heroui/react";

const features = [
  {
    title: "Real-Time Monitoring",
    desc: "Track cloud spend live. Keep eyes on budget thresholds and active resource consumption counters.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </svg>
    ),
    mockup: (
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-[10px] space-y-2 text-slate-300">
        <div className="flex justify-between font-mono">
          <span>Active Resource Cost</span>
          <span className="text-emerald-400 font-bold animate-pulse">Live</span>
        </div>
        <p className="text-xl font-bold text-white font-mono">
          $1,452.80
          <span className="text-[10px] text-slate-500 font-normal">/hr</span>
        </p>
        <div className="h-7 w-full bg-slate-950 rounded flex items-center justify-around px-2 relative overflow-hidden">
          <div className="h-[2px] w-full bg-slate-800 absolute top-1/2 left-0" />
          <motion.div
            animate={{ height: [4, 18, 8, 14, 4] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-1.5 bg-emerald-500 z-10 rounded-full"
          />
          <motion.div
            animate={{ height: [10, 4, 18, 6, 10] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-1.5 bg-[#B770FF] z-10 rounded-full"
          />
          <motion.div
            animate={{ height: [14, 10, 6, 18, 14] }}
            transition={{ repeat: Infinity, duration: 2.2 }}
            className="w-1.5 bg-emerald-500 z-10 rounded-full"
          />
          <motion.div
            animate={{ height: [6, 18, 8, 4, 6] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
            className="w-1.5 bg-[#792CA2] z-10 rounded-full"
          />
        </div>
      </div>
    ),
  },
  {
    title: "Advanced Cost Breakdown",
    desc: "Visualize multi-cloud cost aggregates by region, environment tags, and business department.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"
        />
      </svg>
    ),
    mockup: (
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-[10px] space-y-3 text-slate-300">
        <span className="font-semibold text-slate-400">
          Environment Breakdown
        </span>
        <div className="space-y-2.5">
          <div>
            <div className="flex justify-between text-[9px] mb-0.5 text-slate-400 font-mono">
              <span>Production</span>
              <span>65%</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "65%" }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-[#792CA2] to-[#B770FF]"
              />
            </div>
          </div>
          <div>
            <div className="flex justify-between text-[9px] mb-0.5 text-slate-400 font-mono">
              <span>Staging</span>
              <span>25%</span>
            </div>
            <div className="h-1.5 bg-slate-950 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: "25%" }}
                transition={{ duration: 1 }}
                className="h-full bg-emerald-500"
              />
            </div>
          </div>
        </div>
      </div>
    ),
  },
  {
    title: "Historical Trend Analysis",
    desc: "Analyze fluctuations over time and forecast future spending rates based on historical metrics.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
        />
      </svg>
    ),
    mockup: (
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-[10px] space-y-2 text-slate-300">
        <span className="font-semibold text-slate-400">Monthly Forecast</span>
        <div className="flex items-end justify-between h-14 pt-2 px-1">
          {[20, 35, 45, 60, 80].map((val, idx) => (
            <motion.div
              key={idx}
              initial={{ height: 0 }}
              whileInView={{ height: `${val}%` }}
              transition={{ duration: 0.8, delay: idx * 0.05 }}
              className="w-4 bg-gradient-to-t from-indigo-950 to-indigo-500 rounded-t-sm"
            />
          ))}
          <motion.div
            initial={{ height: 0 }}
            whileInView={{ height: "95%" }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-4 bg-[#792CA2] rounded-t-sm relative"
          >
            <span className="absolute -top-3.5 left-1/2 translate-x-[-50%] text-[7px] text-white font-bold animate-bounce">
              F
            </span>
          </motion.div>
        </div>
      </div>
    ),
  },
  {
    title: "Automated Optimization",
    desc: "Continuously scan active resources for resizing potential or instant idle shutdowns.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
        />
      </svg>
    ),
    mockup: (
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-[10px] flex items-center justify-between gap-3 text-slate-300">
        <div className="flex-1 space-y-1">
          <span className="text-slate-400 font-semibold">
            Idle DB Terminated
          </span>
          <p className="text-[9px] text-emerald-400 font-mono">
            ✔ Saved $410/mo
          </p>
        </div>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="text-[#B770FF]"
        >
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            />
          </svg>
        </motion.div>
      </div>
    ),
  },
  {
    title: "Actionable Savings Insights",
    desc: "Generate targeted optimization tasks pointing directly to cost-reduction recommendations.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
    mockup: (
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-[9px] space-y-2 text-slate-300">
        <div className="flex justify-between items-center text-slate-400 font-semibold mb-1">
          <span>Optimization Plan</span>
          <span className="text-emerald-400">Ready</span>
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-emerald-400 font-bold">✔</span>
          <span className="line-through text-slate-500">
            Unused EBS clean: -$180
          </span>
        </div>
        <div className="flex items-center gap-1.5 font-mono">
          <span className="text-amber-500 font-bold">&bull;</span>
          <span>Rightsize VM (t3.xl to t3.lg): -$320</span>
        </div>
      </div>
    ),
  },
  {
    title: "Real-Time Alerts",
    desc: "Receive prompt notifications about budget breaches and abnormal resource usage spikes.",
    icon: (
      <svg
        className="w-6 h-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
        />
      </svg>
    ),
    mockup: (
      <div className="bg-slate-900 rounded-xl p-4 border border-slate-800 text-[10px] space-y-1.5 text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <span className="text-rose-400 font-bold uppercase tracking-wider text-[8px]">
            Anomaly Alarm
          </span>
        </div>
        <p className="font-bold text-white leading-tight">Spike in RDS Spend</p>
        <p className="text-[8px] text-slate-400">
          +48% cost deviation detected in eu-west-1
        </p>
      </div>
    ),
  },
];

function interpolate(p, isMobile) {
  if (isMobile) {
    if (p <= -1) {
      return { x: -300, scale: 0.9, rotateY: 0, z: -50, opacity: 0, zIndex: 0 };
    }
    if (p >= 1) {
      return { x: 300, scale: 0.9, rotateY: 0, z: -50, opacity: 0, zIndex: 0 };
    }
    if (p < 0) {
      const t = p + 1; // 0 to 1
      return {
        x: -300 + t * 300,
        scale: 0.9 + t * 0.1,
        rotateY: 0,
        z: -50 + t * 50,
        opacity: t,
        zIndex: Math.round(t * 10),
      };
    } else {
      const t = p; // 0 to 1
      return {
        x: t * 300,
        scale: 1 - t * 0.1,
        rotateY: 0,
        z: -t * 50,
        opacity: 1 - t,
        zIndex: Math.round((1 - t) * 10),
      };
    }
  }

  
  const points = [
    {
      p: -2,
      x: -460,
      scale: 0.7,
      rotateY: 48,
      z: -200,
      opacity: 0.35,
      zIndex: 3,
    },
    {
      p: -1,
      x: -270,
      scale: 0.85,
      rotateY: 35,
      z: -100,
      opacity: 0.7,
      zIndex: 5,
    },
    { p: 0, x: 0, scale: 1.08, rotateY: 0, z: 60, opacity: 1, zIndex: 10 },
    {
      p: 1,
      x: 270,
      scale: 0.85,
      rotateY: -35,
      z: -100,
      opacity: 0.7,
      zIndex: 5,
    },
    {
      p: 2,
      x: 460,
      scale: 0.7,
      rotateY: -48,
      z: -200,
      opacity: 0.35,
      zIndex: 3,
    },
  ];

  if (p <= -2) {
    const factor = Math.max(-3, p);
    const t = (factor - -2) / (-3 - -2);
    return {
      x: -460 + t * -160,
      scale: 0.7 + t * -0.2,
      rotateY: 48 + t * 7,
      z: -200 + t * -100,
      opacity: 0.35 * (1 - t),
      zIndex: 0,
    };
  }
  if (p >= 2) {
    const factor = Math.min(3, p);
    const t = (factor - 2) / (3 - 2);
    return {
      x: 460 + t * 160,
      scale: 0.7 + t * -0.2,
      rotateY: -48 + t * -7,
      z: -200 + t * -100,
      opacity: 0.35 * (1 - t),
      zIndex: 0,
    };
  }

  let p0 = points[0];
  let p1 = points[1];
  for (let i = 0; i < points.length - 1; i++) {
    if (p >= points[i].p && p <= points[i + 1].p) {
      p0 = points[i];
      p1 = points[i + 1];
      break;
    }
  }

  const t = (p - p0.p) / (p1.p - p0.p);

  return {
    x: p0.x + t * (p1.x - p0.x),
    scale: p0.scale + t * (p1.scale - p0.scale),
    rotateY: p0.rotateY + t * (p1.rotateY - p0.rotateY),
    z: p0.z + t * (p1.z - p0.z),
    opacity: p0.opacity + t * (p1.opacity - p0.opacity),
    zIndex: Math.max(p0.zIndex, p1.zIndex),
  };
}

function FeatureCard({
  feature,
  index,
  activeIndexVal,
  isMobile,
  startIndex,
  setStartIndex,
}) {
  const progressDiff = useTransform(activeIndexVal, (val) => index - val);

  const x = useTransform(progressDiff, (p) => interpolate(p, isMobile).x);
  const scale = useTransform(
    progressDiff,
    (p) => interpolate(p, isMobile).scale,
  );
  const rotateY = useTransform(
    progressDiff,
    (p) => interpolate(p, isMobile).rotateY,
  );
  const z = useTransform(progressDiff, (p) => interpolate(p, isMobile).z);
  const opacity = useTransform(
    progressDiff,
    (p) => interpolate(p, isMobile).opacity,
  );
  const zIndex = useTransform(
    progressDiff,
    (p) => interpolate(p, isMobile).zIndex,
  );

  return (
    <motion.div
      style={{
        x,
        scale,
        rotateY,
        z,
        opacity,
        zIndex,
        transformStyle: "preserve-3d",
      }}
      className="absolute w-[290px] sm:w-[330px] md:w-[350px] pointer-events-auto"
      onClick={() => {
        if (index !== startIndex) {
          setStartIndex(index);
        }
      }}
    >
      <Card
        className={`
          border
          transition-all
          duration-300
          min-h-[400px]
          cursor-pointer
          rounded-3xl
          ${
            index === startIndex
              ? "border-[#792CA2] dark:border-[#9A4DCC] bg-white dark:bg-[#111430] shadow-[0_30px_70px_rgba(121,44,162,0.15)] dark:shadow-[0_30px_70px_rgba(154,77,204,0.25)] scale-[1.02]"
              : "border-gray-200 dark:border-neutral-800 bg-white/70 dark:bg-[#111430]/70 backdrop-blur-md opacity-60 shadow-md hover:opacity-85 hover:border-[#792CA2]/50 dark:hover:border-[#9A4DCC]/50 hover:shadow-lg"
          }
        `}
      >
        <CardBody className="p-8 flex flex-col justify-between">
          <div>
            <div
              className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 shadow-sm transition-all ${
                index === startIndex
                  ? "bg-[#792CA2] dark:bg-[#9A4DCC] text-white"
                  : "bg-[#792CA2]/10 dark:bg-[#9A4DCC]/20 text-[#792CA2] dark:text-[#B770FF]"
              }`}
            >
              {feature.icon}
            </div>

            <h3 className="text-2xl font-bold text-[#111844] dark:text-white mb-3 transition-colors duration-500">
              {feature.title}
            </h3>

            <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-xs mb-6 transition-colors duration-500">
              {feature.desc}
            </p>
          </div>

          
          <div className="mt-auto">{feature.mockup}</div>
        </CardBody>
      </Card>
    </motion.div>
  );
}

export default function FeaturesCarousel() {
  const containerRef = useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const activeIndexVal = useMotionValue(0);
  const scrollAccum = useRef(0);
  const scrollTimeout = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    animate(activeIndexVal, startIndex, {
      type: "spring",
      stiffness: 150,
      damping: 20,
    });
  }, [startIndex, activeIndexVal]);

 
  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setStartIndex((prevIndex) => (prevIndex + 1) % features.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [isMobile, startIndex]);

  // Scrolling with two fingers
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e) => {
      //for horizontal scrolling
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
        e.preventDefault();

        scrollAccum.current += e.deltaX;

        const slideWidth = isMobile ? 280 : 270;
        
        const progress = startIndex + scrollAccum.current / (slideWidth * 2);
        const clampedProgress = Math.max(
          0,
          Math.min(progress, features.length - 1),
        );

        activeIndexVal.set(clampedProgress);

        if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

        scrollTimeout.current = setTimeout(() => {
          const finalIndex = Math.round(activeIndexVal.get());
          const clampedIndex = Math.max(
            0,
            Math.min(finalIndex, features.length - 1),
          );

          if (clampedIndex === startIndex) {
            animate(activeIndexVal, startIndex, {
              type: "spring",
              stiffness: 150,
              damping: 20,
            });
          } else {
            setStartIndex(clampedIndex);
          }

          scrollAccum.current = 0;
        }, 150); 
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, [startIndex, isMobile, activeIndexVal]);

  const nextSlide = () => {
    if (startIndex < features.length - 1) {
      setStartIndex(startIndex + 1);
    }
  };

  const prevSlide = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  return (
    <section
      id="features"
      className="py-28 bg-[#FFFFFF] dark:bg-[#070919] rounded-t-[50px] relative overflow-hidden transition-colors duration-500"
    >
      
      <div className="absolute top-[20%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#792CA2]/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[30vw] h-[30vw] rounded-full bg-[#B770FF]/5 blur-[100px] pointer-events-none" />

      
      <div className="absolute inset-0 opacity-[0.015] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-4 md:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111844] dark:text-white mb-4 transition-colors duration-500">
            Core Features
          </h2>

          <p className="text-lg text-gray-500 dark:text-gray-400 transition-colors duration-500">
            Drag with mouse or use trackpad two-finger swipe.
          </p>
        </div>

        <div className="flex items-center justify-between gap-4 relative">
          <button
            onClick={prevSlide}
            disabled={startIndex === 0}
            className={`
              hidden md:flex
              w-12 h-12 rounded-full
              bg-white dark:bg-slate-900
              border dark:border-slate-800
              shadow-lg
              text-[#792CA2] dark:text-[#B770FF]
              items-center justify-center
              font-bold
              transition-all
              z-30
              ${startIndex === 0 ? "opacity-20 cursor-not-allowed" : "hover:shadow-2xl hover:scale-105 active:scale-95"}
            `}
          >
            ←
          </button>

          
          <motion.div
            ref={containerRef}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0}
            onDrag={(e, info) => {
              const slideWidth = isMobile ? 280 : 270;
              const dragPercent = info.offset.x / slideWidth;
              const clampedDragPercent = isMobile
                ? Math.max(-1.1, Math.min(1.1, dragPercent))
                : dragPercent;
              activeIndexVal.set(startIndex - clampedDragPercent);
            }}
            onDragEnd={(e, info) => {
              const slideWidth = isMobile ? 280 : 270;
              const dragDistance = info.offset.x;
              const dragVelocity = info.velocity.x;

              let indexOffset = 0;
              if (dragDistance < -50 || dragVelocity < -200) {
                indexOffset = 1;
              } else if (dragDistance > 50 || dragVelocity > 200) {
                indexOffset = -1;
              }

              let newIndex = startIndex + indexOffset;
              if (isMobile) {
                if (newIndex < 0) {
                  newIndex = features.length - 1;
                } else if (newIndex >= features.length) {
                  newIndex = 0;
                }
              } else {
                newIndex = Math.max(0, Math.min(newIndex, features.length - 1));
              }

              if (newIndex === startIndex) {
                animate(activeIndexVal, startIndex, {
                  type: "spring",
                  stiffness: 150,
                  damping: 20,
                });
              } else {
                setStartIndex(newIndex);
              }
            }}
            className="flex-1 relative flex items-center justify-center h-[520px] overflow-visible w-full select-none cursor-grab active:cursor-grabbing touch-pan-y"
            style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
          >
            {features.map((feature, index) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                index={index}
                activeIndexVal={activeIndexVal}
                isMobile={isMobile}
                startIndex={startIndex}
                setStartIndex={setStartIndex}
              />
            ))}
          </motion.div>

          <button
            onClick={nextSlide}
            disabled={startIndex === features.length - 1}
            className={`
              hidden md:flex
              w-12 h-12 rounded-full
              bg-white dark:bg-slate-900
              border dark:border-slate-800
              shadow-lg
              text-[#792CA2] dark:text-[#B770FF]
              items-center justify-center
              font-bold
              transition-all
              z-30
              ${startIndex === features.length - 1 ? "opacity-20 cursor-not-allowed" : "hover:shadow-2xl hover:scale-105 active:scale-95"}
            `}
          >
            →
          </button>
        </div>

        {/* Slide indicators at bottom */}
        <div className="flex justify-center gap-3 mt-10">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setStartIndex(index)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                startIndex === index
                  ? "w-8 bg-[#792CA2] dark:bg-[#B770FF]"
                  : "w-2.5 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
              }`}
              aria-label={`Go to feature slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
