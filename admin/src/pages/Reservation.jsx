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

  // 🔹 Download Aadhaar Image (Bypassing CORS by using a backend endpoint)
  const handleDownload = (imageUrl) => {
    try {
      // Extract filename from the URL, e.g., "1773896274698.jpeg"
      const filename = imageUrl.split("/").pop();
      if (!filename) {
        throw new Error("Invalid image URL");
      }

      // Hit our new backend endpoint that forces a download
      const downloadUrl = `${backendUrl}/api/aadhaar/download/${filename}`;

      const link = document.createElement("a");
      link.href = downloadUrl;
      link.target = "_blank"; // Opens in new tab so if not deployed, it doesn't break current page
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error("Download failed:", error);
      // Fallback: open in new tab
      window.open(imageUrl, "_blank");
    }
  };

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

      <div className="overflow-x-auto w-full">
        <table className="w-full min-w-[800px] shadow-lg rounded-xl text-sm md:text-base">
          <thead>
            <tr className="bg-fuchsia-600 text-left text-white whitespace-nowrap">
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
              className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl bg-white" 
            />
            <button
              onClick={() => handleDownload(selectedImage)}
              className="mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-2 px-6 rounded shadow transition-colors"
            >
              Download
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Reservation;
