"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
  Image,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from "@heroui/react";

import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

const menuItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      type: "spring",
      stiffness: 140,
      damping: 15,
    },
  }),
};

export default function Navigationbar() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredIdx, setHoveredIdx] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (!element) return;

    const offset = 90; // height of the floating navbar + top margin spacing
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });

    setIsMenuOpen(false);
  };

  return (
    <Navbar
      isBlurred={false}
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className={`
        fixed
        top-4
        left-1/2
        -translate-x-1/2
        w-[calc(100%-2rem)]
        max-w-6xl
        z-50
        bg-white/60
        backdrop-blur-xl
        border
        rounded-full
        transition-all
        duration-500
        ease-out
        h-16
        px-4
        ${scrolled 
          ? "border-[#792CA2]/25 shadow-[0_12px_40px_rgba(121,44,162,0.12)] py-1 bg-white/85 scale-[0.98]" 
          : "border-white/30 shadow-[0_8px_30px_rgba(0,0,0,0.03)] py-2 bg-white/40"
        }
      `}
      classNames={{
        wrapper: "max-w-full px-2 h-full justify-between gap-4",
      }}
    >
      {/* Logo */}
      <NavbarBrand>
        <div className="relative flex items-center">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 80, delay: 0.1 }}
            className="z-10 flex items-center pl-2"
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={130}
              className="object-contain cursor-pointer"
              onClick={() => scrollTo("home")}
            />
          </motion.div>
        </div>
      </NavbarBrand>

      {/* DESKTOP NAVIGATION LINKS */}
      <NavbarContent
        justify="end"
        className="
        hidden
        md:flex
        gap-2
        ml-auto
        mr-2
        items-center
        "
      >
        {[
          { label: "Home", target: "home", delay: 0.2 },
          { label: "Features", target: "features", delay: 0.4 },
          { label: "Dashboard", target: "dashboard", delay: 0.6 }
        ].map((item, idx) => (
          <NavbarItem key={idx} className="relative">
            <motion.button
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: item.delay, type: "spring", stiffness: 100 }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              onClick={() => scrollTo(item.target)}
              className="relative px-5 py-2 text-sm font-bold text-gray-700 hover:text-[#792CA2] transition-colors duration-250 cursor-pointer"
            >
              {item.label}
              {hoveredIdx === idx && (
                <motion.span
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-[#792CA2]/10 rounded-full -z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                />
              )}
            </motion.button>
          </NavbarItem>
        ))}

        <NavbarItem className="pl-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
          >
            <a href={isLoggedIn ? "/dashboard" : "/auth/signin"}>
              <Button
                size="md"
                className="bg-[#792CA2] hover:bg-[#5E1A86] text-white font-bold py-2 px-6 shadow-[0_4px_15px_rgba(121,44,162,0.2)] hover:shadow-[0_6px_22px_rgba(121,44,162,0.4)] transition-all duration-300 hover:scale-[1.03]"
                radius="full"
              >
                {isLoggedIn ? "Go To Dashboard" : "Sign In"}
              </Button>
            </a>
          </motion.div>
        </NavbarItem>
      </NavbarContent>

      {/* Hamburger Menu Toggle (Mobile) */}
      <NavbarContent className="md:hidden pr-2" justify="end">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      {/* Mobile Menu as a floating capsule */}
      <NavbarMenu className="fixed top-[80px] left-4 right-4 w-[calc(100%-2rem)] max-w-md mx-auto bg-white/85 backdrop-blur-2xl border border-white/40 shadow-2xl rounded-3xl p-6 flex flex-col gap-3 z-50 !h-fit overflow-hidden pb-8">
        <NavbarMenuItem>
          <motion.div custom={0} variants={menuItemVariants} initial="hidden" animate="visible">
            <button
              onClick={() => scrollTo("home")}
              className="w-full flex items-center gap-3.5 py-3.5 px-4 text-base font-bold text-gray-800 hover:text-[#792CA2] hover:bg-[#792CA2]/5 active:bg-[#792CA2]/10 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-[#792CA2]/10"
            >
              <svg className="w-5 h-5 text-[#792CA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </button>
          </motion.div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <motion.div custom={1} variants={menuItemVariants} initial="hidden" animate="visible">
            <button
              onClick={() => scrollTo("features")}
              className="w-full flex items-center gap-3.5 py-3.5 px-4 text-base font-bold text-gray-800 hover:text-[#792CA2] hover:bg-[#792CA2]/5 active:bg-[#792CA2]/10 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-[#792CA2]/10"
            >
              <svg className="w-5 h-5 text-[#792CA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
              <span>Features</span>
            </button>
          </motion.div>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <motion.div custom={2} variants={menuItemVariants} initial="hidden" animate="visible">
            <button
              onClick={() => scrollTo("dashboard")}
              className="w-full flex items-center gap-3.5 py-3.5 px-4 text-base font-bold text-gray-800 hover:text-[#792CA2] hover:bg-[#792CA2]/5 active:bg-[#792CA2]/10 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-[#792CA2]/10"
            >
              <svg className="w-5 h-5 text-[#792CA2]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Dashboard</span>
            </button>
          </motion.div>
        </NavbarMenuItem>
        <NavbarMenuItem className="mt-4">
          <motion.div custom={3} variants={menuItemVariants} initial="hidden" animate="visible">
            <a href={isLoggedIn ? "/dashboard" : "/auth/signin"} className="block w-full">
              <Button
                size="lg"
                className="bg-gradient-to-r from-[#792CA2] to-[#B770FF] hover:from-[#5E1A86] hover:to-[#9A4DCC] text-white font-bold py-3 px-4 w-full rounded-full shadow-[0_6px_20px_rgba(121,44,162,0.25)] transition-all duration-300 hover:scale-[1.02]"
              >
                {isLoggedIn ? "Go To Dashboard" : "Sign In"}
              </Button>
            </a>
          </motion.div>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
