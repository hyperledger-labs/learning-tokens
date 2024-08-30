import React from "react";
import { motion } from "framer-motion";

const steps = [
  { title: "Learn", description: "Complete courses and acquire new skills" },
  { title: "Earn Tokens", description: "Receive tokens for your achievements" },
  {
    title: "Verify",
    description: "Use tokens to prove your skills to employers",
  },
];

const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-32">How It Works</h2>
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="text-center mb-8 md:mb-0"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <div className="bg-[#013A44] text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mb-4 mx-auto">
                {index + 1}
              </div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
