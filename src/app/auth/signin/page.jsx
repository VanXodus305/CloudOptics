"use client";

import React, { useEffect, useState, useRef } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Navbar, NavbarBrand, Image, Link, Button } from "@heroui/react";

function ParticleBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId;
    let particles = [];
    const maxParticles = 70;

    let mouse = { x: null, y: null, radius: 150 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = null;
      mouse.y = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseleave", handleMouseLeave);

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.8;
        this.vy = (Math.random() - 0.5) * 0.8;
        this.radius = Math.random() * 2 + 1;
        this.color = Math.random() > 0.5 ? "rgba(121, 44, 162, 0.35)" : "rgba(154, 77, 204, 0.35)";
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
            const opacity = ((120 - dist) / 120) * 0.12;
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
            const opacity = ((mouse.radius - dist) / mouse.radius) * 0.18;
            ctx.strokeStyle = `rgba(154, 77, 204, ${opacity})`;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

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

export default function SignInPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [enterpriseId, setEnterpriseId] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  if (status === "loading") {
    return (
      <div
        className="
        min-h-screen
        flex
        items-center
        justify-center
        px-6
        py-10
        bg-gradient-to-br
        from-[#F9F7F7]
        via-[#EEEEEE]
        to-[#DCCBFF]
        "
      >
        <div className="w-12 h-12 border-4 border-[#792CA2] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F9F7F7] via-[#EEEEEE] to-[#DCCBFF] overflow-hidden flex flex-col">
      <Navbar
        isBlurred
        position="sticky"
        maxWidth="full"
        className="
        bg-[#F9F7F7]/95
        backdrop-blur-md
        border-b
        border-[#EEEEEE]
        "
      >
        <NavbarBrand>
          <div className="relative flex items-center">
            <motion.div
              initial={{
                x: -150,
                y: -20,
                opacity: 0,
              }}
              animate={{
                x: 0,
                y: 0,
                opacity: 1,
              }}
              transition={{
                duration: 1.4,
              }}
              className="-left-5 z-10"
            >
              <Link href={"/"}>
                <Image src="/logo.png" alt="Logo" width={160} />
              </Link>
            </motion.div>
          </div>
        </NavbarBrand>
      </Navbar>

      <div className="flex-grow flex items-center justify-center p-6 relative">
        <ParticleBackground />

        {/* Dynamic Glowing background blobs */}
        <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] rounded-full bg-[#792CA2]/8 blur-[100px] animate-[pulse_10s_infinite_alternate] pointer-events-none z-0" />
        <div className="absolute bottom-[10%] right-[10%] w-[45vw] h-[45vw] rounded-full bg-[#B770FF]/8 blur-[110px] animate-[pulse_8s_infinite_alternate_2s] pointer-events-none z-0" />

        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="
            w-full
            max-w-4xl
            bg-white/70
            backdrop-blur-2xl
            border
            border-white/30
            rounded-3xl
            overflow-hidden
            shadow-[0_20px_50px_rgba(121,44,162,0.08)]
            grid
            md:grid-cols-12
            relative
            z-10
          "
        >
          {/* LEFT PANEL */}
          <div
            className="
              md:col-span-5
              relative
              bg-gradient-to-br
              from-[#792CA2]
              via-[#9A4DCC]
              to-[#5E1A86]
              text-white
              p-10
              flex
              flex-col
              justify-between
              overflow-hidden
            "
          >
            {/* Grid Pattern overlay */}
            <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:20px_20px] pointer-events-none" />

            {/* Tech details: Rotating glowing wireframe circles */}
            <div className="absolute bottom-[-15%] right-[-15%] w-[320px] h-[320px] opacity-20 pointer-events-none">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                className="w-full h-full rounded-full border-2 border-dashed border-white"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-6 rounded-full border border-dotted border-white"
              />
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-16 rounded-full bg-white/5 blur-sm"
              />
            </div>

            <div className="relative z-10">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <h1 className="text-3xl font-black tracking-wider flex items-center gap-1">
                  <span className="text-[#DCCBFF] text-4xl font-mono">{">"}</span>
                  <span>CloudOptics</span>
                </h1>
              </motion.div>
            </div>

            <div className="relative z-10 mt-20 md:mt-0">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="
                  text-4xl
                  md:text-5xl
                  text-[#DCCBFF]
                  font-black
                  leading-tight
                "
              >
                Let there
                <br />
                Be
                <br />
                Change.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="
                  mt-6
                  text-sm
                  text-white/80
                  font-medium
                  tracking-widest
                  uppercase
                "
              >
                Rethink &bull; Rebuild &bull; Reinvent
              </motion.p>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div
            className="
              md:col-span-7
              bg-white/20
              backdrop-blur-xl
              flex
              items-center
              justify-center
              p-8
              md:p-12
            "
          >
            <div className="w-full max-w-md">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <h1 className="text-3xl font-bold text-[#111844] mb-2">Welcome Back</h1>
                <p className="text-sm text-gray-500 mb-8">
                  Monitor and optimize your cloud spend.
                </p>
              </motion.div>

              {/* GOOGLE SIGN IN */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <button
                  onClick={() =>
                    signIn("google", {
                      callbackUrl: "/dashboard",
                    })
                  }
                  className="
                    w-full
                    bg-white
                    border
                    border-gray-200
                    hover:border-[#792CA2]
                    hover:bg-gray-50
                    py-3.5
                    rounded-xl
                    font-semibold
                    text-[#111844]
                    flex
                    items-center
                    justify-center
                    gap-3
                    transition-all
                    duration-300
                    hover:scale-[1.01]
                    shadow-[0_4px_20px_rgba(121,44,162,0.03)]
                  "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 48"
                    className="w-5 h-5 animate-pulse"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.4-.4-3.5z"
                    />
                    <path
                      fill="#FF3D00"
                      d="M6.3 14.7l6.6 4.8C14.7 15.2 19 12 24 12c3 0 5.7 1.1 7.8 2.9l5.7-5.7C34.1 6.1 29.3 4 24 4c-7.7 0-14.3 4.3-17.7 10.7z"
                    />
                    <path
                      fill="#4CAF50"
                      d="M24 44c5.2 0 10-2 13.6-5.2l-6.3-5.3C29.3 35 26.8 36 24 36c-5.3 0-9.7-3.3-11.3-8l-6.6 5.1C9.4 39.6 16.1 44 24 44z"
                    />
                    <path
                      fill="#1976D2"
                      d="M43.6 20.5H42V20H24v8h11.3c-1.1 3.1-3.3 5.5-6.3 6.9l6.3 5.3C39.1 36.6 44 30.9 44 24c0-1.3-.1-2.4-.4-3.5z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                </button>
              </motion.div>

              {/* DIVIDER */}
              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-gray-200" />
                <span className="px-3 text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                  or sign in with Enterprise ID
                </span>
                <div className="flex-grow border-t border-gray-200" />
              </div>

              {/* FORM FIELDS */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="space-y-4"
              >
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Enterprise ID
                  </label>
                  <input
                    type="text"
                    value={enterpriseId}
                    onChange={(e) => setEnterpriseId(e.target.value)}
                    placeholder="name@company.com"
                    className="
                      w-full
                      bg-white/80
                      border
                      border-gray-200
                      focus:border-[#792CA2]
                      focus:bg-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      text-[#111844]
                      placeholder:text-gray-400
                      transition-all
                      duration-300
                    "
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Password
                    </label>
                    <button className="text-xs text-[#792CA2] hover:underline font-semibold transition-all">
                      Forgot Password?
                    </button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="
                      w-full
                      bg-white/80
                      border
                      border-gray-200
                      focus:border-[#792CA2]
                      focus:bg-white
                      rounded-xl
                      px-4
                      py-3
                      outline-none
                      text-[#111844]
                      placeholder:text-gray-400
                      transition-all
                      duration-300
                    "
                  />
                </div>

                <button
                  className="
                    w-full
                    mt-6
                    bg-[#111844]
                    hover:bg-[#0c0e2b]
                    text-white
                    py-3.5
                    rounded-xl
                    font-semibold
                    text-lg
                    transition-all
                    duration-300
                    hover:scale-[1.01]
                    shadow-[0_4px_20px_rgba(17,24,68,0.15)]
                  "
                >
                  Sign In
                </button>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
