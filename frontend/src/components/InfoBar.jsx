import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";

const InfoBar = () => {
  return (
    <div
      className="w-full text-white py-6"
      style={{ backgroundColor: "#E17100" }}
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">

        {/* Location */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4">
          <FaMapMarkerAlt className="text-2xl" />
          <div>
            <h3 className="font-semibold text-lg">Location</h3>
            <p className="text-sm">60 Feet Road, V.M Nagar</p>
          </div>
        </div>

        {/* Call Us */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4">
          <FaPhoneAlt className="text-2xl" />
          <div>
            <h3 className="font-semibold text-lg">Call Us</h3>
            <p className="text-sm">+91 86678 37244</p>
          </div>
        </div>

        {/* Check-in */}
        <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-3 md:gap-4">
          <FaClock className="text-2xl" />
          <div>
            <h3 className="font-semibold text-lg">Check-in</h3>
            <p className="text-sm">24/7 Reception Available</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InfoBar;