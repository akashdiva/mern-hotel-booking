import React, { createContext, useState,useEffect } from "react";
import { roomData } from "../assets/asset";
import axios from "axios"
import { backendUrl } from "../App";

export const RoomContext = createContext();

const RoomContextProvider = ({ children }) => {
  const [rooms, setRooms] = useState(roomData);
 const fetchHotelRoom = async (checkin, checkout) => {
  try {

    let url = `${backendUrl}/api/hotel/list`;

    // If dates exist send them to backend
    if (checkin && checkout) {
      url += `?checkin=${checkin}&checkout=${checkout}`;
    }

    const response = await axios.get(url);

    if (response.data.success) {
      setRooms(response.data.hotels);
    } else {
      console.log(response.data.message);
    }

  } catch (error) {
    console.log(error);
  }
};

useEffect(() => {

  const checkin = localStorage.getItem("checkin");
  const checkout = localStorage.getItem("checkout");

  if (checkin && checkout) {
    fetchHotelRoom(checkin, checkout);
  } else {
    fetchHotelRoom();
  }

}, []);


  return (
   
  <RoomContext.Provider value={{ rooms, fetchHotelRoom }}>
    {children}
  </RoomContext.Provider>

  );
};

export default RoomContextProvider;
