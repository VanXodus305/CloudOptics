"use client";

import React from "react";
import { motion } from "framer-motion";

const reviewsList = [
  {
    reviewer: "Sarah T.",
    role: "VP of Infrastructure",
    avatar: "ST",
    text: "CloudOptics gave us instant visibility into our multi-cloud spend. We saved $12k in the first month!",
    stars: 5,
  },
  {
    reviewer: "David L.",
    role: "DevOps Lead",
    avatar: "DL",
    text: "The real-time visibility is incredible. We spotted an orphaned database spike within minutes, saving us thousands.",
    stars: 3,
  },
  {
    reviewer: "Sophia M.",
    role: "FinOps Manager",
    avatar: "SM",
    text: "Setting budget policies and auto-shutdown rules has saved our engineering department 35% on idle systems.",
    stars: 4,
  },
  {
    reviewer: "Marcus K.",
    role: "Head of FinOps",
    avatar: "MK",
    text: "Governance is finally automated. Cost spikes are flagged immediately and routed to the correct engineer.",
    stars: 5,
  },
  {
    reviewer: "James P.",
    role: "CFO",
    avatar: "JP",
    text: "The forecasting models are spot-on. It takes the guesswork out of purchasing reserve instances and savings plans.",
    stars: 2.5,
  },
  {
    reviewer: "Elena R.",
    role: "CTO",
    avatar: "ER",
    text: "The sizing recommendations made our cloud budget planning incredibly accurate and reduced waste.",
    stars: 5,
  },
  {
    reviewer: "Alex B.",
    role: "Cloud Architect",
    avatar: "AB",
    text: "Migrating to CloudOptics was seamless. The cost governance policies saved us from a massive over-provisioning disaster.",
    stars: 4,
  },
  {
    reviewer: "Emily W.",
    role: "Director of Engineering",
    avatar: "EW",
    text: "Our team's accountability has skyrocketed. Now everyone knows exactly which resource belongs to which project.",
    stars: 5,
  },
  {
    reviewer: "Ryan H.",
    role: "Solutions Architect",
    avatar: "RH",
    text: "The automated alert routing is a game changer. We resolved an accidental compute leak within 5 minutes.",
    stars: 5,
  },
  {
    reviewer: "Lisa K.",
    role: "Technical Program Manager",
    avatar: "LK",
    text: "CloudOptics handles our multi-tenant cost allocation perfectly. Invoicing and chargeback are no longer a headache.",
    stars: 5,
  },
];

const ReviewCard = ({ review }) => {
  return (
    <div className="p-5 rounded-2xl bg-white/70 dark:bg-slate-950/70 backdrop-blur-md border border-white/50 dark:border-slate-800/60 shadow-lg flex flex-col gap-3 text-slate-800 dark:text-slate-100 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl text-left">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#792CA2] to-[#B770FF] text-white flex items-center justify-center text-xs font-black shadow-sm">
            {review.avatar}
          </div>
          <div>
            <p className="text-xs font-bold leading-none text-[#111844] dark:text-white">
              {review.reviewer}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-slate-400 mt-1">
              {review.role}
            </p>
          </div>
        </div>
        <div className="flex gap-0.5 text-amber-500">
          {Array.from({ length: review.stars }).map((_, i) => (
            <span key={i} className="text-xs">★</span>
          ))}
        </div>
      </div>
      <p className="text-xs text-gray-600 dark:text-slate-300 font-medium leading-relaxed italic">
        "{review.text}"
      </p>
    </div>
  );
};

export default function ReviewsSection() {
  const col1 = [...reviewsList, ...reviewsList];
  const col2 = [
    reviewsList[3],
    reviewsList[7],
    reviewsList[1],
    reviewsList[9],
    reviewsList[5],
    reviewsList[2],
    reviewsList[8],
    reviewsList[0],
    reviewsList[6],
    reviewsList[4],
    reviewsList[3],
    reviewsList[7],
    reviewsList[1],
    reviewsList[9],
    reviewsList[5],
    reviewsList[2],
    reviewsList[8],
    reviewsList[0],
    reviewsList[6],
    reviewsList[4],
  ];
  const col3 = [
    reviewsList[6],
    reviewsList[2],
    reviewsList[8],
    reviewsList[0],
    reviewsList[4],
    reviewsList[9],
    reviewsList[3],
    reviewsList[7],
    reviewsList[1],
    reviewsList[5],
    reviewsList[6],
    reviewsList[2],
    reviewsList[8],
    reviewsList[0],
    reviewsList[4],
    reviewsList[9],
    reviewsList[3],
    reviewsList[7],
    reviewsList[1],
    reviewsList[5],
  ];

  return (
    <section className="relative py-24 px-8 overflow-hidden bg-gradient-to-br from-[#F9F7F7] via-[#EEEEEE] to-[#E9DEFF] dark:from-[#080A1A] dark:via-[#0E112D] dark:to-[#1C1332]">
      {/* Background design accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-[#792CA2]/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-[#B770FF]/5 blur-[120px] pointer-events-none z-0" />

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marqueeUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
        .animate-marquee-up-slow {
          animation: marqueeUp 45s linear infinite;
        }
        .animate-marquee-up-medium {
          animation: marqueeUp 35s linear infinite;
        }
        .animate-marquee-up-fast {
          animation: marqueeUp 25s linear infinite;
        }
        .animate-marquee-up-slow:hover,
        .animate-marquee-up-medium:hover,
        .animate-marquee-up-fast:hover {
          animation-play-state: paused;
        }
      `}} />

      <div className="max-w-7xl mx-auto relative z-10 text-center">
        {/* Section Heading */}
        <div className="mb-16 flex flex-col items-center">
          
          <p className="mt-4 text-base md:text-lg text-gray-600 dark:text-gray-300 max-w-2xl font-medium">
            See how organizations are optimizing their cloud costs, automating governance, and eliminating waste with CloudOptics.
          </p>
        </div>

        {/* Scrolling Columns Container */}
        <div 
          className="w-full max-w-6xl mx-auto h-[520px] overflow-hidden relative grid grid-cols-1 md:grid-cols-3 gap-6 px-4 md:px-8"
          style={{
            maskImage: "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent, white 15%, white 85%, transparent)"
          }}
        >
          {/* Column 1 */}
          <div className="flex flex-col gap-6 animate-marquee-up-slow">
            {col1.map((rev, idx) => (
              <ReviewCard key={`col1-${idx}`} review={rev} />
            ))}
          </div>

          {/* Column 2 */}
          <div className="hidden md:flex flex-col gap-6 animate-marquee-up-medium">
            {col2.map((rev, idx) => (
              <ReviewCard key={`col2-${idx}`} review={rev} />
            ))}
          </div>

          {/* Column 3 */}
          <div className="hidden md:flex flex-col gap-6 animate-marquee-up-fast">
            {col3.map((rev, idx) => (
              <ReviewCard key={`col3-${idx}`} review={rev} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
