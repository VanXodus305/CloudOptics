import Navigationbar from "../components/home/Navigationbar";
import HeroSection from "../components/home/HeroSection";
import FeaturesCarousel from "../components/home/Features";
import DashboardPreview from "../components/home/Dashboard";
import Footer from "../components/home/Footer";
import ScrollReveal from "../components/common/ScrollReveal";

export default function LandingPage() {
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

      <Footer />

    </main>
  );
}