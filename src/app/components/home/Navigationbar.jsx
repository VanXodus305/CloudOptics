"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Button,
} from "@heroui/react";

import { CloudIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

export default function Navigationbar() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Navbar
      isBlurred
      position="sticky"
      maxWidth="full"
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
            absolute
            -left-5
            -top-2
            z-10
            "
          >
            <CloudIcon
              className="
              w-7
              h-7
              text-[#792CA2]
              "
            />
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              delay: 1,
              duration: 0.8,
            }}
            className="
            text-2xl
            font-black
            pl-3
            "
          >
            Cloud
            <span className="text-[#792CA2]">
              Optics
            </span>
          </motion.h1>

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
            <Button className="bg-[#792CA2] text-white">
              Sign In
            </Button>
          </motion.div>
        </NavbarItem>

      </NavbarContent>
    </Navbar>
  );
}