import About from "../components/landingPage/about";
import Features from "../components/landingPage/features";
import HowItWorks from "../components/landingPage/howItWorks";
import { motion } from "framer-motion";
import Testimonials from "../components/landingPage/testimonials";
import Footer from "../components/landingPage/footer";
import BackgroundSVG from "@/components/landingPage/backgroundSVG";
import Header from "@/components/landingPage/header";
import Hero from "@/components/landingPage/hero";

export const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <BackgroundSVG />
      <Header />
      <motion.main
        className="container mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Hero />
        <Features />
        <About />
        <HowItWorks />
        <Testimonials />
      </motion.main>
      <Footer />
    </div>
  );
};
