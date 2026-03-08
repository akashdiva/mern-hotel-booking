import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaConciergeBell,
  FaBath,
  FaBed,
  FaUserFriends,
} from "react-icons/fa";

const RoomCard = ({ room }) => {
  const { _id, image, name, price } = room;

  // Ensure image is always an array
  const images = Array.isArray(image) ? image : [image];

  const [current, setCurrent] = useState(0);

  const nextSlide = () => {
    setCurrent((prev) => (prev + 1) % images.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* 🔥 IMAGE SLIDER */}
      <div className="relative">
        <img
          src={images[current]}
          alt={name}
          className="w-full h-80 object-cover"
        />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-[#D35400] text-white px-4 py-2 rounded-lg font-semibold">
          ₹{price}/night
        </div>

        {/* Slider Buttons (only if multiple images) */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow-md hover:bg-gray-100"
            >
              ◀
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full shadow-md hover:bg-gray-100"
            >
              ▶
            </button>
          </>
        )}
      </div>

      {/* 🔥 ROOM DETAILS */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-2xl font-bold text-gray-900">
            {name}
          </h3>

          <div className="flex items-center gap-2 text-gray-600 text-sm">
            <FaUserFriends className="text-[#D35400]" />
            2 Guests
          </div>
        </div>

        <p className="text-gray-600 mb-5">
          Comfortable room with essential amenities for a pleasant stay
        </p>

        <h4 className="font-semibold mb-3">Amenities:</h4>

        <div className="grid grid-cols-2 gap-3 text-gray-700 text-sm">
          <div className="flex items-center gap-2">
            <FaWifi className="text-[#D35400]" /> Free WiFi
          </div>
          <div className="flex items-center gap-2">
            <FaTv className="text-[#D35400]" /> TV
          </div>
          <div className="flex items-center gap-2">
            <FaSnowflake className="text-[#D35400]" /> AC
          </div>
          <div className="flex items-center gap-2">
            <FaBath className="text-[#D35400]" /> Attached Bathroom
          </div>
          <div className="flex items-center gap-2">
            <FaBed className="text-[#D35400]" /> Premium Bedding
          </div>
          <div className="flex items-center gap-2">
            <FaConciergeBell className="text-[#D35400]" /> Room Service
          </div>
        </div>

        <Link
          to={`/booking/${_id}`}
          className="mt-6 block w-full text-center bg-[#D35400] hover:bg-[#b84300] text-white py-3 rounded-lg font-semibold transition"
        >
          Book This Room
        </Link>
      </div>
    </div>
  );
};

export default RoomCard;