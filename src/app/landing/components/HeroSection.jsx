"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const maxParticles = 60;

    let mouse = { x: null, y: null, radius: 160 };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const isMobile = window.innerWidth < 768;

    const drawStatic = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = ((120 - dist) / 120) * 0.1;
            ctx.strokeStyle = `rgba(121, 44, 162, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    };

    const resizeCanvas = () => {
      if (!canvas.parentElement) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      if (window.innerWidth < 768) {
        drawStatic();
      }
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.7;
        this.vy = (Math.random() - 0.5) * 0.7;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? "rgba(121, 44, 162, 0.25)" : "rgba(154, 77, 204, 0.25)";
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
        if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;

        if (mouse.x !== null && mouse.y !== null) {
          const dx = mouse.x - this.x;
          const dy = mouse.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            this.x -= (dx / dist) * force * 1.5;
            this.y -= (dy / dist) * force * 1.5;
          }
        }
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
      }
    }

    for (let i = 0; i < maxParticles; i++) {
      particles.push(new Particle());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.hypot(dx, dy);

          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const opacity = ((120 - dist) / 120) * 0.1;
            ctx.strokeStyle = `rgba(121, 44, 162, ${opacity})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        if (mouse.x !== null && mouse.y !== null) {
          const dx = particles[i].x - mouse.x;
          const dy = particles[i].y - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < mouse.radius) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(mouse.x, mouse.y);
            const opacity = ((mouse.radius - dist) / mouse.radius) * 0.15;
            ctx.strokeStyle = `rgba(154, 77, 204, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    if (isMobile) {
      drawStatic();
    } else {
      animate();
    }

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

const slides = [
  {
    tag: "COST CONTROL",
    tagColor: "from-purple-600 to-indigo-600",
    title: "See Every Dollar.",
    highlight: "Optimize Every Resource.",
    desc: "CloudOptics combines real-time monitoring, cost analytics, automated optimization, savings recommendations, and risk detection into a single platform, helping organizations achieve greater efficiency and financial control across their cloud environments.",
  },
  {
    tag: "INSTANT ALERTS",
    tagColor: "from-sky-500 to-blue-500",
    title: "Real-time Cost Visibility.",
    highlight: "Never Miss An Anomaly.",
    desc: "Get notified instantly of any abnormal spikes in your cloud resources. Keep your cloud engineering teams accountable with precise resource ownership mapping and automated alert routing.",
  },
  {
    tag: "AUTOMATED SAVINGS",
    tagColor: "from-emerald-500 to-teal-500",
    title: "Actionable Savings Insights.",
    highlight: "Cut Cloud Waste by 30%.",
    desc: "Our rule-based engine continuously scans your infrastructure to pinpoint idle systems, oversized instances, and orphaned disks, giving you exact steps to reduce spend instantly.",
  }
];

// Word wrapper component to animate each word individually with 3D effects
const WordWrapper = ({ text, delayOffset = 0, variantType = "title", className = "", isMobile = false }) => {
  if (isMobile) {
    return <span className={className}>{text}</span>;
  }
  const words = text.split(" ");
  return (
    <span className="inline-flex flex-wrap overflow-visible" style={{ transformStyle: "preserve-3d" }}>
      {words.map((word, index) => (
        <motion.span
          key={index}
          variants={wordVariants}
          custom={{ index, delayOffset, variantType }}
          className={`inline-block mr-[0.25em] origin-center whitespace-nowrap overflow-visible ${className}`}
          style={{ transformStyle: "preserve-3d" }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

// 3D Flip & Stagger Animations for Slide contents
const containerVariants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
  },
  exit: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const mobileContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

const wordVariants = {
  hidden: (custom) => ({
    opacity: 0,
    y: custom.variantType === "title" ? 80 : 50,
    rotateX: custom.variantType === "title" ? -100 : -70,
    rotateY: custom.variantType === "title" ? 45 : 25,
    rotateZ: custom.variantType === "title" ? 10 : 5,
    scale: 0.4,
    skewX: custom.variantType === "title" ? 20 : 10,
    skewY: custom.variantType === "title" ? 10 : 5,
    filter: "blur(15px)",
  }),
  visible: (custom) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    rotateY: 0,
    rotateZ: 0,
    scale: 1,
    skewX: 0,
    skewY: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 140,
      damping: 11, // low damping for lively overshoot/bounce
      mass: 0.8,
      delay: custom.index * 0.07 + custom.delayOffset,
    },
  }),
  exit: (custom) => ({
    opacity: 0,
    y: custom.variantType === "title" ? -80 : -50,
    rotateX: custom.variantType === "title" ? 100 : 70,
    rotateY: custom.variantType === "title" ? -45 : -25,
    rotateZ: custom.variantType === "title" ? -10 : -5,
    scale: 0.5,
    skewX: custom.variantType === "title" ? -20 : -10,
    skewY: custom.variantType === "title" ? -10 : -5,
    filter: "blur(15px)",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
      delay: custom.index * 0.03,
    },
  }),
};

const tagVariants = {
  hidden: { opacity: 0, scale: 0.3, y: 15, rotateY: -180 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateY: 0,
    transition: {
      type: "spring",
      stiffness: 150,
      damping: 10,
      delay: 0.05,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.7,
    y: -15,
    rotateY: 180,
    transition: {
      duration: 0.3,
    },
  },
};

const descVariants = {
  hidden: { opacity: 0, y: 35, scale: 0.95, rotateX: -20, filter: "blur(10px)" },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    rotateX: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 14,
      delay: 0.45,
    },
  },
  exit: {
    opacity: 0,
    y: -25,
    scale: 0.95,
    rotateX: 20,
    filter: "blur(10px)",
    transition: {
      duration: 0.4,
      ease: "easeInOut",
    },
  },
};

const featuresList = [
  {
    title: "Real-Time Monitoring",
    desc: "Track cloud spend live. Keep eyes on budget thresholds and active resource consumption counters.",
    color: "bg-emerald-500/10 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-400 border-emerald-500/20",
    badgeColor: "bg-emerald-500 text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )
  },
  {
    title: "Advanced Cost Breakdown",
    desc: "Visualize multi-cloud cost aggregates by region, environment tags, and business department.",
    color: "bg-purple-500/10 text-purple-600 dark:bg-purple-500/20 dark:text-purple-400 border-purple-500/20",
    badgeColor: "bg-purple-500 text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    )
  },
  {
    title: "Historical Trend Analysis",
    desc: "Analyze fluctuations over time and forecast future spending rates based on historical metrics.",
    color: "bg-blue-500/10 text-blue-600 dark:bg-blue-500/20 dark:text-blue-400 border-blue-500/20",
    badgeColor: "bg-blue-500 text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    )
  },
  {
    title: "Automated Optimization",
    desc: "Continuously scan active resources for resizing potential or instant idle shutdowns.",
    color: "bg-[#792CA2]/10 text-[#792CA2] dark:bg-[#792CA2]/20 dark:text-[#B770FF] border-[#792CA2]/20",
    badgeColor: "bg-[#792CA2] text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    )
  },
  {
    title: "Actionable Savings Insights",
    desc: "Generate targeted optimization tasks pointing directly to cost-reduction recommendations.",
    color: "bg-amber-500/10 text-amber-600 dark:bg-amber-500/20 dark:text-amber-400 border-amber-500/20",
    badgeColor: "bg-amber-500 text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )
  },
  {
    title: "Real-Time Alerts",
    desc: "Receive prompt notifications about budget breaches and abnormal resource usage spikes.",
    color: "bg-rose-500/10 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400 border-rose-500/20",
    badgeColor: "bg-rose-500 text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
      </svg>
    )
  }
];

function FloatingFeatureStream({ activeFeatureIndex, hoveredTrigger }) {
  const [bubbles, setBubbles] = useState([]);

  // Helper to spawn a single bubble
  const spawnBubble = (idx) => {
    const feat = featuresList[idx];
    if (!feat) return;
    const id = Math.random().toString(36).substring(2, 9);

    const startX = 15 + Math.random() * 70; // 15% to 85% horizontal range
    const scale = 0.8 + Math.random() * 0.35; // 0.8 to 1.15
    const duration = 4.5 + Math.random() * 2.5; // 4.5 to 7 seconds
    const swayDistance = 25 + Math.random() * 35; // horizontal wave offset
    const rotateDir = Math.random() > 0.5 ? 1 : -1;
    const initialRotate = (Math.random() - 0.5) * 12; // -6 to 6 deg
    const endRotate = initialRotate + rotateDir * (15 + Math.random() * 20); // final rotation

    const newBubble = {
      id,
      feature: feat,
      startX,
      scale,
      duration,
      swayDistance,
      initialRotate,
      endRotate
    };

    setBubbles((prev) => [...prev, newBubble]);

    setTimeout(() => {
      setBubbles((prev) => prev.filter((b) => b.id !== id));
    }, duration * 1000);
  };

  // Trigger burst of bubbles on hover trigger
  useEffect(() => {
    if (activeFeatureIndex === null || activeFeatureIndex === undefined) return;

    // Burst of 4 bubbles
    const timers = [];
    for (let i = 0; i < 4; i++) {
      const timerId = setTimeout(() => {
        spawnBubble(activeFeatureIndex);
      }, i * 220);
      timers.push(timerId);
    }
    return () => timers.forEach(clearTimeout);
  }, [activeFeatureIndex, hoveredTrigger]);

  // Periodic trickle stream
  useEffect(() => {
    if (activeFeatureIndex === null || activeFeatureIndex === undefined) return;
    const interval = setInterval(() => {
      spawnBubble(activeFeatureIndex);
    }, 1300);
    return () => clearInterval(interval);
  }, [activeFeatureIndex]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none w-full h-full z-10">
      <AnimatePresence>
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            initial={{
              opacity: 0,
              y: "110%",
              x: `${bubble.startX}%`,
              scale: bubble.scale * 0.7,
              rotate: bubble.initialRotate
            }}
            animate={{
              opacity: [0, 0.95, 0.95, 0],
              y: "-15%",
              x: [
                `${bubble.startX}%`,
                `${bubble.startX + bubble.swayDistance / 12}%`,
                `${bubble.startX - bubble.swayDistance / 12}%`,
                `${bubble.startX + (Math.random() > 0.5 ? 1 : -1) * (bubble.swayDistance / 14)}%`
              ],
              scale: bubble.scale,
              rotate: bubble.endRotate
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: bubble.duration,
              ease: "easeOut",
              times: [0, 0.15, 0.85, 1]
            }}
            className="absolute bottom-0 w-[230px] sm:w-[250px] md:w-[270px]"
            style={{
              x: "-50%"
            }}
          >
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-slate-950/90 backdrop-blur-md border border-white/40 dark:border-slate-800/40 shadow-xl flex gap-3 text-slate-800 dark:text-slate-100">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${bubble.feature.color}`}>
                {bubble.feature.icon}
              </div>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-bold truncate">{bubble.feature.title}</p>
                <p className="text-[10px] text-gray-500 dark:text-slate-400 leading-tight mt-0.5 line-clamp-2">{bubble.feature.desc}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default function HeroSection() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [hoveredWidget, setHoveredWidget] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Outer Hero Section Carousel States
  const [heroActiveSlide, setHeroActiveSlide] = useState(0);
  const [isHeroPaused, setIsHeroPaused] = useState(false);
  const [hoveredFeatureIndex, setHoveredFeatureIndex] = useState(0);
  const [hoveredFeatureTrigger, setHoveredFeatureTrigger] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    setMounted(true);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Combined slide auto-play controller
  useEffect(() => {
    const isPausedAny = heroActiveSlide === 0 ? isPaused : isHeroPaused;
    if (isPausedAny) return;

    const delay = heroActiveSlide === 0 ? 3000 : 8000;

    const timer = setTimeout(() => {
      if (heroActiveSlide === 0) {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide((prev) => prev + 1);
        } else {
          setHeroActiveSlide(1);
          setCurrentSlide(0);
        }
      } else {
        setHeroActiveSlide(0);
        setCurrentSlide(0);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [heroActiveSlide, currentSlide, isHeroPaused, isPaused]);

  const handleMouseEnterSlide2 = () => {
    setIsHeroPaused(true);
  };

  const handleMouseLeaveSlide2 = () => {
    setIsHeroPaused(false);
  };

  return (
    <section
      className="
      min-h-screen
      bg-gradient-to-br
      from-[#F9F7F7]
      via-[#EEEEEE]
      to-[#DCCBFF]
      dark:from-[#080A1A]
      dark:via-[#0F122B]
      dark:to-[#22163A]
      flex
      items-center
      px-8
      pt-28
      pb-36
      md:pt-0
      md:pb-36
      relative
      overflow-hidden
      "
    >
      <ParticleBackground />

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none z-0" />

      {/* Floating Glowing Blobs */}
      <div className="absolute top-[10%] left-[10%] w-[35vw] h-[35vw] rounded-full bg-[#792CA2]/6 blur-[100px] animate-[pulse_10s_infinite_alternate] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[40vw] h-[40vw] rounded-full bg-[#B770FF]/6 blur-[110px] animate-[pulse_8s_infinite_alternate_2s] pointer-events-none z-0" />

      {/* Cybernetic concentric circles in the background */}
      <div className="absolute top-1/2 left-[5%] w-[450px] h-[450px] opacity-[0.05] dark:opacity-[0.1] pointer-events-none z-0">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
          className="w-full h-full rounded-full border border-dashed border-[#111844] dark:border-white"
        />
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-10 rounded-full border border-dotted border-[#111844] dark:border-white"
        />
      </div>

      <AnimatePresence mode="wait">
        {heroActiveSlide === 0 ? (
          <motion.div
            key="slide1-brand"
            initial={{ opacity: 0, x: isMobile ? 0 : -80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : 80 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-2
            gap-12
            lg:gap-24
            items-center
            relative
            z-10  
            w-full
            "
          >
            {/* Slide 1 Left Column: Cloud Optics branding & Widgets */}
            <div>
              <motion.h1
                initial={{
                  opacity: 0,
                  x: -200,
                }}
                animate={{
                  opacity: 1,
                  x: 0,
                }}
                transition={{
                  duration: 1.2,
                }}
                className="
                text-5xl
                sm:text-6xl
                md:text-8xl
                font-black
                bg-gradient-to-r
                from-[#111844]
                via-[#792CA2]
                to-[#B770FF]
                bg-clip-text
                mt-2
                md:mt-24
                text-transparent
                dark:text-white
                leading-none
                overflow-visible
                pb-3
                "
              >
                Cloud
                <br />
                Optics
              </motion.h1>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "180px" }}
                transition={{
                  duration: 1,
                  delay: 0.5,
                }}
                className="
                h-1
                bg-gradient-to-r
                from-[#792CA2]
                to-[#B770FF]
                dark:from-[#9A4DCC]
                dark:to-[#C084FC]
                rounded-full
                mt-4
                "
              />

              <motion.p
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.8,
                  delay: 0.6,
                }}
                className="
                uppercase
                tracking-[4px]
                text-[#792CA2]
                dark:text-[#B770FF]
                font-bold
                text-sm
                md:text-base
                mt-6
                "
              >
                Cloud Cost Optimization & Monitoring
              </motion.p>

              {/* Floating Widgets Cluster */}
              <div className="mt-8 relative h-[320px] w-full hidden md:block">
                {/* Widget 1: Savings */}
                <motion.div
                  onMouseEnter={() => setHoveredWidget("savings")}
                  onMouseLeave={() => setHoveredWidget(null)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    height: hoveredWidget === "savings" ? 175 : 110,
                    zIndex: hoveredWidget === "savings" ? 40 : 10,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 24,
                  }}
                  className="absolute top-0 left-0 p-5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-white/40 dark:border-slate-800/40 rounded-2xl shadow-[0_10px_30px_rgba(121,44,162,0.05)] w-60 overflow-hidden cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">Potential Savings</span>
                  </div>
                  <p className="text-3xl font-black text-[#111844] dark:text-white">$8,450<span className="text-sm font-medium text-gray-500 dark:text-slate-400">/mo</span></p>

                  {hoveredWidget === "savings" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 pt-3 border-t border-gray-150/50 dark:border-slate-800 space-y-1 text-[10px] text-gray-600 dark:text-slate-300"
                    >
                      <div className="flex justify-between font-semibold">
                        <span>☁ Compute (EC2):</span>
                        <span className="text-emerald-600 dark:text-emerald-400">$3,200</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>💾 Storage (S3):</span>
                        <span className="text-emerald-600 dark:text-emerald-400">$2,850</span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>🗄 Databases (RDS):</span>
                        <span className="text-emerald-600 dark:text-emerald-400">$2,400</span>
                      </div>
                    </motion.div>
                  ) : (
                    ""
                  )}
                </motion.div>

                {/* Widget 2: Real-time alert */}
                <motion.div
                  onMouseEnter={() => setHoveredWidget("alert")}
                  onMouseLeave={() => setHoveredWidget(null)}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    height: hoveredWidget === "alert" ? 165 : 105,
                    zIndex: hoveredWidget === "alert" ? 40 : 20,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 24,
                  }}
                  className="absolute top-12 right-2 md:right-6 p-5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-white/40 dark:border-slate-800/40 rounded-2xl shadow-[0_10px_30px_rgba(121,44,162,0.05)] w-56 overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
                    <div className="w-2 h-2 rounded-full bg-amber-500 absolute" />
                    <span className="text-[9px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">Active Alerts</span>
                  </div>
                  <p className="text-sm font-bold text-[#111844] dark:text-white mt-2">Idle Database Instance</p>

                  {hoveredWidget === "alert" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2.5 pt-2.5 border-t border-gray-150/50 dark:border-slate-800 text-[10px] text-gray-600 dark:text-slate-300 space-y-0.5"
                    >
                      <p className="font-semibold"><span className="text-gray-400">ID:</span> db-prod-replica</p>
                      <p className="font-semibold"><span className="text-gray-400">Action:</span> Terminate</p>
                      <p className="text-amber-600 dark:text-amber-400 font-bold">Waste: $140/mo</p>
                    </motion.div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-slate-400">Saving potential: $140/mo</p>
                  )}
                </motion.div>

                {/* Widget 3: Status check */}
                <motion.div
                  onMouseEnter={() => setHoveredWidget("status")}
                  onMouseLeave={() => setHoveredWidget(null)}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{
                    opacity: 1,
                    scale: 1,
                    height: hoveredWidget === "status" ? 130 : 66,
                    zIndex: hoveredWidget === "status" ? 40 : 30,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 220,
                    damping: 24,
                  }}
                  className="absolute bottom-16 left-10 md:left-14 p-4 bg-[#792CA2] dark:bg-[#5E1A86] text-white rounded-2xl shadow-xl w-60 overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#DCCBFF] dark:text-slate-300 font-bold uppercase tracking-wider">Active Monitoring</p>
                      <p className="text-sm font-black">Systems Optimized</p>
                    </div>
                  </div>

                  {hoveredWidget === "status" && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 pt-2.5 border-t border-white/10 text-[9px] text-[#DCCBFF] dark:text-slate-300 grid grid-cols-2 gap-1 font-semibold"
                    >
                      <div>✔ Budgets: OK</div>
                      <div>✔ Anomalies: 0</div>
                      <div>✔ Multi-cloud: Active</div>
                      <div>✔ Scan: 100% OK</div>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Slide 1 Right Column: Text Highlights Slider */}
            <div
              className="flex flex-col justify-center relative"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Slide-specific ambient backdrop glow */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`ambient-${currentSlide}`}
                  initial={{ opacity: 0, scale: 0.6, rotate: -30, filter: "blur(100px)" }}
                  animate={{ opacity: 1, scale: 1.1, rotate: 15, filter: "blur(80px)" }}
                  exit={{ opacity: 0, scale: 1.3, rotate: 60, filter: "blur(110px)" }}
                  transition={{ duration: 1, ease: "easeInOut" }}
                  className={`absolute -inset-16 -z-10 rounded-full pointer-events-none ${currentSlide === 0
                      ? "bg-gradient-to-tr from-[#792CA2]/15 via-[#B770FF]/15 dark:from-[#9A4DCC]/20 dark:via-[#C084FC]/10 to-transparent"
                      : currentSlide === 1
                        ? "bg-gradient-to-br from-[#00F2FE]/15 via-[#4FACFE]/15 dark:from-[#00F2FE]/20 dark:via-[#4FACFE]/10 to-transparent"
                        : "bg-gradient-to-tr from-[#FF0844]/15 via-[#FFB199]/15 dark:from-[#FF0844]/20 dark:via-[#FFB199]/10 to-transparent"
                    }`}
                />
              </AnimatePresence>

              {/* Automatic transitioning carousel for headings & descriptions */}
              <div
                className="min-h-[340px] flex flex-col justify-center relative z-10"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
              >
                {mounted && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      variants={isMobile ? mobileContainerVariants : containerVariants}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={isMobile ? {} : { transformStyle: "preserve-3d" }}
                      className="flex flex-col items-start"
                    >
                      {/* Badge Tag with 3D Flip */}
                      <motion.div
                        variants={isMobile ? {} : tagVariants}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r ${slides[currentSlide].tagColor} shadow-md mb-6`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        {slides[currentSlide].tag}
                      </motion.div>

                      <motion.h2
                        className="
                        text-4xl
                        md:text-5xl
                        font-black
                        text-[#111844]
                        dark:text-white
                        leading-tight
                        overflow-visible
                        "
                        style={isMobile ? {} : { transformStyle: "preserve-3d" }}
                      >
                        <WordWrapper text={slides[currentSlide].title} delayOffset={0.05} variantType="title" isMobile={isMobile} />
                        <br />
                        <WordWrapper
                          text={slides[currentSlide].highlight}
                          delayOffset={0.25}
                          variantType="highlight"
                          className="bg-gradient-to-r from-[#792CA2] to-[#B770FF] dark:from-[#9A4DCC] dark:to-[#C084FC] bg-clip-text text-transparent font-black pb-2 -mb-2"
                          isMobile={isMobile}
                        />
                      </motion.h2>

                      <motion.p
                        variants={isMobile ? {} : descVariants}
                        className="
                        mt-8
                        text-lg
                        md:text-xl
                        text-gray-600
                        dark:text-gray-300
                        leading-relaxed
                        max-w-xl
                        "
                      >
                        {slides[currentSlide].desc}
                      </motion.p>
                    </motion.div>
                  </AnimatePresence>
                )}
              </div>

              <motion.div
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="mt-8 flex items-center gap-6 relative z-10"
              >
                <a href={isLoggedIn ? "/dashboard" : "/auth/signin"}>
                  <Button
                    size="lg"
                    className="
                    bg-[#111844]
                    dark:bg-white
                    hover:bg-[#0c0e2b]
                    dark:hover:bg-gray-150
                    text-white
                    dark:text-[#111844]
                    font-bold
                    px-8
                    shadow-[0_4px_25px_rgba(17,24,68,0.25)]
                    transition-all
                    hover:scale-[1.02]
                    "
                  >
                    {isLoggedIn ? "Go To Dashboard" : "Explore Dashboard"}
                  </Button>
                </a>

                {/* Slide Navigation Indicators */}
                <div className="flex gap-2">
                  {slides.map((_, idx) => {
                    const isActive = currentSlide === idx;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setCurrentSlide(idx);
                        }}
                        className={`h-2.5 rounded-full overflow-hidden relative transition-all duration-500 ease-out ${isActive ? "w-8 bg-gray-200 dark:bg-neutral-800" : "w-2.5 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
                          }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        {isActive && (
                          <motion.div
                            key={`progress-${idx}-${isPaused}`}
                            initial={{ width: isPaused ? "100%" : "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: isPaused ? 0 : 3, ease: "linear" }}
                            className="absolute inset-y-0 left-0 bg-[#792CA2] dark:bg-[#B770FF]"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="slide2-features"
            initial={{ opacity: 0, x: isMobile ? 0 : 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : -80 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="
            max-w-7xl
            mx-auto
            grid
            lg:grid-cols-2
            gap-12
            lg:gap-24
            items-center
            relative
            z-10  
            w-full
            "
          >
            {/* Slide 2 Left Column: Features Grid */}
            <div
              onMouseEnter={handleMouseEnterSlide2}
              onMouseLeave={handleMouseLeaveSlide2}
              className="mt-2 md:mt-24"
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
              >
                <span className="text-xs uppercase tracking-[4px] font-bold text-[#792CA2] dark:text-[#B770FF]">
                  Explore the platform
                </span>
                <h2 className="text-4xl md:text-5xl font-black text-[#111844] dark:text-white leading-tight mt-2 pb-1 bg-gradient-to-r from-[#111844] via-[#792CA2] to-[#B770FF] bg-clip-text text-[#111844] dark:text-white overflow-visible">
                  6 Core Pillars
                </h2>
                <p className="text-sm md:text-base text-gray-500 dark:text-slate-400 mt-2 max-w-lg leading-relaxed">
                  Hover over each pillar to watch its operational footprint bubble up, or explore our full dashboard for a complete analytics demo.
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                {featuresList.map((feat, idx) => {
                  const isHovered = hoveredFeatureIndex === idx;
                  return (
                    <motion.div
                      key={idx}
                      onMouseEnter={() => {
                        setHoveredFeatureIndex(idx);
                        setHoveredFeatureTrigger((prev) => prev + 1);
                      }}
                      className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${isHovered
                          ? "bg-white dark:bg-slate-950 border-[#792CA2] dark:border-[#B770FF] shadow-lg shadow-[#792CA2]/5 dark:shadow-[#B770FF]/5 scale-[1.02]"
                          : "bg-white/50 dark:bg-slate-900/50 border-gray-200/50 dark:border-slate-800/50 hover:bg-white/80 dark:hover:bg-slate-900/80 hover:border-gray-300 dark:hover:border-slate-700"
                        }`}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex gap-3">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${isHovered ? feat.badgeColor : "bg-[#792CA2]/10 dark:bg-[#B770FF]/15 text-[#792CA2] dark:text-[#B770FF]"
                          }`}>
                          {feat.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-[#111844] dark:text-white">{feat.title}</h4>
                          <p className="text-xs text-gray-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">{feat.desc}</p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-6 flex items-center gap-4 relative z-10"
              >
                <a href={isLoggedIn ? "/dashboard" : "/auth/signin"}>
                  <Button
                    size="lg"
                    className="
                    bg-[#111844]
                    dark:bg-white
                    hover:bg-[#0c0e2b]
                    dark:hover:bg-gray-150
                    text-white
                    dark:text-[#111844]
                    font-bold
                    px-8
                    shadow-[0_4px_25px_rgba(17,24,68,0.25)]
                    transition-all
                    hover:scale-[1.02]
                    "
                  >
                    {isLoggedIn ? "Go To Dashboard" : "Explore Dashboard"}
                  </Button>
                </a>
              </motion.div>
            </div>

            {/* Slide 2 Right Column: Floating Stream Container */}
            <div className="mt-2 md:mt-24 relative h-[450px] w-full flex items-center justify-center rounded-3xl bg-slate-950/20 dark:bg-slate-950/40 border border-white/5 dark:border-slate-800/30 overflow-hidden shadow-inner">
              <div className="absolute inset-0 opacity-[0.08] bg-[radial-gradient(#792CA2_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
              <div className="absolute w-[200px] h-[200px] rounded-full bg-[#792CA2]/10 blur-[60px] animate-pulse pointer-events-none" />
              <FloatingFeatureStream activeFeatureIndex={hoveredFeatureIndex} hoveredTrigger={hoveredFeatureTrigger} />

              <div className="absolute bottom-6 text-center pointer-events-none z-20">
                <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-widest animate-pulse">
                  Hover features on the left
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Arrows */}
      <button
        onClick={() => {
          setHeroActiveSlide((prev) => (prev === 0 ? 1 : 0));
          setIsHeroPaused(true);
        }}
        className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-800/50 shadow-lg flex items-center justify-center text-[#792CA2] dark:text-[#B770FF] hover:scale-105 active:scale-95 transition-all z-40 group"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        onClick={() => {
          setHeroActiveSlide((prev) => (prev === 0 ? 1 : 0));
          setIsHeroPaused(true);
        }}
        className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/60 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 border border-gray-200/50 dark:border-slate-800/50 shadow-lg flex items-center justify-center text-[#792CA2] dark:text-[#B770FF] hover:scale-105 active:scale-95 transition-all z-40 group"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Slide dots at bottom */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
        <button
          onClick={() => {
            setHeroActiveSlide(0);
            setIsHeroPaused(true);
          }}
          className={`h-2.5 rounded-full overflow-hidden relative transition-all duration-500 ease-out ${heroActiveSlide === 0
              ? "w-8 bg-gray-200 dark:bg-neutral-800"
              : "w-2.5 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
            }`}
          aria-label="Go to slide 1"
        >
          {heroActiveSlide === 0 && (
            <motion.div
              key={`hero-progress-0-${isHeroPaused}`}
              initial={{ width: isHeroPaused ? "100%" : "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: isHeroPaused ? 0 : 9, ease: "linear" }}
              className="absolute inset-y-0 left-0 bg-[#792CA2] dark:bg-[#B770FF]"
            />
          )}
        </button>
        <button
          onClick={() => {
            setHeroActiveSlide(1);
            setIsHeroPaused(true);
          }}
          className={`h-2.5 rounded-full overflow-hidden relative transition-all duration-500 ease-out ${heroActiveSlide === 1
              ? "w-8 bg-gray-200 dark:bg-neutral-800"
              : "w-2.5 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
            }`}
          aria-label="Go to slide 2"
        >
          {heroActiveSlide === 1 && (
            <motion.div
              key={`hero-progress-1-${isHeroPaused}`}
              initial={{ width: isHeroPaused ? "100%" : "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: isHeroPaused ? 0 : 8, ease: "linear" }}
              className="absolute inset-y-0 left-0 bg-[#792CA2] dark:bg-[#B770FF]"
            />
          )}
        </button>
      </div>
    </section>
  );
}