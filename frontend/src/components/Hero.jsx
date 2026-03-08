import React from "react";
import bgImage from "../assets/Ragu_Residency.png";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
  <div className="relative pt-20 h-[calc(100vh-80px)] w-full overflow-hidden">
      
      {/* Background Image */}
      <img
        src={bgImage}
        alt="Hotel"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>

      {/* Center Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-4">
        
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Raghu Residency
        </h1>

        <p className="text-lg md:text-xl mb-4">
          Your Comfortable Stay in Tiruvallur
        </p>

        <div className="flex items-center gap-2 mb-6 text-yellow-400 text-lg">
          ⭐⭐⭐⭐☆
          <span className="text-white text-base ml-2">
            4.0 (290 reviews)
          </span>
        </div>

        <div className="flex justify-center gap-4 mt-6">
          <Link
            to="/booking/:id"
            className="text-white font-semibold px-6 py-3 rounded-lg transition"
            style={{ backgroundColor: "#E17100" }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#c96300")}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#E17100")}
          >
            Book Now
          </Link>

          <Link
            to="/rooms"
            className="bg-white hover:bg-gray-200 text-gray-800 font-semibold px-6 py-3 rounded-lg transition"
          >
            View Rooms
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Hero;