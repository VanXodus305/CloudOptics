"use client";

import { motion } from "framer-motion";

export default function Footer({ reduced = false }) {
  const currentYear = new Date().getFullYear();

  if (reduced) {
    return (
      <footer className="w-full py-6 text-center text-xs text-gray-400 bg-[#111844] border-t border-white/5 relative z-10">
        <p>@2026 CloudOptics</p>
      </footer>
    );
  }

  const handleScrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (!element) {
      window.location.href = `/#${id}`;
      return;
    }
    const offset = 90;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const footerLinks = {
    platform: [
      { name: "Home", id: "home" },
      { name: "Features", id: "features" },
      { name: "Dashboard Preview", id: "dashboard" }
    ]
  };

  return (
    <footer className="relative bg-gradient-to-br from-[#111844] via-[#0E0C24] to-[#1F1235] text-white pt-20 pb-10 overflow-hidden border-t border-white/5">
      {/* Background Cyber-grid Overlay */}
      <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:30px_30px] pointer-events-none" />

      {/* Glowing Mesh Orbs */}
      <div className="absolute top-0 left-1/4 w-[30vw] h-[30vw] rounded-full bg-[#792CA2]/12 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[25vw] h-[25vw] rounded-full bg-[#B770FF]/8 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pb-16 items-start">
          {/* Brand Info */}
          <div className="flex flex-col justify-start">
            <h3 className="text-3xl font-black bg-gradient-to-r from-white via-[#DCCBFF] to-[#B770FF] bg-clip-text text-transparent tracking-wide">
              CloudOptics
            </h3>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed max-w-md">
              Next-generation cloud cost intelligence. Automate infrastructure rightsizing, eliminate billing anomalies, and manage multi-cloud environments from a single dynamic panel.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col md:items-end">
            <div className="w-fit">
              <h4 className="text-xs font-black uppercase tracking-widest text-[#B770FF] mb-5">
                Platform
              </h4>
              <ul className="space-y-3">
                {footerLinks.platform.map((link, idx) => (
                  <li key={idx}>
                    <a
                      href={`#${link.id}`}
                      onClick={(e) => handleScrollTo(e, link.id)}
                      className="text-sm text-gray-400 hover:text-white transition-colors duration-200 cursor-pointer block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar Divider */}
        <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent my-4" />

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center pt-4 text-xs text-gray-500 gap-4">
          <p>© {currentYear} CloudOptics. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <p className="font-medium text-gray-600">Built for high-efficiency infrastructure.</p>

            {/* Scroll to Top */}
            <motion.button
              onClick={scrollToTop}
              whileHover={{ scale: 1.1, y: -2 }}
              className="p-2.5 bg-white/5 hover:bg-[#792CA2]/20 border border-white/10 rounded-full text-gray-400 hover:text-white transition-all cursor-pointer"
              aria-label="Scroll to top"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </motion.button>
          </div>
        </div>
      </div>
    </footer>
  );
}