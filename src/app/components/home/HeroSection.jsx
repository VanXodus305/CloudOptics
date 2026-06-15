"use client";

import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { useSession } from "next-auth/react";

export default function HeroSection() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  return (
    <section
      className="
      min-h-screen
      hero-gradient
      flex
      items-center
      px-8
      "
    >
      <div
        className="
        max-w-7xl
        mx-auto
        grid
        lg:grid-cols-2
        gap-24
        items-center
        "
      >
        <div>

  <motion.p
    initial={{
      opacity: 0,
      y: -40,
    }}
    animate={{
      opacity: 1,
      y: 0,
    }}
    transition={{
      duration: 0.8,
    }}
    className="
    uppercase
    tracking-[4px]
    text-[#DCCBFF]
    font-semibold
    text-sm
    md:text-base
    mb-6
    "
  >
    Cloud Cost Optimization & Monitoring Dashboard
  </motion.p>

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
    text-7xl
    md:text-8xl
    font-black
    text-white
    "
  >
    Cloud
    <span className="text-[#DCCBFF]">
      Optics
    </span>
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
    bg-white
    rounded-full
    mt-5
    "
  />

</div>

        <div>

          <motion.div
  initial={{
    opacity: 0,
    y: -60,
  }}
  animate={{
    opacity: 1,
    y: 0,
  }}
  transition={{
    duration: 1,
    delay: 0.4,
  }}
>
  <h2
    className="
    text-4xl
    md:text-5xl
    font-black
    text-white
    leading-tight
    "
  >
    See Every Dollar.
    <br />

    <span className="text-[#DCCBFF]">
      Optimize Every Resource.
    </span>
  </h2>

  <p
    className="
    mt-8
    text-lg
    md:text-xl
    text-[#EEEEEE]
    leading-relaxed
    max-w-xl
    "
  >
    CloudOptics combines real-time monitoring, cost analytics, automated optimization, savings recommendations, and risk detection into a single platform, helping organizations achieve greater efficiency and financial control across their cloud environments.
  </p>
</motion.div>

          <motion.div
            initial={{
              opacity: 0,
              x: 100,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 1,
              delay: 0.8,
            }}
            className="mt-10"
          >
            <a href={isLoggedIn ? "/dashboard" : "/auth/signin"}>
            <Button
              size="lg"
              className="
              bg-white
              text-[#111844]
              font-bold
              px-8
              "
            >
              {isLoggedIn ? "Dashboard" : "Explore Dashboard"}
            </Button>
            </a>
          </motion.div>

        </div>
      </div>
    </section>
  );
}