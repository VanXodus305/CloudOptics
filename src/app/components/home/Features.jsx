"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardBody } from "@heroui/react";

const features = [
  {
    title: "Real-Time Cost Monitoring",
    desc: "Track your cloud spending as it happens with a centralized dashboard that aggregates costs across all services. Instantly understand how much you're spending and how close you are to your budget limits.",
  },
  {
    title: "Advanced Cost Breakdown & Analytics",
    desc: "Gain deep financial insights with visual breakdowns of your cloud usage by service, environment, and department. Understand exactly where your money is going.",
  },
  {
    title: "Historical Trend Analysis",
    desc: "Analyze spending patterns over time with interactive charts that highlight cost fluctuations, growth patterns, and anomalies across the last 30 days or current year.",
  },
  {
    title: "Automated Cost Optimization Engine",
    desc: "Leverage a rule-based engine that continuously scans your infrastructure to identify inefficiencies such as underutilized resources or oversized instances.",
  },
  {
    title: "Actionable Savings Recommendations",
    desc: "Move beyond insights into action with intelligent recommendations that show exactly how to reduce costs and how much you can save.",
  },
  {
    title: "Real-Time Alerts & Risk Detection",
    desc: "Stay informed with a centralized alert system that notifies you of inefficiencies, risks, and anomalies in your cloud infrastructure.",
  },
];

export default function FeaturesCarousel() {
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = 3;

  const nextSlide = () => {
    if (startIndex < features.length - visibleCards) {
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
      className="py-28 bg-white rounded-t-[50px]"
    >
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-5xl font-black text-[#111844] mb-4">
            Features
          </h2>

          <p className="text-lg text-gray-600">
            Everything needed to optimize cloud costs efficiently.
          </p>
        </div>

        <div className="flex items-center gap-4">

          <button
            onClick={prevSlide}
            disabled={startIndex === 0}
            className="
            w-12 h-12 rounded-full
            bg-white
            shadow-lg
            text-[#792CA2]
            "
          >
            ←
          </button>

          <div className="grid md:grid-cols-3 gap-6 flex-1">

            {features
              .slice(startIndex, startIndex + visibleCards)
              .map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{
                    opacity: 0,
                    y: 50,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: false,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.15,
                  }}
                >
                  <Card
                    className="
                    border
                    border-[#EEEEEE]
                    hover:border-[#792CA2]
                    hover:shadow-xl
                    transition-all
                    duration-300
                    hover:-translate-y-2
                    min-h-[220px]
                    "
                  >
                    <CardBody className="p-8">

                      <h3 className="text-2xl font-bold text-[#111844] mb-4">
                        {feature.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed">
                        {feature.desc}
                      </p>

                    </CardBody>
                  </Card>
                </motion.div>
              ))}
          </div>

          <button
            onClick={nextSlide}
            disabled={startIndex >= features.length - visibleCards}
            className="
            w-12 h-12 rounded-full
            bg-white
            shadow-lg
            text-[#792CA2]
            "
          >
            →
          </button>

        </div>

        <div className="flex justify-center gap-3 mt-10">
          {Array.from({
            length: features.length - visibleCards + 1,
          }).map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full ${
                startIndex === index
                  ? "w-8 bg-[#792CA2]"
                  : "w-2 bg-gray-300"
              }`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}