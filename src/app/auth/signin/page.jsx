"use client";

import React, { useEffect, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

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
    <motion.div
  initial={{
    opacity: 0,
    x: -400,
  }}
  animate={{
    opacity: 1,
    x: 0,
  }}
  transition={{
    duration: 1.1,
    ease: "easeOut",
  }}
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
      <div
        className="
        w-full
        max-w-3xl
        bg-white/90
        backdrop-blur-xl
        rounded-3xl
        overflow-hidden
        shadow-[0_25px_60px_rgba(0,0,0,0.15)]
        grid
        md:grid-cols-2
        "
      >
        {/* LEFT PANEL */}

        <div
          className="
          bg-gradient-to-br
          from-[#792CA2]
          via-[#9A4DCC]
          to-[#B770FF]
          text-white
          p-8
          flex
          flex-col
          justify-between
          "
        >
          <div>
            <h1 className="text-4xl font-black tracking-wide">
              <span className="text-6xl">{">"}</span> Accenture
            </h1>
          </div>

          <div>
            <h2
              className="
              text-4xl
              md:text-5xl
              text-[#111844]
              font-black
              leading-tight
              "
            >
              Let there
              <br />
              Be
              <br />
              Change.
            </h2>

            <p
              className="
              mt-6
              text-lg
              text-white/90
              leading-relaxed
              "
            >
              Rethink&nbsp;&nbsp;&nbsp;&nbsp;Rebuild&nbsp;&nbsp;&nbsp;&nbsp;Reinvent.
            </p>
          </div>
        </div>

        {/* RIGHT PANEL */}

        <div
          className="
          flex
          items-center
          justify-center
          p-8

          "
        >
          <div className="w-full max-w-md">
            <h1
              className="
              text-3xl
              font-semibold
              text-[#111844]
              mb-10
              "
            >
              Sign In
            </h1>

            {/* GOOGLE */}

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
              border-gray-300
              hover:border-[#792CA2]
              hover:shadow-md
              py-3
              rounded-xl
              font-semibold
              text-[#111844]
              flex
              items-center
              justify-center
              gap-3
              transition-all
              duration-300
              "
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                className="w-6 h-6"
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

              Continue with Google
            </button>

            <div
              className="
              text-center
              text-gray-500
              my-8
              "
            >
              or sign in with Enterprise ID
            </div>

            {/* ENTERPRISE ID */}

            <input
              type="text"
              value={enterpriseId}
              onChange={(e) => setEnterpriseId(e.target.value)}
              placeholder="Enterprise ID"
              className="
              w-full
              bg-[#F4F4F4]
              border
              border-gray-200
              rounded-xl
              px-5
              py-4
              mb-5
              outline-none
              focus:border-[#792CA2]
              "
            />

            {/* PASSWORD */}

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="
              w-full
              bg-[#F4F4F4]
              border
              border-gray-200
              rounded-xl
              px-5
              py-4
              outline-none
              focus:border-[#792CA2]
              "
            />

            <div className="flex justify-end mt-3">
              <button
                className="
                text-[#792CA2]
                font-medium
                hover:underline
                "
              >
                Forgot Password?
              </button>
            </div>

            {/* SIGN IN */}

            <button
              className="
              w-full
              mt-5
              bg-[#111844]
              hover:bg-[#0C1235]
              text-white
              py-4
              rounded-xl
              font-semibold
              text-lg
              transition-all
              duration-300
              hover:scale-[1.02]
              "
            >
              Sign In
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}