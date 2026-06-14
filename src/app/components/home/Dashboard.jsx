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
      "
    >
      <div className="max-w-7xl mx-auto px-6">

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
          gap-20
          items-center
          "
        >

          <div
            className="
            h-[420px]
            rounded-3xl
            bg-gradient-to-br
            from-[#111844]
            to-[#792CA2]
            flex
            items-center
            justify-center
            shadow-2xl
            "
          >
            <div className="text-center text-white">
              <h3 className="text-3xl font-bold">
                Dashboard Preview
              </h3>

              <p className="mt-3 opacity-80">
                Analytics Coming Soon
              </p>
            </div>
          </div>

          {/* Content */}

          <div>

            <h2 className="text-5xl font-black text-[#111844] mb-6">
              Unlock Full Insights
            </h2>

            <p className="text-lg text-gray-600 mb-8">
              Access comprehensive analytics and
              cloud cost optimization recommendations.
            </p>

            <ul className="space-y-5 text-lg text-[#111844]">
  <li>• Live cloud spending visibility across all services</li>
  <li>• Advanced cost breakdowns and analytics dashboards</li>
  <li>• Historical trend tracking and forecasting insights</li>
  <li>• Automated detection of idle and oversized resources</li>
  <li>• Intelligent cost-saving recommendations</li>
  <li>• Real-time alerts for risks and anomalies</li>
</ul>
            

          </div>

        </motion.div>

      </div>
    </section>
  );
}