import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialRooms = [
  { id: 1, type: "AC", status: "booked" },
  { id: 2, type: "AC", status: "available" },
  { id: 3, type: "AC", status: "booked" },
  { id: 4, type: "AC", status: "available" },
  { id: 5, type: "Family AC", status: "available" },
  { id: 6, type: "AC", status: "available" },
  { id: 7, type: "AC", status: "available" },
  { id: 8, type: "NonAC", status: "available" },
  { id: 9, type: "NonAC", status: "available" },
  { id: 10, type: "NonAC", status: "available" },
  { id: 11, type: "NonAC", status: "available" },
  { id: 12, type: "AC", status: "available" },
  { id: 13, type: "AC", status: "available" },
];

const RoomDashboard = () => {
  const navigate = useNavigate();

  const [rooms] = useState(initialRooms);

  const totalRooms = rooms.length;
  const bookedRooms = rooms.filter(room => room.status === "booked").length;
  const availableRooms = rooms.filter(room => room.status === "available").length;

  return (

    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER DASHBOARD */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-2xl shadow-lg mb-8">

        <div className="flex items-center gap-4 mb-6">
          <div className="bg-white/20 p-3 rounded-lg text-2xl">
            🏨
          </div>

          <div>
            <h1 className="text-3xl font-bold">Raghu Residency</h1>
            <p className="text-blue-200">Hotel Room Management</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-blue-500/40 p-6 rounded-xl">
            <p>Total Rooms</p>
            <h2 className="text-4xl font-bold">{totalRooms}</h2>
          </div>

          <div className="bg-red-500/40 p-6 rounded-xl">
            <p>Booked Rooms</p>
            <h2 className="text-4xl font-bold">{bookedRooms}</h2>
          </div>

          <div className="bg-green-500/40 p-6 rounded-xl">
            <p>Available Rooms</p>
            <h2 className="text-4xl font-bold">{availableRooms}</h2>
          </div>

        </div>

      </div>

      {/* ROOM GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {rooms.map(room => (

          <div
            key={room.id}
            className={`p-6 rounded-lg border flex flex-col justify-between
            ${
              room.status === "booked"
                ? "border-red-400 bg-red-50"
                : "border-green-400 bg-green-50"
            }`}
          >

            <div>

              <div className="flex justify-between mb-2">

                <h2 className="font-bold text-lg">
                  Room {room.id}
                </h2>

                <span
                  className={`text-xs px-3 py-1 rounded-full text-white
                  ${
                    room.status === "booked"
                      ? "bg-red-500"
                      : "bg-green-500"
                  }`}
                >
                  {room.status.toUpperCase()}
                </span>

              </div>

              <p className="text-gray-600">
                Type: {room.type}
              </p>

            </div>
{room.status === "available" && (

<button
  onClick={() =>
    window.location.href = `http://localhost:5173/booking/${room.id}?admin=true`
  }
  className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg"
>
  Book Now
</button>

)}
          </div>

        ))}

      </div>

    </div>

  );
};

export default RoomDashboard;