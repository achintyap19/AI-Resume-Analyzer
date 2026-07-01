import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import AIProcessing from "../components/AIProcessing";
import FeatureBento from "../components/FeatureBento";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";

export default function Landing() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#050505] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <Hero />

      {/* AI Processing */}
      <AIProcessing />

      {/* Features */}
      <FeatureBento />

      {/* FAQ */}
      <FAQ />

      {/* Footer */}
      <Footer />
    </main>
  );
}