import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialRooms = [
  { id: 101, type: "AC", capacity: 1, status: "booked", guest: "Rajesh Kumar" },
  { id: 102, type: "AC", capacity: 2, status: "available" },
  { id: 103, type: "AC", capacity: 4, status: "booked", guest: "Priya Sharma" },
  { id: 104, type: "AC", capacity: 2, status: "available" },
  { id: 105, type: "Family AC", capacity: 1, status: "available" },
  { id: 106, type: "AC", capacity: 2, status: "booked", guest: "Amit Patel" },
  { id: 107, type: "AC", capacity: 4, status: "available" },
  { id: 108, type: "NonAC", capacity: 2, status: "available" },
  { id: 109, type: "NonAC", capacity: 2, status: "available" },
  { id: 110, type: "NonAC", capacity: 2, status: "available" },
  { id: 111, type: "NonAC", capacity: 2, status: "available" },
  { id: 112, type: "AC", capacity: 2, status: "available" },
  { id: 113, type: "AC", capacity: 2, status: "available" },
];

const RoomDashboard = () => {

  const [rooms, setRooms] = useState(initialRooms);
  const [filter, setFilter] = useState("all");

  const totalRooms = rooms.length;
  const bookedRooms = rooms.filter(r => r.status === "booked").length;
  const availableRooms = rooms.filter(r => r.status === "available").length;

  const navigate = useNavigate();

  // Toggle room status
  const toggleRoomStatus = (roomId) => {

    const updatedRooms = rooms.map(room => {

      if (room.id === roomId) {

        if (room.status === "booked") {
          return { ...room, status: "available", guest: null };
        } else {
          const guestName = prompt("Enter guest name:");
          return { ...room, status: "booked", guest: guestName || "Guest" };
        }

      }

      return room;

    });

    setRooms(updatedRooms);
  };

  // Filter logic
  const filteredRooms = rooms.filter(room => {
    if (filter === "booked") return room.status === "booked";
    if (filter === "available") return room.status === "available";
    return true;
  });

  return (

    <div className="p-6 max-w-7xl mx-auto">

      {/* HEADER */}
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

          <div className="bg-purple-500/40 border border-red-400 p-6 rounded-xl">
            <p>Booked Rooms</p>
            <h2 className="text-4xl font-bold">{bookedRooms}</h2>
          </div>

          <div className="bg-blue-500/40 border border-green-400 p-6 rounded-xl">
            <p>Available Rooms</p>
            <h2 className="text-4xl font-bold">{availableRooms}</h2>
          </div>

        </div>

      </div>

      {/* FILTER */}
      <div className="flex items-center gap-4 mb-6">

        <span className="font-medium">🔎 Filter:</span>

        <button
          onClick={() => setFilter("all")}
          className={`px-5 py-2 rounded-lg ${
            filter === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          All Rooms
        </button>

        <button
          onClick={() => setFilter("booked")}
          className={`px-5 py-2 rounded-lg ${
            filter === "booked"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Booked
        </button>

        <button
          onClick={() => setFilter("available")}
          className={`px-5 py-2 rounded-lg ${
            filter === "available"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Available
        </button>

      </div>

      {/* ROOMS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

        {filteredRooms.map(room => (

          <div
            key={room.id}
            className={`p-6 rounded-lg border flex flex-col justify-between min-h-[230px]
            ${
              room.status === "booked"
                ? "border-red-400 bg-red-50"
                : "border-green-400 bg-green-50"
            }`}
          >

            <div>

              <div className="flex justify-between mb-2">

                <h2 className="font-bold text-lg">Room {room.id}</h2>

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

              <p className="text-gray-500">{room.type}</p>

              <p className="text-sm mt-2">
                Capacity: {room.capacity} guests
              </p>

              {room.status === "booked" && (
                <p className="text-sm mt-2">
                  Guest: {room.guest}
                </p>
              )}

            </div>

       <button
  onClick={() =>
    window.location.href = `http://localhost:5173/booking/${room.id}`
  }
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  Mark as Booked
</button>

          </div>

        ))}

      </div>

    </div>

  );
};

export default RoomDashboard;