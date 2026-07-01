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
        this.color =
          Math.random() > 0.5
            ? "rgba(121, 44, 162, 0.25)"
            : "rgba(154, 77, 204, 0.25)";
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
    // tag: "COST CONTROL",
    tagColor: "from-purple-600 to-indigo-600",
    title: "See Every Dollar.",
    highlight: "Optimize Every Resource.",
    desc: "CloudOptics combines real-time monitoring, cost analytics, automated optimization, savings recommendations, and risk detection into a single platform, helping organizations achieve greater efficiency and financial control across their cloud environments.",
  },
  {
    // tag: "INSTANT ALERTS",
    tagColor: "from-sky-500 to-blue-500",
    title: "Real-time Cost Visibility.",
    highlight: "Never Miss An Anomaly.",
    desc: "Get notified instantly of any abnormal spikes in your cloud resources. Keep your cloud engineering teams accountable with precise resource ownership mapping and automated alert routing.",
  },
  {
    // tag: "AUTOMATED SAVINGS",
    tagColor: "from-emerald-500 to-teal-500",
    title: "Actionable Savings Insights.",
    highlight: "Cut Cloud Waste by 30%.",
    desc: "Our rule-based engine continuously scans your infrastructure to pinpoint idle systems, oversized instances, and orphaned disks, giving you exact steps to reduce spend instantly.",
  },
];

// Word wrapper component to animate each word individually with 3D effects
const WordWrapper = ({
  text,
  delayOffset = 0,
  variantType = "title",
  className = "",
  isMobile = false,
}) => {
  if (isMobile) {
    return <span className={className}>{text}</span>;
  }
  const words = text.split(" ");
  return (
    <span
      className="inline-flex flex-wrap overflow-visible"
      style={{ transformStyle: "preserve-3d" }}
    >
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
    transition: { duration: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.3 },
  },
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
  hidden: {
    opacity: 0,
    y: 35,
    scale: 0.95,
    rotateX: -20,
    filter: "blur(10px)",
  },
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

export default function HeroSection() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";

  const [hoveredWidget, setHoveredWidget] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [currentMacroSlide, setCurrentMacroSlide] = useState(0);
  const totalMacroSlides = 4;
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    setMounted(true);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-play controller for inner & macro carousels
  useEffect(() => {
    if (isPaused) return;

    const timeoutDuration = 5000;

    const timer = setTimeout(() => {
      if (currentMacroSlide === 0) {
        if (currentSlide < slides.length - 1) {
          setCurrentSlide((prev) => prev + 1);
        } else {
          setCurrentMacroSlide(1);
        }
      } else {
        setCurrentMacroSlide((prev) => {
          const next = prev < totalMacroSlides - 1 ? prev + 1 : 0;
          if (next === 0) setCurrentSlide(0);
          return next;
        });
      }
    }, timeoutDuration);

    return () => clearTimeout(timer);
  }, [currentSlide, currentMacroSlide, isPaused]);

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
      pb-48
      md:pt-7
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

      {/* Left/Right Navigation Arrows for Macro Carousel */}
      <button
        onClick={() => {
          setCurrentMacroSlide((prev) => {
            const next = prev === 0 ? totalMacroSlides - 1 : prev - 1;
            if (next === 0) setCurrentSlide(0);
            return next;
          });
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-800 dark:text-white transition-all hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
      </button>

      <button
        onClick={() => {
          if (currentMacroSlide === 0 && currentSlide < slides.length - 1) {
            setCurrentSlide((prev) => prev + 1);
          } else {
            setCurrentMacroSlide((prev) => {
              const next = prev < totalMacroSlides - 1 ? prev + 1 : 0;
              if (next === 0) setCurrentSlide(0);
              return next;
            });
          }
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-2 md:p-4 rounded-full bg-white/10 hover:bg-white/20 dark:bg-black/20 dark:hover:bg-black/40 backdrop-blur-md border border-white/20 dark:border-white/10 text-gray-800 dark:text-white transition-all hover:scale-110"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
      </button>

      <AnimatePresence mode="wait">
        {currentMacroSlide === 0 && (
          <motion.div
            key="slide1-brand"
            initial={{ opacity: 0, x: isMobile ? 0 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : 40 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
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
                  className="absolute top-0 left-6 md:left-12 p-5 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border border-white/40 dark:border-slate-800/40 rounded-2xl shadow-[0_10px_30px_rgba(121,44,162,0.05)] w-60 overflow-hidden cursor-pointer"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-[10px] text-gray-500 dark:text-slate-400 font-bold uppercase tracking-wider">
                      Potential Savings
                    </span>
                  </div>
                  <p className="text-3xl font-black text-[#111844] dark:text-white">
                    $8,450
                    <span className="text-sm font-medium text-gray-500 dark:text-slate-400">
                      /mo
                    </span>
                  </p>

                  {hoveredWidget === "savings" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-3 pt-3 border-t border-gray-150/50 dark:border-slate-800 space-y-1 text-[10px] text-gray-600 dark:text-slate-300"
                    >
                      <div className="flex justify-between font-semibold">
                        <span>☁ Compute (EC2):</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          $3,200
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>💾 Storage (S3):</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          $2,850
                        </span>
                      </div>
                      <div className="flex justify-between font-semibold">
                        <span>🗄 Databases (RDS):</span>
                        <span className="text-emerald-600 dark:text-emerald-400">
                          $2,400
                        </span>
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
                    <span className="text-[9px] text-amber-800 dark:text-amber-400 font-bold uppercase tracking-wider">
                      Active Alerts
                    </span>
                  </div>
                  <p className="text-sm font-bold text-[#111844] dark:text-white mt-2">
                    Idle Database Instance
                  </p>

                  {hoveredWidget === "alert" ? (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-2.5 pt-2.5 border-t border-gray-150/50 dark:border-slate-800 text-[10px] text-gray-600 dark:text-slate-300 space-y-0.5"
                    >
                      <p className="font-semibold">
                        <span className="text-gray-400">ID:</span> db-prod-replica
                      </p>
                      <p className="font-semibold">
                        <span className="text-gray-400">Action:</span> Terminate
                      </p>
                      <p className="text-amber-600 dark:text-amber-400 font-bold">
                        Waste: $140/mo
                      </p>
                    </motion.div>
                  ) : (
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      Saving potential: $140/mo
                    </p>
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
                  className="absolute bottom-24 left-10 md:left-14 p-4 bg-[#792CA2] dark:bg-[#5E1A86] text-white rounded-2xl shadow-xl w-60 overflow-hidden cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/10 rounded-xl">
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#DCCBFF] dark:text-slate-300 font-bold uppercase tracking-wider">
                        Active Monitoring
                      </p>
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
              className="w-full flex flex-col justify-center relative p-6 md:p-10 rounded-3xl bg-white/10 dark:bg-slate-950/20 border border-white/30 dark:border-white/5 backdrop-blur-[2px] shadow-[0_8px_30px_rgba(121,44,162,0.02)] overflow-visible"
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
            >
              {/* Subtle background image that bleeds outside the card edges, extending leftward */}
              <div className="absolute top-20 -bottom-20 -right-5 -left-12 sm:-left-16 md:-left-20 lg:-left-[420px] xl:-left-[520px] -z-10 opacity-[0.20] dark:opacity-[0.15] pointer-events-none overflow-hidden rounded-3xl md:rounded-l-[50px] md:rounded-r-3xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentSlide}
                    initial={{ opacity: 0, scale: 1.05 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.6 }}
                    className="w-full h-full"
                    style={{
                      backgroundImage: `url('/hero-${currentSlide + 1}.jpg')`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      maskImage:
                        "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                      WebkitMaskImage:
                        "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                    }}
                  />
                </AnimatePresence>
              </div>

              {/* Automatic transitioning carousel for headings & descriptions */}
              <div
                className="min-h-[340px] flex flex-col justify-center relative z-10"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
              >
                {mounted && (
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentSlide}
                      variants={
                        isMobile ? mobileContainerVariants : containerVariants
                      }
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      style={isMobile ? {} : { transformStyle: "preserve-3d" }}
                      className="flex flex-col items-start"
                    >
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
                        <WordWrapper
                          text={slides[currentSlide].title}
                          delayOffset={0.05}
                          variantType="title"
                          isMobile={isMobile}
                        />
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
                className="mt-8 flex flex-wrap items-center gap-4 sm:gap-6 relative z-10 w-full"
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
                    px-5
                    sm:px-8
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
                        className={`h-2.5 rounded-full overflow-hidden relative transition-all duration-500 ease-out ${isActive
                          ? "w-8 bg-gray-200 dark:bg-neutral-800"
                          : "w-2.5 bg-gray-300 dark:bg-neutral-700 hover:bg-gray-400 dark:hover:bg-neutral-600"
                          }`}
                        aria-label={`Go to slide ${idx + 1}`}
                      >
                        {isActive && (
                          <motion.div
                            key={`progress-${idx}-${isPaused}`}
                            initial={{ width: isPaused ? "100%" : "0%" }}
                            animate={{ width: "100%" }}
                            transition={{
                              duration: isPaused ? 0 : 5,
                              ease: "linear",
                            }}
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
        )}

        {/* Macro Slide 1 */}
        {currentMacroSlide === 1 && (
          <motion.div
            key="macro-slide-1"
            initial={{ opacity: 0, x: isMobile ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : -40 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 w-full pb-16 lg:pb-32"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#111844] via-[#792CA2] to-[#B770FF] bg-clip-text mt-2 md:mt-24 text-transparent dark:text-white leading-none overflow-visible pb-3 pr-8 whitespace-nowrap"
              >
                Advanced
                <br />
                Analytics
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "180px" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-[#792CA2] to-[#B770FF] dark:from-[#9A4DCC] dark:to-[#C084FC] rounded-full mt-4"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="uppercase tracking-[4px] text-[#792CA2] dark:text-[#B770FF] font-bold text-sm md:text-base mt-6"
              >
                Deep Dive Into Your Cloud Costs
              </motion.p>
              <div className="mt-12 space-y-6 hidden md:block">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />,
                    title: "Real-time Processing",
                    desc: "Analyze millions of data points with sub-second latency"
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
                    title: "Predictive Forecasting",
                    desc: "Machine learning driven projections for future expenditures"
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
                    title: "Granular Visibility",
                    desc: "Resource-level tracking across your entire ecosystem"
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                    className="flex items-center gap-5 group cursor-default"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#792CA2]/10 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#792CA2]/20 to-[#B770FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <svg className="w-6 h-6 text-[#792CA2] dark:text-[#B770FF] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#111844] dark:text-white group-hover:text-[#792CA2] dark:group-hover:text-[#B770FF] transition-colors">{feature.title}</h4>
                      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium mt-1">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="w-full flex flex-col justify-center relative p-6 md:p-10 rounded-3xl bg-white/10 dark:bg-slate-950/20 border border-white/30 dark:border-white/5 backdrop-blur-[2px] shadow-[0_8px_30px_rgba(121,44,162,0.02)] overflow-visible"
            >
              <div className="absolute top-20 -bottom-20 -right-5 -left-12 sm:-left-16 md:-left-20 lg:-left-[420px] xl:-left-[520px] -z-10 opacity-[0.20] dark:opacity-[0.15] pointer-events-none overflow-hidden rounded-3xl md:rounded-l-[50px] md:rounded-r-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url('/slide-bg-1.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 60%",
                    maskImage: "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                  }}
                />
              </div>

              <div className="flex-1 h-full min-h-[340px] flex flex-col justify-center relative z-10" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
                <div className="flex flex-col items-start">
                  <h2 className="text-4xl md:text-5xl font-black text-[#111844] dark:text-white leading-tight overflow-visible">
                    Interactive Dashboards.
                    <br />
                    <span className="bg-gradient-to-r from-[#792CA2] to-[#B770FF] dark:from-[#9A4DCC] dark:to-[#C084FC] bg-clip-text text-transparent font-black pb-2 -mb-2">Visualized Efficiency.</span>
                  </h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-6 md:mt-8 max-w-lg"
                  >
                    Understand your expenditure like never before with powerful data visualization tools tailored for complex cloud architectures.
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Macro Slide 2 */}
        {currentMacroSlide === 2 && (
          <motion.div
            key="macro-slide-2"
            initial={{ opacity: 0, x: isMobile ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : -40 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 w-full pb-16 lg:pb-32"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
                className="text-4xl sm:text-3xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#111844] via-[#792CA2] to-[#B770FF] bg-clip-text mt-2 md:mt-24 text-transparent dark:text-white leading-none overflow-visible pb-3 pr-8 whitespace-nowrap"
              >
                Security
                <br />
                Posture
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "180px" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-[#792CA2] to-[#B770FF] dark:from-[#9A4DCC] dark:to-[#C084FC] rounded-full mt-4"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="uppercase tracking-[4px] text-[#792CA2] dark:text-[#B770FF] font-bold text-sm md:text-base mt-6"
              >
                Ensure Compliance Across Regions
              </motion.p>
              
              <div className="mt-12 space-y-6 hidden md:block">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />,
                    title: "Zero-Day Protection",
                    desc: "Instantly identify and mitigate emerging threat vectors"
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
                    title: "Continuous Compliance",
                    desc: "Automated mapping to SOC2, HIPAA, and PCI-DSS"
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
                    title: "Vulnerability Scanning",
                    desc: "Deep inspection of containers and serverless functions"
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                    className="flex items-center gap-5 group cursor-default"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#792CA2]/10 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#792CA2]/20 to-[#B770FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <svg className="w-6 h-6 text-[#792CA2] dark:text-[#B770FF] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#111844] dark:text-white group-hover:text-[#792CA2] dark:group-hover:text-[#B770FF] transition-colors">{feature.title}</h4>
                      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium mt-1">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="w-full flex flex-col justify-center relative p-6 md:p-10 rounded-3xl bg-white/10 dark:bg-slate-950/20 border border-white/30 dark:border-white/5 backdrop-blur-[2px] shadow-[0_8px_30px_rgba(121,44,162,0.02)] overflow-visible"
            >
              <div className="absolute top-20 -bottom-20 -right-5 -left-12 sm:-left-16 md:-left-20 lg:-left-[420px] xl:-left-[520px] -z-10 opacity-[0.20] dark:opacity-[0.15] pointer-events-none overflow-hidden rounded-3xl md:rounded-l-[50px] md:rounded-r-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url('/slide-bg-2.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 60%",
                    maskImage: "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                  }}
                />
              </div>

              <div className="flex-1 h-full min-h-[340px] flex flex-col justify-center relative z-10" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
                <div className="flex flex-col items-start">
                  <h2 className="text-4xl md:text-5xl font-black text-[#111844] dark:text-white leading-tight overflow-visible">
                    Zero Vulnerabilities.
                    <br />
                    <span className="bg-gradient-to-r from-[#792CA2] to-[#B770FF] dark:from-[#9A4DCC] dark:to-[#C084FC] bg-clip-text text-transparent font-black pb-2 -mb-2">Total Control.</span>
                  </h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-6 md:mt-8 max-w-lg"
                  >
                    Continuously scan for misconfigurations and vulnerabilities, keeping your infrastructure fortified against modern threats.
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Macro Slide 3 */}
        {currentMacroSlide === 3 && (
          <motion.div
            key="macro-slide-3"
            initial={{ opacity: 0, x: isMobile ? 0 : 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : -40 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10 w-full pb-16 lg:pb-32"
          >
            <div>
              <motion.h1
                initial={{ opacity: 0, x: -200 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 1.2 }}
                className="text-4xl sm:text-4xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-[#111844] via-[#792CA2] to-[#B770FF] bg-clip-text mt-2 md:mt-24 text-transparent dark:text-white leading-none overflow-visible pb-3 pr-8 whitespace-nowrap"
              >
                Automated
                <br />
                Governance
              </motion.h1>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "180px" }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-1 bg-gradient-to-r from-[#792CA2] to-[#B770FF] dark:from-[#9A4DCC] dark:to-[#C084FC] rounded-full mt-4"
              />
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="uppercase tracking-[4px] text-[#792CA2] dark:text-[#B770FF] font-bold text-sm md:text-base mt-6"
              >
                Policy-Driven Infrastructure
              </motion.p>
              
              <div className="mt-12 space-y-6 hidden md:block">
                {[
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />,
                    title: "Policy as Code",
                    desc: "Define and enforce guardrails directly in your repository"
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />,
                    title: "Cost & Security Guardrails",
                    desc: "Prevent deployments that violate budgets or baselines"
                  },
                  {
                    icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />,
                    title: "Multi-Cloud Unified Control",
                    desc: "Seamless standardization across AWS, Azure, and GCP"
                  }
                ].map((feature, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + i * 0.15 }}
                    className="flex items-center gap-5 group cursor-default"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-white/5 dark:bg-slate-900/50 border border-white/10 dark:border-white/5 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-[#792CA2]/10 transition-all duration-300 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-[#792CA2]/20 to-[#B770FF]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <svg className="w-6 h-6 text-[#792CA2] dark:text-[#B770FF] relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        {feature.icon}
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#111844] dark:text-white group-hover:text-[#792CA2] dark:group-hover:text-[#B770FF] transition-colors">{feature.title}</h4>
                      <p className="text-sm md:text-base text-gray-500 dark:text-gray-400 font-medium mt-1">{feature.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div
              className="w-full flex flex-col justify-center relative p-6 md:p-10 rounded-3xl bg-white/10 dark:bg-slate-950/20 border border-white/30 dark:border-white/5 backdrop-blur-[2px] shadow-[0_8px_30px_rgba(121,44,162,0.02)] overflow-visible"
            >
              <div className="absolute top-20 -bottom-20 -right-5 -left-12 sm:-left-16 md:-left-20 lg:-left-[420px] xl:-left-[520px] -z-10 opacity-[0.20] dark:opacity-[0.15] pointer-events-none overflow-hidden rounded-3xl md:rounded-l-[50px] md:rounded-r-3xl">
                <motion.div
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="w-full h-full"
                  style={{
                    backgroundImage: `url('/slide-bg-3.jpg')`,
                    backgroundSize: "cover",
                    backgroundPosition: "center 60%",
                    maskImage: "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                    WebkitMaskImage: "radial-gradient(ellipse at 80% 50%, black 25%, transparent 70%)",
                  }}
                />
              </div>

              <div className="flex-1 h-full min-h-[340px] flex flex-col justify-center relative z-10" style={{ perspective: "1200px", transformStyle: "preserve-3d" }}>
                <div className="flex flex-col items-start">
                  <h2 className="text-4xl md:text-5xl font-black text-[#111844] dark:text-white leading-tight overflow-visible">
                    Standardize.
                    <br />
                    <span className="bg-gradient-to-r from-[#792CA2] to-[#B770FF] dark:from-[#9A4DCC] dark:to-[#C084FC] bg-clip-text text-transparent font-black pb-2 -mb-2">Scale Efficiently.</span>
                  </h2>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.7 }}
                    className="text-lg md:text-xl text-gray-500 dark:text-gray-400 leading-relaxed font-medium mt-6 md:mt-8 max-w-lg"
                  >
                    Implement robust governance rules that enforce consistent standards globally without slowing down your engineering velocity.
                  </motion.p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
