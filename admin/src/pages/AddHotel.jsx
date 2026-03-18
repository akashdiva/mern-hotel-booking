

import React, { useState } from "react";
import default_img from "../assets/upload_img.png";
import axios from "axios";
import { backendUrl } from "../App";
import { FaCheckCircle } from "react-icons/fa";

const AddHotel = ({ token }) => {
  const [image, setImage] = useState([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [popup, setPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalRooms, setTotalRooms] = useState("");
  const [maxAdults, setMaxAdults] = useState("");
const [maxChildren, setMaxChildren] = useState("");
const [roomNumbers, setRoomNumbers] = useState("");

  const roomSubmission = async (e) => {
    e.preventDefault();

      try {
    setLoading(true);

    // ✅ ADD THIS VALIDATION HERE
  if (!name || !description || !price || !totalRooms || !roomNumbers || image.length === 0){
      alert("Please fill all fields");
      setLoading(false);
      return;
    }

     
      const formData = new FormData();
formData.append("name", name);
formData.append("description", description);
formData.append("price", price);
formData.append("totalRooms", totalRooms); // ADD THIS
formData.append("maxAdults", maxAdults);
formData.append("maxChildren", maxChildren);
formData.append("roomNumbers", roomNumbers);

      image.forEach((img) => {
        formData.append("image", img);
      });

      const response = await axios.post(
        `${backendUrl}/api/hotel/add`,
        formData,
        { headers: { token } }
      );

      if (response.data.success) {
        setPopup(true);
     setName("");
setDescription("");
setPrice("");
setTotalRooms("");
setRoomNumbers("");
setImage([]);
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      {/* ✅ SUCCESS POPUP */}
      {popup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-[350px]">
            <FaCheckCircle className="text-green-500 text-5xl mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Room Added Successfully!
            </h2>
            <button
              onClick={() => setPopup(false)}
              className="mt-4 px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition"
            >
              OK
            </button>
          </div>
        </div>
      )}

      <form
        onSubmit={roomSubmission}
        className="flex flex-col items-start gap-5"
      >
        {/* Image Upload */}
        <div>
          <p className="mb-2 text-[20px] font-semibold">Upload Images</p>

          <label htmlFor="image" className="cursor-pointer">
            <div className="flex gap-3 flex-wrap">
              {image.length > 0 ? (
                image.map((img, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(img)}
                    alt=""
                    className="w-24 h-24 object-cover border rounded-md"
                  />
                ))
              ) : (
                <img
                  src={default_img}
                  alt=""
                  className="w-32 h-32 object-contain border rounded-md"
                />
              )}
            </div>
          </label>

          <input
            type="file"
            id="image"
            multiple
            hidden
            onChange={(e) => setImage([...e.target.files])}
          />
        </div>

        {/* Room Name */}
        <div className="w-full">
          <p className="mb-2 text-[20px] font-semibold">Room Name</p>
          <input
            type="text"
            placeholder="Enter room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full max-w-[500px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
          />
        </div>

        {/* Description */}
        <div className="w-full">
          <p className="mb-2 text-[20px] font-semibold">Room Description</p>
          <input
            type="text"
            placeholder="Enter room description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full max-w-[500px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
          />
        </div>

        {/* Price */}
        <div className="w-full">
          <p className="mb-2 text-[20px] font-semibold">Price</p>
          <input
            type="number"
            placeholder="40"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full max-w-[500px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
          />
        </div>

        {/* Total Rooms */}
<div className="w-full">
  <p className="mb-2 text-[20px] font-semibold">Total Rooms</p>
 <input
  type="number"
  placeholder="Enter total rooms (example: 8)"
  value={totalRooms}
  required
  min="1"
  onChange={(e) => setTotalRooms(e.target.value)}
  className="w-full max-w-[500px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
/>
</div>

<div className="w-full">
  <p className="mb-2 text-[20px] font-semibold">Room Numbers</p>

  <input
    type="text"
    placeholder="Example: 101,102,103,104"
    value={roomNumbers}
    onChange={(e) => setRoomNumbers(e.target.value)}
    className="w-full max-w-[500px] p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-fuchsia-500 outline-none"
  />

  <p className="text-sm text-gray-500 mt-1">
    Enter room numbers separated by commas
  </p>
</div>

<input
  type="number"
  placeholder="Max Adults"
  value={maxAdults}
  onChange={(e) => setMaxAdults(e.target.value)}
/>

<input
  type="number"
  placeholder="Max Children"
  value={maxChildren}
  onChange={(e) => setMaxChildren(e.target.value)}
/>

        {/* 🔥 Improved Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-6 px-12 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 
                     hover:from-purple-600 hover:to-fuchsia-600 
                     text-white font-semibold rounded-xl shadow-lg 
                     transition duration-300 transform hover:scale-105 
                     disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Adding..." : "Add Room"}
        </button>
      </form>
    </div>
  );
};

export default AddHotel;