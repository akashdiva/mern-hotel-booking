import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Homepage from "./pages/Homepage";
import HotelDetails from "./pages/HotelDetails";
import BookingPage from "./pages/BookingPage";
import ContactPage from "./pages/ContactPage";
import ScrollToTop from "./components/ScrollToTop";
import Rooms from "./pages/Rooms";
import Footer from "./components/Footer";

//export const backendUrl = import.meta.env.VITE_BACKEND_URL;
//export const backendUrl="http://localhost:4000";
export const backendUrl = "https://api.raghuresidency.in";
const App = () => {
  console.log(import.meta.env.VITE_BACKEND_URL);
  return (
    <div>

      <ScrollToTop />  

      <Navbar />

      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/room/:id" element={<HotelDetails />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/booking/:id" element={<BookingPage />} />
        <Route path="/admin/booking/:id" element={<BookingPage />} />
        <Route path="/contact" element={<ContactPage />} />
      </Routes>

      <Footer />

    </div>
  );
};


export default App;