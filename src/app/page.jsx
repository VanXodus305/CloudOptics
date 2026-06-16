"use client";
import Navigationbar from "./landing/components/Navigationbar";
import HeroSection from "./landing/components/HeroSection";
import FeaturesCarousel from "./landing/components/Features";
import DashboardPreview from "./landing/components/Dashboard";
import ReviewsSection from "./landing/components/ReviewsSection";
import Footer from "./landing/components/Footer";
import ScrollReveal from "./components/common/ScrollReveal";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    // Ensure page stays at top on load
    window.scrollTo(0, 0);
  }, []);
  return (
    <main className="overflow-hidden">
      <section id="home">
        <Navigationbar />
        <HeroSection />
      </section>

      <section
        id="features"
        className="
          relative
          z-10
          -mt-20
          "
      >
        <ScrollReveal>
          <FeaturesCarousel />
        </ScrollReveal>
      </section>

      <section
        id="dashboard"
        className="
          relative
          z-20
          -mt-20
          "
      >
        <ScrollReveal>
          <DashboardPreview />
        </ScrollReveal>
      </section>

      <section
        id="reviews"
        className="
          relative
          z-10
          -mt-10
          "
      >
        <ScrollReveal>
          <ReviewsSection />
        </ScrollReveal>
      </section>

      <Footer />
    </main>
  );
}
