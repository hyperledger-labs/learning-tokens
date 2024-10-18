import React from "react";
import { motion } from "framer-motion";

const About: React.FC = () => {
  return (
    <section id="about" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-8"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          About Learning Tokens
        </motion.h2>
        <motion.p
          className="text-lg text-center max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Learning Tokens is an innovative platform that combines education and
          blockchain technology. We aim to revolutionize the way learning
          achievements are recognized, verified, and shared in the digital age.
        </motion.p>
      </div>
    </section>
  );
};

export default About;
