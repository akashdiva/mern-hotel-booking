import React, { useContext, useState } from "react";
import { RoomContext } from "../context/RoomContext";
import { Link } from "react-router-dom";


import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaConciergeBell,
  FaBath,
  FaBed,
  FaUserFriends,
  FaChild ,
  FaChevronLeft,
   FaChevronRight
} from "react-icons/fa";


// ✅ Room Card Component (moved slider logic here)
const RoomCard = ({ room }) => {

  const { _id, image, name, price, description, totalRooms } = room;

  

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

  const getGuestCapacity = () => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes("family")) {
    return { adults: 4, children: 2 };
  }

  return { adults: 2, children: 1 };
};
const { adults, children } = getGuestCapacity();
  return (
   <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col h-full">
      {/* 🔥 Image Slider */}
      <div className="relative">
        <img
          src={images[current]}
          alt={name}
       className="w-full h-56 md:h-80 object-cover"
        />

        {/* Price Badge */}
        <div className="absolute top-4 right-4 bg-[#D35400] text-white px-4 py-2 rounded-lg font-semibold">
          ₹{price}/night
        </div>

        {/* Slider Buttons */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevSlide}
             className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 
bg-black/50 hover:bg-black/70 
text-white p-2 md:p-3 rounded-full"
                       
            >
              <FaChevronLeft size={18} />
            </button>

           <button
  onClick={nextSlide}
  className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 
  bg-black/50 hover:bg-black/70 
  text-white p-2 md:p-3 rounded-full"
>
  <FaChevronRight size={18} />
</button>
          </>
        )}
      </div>

      {/* Details */}
      <div className="p-4 md:p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl md:text-2xl font-bold text-gray-900">
            {name}
          </h3>
         <div className="flex items-center gap-4 text-gray-600 text-sm">
 <div className="flex items-center gap-4 text-gray-600 text-sm">
  <div className="flex items-center gap-1">
    <FaUserFriends className="text-[#D35400]" />
    {adults} Adults
  </div>

  <div className="flex items-center gap-1">
    <FaChild className="text-[#D35400]" />
    {children} Children
  </div>

  <div className="text-sm text-green-600 font-semibold ml-2">

</div>
</div>
</div>
        </div>

       <p className="text-gray-600 mb-4 leading-relaxed text-sm md:text-md font-medium">
  {description
    ? description
    : "Comfortable room with essential amenities for a pleasant stay"}
</p>
<div className="mt-auto">
        <h4 className="font-semibold mb-3">Amenities:</h4>

        <div className="grid grid-cols-2 gap-2 md:gap-3 text-gray-700 text-xs md:text-sm">
         
          <div className="flex items-center gap-2">
            <FaTv className="text-[#D35400]" /> TV
          </div>
         {!name.toLowerCase().includes("non") && (
  <div className="flex items-center gap-2">
    <FaSnowflake className="text-[#D35400]" /> AC
  </div>
)}
          <div className="flex items-center gap-2">
            <FaBath className="text-orange-600" /> Attached Bathroom
          </div>
          <div className="flex items-center gap-2">
            <FaBed className="text-orange-600" /> Premium Bedding
          </div>
          <div className="flex items-center gap-2">
            <FaConciergeBell className="text-orange-600" /> Room Service
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
    </div>
  );
};


// ✅ Main HotelList Component
const HotelList = () => {
  const { rooms } = useContext(RoomContext);

  return (
  <div>
    {/* Header */}
    <div className="w-full bg-[#D35400] py-20 text-center text-white">
     <h1 className="text-3xl md:text-5xl font-bold mb-4">Our Rooms</h1>
      <p className="text-base md:text-xl">
        Choose from our range of comfortable accommodations
      </p>
    </div>

    {/* Content */}
    <div className="bg-gray-100 py-20">
      <div className="max-w-7xl mx-auto px-6">

        {/* Rooms Grid */}
    <div className="grid md:grid-cols-2 gap-6 md:gap-10">
          {rooms && rooms.length > 0 ? (
            rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-full">
              No rooms available
            </p>
          )}
        </div>

        {/* Hotel Policies Section */}
        <div className="mt-20 grid md:grid-cols-3  gap-8">

          <div className="bg-white p-8 md:p-20 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-3">Check-in Time</h3>
            <p className="text-gray-600">02:00 PM onwards</p>
          </div>

          <div className="bg-white p-8 md:p-20 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-3">Check-out Time</h3>
            <p className="text-gray-600">11:00 AM</p>
          </div>

          <div className="bg-white p-8 md:p-20 rounded-xl shadow text-center">
            <h3 className="text-xl font-bold mb-3">Cancellation Policy</h3>
            <p className="text-gray-600">
              Free cancellation up to 24 hours before check-in
            </p>
          </div>

        </div>

      </div>
    </div>
  </div>
);
};

export default HotelList;