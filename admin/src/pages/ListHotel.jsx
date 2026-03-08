import React, { useState, useEffect } from "react";
import { backendUrl } from "../App";
import { MdDeleteForever } from "react-icons/md";
import axios from "axios";

const ListHotel = ({ token }) => {
  const [list, setList] = useState([]);

  // 🔹 Fetch hotel rooms
  const fetchRoomList = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/hotel/list",
        { headers: { token } }
      );

      if (response.data.success) {
        setList(response.data.hotels);
      } else {
        console.log(response.data.message);
      }

    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchRoomList();
  }, []);

  // 🔹 Delete hotel room
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${backendUrl}/api/hotel/delete/${id}`,
        { headers: { token } }
      );

      if (response.data.success) {
        alert("Room deleted successfully");

        // Remove from UI instantly
        setList((prev) =>
          prev.filter((item) => item._id !== id)
        );

      } else {
        alert(response.data.message);
      }

    } catch (error) {
      console.log(error);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <p className="mb-2 font-bold text-2xl">
        Hotel Rooms List
      </p>

      <div className="flex flex-col gap-2">

        {/* Header */}
       <div className="grid grid-cols-[1fr_2fr_3fr_1fr_1fr] items-center p-2 border-b-2 border-gray-300 text-lg font-semibold">
          <b>Image</b>
<b>Room Name</b>
<b>Description</b>
<b>Price</b>
<b className="text-center">Delete</b>
        </div>

        {/* Room List */}
        {list.length === 0 ? (
          <p className="text-center p-4">
            No Rooms Available
          </p>
        ) : (
          list.map((item) => (
            <div
              key={item._id}
             className="grid grid-cols-[1fr_2fr_3fr_1fr_1fr] items-center p-2 border-b-2 border-gray-300 text-lg"
            >
  <img
  src={
    Array.isArray(item.image)
      ? item.image[0]
      : item.image
  }
  alt={item.name}
  className="w-[50px] h-[50px] object-cover rounded"
/>

              <p>{item.name}</p>
               <p> {item.description}</p>

             <p>₹{item.price}</p>

              <MdDeleteForever
                onClick={() => handleDelete(item._id)}
                className="ml-10 text-[28px] cursor-pointer text-red-600 hover:text-red-800 transition"
              />
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default ListHotel;
