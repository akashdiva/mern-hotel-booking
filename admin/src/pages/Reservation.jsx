import React, { useState, useEffect } from "react";
import axios from "axios";
import { backendUrl } from "../App";

const Reservation = () => {
  const [reservations, setReservations] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  // 🔹 Fetch reservations
  const fetchReservations = async () => {
    try {
      const response = await axios.get(
        backendUrl + "/api/reservations/get"
      );
      setReservations(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  // 🔹 Delete reservation
 const handleDelete = async (id) => {
  try {
    const response = await axios.delete(
      `${backendUrl}/api/reservations/delete/${id}`
    );

    if (response.data) {
      alert("Reservation deleted successfully");
      fetchReservations(); // refresh list
    }

  } catch (error) {
    console.log(error);
    alert("Delete failed");
  }
};


  return (
    <div className="min-h-screen">
      <h2 className="text-3xl font-bold text-gray-700 text-center mb-6">
        Room Reservation
      </h2>

      <div className="overflow-x-auto">
        <table className="w-full shadow-lg rounded-xl">
          <thead>
            <tr className="bg-fuchsia-600 text-left text-white">
              <th className="p-3">Room Name</th>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Guests</th>
              <th className="p-3">Check-in</th>
              <th className="p-3">Check-out</th>
               <th className="p-3">Aadhaar</th> 
              <th className="p-3">Delete</th>
            </tr>
          </thead>

          <tbody>
            {reservations.length === 0 ? (
              <tr>
                <td colSpan="8" className="p-4 text-center">
                  No Reservations Available
                </td>
              </tr>
            ) : (
              reservations.map((res) => (
                <tr
                  key={res._id}
                  className="border-b hover:bg-gray-300"
                >
                  <td className="p-3">{res.roomName}</td>
                  <td className="p-3">{res.name}</td>
                  <td className="p-3">{res.email}</td>
                  <td className="p-3">{res.phone}</td>
                  <td className="p-3">{res.guests}</td>
                 <td className="p-3">
  {new Date(res.checkin).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  })}
</td>

<td className="p-3">
  {new Date(res.checkout).toLocaleDateString("en-IN", {
    timeZone: "Asia/Kolkata",
  })}
</td>
<td className="p-3">
  {res.aadhaar ? (
  <img 
    src={`${backendUrl}/${res.aadhaar}`} 
    alt="Aadhaar"
    className="w-16 h-12 md:w-20 md:h-14 object-cover rounded shadow cursor-pointer hover:opacity-80 transition-opacity border"
    onClick={() => setSelectedImage(`${backendUrl}/${res.aadhaar}`)}
  />
  ) : (
    "No Image"
  )}
</td>
                  <td className="p-3">
                    <button
                      onClick={() => handleDelete(res._id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Full Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              className="absolute -top-12 right-0 text-white text-4xl font-bold hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              &times;
            </button>
            <img 
              src={selectedImage} 
              alt="Aadhaar Full Size" 
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl bg-white" 
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Reservation;
