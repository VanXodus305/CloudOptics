"use client";

import React, { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    // Ensure page stays at top on load
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="relative overflow-hidden bg-slate-50">Hello Cloud!</div>
  );
}
