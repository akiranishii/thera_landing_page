import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { Features } from "@/components/sections/Features";
import { DemoSection } from "@/components/sections/DemoSection";
import { Discover } from "@/components/sections/Discover";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Philosophy } from "@/components/sections/Philosophy";
import { Privacy } from "@/components/sections/Privacy";
import { EarlyAccess } from "@/components/sections/EarlyAccess";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main id="main" className="flex-1">
        <Hero />
        <Problem />
        <Features />
        <DemoSection />
        <Discover />
        <HowItWorks />
        <Philosophy />
        <Privacy />
        <EarlyAccess />
      </main>
      <Footer />
    </>
  );
}
