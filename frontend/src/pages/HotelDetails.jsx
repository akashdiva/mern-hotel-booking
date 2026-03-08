// import React, { useState, useEffect, useContext } from "react";
// import { useParams } from "react-router-dom";
// import axios from "axios";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// import {
//   FaWifi,
//   FaTv,
//   FaUtensils,
//   FaSwimmingPool,
//   FaConciergeBell,
// } from "react-icons/fa";

// import { RoomContext } from "../context/RoomContext";
// import { backendUrl } from "../App";

// const HotelDetails = () => {
//   const { rooms } = useContext(RoomContext);
//   const { id } = useParams();
//   const [aadhaar, setAadhaar] = useState(null);


//   const [room, setRoom] = useState(null);

//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     phone: "",
//     checkin: null,
//     checkout: null,
//     guests: 1,
//   });

//   const [bookedDates, setBookedDates] = useState([]);

//   // 🔹 Find selected room
//   useEffect(() => {
//     if (rooms && rooms.length > 0) {
//       const selectedRoom = rooms.find((r) => r._id === id);
//       setRoom(selectedRoom);
//     }
//   }, [id, rooms]);

//   // 🔹 Fetch booked dates
//   useEffect(() => {
//     if (room) {
//       axios
//         .get(`${backendUrl}/api/reservations/room/${room._id}`)
//         .then((res) => {
//           const formatted = res.data.map((booking) => ({
//             checkin: new Date(booking.checkin),
//             checkout: new Date(booking.checkout),
//           }));
//           setBookedDates(formatted);
//         })
//         .catch((err) => console.log(err));
//     }
//   }, [room]);

//   // 🔹 Generate all disabled dates
//   const getDisabledDates = () => {
//     let disabled = [];

//     bookedDates.forEach((booking) => {
//       let current = new Date(booking.checkin);
//       const end = new Date(booking.checkout);

//       current.setHours(0, 0, 0, 0);
//       end.setHours(0, 0, 0, 0);

//       while (current < end) {
//         disabled.push(new Date(current));
//         current.setDate(current.getDate() + 1);
//       }
//     });

//     return disabled;
//   };

//   const handleChange = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value,
//     });
//   };

//  const handleSubmit = async (e) => {
//   e.preventDefault();

//   if (!formData.checkin || !formData.checkout) {
//     alert("⚠️ Please select dates");
//     return;
//   }

//   if (!aadhaar) {
//     alert("⚠️ Please upload Aadhaar card");
//     return;
//   }

//   try {
//     const bookingData = new FormData();

//     bookingData.append("name", formData.name);
//     bookingData.append("email", formData.email);
//     bookingData.append("phone", formData.phone);
//     bookingData.append("checkin", formData.checkin);
//     bookingData.append("checkout", formData.checkout);
//     bookingData.append("guests", formData.guests);
//     bookingData.append("roomName", room.name);
//     bookingData.append("roomId", room._id);
//     bookingData.append("aadhaar", aadhaar); // 🔥 file

//     const response = await axios.post(
//       backendUrl + "/api/reservations/create",
//       bookingData,
//       {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       }
//     );

//     alert("✅ Booking successful");

//   } catch (error) {
//     console.log(error);
//     alert("Something went wrong");
//   }
// };


//   if (!room) {
//     return (
//       <div className="text-center py-20 text-xl font-semibold">
//         Loading Room Details...
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 py-12 px-6">
//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

//         {/* LEFT SIDE */}
//         <div className="md:col-span-2 bg-white p-6 rounded-lg shadow">
//           <h1 className="text-3xl font-bold text-gray-800">
//             {room.name}
//           </h1>

//           <p className="text-lime-600 text-xl font-semibold mt-1">
//             ${room.price}
//           </p>

//           <img
//             src={room.image}
//             alt={room.name}
//             className="w-full h-[420px] object-cover rounded-lg mt-6"
//           />
//         </div>

//         {/* RIGHT SIDE – BOOKING CARD */}
//         <div className="bg-white p-6 rounded-lg shadow h-fit">
//           <h2 className="text-xl font-semibold mb-6">
//             Book Your Stay
//           </h2>

//           <form onSubmit={handleSubmit} className="space-y-4">

//             <input
//               type="text"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               placeholder="Name"
//               className="w-full border rounded-md px-4 py-3"
//               required
//             />

//             <input
//               type="email"
//               name="email"
//               value={formData.email}
//               onChange={handleChange}
//               placeholder="Email"
//               className="w-full border rounded-md px-4 py-3"
//               required
//             />

//             <input
//               type="tel"
//               name="phone"
//               value={formData.phone}
//               onChange={handleChange}
//               placeholder="Phone Number"
//               className="w-full border rounded-md px-4 py-3"
//               required
//             />

//             {/* CHECK IN */}
//             <div>
//               <label className="text-sm font-medium">Check-In</label>
//               <DatePicker
//                 selected={formData.checkin}
//                 onChange={(date) =>
//                   setFormData({ ...formData, checkin: date })
//                 }
//                 excludeDates={getDisabledDates()}
//                 minDate={new Date()}
//                 placeholderText="Select Check-In"
//                 className="w-full border rounded-md px-4 py-3 mt-1"
//               />
//             </div>

//             {/* CHECK OUT */}
//             <div>
//               <label className="text-sm font-medium">Check-Out</label>
//               <DatePicker
//                 selected={formData.checkout}
//                 onChange={(date) =>
//                   setFormData({ ...formData, checkout: date })
//                 }
//                 excludeDates={getDisabledDates()}
//                 minDate={formData.checkin || new Date()}
//                 placeholderText="Select Check-Out"
//                 className="w-full border rounded-md px-4 py-3 mt-1"
//               />
//             </div>

//             <div>
//               <label className="text-sm font-medium">
//                 Number of Guests
//               </label>
//               <select
//                 name="guests"
//                 value={formData.guests}
//                 onChange={handleChange}
//                 className="w-full border rounded-md px-4 py-3 mt-1"
//               >
//                 {[...Array(3).keys()].map((i) => (
//                   <option key={i + 1} value={i + 1}>
//                     {i + 1} Guest(s)
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Aadhaar Upload */}
// <div>
//   <label className="text-sm font-medium">
//     Upload Aadhaar Card
//   </label>
//   <input
//     type="file"
//     accept="image/*"
//     onChange={(e) => setAadhaar(e.target.files[0])}
//     className="w-full border rounded-md px-4 py-3 mt-1"
//     required
//   />
// </div>


//             <button
//               type="submit"
//               className="w-full bg-lime-500 hover:bg-lime-600 text-white font-bold py-3 rounded-md transition"
//             >


//               Book Now
//             </button>

//           </form>
//         </div>

//       </div>
//     </div>
//   );
// };

// export default HotelDetails;
 import { Link } from "react-router-dom";

import React from "react";
import { useNavigate } from "react-router-dom";
import {
  FaWifi,
  FaTv,
  FaSnowflake,
  FaBath,
  FaConciergeBell,
  FaCouch,
  FaLaptop,
  FaWineBottle,
} from "react-icons/fa";

const HotelDetails = () => {
  const navigate = useNavigate();

  const rooms = [
    {
      id: 1,
      name: "Standard Room",
      price: 1200,
      image:
        "https://images.unsplash.com/photo-1505693314120-0d443867891c",
      description:
        "Comfortable room with essential amenities for a pleasant stay",
      amenities: [
        { icon: <FaWifi />, text: "Free WiFi" },
        { icon: <FaSnowflake />, text: "AC" },
        { icon: <FaConciergeBell />, text: "Room Service" },
        { icon: <FaTv />, text: "TV" },
        { icon: <FaBath />, text: "Attached Bathroom" },
      ],
    },
    {
      id: 2,
      name: "Deluxe Room",
      price: 1800,
      image:
        "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
      description:
        "Spacious room with premium furnishing and enhanced comfort",
      amenities: [
        { icon: <FaWifi />, text: "Free WiFi" },
        { icon: <FaSnowflake />, text: "AC" },
        { icon: <FaCouch />, text: "Premium Bedding" },
        { icon: <FaTv />, text: "Smart TV" },
        { icon: <FaWineBottle />, text: "Mini Fridge" },
       { icon: <FaLaptop />, text: "Work Desk" },
      ],
    },
  ];

  return (
    <div className="bg-gray-100">

      {/* 🔶 ORANGE HEADER */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-500 py-20 text-center text-white">
        <h1 className="text-5xl font-bold mb-4">Our Rooms</h1>
        <p className="text-xl">
          Choose from our range of comfortable accommodations
        </p>
      </div>

      {/* 🔶 ROOM CARDS */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-2 gap-10">

        {rooms.map((room) => (
          <div
            key={room.id}
            className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition duration-300"
          >

            {/* Image Section */}
            <div className="relative">
              <img
                src={room.image}
                alt={room.name}
                className="w-full h-72 object-cover"
              />

              {/* Price Badge */}
              <div className="absolute top-6 right-6 bg-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow">
                ₹{room.price}/night
              </div>
            </div>

            {/* Content Section */}
            <div className="p-8">

              {/* Title + Guests */}
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-2xl font-bold text-gray-800">
                  {room.name}
                </h2>
                <span className="text-gray-600 font-medium">
                  👥 2 Guests
                </span>
              </div>

              <p className="text-gray-600 mb-6">
                {room.description}
              </p>

              <h4 className="font-semibold mb-4 text-gray-800">
                Amenities:
              </h4>

              {/* Amenities Grid */}
              <div className="grid grid-cols-2 gap-3 mb-8 text-gray-700">
                {room.amenities.map((item, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <span className="text-orange-500">
                      {item.icon}
                    </span>
                    <span>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Book Button */}
      

<Link
  to="/booking"
  className="mt-6 w-full text-center bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-semibold transition"
>
  Book This Room
</Link>

            </div>
          </div>
        ))}

      </div>
    </div>
  );
};

export default HotelDetails;