import React from "react";
import { motion } from "framer-motion";

import {
 
  FiClock,
  FiTv,
  FiCoffee,
  FiShield,
   FiWind,
} from "react-icons/fi";

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
    icon: <FaCar />,   // ✅ Proper car icon
    title: "Parking",
    desc: "Secure parking available",
  },
  {
    icon: <FiShield />,
    title: "Safe & Secure",
    desc: "Your safety is our priority",
  },
];

const Amenities = () => {
  return (
    <section className="bg-gray-100 py-24 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto text-center">

        {/* Heading */}
        <motion.h2
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
        >
          Our Amenities
        </motion.h2>

        <motion.p
          initial={{ x: -100, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="text-gray-600 mb-14 text-lg"
        >
          Enjoy a comfortable stay with our modern facilities
        </motion.p>

        {/* Cards */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {amenities.map((item, index) => (
            <motion.div
              key={index}
              initial={{ x: -100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
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
        </div>

      </div>
    </section>
  );
};

export default Amenities;