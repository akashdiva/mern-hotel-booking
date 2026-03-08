import React from "react";
import Hero from "../components/Hero";
import HotelList from "../components/HotelList";
import Facility from "../components/Facility";
import InfoBar from "../components/InfoBar";
import AboutSection from "../components/AboutSection";
import Amenities from "../components/Amenities";
import Reviews from "../components/Reviews";
import BookingCTA from "../components/BookingCTA";



const Homepage = () => {
  return (
    <>
      <Hero />
      <InfoBar/>
       <AboutSection/>
       <Amenities/>
       <Reviews/>
       <BookingCTA/>
     
     
     
      
    </>
  );
};

export default Homepage;
