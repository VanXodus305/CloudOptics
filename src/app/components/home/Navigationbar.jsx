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
import { useState } from "react";

export default function Navigationbar() {
  const { status } = useSession();
  const isLoggedIn = status === "authenticated";
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
    setIsMenuOpen(false);
  };

  return (
    <Navbar
      isBlurred
      position="sticky"
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      className="
      bg-[#F9F7F7]/90
      backdrop-blur-md
      border-b
      border-[#EEEEEE]
      "
    >
      {/* Logo */}

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
            className="
            -left-5
            z-10
            "
          >
            <Image
              src="/logo.png"
              alt="Logo"
              width={160}
            />
          </motion.div>
        </div>
      </NavbarBrand>

      {/* RIGHT SIDE NAVIGATION */}

      <NavbarContent
        justify="end"
        className="
        hidden
        md:flex
        gap-10
        ml-auto
        mr-10
        "
      >
        <NavbarItem>
          <motion.button
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            onClick={() => scrollTo("home")}
            className="hover:text-[#792CA2]"
          >
            Home
          </motion.button>
        </NavbarItem>

        <NavbarItem>
          <motion.button
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            onClick={() => scrollTo("features")}
            className="hover:text-[#792CA2]"
          >
            Features
          </motion.button>
        </NavbarItem>

        <NavbarItem>
          <motion.button
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.5 }}
            onClick={() => scrollTo("dashboard")}
            className="hover:text-[#792CA2]"
          >
            Dashboard
          </motion.button>
        </NavbarItem>

        <NavbarItem>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3 }}
          >
            <a href={isLoggedIn ? "/dashboard" : "/auth/signin"}>
              <Button
                size="md"
                className="bg-[#792CA2] hover:bg-[#5E1A86] text-white font-semibold py-2 px-4"
                radius="lg"
              >
                {isLoggedIn ? "Go To Dashboard" : "Sign In"}
              </Button>
            </a>
          </motion.div>
        </NavbarItem>
      </NavbarContent>

      {/* Hamburger Menu Toggle (Mobile) */}
      <NavbarContent className="md:hidden" justify="end">
        <NavbarMenuToggle aria-label={isMenuOpen ? "Close menu" : "Open menu"} />
      </NavbarContent>

      {/* Mobile Menu */}
      <NavbarMenu className="bg-[#F9F7F7]/95 backdrop-blur-md border-b border-[#EEEEEE] px-6 py-4 flex flex-col gap-4">
        <NavbarMenuItem>
          <button
            onClick={() => scrollTo("home")}
            className="w-full text-left py-2 text-lg font-medium text-gray-800 hover:text-[#792CA2] transition-colors"
          >
            Home
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <button
            onClick={() => scrollTo("features")}
            className="w-full text-left py-2 text-lg font-medium text-gray-800 hover:text-[#792CA2] transition-colors"
          >
            Features
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem>
          <button
            onClick={() => scrollTo("dashboard")}
            className="w-full text-left py-2 text-lg font-medium text-gray-800 hover:text-[#792CA2] transition-colors"
          >
            Dashboard
          </button>
        </NavbarMenuItem>
        <NavbarMenuItem className="mt-4">
          <a href={isLoggedIn ? "/dashboard" : "/auth/signin"}>
            <Button
              size="md"
              className="bg-[#792CA2] hover:bg-[#5E1A86] text-white font-semibold py-2 px-4 w-full"
              radius="lg"
            >
              {isLoggedIn ? "Go To Dashboard" : "Sign In"}
            </Button>
          </a>
        </NavbarMenuItem>
      </NavbarMenu>
    </Navbar>
  );
}
