import React, { useState, useEffect } from "react";
import Login from "./Components/Login";
import { Route, Routes } from "react-router-dom";
import Sidebar from "./Components/Sidebar";
import AddHotel from "./pages/AddHotel";
import ListHotel from "./pages/ListHotel";
import Reservation from "./pages/Reservation";
import RoomDashboard from "./pages/RoomDashboard";
import AdminBooking from "./pages/AdminBooking"

export const backendUrl = "https://api.raghuresidency.in";

const App = () => {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }, [token]);

  return (
    <div className="bg-white min-h-screen">
      {!token ? (
        <Login setToken={setToken} />
      ) : (
        <div className="flex w-full">
          <Sidebar setToken={setToken} />

          <div className="w-[70%] ml-[max(5vw,25px)] my-8 text-black text-base">
            <Routes>
              <Route path="/add" element={<AddHotel token={token} />} />
              <Route path="/list" element={<ListHotel token={token} />} />
              <Route path="/reservation" element={<Reservation />} />
              <Route path="/rooms" element={<RoomDashboard />} />
              <Route path="/admin-booking" element={<AdminBooking />} />
            </Routes>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;