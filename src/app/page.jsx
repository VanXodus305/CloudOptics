"use client";

import LandingPage from "./pages/LandingPage";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Ensure page stays at top on load
    window.scrollTo(0, 0);
  }, []);
  return <LandingPage />;
}
