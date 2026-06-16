"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@heroui/react";
import { motion } from "framer-motion";

function RadarAnimation() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId;
    let angle = 0;

    // Lost cloud targets representing orphaned resource metrics
    const targets = [
      { x: -140, y: -90, name: "EC2::Orphaned", value: "$410/mo" },
      { x: 160, y: -120, name: "S3::Unprotected", value: "$95/mo" },
      { x: -110, y: 130, name: "RDS::Zombie", value: "$350/mo" },
      { x: 120, y: 100, name: "NAT::Idle", value: "$65/mo" },
    ];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    const isMobile = window.innerWidth < 768;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const maxRadius = Math.min(canvas.width, canvas.height) * 0.45;

      // Draw radar grid concentric rings (light theme purple)
      ctx.strokeStyle = "rgba(121, 44, 162, 0.08)";
      ctx.lineWidth = 1;
      for (let r = maxRadius / 4; r <= maxRadius; r += maxRadius / 4) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.strokeStyle = "rgba(121, 44, 162, 0.04)";
      ctx.beginPath();
      ctx.moveTo(cx - maxRadius, cy);
      ctx.lineTo(cx + maxRadius, cy);
      ctx.moveTo(cx, cy - maxRadius);
      ctx.lineTo(cx, cy + maxRadius);
      ctx.stroke();

      if (!isMobile) {
        // Draw rotating sweep
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(angle);

        const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, maxRadius);
        gradient.addColorStop(0, "rgba(154, 77, 204, 0.08)");
        gradient.addColorStop(1, "rgba(249, 247, 247, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius, -0.3, 0.3);
        ctx.closePath();
        ctx.fill();

        // Draw sweep sweep line
        ctx.strokeStyle = "rgba(121, 44, 162, 0.25)";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(maxRadius, 0);
        ctx.stroke();

        ctx.restore();

        // Sweep rotation velocity
        angle += 0.006;
      }

      // Draw radar dots/targets
      targets.forEach((t) => {
        const tx = cx + t.x;
        const ty = cy + t.y;

        const dist = Math.hypot(t.x, t.y);
        if (dist > maxRadius) return;

        // Target dot
        ctx.fillStyle = "rgba(220, 38, 38, 0.7)";
        ctx.shadowColor = "rgb(220, 38, 38)";
        ctx.shadowBlur = 4;
        ctx.beginPath();
        ctx.arc(tx, ty, 4.5, 0, Math.PI * 2);
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;

        // Label and Cost Metric (Darker text for light mode legibility)
        ctx.fillStyle = "rgba(17, 24, 68, 0.6)";
        ctx.font = "9px monospace";
        ctx.fillText(t.name, tx + 8, ty - 2);
        ctx.fillStyle = "rgba(220, 38, 38, 0.7)";
        ctx.fillText(`WASTE: ${t.value}`, tx + 8, ty + 8);
      });

      if (!isMobile) {
        animationId = requestAnimationFrame(draw);
      }
    };

    if (isMobile) {
      draw();
    } else {
      draw();
    }

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0"
    />
  );
}

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F7F7] via-[#EEEEEE] to-[#DCCBFF] text-[#111844] flex flex-col justify-between overflow-hidden relative font-sans">
      
      {/* Dynamic Glowing backdrop blobs */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#792CA2]/8 blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-[#B770FF]/8 blur-[110px] pointer-events-none z-0" />

      {/* Radar scanning background */}
      <RadarAnimation />

      {/* Header bar */}
      <header className="w-full h-20 px-8 flex items-center justify-between relative z-10">
        <Link href="/">
          <img
            src="/logo.png"
            alt="Logo"
            className="h-16  object-contain cursor-pointer"
          />
        </Link>
      </header>

      {/* Main content area */}
      <div className="flex-grow flex items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            w-full
            max-w-lg
            bg-white/70
            backdrop-blur-2xl
            border
            border-white/30
            rounded-3xl
            p-8
            md:p-12
            text-center
            shadow-[0_20px_50px_rgba(121,44,162,0.08)]
            flex
            flex-col
            items-center
            justify-center
          "
        >
          {/* Glitching 404 Heading */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative animate-pulse"
          >
            <h1 className="text-8xl md:text-9xl font-black bg-gradient-to-r from-[#111844] via-[#792CA2] to-[#B770FF] bg-clip-text text-transparent select-none">
              404
            </h1>
            <span className="absolute -top-2 -right-4 bg-[#792CA2]/10 text-[#792CA2] border border-[#792CA2]/20 text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Orphaned Route
            </span>
          </motion.div>

          <h2 className="text-xl md:text-2xl font-extrabold text-[#111844] mt-6 tracking-wide">
            Route Scanned & Downscaled
          </h2>

          <p className="mt-4 text-xs md:text-sm text-gray-500 leading-relaxed max-w-sm">
            Our deep-scan engine searched your entire multi-cloud infrastructure but this route returned a null state. This resource might have been decommissioned, downscaled to 0, or relocated.
          </p>

          {/* Action button */}
          <Link href="/" className="mt-8">
            <Button
              size="lg"
              className="
                bg-[#111844]
                hover:bg-[#0c0e2b]
                text-white
                font-bold
                px-8
                rounded-full
                shadow-[0_4px_20px_rgba(17,24,68,0.15)]
                transition-all
                duration-300
                hover:scale-[1.03]
              "
            >
              ← Back to Home
            </Button>
          </Link>
        </motion.div>
      </div>

      {/* Footer bar */}
      <footer className="w-full h-16 border-t border-gray-200/50 flex items-center justify-center text-[10px] text-gray-400 relative z-10 px-6">
        <p>© {new Date().getFullYear()} CloudOptics cost-control scanning module active.</p>
      </footer>

    </div>
  );
}
