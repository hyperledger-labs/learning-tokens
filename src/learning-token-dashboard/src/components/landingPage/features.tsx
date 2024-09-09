import React from "react";
import { motion } from "framer-motion";

const featuresList = [
  {
    title: "Tokenized Learning",
    description: "Convert your educational achievements into digital tokens",
  },
  {
    title: "Blockchain Security",
    description: "Secure and immutable record of your learning progress",
  },
  {
    title: "Skill Verification",
    description: "Easily verify and showcase your skills to employers",
  },
];

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20">
      <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featuresList.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Features;
