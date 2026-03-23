import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
export const backendUrl = "https://api.raghuresidency.in";


const initialRooms = [
  { id: 101, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },
  { id: 102, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },
  { id: 103, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },
  { id: 104, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },

  { id: 105, type: "Family AC", roomTypeId: "69bd3850e5b655e0db2fb5a0" },

  { id: 106, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },
  { id: 107, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },

  { id: 108, type: "Non A/C Rooms", roomTypeId: "69bd36fae5b655e0db2fb597" },
  { id: 109, type: "Non A/C Rooms", roomTypeId: "69bd36fae5b655e0db2fb597" },
  { id: 110, type: "Non A/C Rooms", roomTypeId: "69bd36fae5b655e0db2fb597" },
  { id: 111, type: "Non A/C Rooms", roomTypeId: "69bd36fae5b655e0db2fb597" },

  { id: 112, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },
  { id: 113, type: "A/C Rooms", roomTypeId: "69bd37e2e5b655e0db2fb59e" },
 
];

const RoomDashboard = () => {

  const [rooms] = useState(initialRooms);
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);



  /* FETCH RESERVATIONS */

  const fetchReservations = async () => {
    try {
      const res = await axios.get(`${backendUrl}/api/reservations/get`);

      console.log("Reservations from backend:", res.data);

      setReservations(res.data);

    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  /* AUTO REFRESH */

  useEffect(() => {
    const interval = setInterval(fetchReservations, 3000);
    return () => clearInterval(interval);
  }, []);

  /* DATE NORMALIZER */

  const normalize = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  };

  const getRoomStatus = (roomId) => {
    const today = normalize(new Date());
    let isReserved = false;

    for (const r of reservations) {

      if (Number(r.roomNumber) === Number(roomId)) {

        const checkin = normalize(r.checkin);
        const checkout = normalize(r.checkout);

        if (today >= checkin && today < checkout) {
          return "occupied";
        }

        if (today < checkin) {
          isReserved = true;
        }

      }
    }

    return isReserved ? "reserved" : "available";
  };
  /* DASHBOARD COUNTS */

  const totalRooms = rooms.length;

  const bookedRooms = rooms.filter(room =>
    getRoomStatus(room.id) !== "available"
  ).length;

  const availableRooms = rooms.filter(room =>
    getRoomStatus(room.id) === "available"
  ).length;


  return (

    <div className="p-4 sm:p-6 max-w-7xl mx-auto">

      {/* HEADER */}

      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 sm:p-8 rounded-2xl shadow-lg mb-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center md:text-left">
          Raghu Residency
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center md:text-left">

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

        {rooms.map((room) => {

          const status = getRoomStatus(room.id);

          return (

            <div
              key={room.id}
              className={`p-6 rounded-lg border flex flex-col justify-between
              ${status === "occupied"
                  ? "border-red-400 bg-red-50"
                  : status === "reserved"
                    ? "border-yellow-400 bg-yellow-50"
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
                    ${status === "occupied"
                        ? "bg-red-500"
                        : status === "reserved"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                  >
                    {
                      status === "occupied"
                        ? "OCCUPIED"
                        : status === "reserved"
                          ? "RESERVED"
                          : "AVAILABLE"
                    }
                  </span>

                </div>

                <p className="text-gray-600">
                  Type: {room.type}
                </p>

              </div>

              <button
                onClick={() =>
                  window.location.href =
                  "https://raghuresidency.in/admin/booking/" +
                  room.roomTypeId +
                  "?admin=true&roomNumber=" +
                  room.id
                }
                className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Book Now
              </button>

            </div>

          );

        })}

      </div>

    </div>

  );

};

export default RoomDashboard;