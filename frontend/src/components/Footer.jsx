import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaClock } from "react-icons/fa";
import { Link } from "react-router-dom";


const Footer = () => {
  return (
    <footer className="bg-[#0b1c34] text-white pt-16 pb-8 px-6 border-t-4 border-[#E17100]">
      
      <div className="max-w-7xl mx-auto">

        {/* Top Grid */}
        <div className="grid md:grid-cols-3 gap-12">

          {/* Column 1 */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Raghu Residency</h3>
            <p className="text-gray-300 leading-relaxed mb-6">
              A comfortable and affordable lodging service in the heart of
              Tiruvallur, offering quality accommodation for travelers and guests.
            </p>
    
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Contact Information</h3>

            <div className="flex items-start gap-4 mb-4">
              <FaMapMarkerAlt className="mt-1 text-gray-400" />
              <p className="text-gray-300">
                33, 2nd Floor,Near By Municipality Office, <br />
                Opposite to Rose Mahal, <br />
                VM Nagar, Thiruvallur – 602001, <br />
                Tamil Nadu, India
              </p>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <FaPhoneAlt className="text-gray-400" />
              <p className="text-gray-300">+91 86678 37244</p>
            </div>

            <div className="flex items-center gap-4">
              <FaClock className="text-gray-400" />
              <p className="text-gray-300">24/7 Reception</p>
            </div>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-xl font-semibold mb-6">Quick Links</h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <Link to="/" className="hover:text-[#E17100] transition duration-300 hover:pl-2">
                  Home
                </Link>
              </li>

              <li>
                <Link to="/rooms" className="hover:text-[#E17100] transition duration-300 hover:pl-2">
                  Our Rooms
                </Link>
              </li>

              <li>
                <Link to="/booking/:id" className="hover:text-[#E17100] transition duration-300 hover:pl-2">
                  Book Now
                </Link>
              </li>

              <li>
                <Link to="/contact" className="hover:text-[#E17100] transition duration-300 hover:pl-2">
                  Contact Us
                </Link>
              </li>


             
            </ul>
          </div>

        </div>

        {/* Bottom Line */}
        <div className="border-t border-gray-700 mt-12 pt-6 text-center text-gray-400">
          © 2026 Raghu Residency. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;