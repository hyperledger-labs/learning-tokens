import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "John Doe",
    role: "Student",
    content:
      "Learning Tokens has transformed the way I showcase my skills to potential employers. It's an innovative approach to education!",
  },
  {
    name: "Jane Smith",
    role: "HR Manager",
    content:
      "As an employer, Learning Tokens makes it easy to verify candidates' skills and qualifications. It's a game-changer in recruitment.",
  },
  {
    name: "Mike Johnson",
    role: "Educator",
    content:
      "Learning Tokens provides a new level of motivation for my students. They love seeing their progress represented in a tangible way.",
  },
];

const Testimonials: React.FC = () => {
  return (
    <section id="testimonials" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-12">
          What People Are Saying
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
              <div className="font-semibold">{testimonial.name}</div>
              <div className="text-sm text-gray-500">{testimonial.role}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
