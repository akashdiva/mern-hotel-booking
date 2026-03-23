import React from "react";
import { motion } from "framer-motion";



import { FiWind, FiClock, FiTv, FiCoffee, FiShield, FiVideo } from "react-icons/fi";
import { FaCar, FaWater, FaBolt } from "react-icons/fa";

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
  {
    icon: <FaWater />,
    title: "RO Water",
    desc: "Clean and purified drinking water",
  },
  {
    icon: <FaBolt />,
    title: "Power Backup",
    desc: "Generator available during power cuts",
  },
  {
    icon: <FiVideo />,
    title: "CCTV Security",
    desc: "24/7 camera surveillance for your safety",
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
    <section className="bg-gray-100 py-16 md:py-24 px-4 md:px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.6 }}
          viewport={{ once: true }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4"
        >
          Our Amenities
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.8 }}
          viewport={{ once: true }}
          className="text-gray-600 mb-10 md:mb-14 text-base md:text-lg"
        >
          Enjoy a comfortable stay with our modern facilities
        </motion.p>

        {/* Cards */}
       <motion.div
  variants={container}
  initial="hidden"
  whileInView="show"
  viewport={{ once: true }}
  className="grid gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
>
  {amenities.map((item, index) => (
    <motion.div
      key={index}
      variants={item}
      className="bg-white rounded-xl shadow-md p-4 md:p-5 text-left hover:shadow-lg transition duration-300"
    >
      <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-orange-100 text-[#E17100] text-lg md:text-xl mb-3 md:mb-4">
        {item.icon}
      </div>

      <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-1">
        {item.title}
      </h3>

      <p className="text-xs md:text-sm text-gray-600">{item.desc}</p>
    </motion.div>
  ))}
</motion.div>

      </div>
    </section>
  );
};

export default Amenities;