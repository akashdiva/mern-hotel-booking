import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import HotelDetails from "./pages/HotelDetails";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import Rooms from "./pages/Rooms";
import Footer from "./components/Footer";
export const backendUrl="http://localhost:4000"

const App = () => {
  return (
    <div>
      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/room/:id" element={<HotelDetails />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
