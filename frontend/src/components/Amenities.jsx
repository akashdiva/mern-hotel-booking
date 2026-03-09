import React from "react";
import { motion } from "framer-motion";

import { FiClock } from "react-icons/fi";
import { FiTv } from "react-icons/fi";
import { FiCoffee } from "react-icons/fi";
import { FiShield } from "react-icons/fi";
import { FiWind } from "react-icons/fi";
import { FaCar } from "react-icons/fa";

const amenities = [
  {
    icon: <FiWind />,
    title: "Air Conditioned",
    desc: "Fully air-conditioned rooms",
  },
  {
    icon: <FiClock />,
    title: "24/7 Reception",
    desc: "Round-the-clock service",
  },
  {
    icon: <FiTv />,
    title: "TV in Rooms",
    desc: "Entertainment channels",
  },
  {
    icon: <FiCoffee />,
    title: "Room Service",
    desc: "Food & beverages delivered",
  },
  {
    icon: <FaCar />,
    title: "Parking",
    desc: "Secure parking available",
  },
  {
    icon: <FiShield />,
    title: "Safe & Secure",
    desc: "Your safety is our priority",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.6, // very slow delay between cards
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 50 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1.4, // slower animation
      ease: "easeOut",
    },
  },
};

const Amenities = () => {
  return (
    <section className="bg-gray-100 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Our Amenities
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
          viewport={{ once: true }}
          className="text-gray-600 mb-14 text-lg"
        >
          Enjoy a comfortable stay with our modern facilities
        </motion.p>

        {/* Cards */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
        >
          {amenities.map((item, index) => (
            <motion.div
              key={index}
              variants={item}
              className="bg-white rounded-xl shadow-md p-8 text-left hover:shadow-lg transition duration-300"
            >
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-orange-100 text-[#E17100] text-2xl mb-6">
                {item.icon}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
};

export default Amenities;