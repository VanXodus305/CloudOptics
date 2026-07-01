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

import { motion, AnimatePresence } from "framer-motion";
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
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mounting and initial theme check
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isSystemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (
      savedTheme === "dark" || 
      (savedTheme === "system" && isSystemDark) ||
      (!savedTheme && isSystemDark)
    ) {
      setTheme("dark");
      document.documentElement.classList.add("dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (theme === "light") {
      setTheme("dark");
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

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
        dark:bg-black/60
        backdrop-blur-xl
        border
        rounded-full
        transition-all
        duration-500
        ease-out
        h-16
        px-4
        ${scrolled 
          ? "border-[#792CA2]/25 dark:border-[#9A4DCC]/30 shadow-[0_12px_40px_rgba(121,44,162,0.12)] py-1 bg-white/85 dark:bg-black/85 scale-[0.98]" 
          : "border-white/30 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.03)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.5)] py-2 bg-white/40 dark:bg-black/40"
        }
      `}
      classNames={{
        wrapper: "max-w-full px-2 h-full justify-between gap-4 relative",
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
              className="object-contain cursor-pointer dark:brightness-110"
              onClick={() => scrollTo("home")}
            />
          </motion.div>
        </div>
      </NavbarBrand>

      {/* DESKTOP CENTER NAVIGATION LINKS */}
      <NavbarContent
        justify="center"
        className="
        hidden
        md:flex
        absolute
        left-1/2
        -translate-x-1/2
        gap-2
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
              className="relative px-5 py-2 text-sm font-bold text-gray-700 dark:text-gray-300 hover:text-[#792CA2] dark:hover:text-[#C084FC] transition-colors duration-250 cursor-pointer focus:outline-none"
            >
              {item.label}
              {hoveredIdx === idx && (
                <motion.span
                  layoutId="navbar-hover"
                  className="absolute inset-0 bg-[#792CA2]/10 dark:bg-[#9A4DCC]/20 rounded-full -z-10"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 320, damping: 22 }}
                />
              )}
            </motion.button>
          </NavbarItem>
        ))}
      </NavbarContent>

      {/* DESKTOP RIGHT ITEMS (THEME TOGGLE + SIGN IN) */}
      <NavbarContent
        justify="end"
        className="
        hidden
        md:flex
        gap-4
        items-center
        "
      >
        <NavbarItem>
          <button
            onClick={toggleTheme}
            className={`
              relative
              w-14
              h-8
              rounded-full
              p-1
              transition-all
              duration-500
              ease-in-out
              cursor-pointer
              focus:outline-none
              select-none
              overflow-hidden
              border
              bg-gradient-to-r
              shadow-md
              flex
              items-center
              ${theme === "light"
                ? "from-sky-300 to-blue-200 border-sky-400/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.06)]"
                : "from-[#0F122B] to-[#22163A] border-purple-500/30 shadow-[0_0_15px_rgba(154,77,204,0.15),inset_0_2px_4px_rgba(0,0,0,0.4)]"
              }
            `}
            title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          >
            {/* Background elements like clouds or stars */}
            <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
              {theme === "light" ? (
                // Clouds
                <div className="absolute right-2 top-2 w-3 h-1.5 bg-white rounded-full opacity-60 filter blur-[0.5px]">
                  <div className="absolute -top-1 left-1 w-2 h-2 bg-white rounded-full" />
                </div>
              ) : (
                // Stars
                <div className="absolute left-2.5 top-2.5 w-0.5 h-0.5 bg-white rounded-full animate-pulse">
                  <div className="absolute top-2 left-6 w-0.5 h-0.5 bg-white rounded-full" />
                  <div className="absolute -top-1 left-3 w-1 h-1 bg-purple-300 rounded-full opacity-50" />
                </div>
              )}
            </div>

            {/* Sliding Knob */}
            <motion.div
              layout
              transition={{ type: "spring", stiffness: 500, damping: 25 }}
              className={`
                w-6
                h-6
                rounded-full
                flex
                items-center
                justify-center
                shadow-md
                z-10
                ${theme === "light"
                  ? "bg-amber-400 text-amber-950 shadow-[0_2px_8px_rgba(251,191,36,0.5)]"
                  : "bg-purple-600 text-purple-100 shadow-[0_2px_8px_rgba(154,77,204,0.6)]"
                }
              `}
              style={{
                marginLeft: theme === "light" ? "0" : "auto"
              }}
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "light" ? (
                  <motion.svg
                    key="sun"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                    className="w-4 h-4 text-amber-900"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.364l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                  </motion.svg>
                ) : (
                  <motion.svg
                    key="moon"
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 45 }}
                    transition={{ duration: 0.2 }}
                    className="w-3.5 h-3.5 text-purple-100"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </motion.svg>
                )}
              </AnimatePresence>
            </motion.div>
          </button>
        </NavbarItem>

        <NavbarItem>
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
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} className="dark:text-white" />
      </NavbarContent>

      {/* Mobile Menu as a floating capsule */}
      <NavbarMenu className="fixed top-[80px] left-4 right-4 w-[calc(100%-2rem)] max-w-md mx-auto bg-white/85 dark:bg-neutral-900/90 backdrop-blur-2xl border border-white/40 dark:border-neutral-800/80 shadow-2xl rounded-3xl p-6 flex flex-col gap-3 z-50 !h-fit overflow-hidden pb-8">
        <NavbarMenuItem>
          <motion.div custom={0} variants={menuItemVariants} initial="hidden" animate="visible">
            <button
              onClick={() => scrollTo("home")}
              className="w-full flex items-center gap-3.5 py-3.5 px-4 text-base font-bold text-gray-800 dark:text-gray-200 hover:text-[#792CA2] dark:hover:text-[#C084FC] hover:bg-[#792CA2]/5 dark:hover:bg-[#9A4DCC]/10 active:bg-[#792CA2]/10 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-[#792CA2]/10 dark:hover:border-[#9A4DCC]/20"
            >
              <svg className="w-5 h-5 text-[#792CA2] dark:text-[#B770FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="w-full flex items-center gap-3.5 py-3.5 px-4 text-base font-bold text-gray-800 dark:text-gray-200 hover:text-[#792CA2] dark:hover:text-[#C084FC] hover:bg-[#792CA2]/5 dark:hover:bg-[#9A4DCC]/10 active:bg-[#792CA2]/10 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-[#792CA2]/10 dark:hover:border-[#9A4DCC]/20"
            >
              <svg className="w-5 h-5 text-[#792CA2] dark:text-[#B770FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
              className="w-full flex items-center gap-3.5 py-3.5 px-4 text-base font-bold text-gray-800 dark:text-gray-200 hover:text-[#792CA2] dark:hover:text-[#C084FC] hover:bg-[#792CA2]/5 dark:hover:bg-[#9A4DCC]/10 active:bg-[#792CA2]/10 rounded-2xl transition-all duration-200 cursor-pointer border border-transparent hover:border-[#792CA2]/10 dark:hover:border-[#9A4DCC]/20"
            >
              <svg className="w-5 h-5 text-[#792CA2] dark:text-[#B770FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Dashboard Preview</span>
            </button>
          </motion.div>
        </NavbarMenuItem>

        <NavbarMenuItem className="flex justify-between items-center py-3.5 px-4 bg-gray-50 dark:bg-neutral-800/50 rounded-2xl">
          <span className="text-sm font-bold text-gray-800 dark:text-gray-200">Dark Mode</span>
          <button
            onClick={toggleTheme}
            className="w-12 h-6 rounded-full p-0.5 bg-gray-200 dark:bg-[#792CA2] transition-colors focus:outline-none flex items-center"
          >
            <motion.div
              layout
              className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center text-slate-700 text-[10px]"
              animate={{ x: theme === "dark" ? 24 : 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            >
              {theme === "dark" ? "🌙" : "☀️"}
            </motion.div>
          </button>
        </NavbarMenuItem>

        <NavbarMenuItem className="mt-4">
          <motion.div custom={4} variants={menuItemVariants} initial="hidden" animate="visible">
            <a href={isLoggedIn ? "/dashboard" : "/auth/signin"} className="block w-full">
              <Button
                size="lg"
                className="bg-[#792CA2] hover:bg-[#5E1A86] text-white font-bold py-3 px-4 w-full rounded-full shadow-[0_6px_20px_rgba(121,44,162,0.25)] transition-all duration-300 hover:scale-[1.02]"
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
