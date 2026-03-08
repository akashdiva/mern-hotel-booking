

import reservationModels from "../models/reservationModels.js";
import hotelModel from "../models/hotelModels.js";

const createReservation = async (req, res) => {
  
  try {
   const {
  name,
  email,
  phone,
  checkin,
  checkout,
  adults,
  children,
  roomId,
} = req.body;

    const aadhaarPath = req.file ? req.file.path : null;
      const checkinDate = new Date(checkin);
    checkinDate.setHours(0,0,0,0);

    const checkoutDate = new Date(checkout);
    checkoutDate.setHours(0,0,0,0);

  if (
  !name ||
  !email ||
  !phone ||
  !checkin ||
  !checkout ||
  !roomId ||
  !adults ||
  children === undefined ||
  !aadhaarPath
) {
  return res.status(400).json({ message: "All fields are required" });
}

    const room = await hotelModel.findById(roomId);

    if (!room) {
      return res.status(400).json({ message: "Room not found" });
    }


   // ✅ Capacity validation
if (adults > room.maxAdults || children > room.maxChildren) {
  return res.status(400).json({
    message: `Room allows only ${room.maxAdults} adults and ${room.maxChildren} children`,
  });
}

    // Find overlapping reservations
   const overlappingReservations = await reservationModels.find({
  roomId,
  checkin: { $lt: checkoutDate },
  checkout: { $gt: checkinDate },
});

    // Check if rooms available
    if (overlappingReservations.length >= room.totalRooms) {
      return res.status(400).json({
        message: "No rooms available for selected dates",
      });
    }

    const nights = Math.ceil(
      ((checkoutDate - checkinDate)) /
        (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    const totalAmount = nights * room.price;

    const newReservation = await reservationModels.create({
      name,
      email,
      phone,
     checkin: checkinDate,
checkout: checkoutDate,
      adults,
     children,
      roomName: room.name,
      roomId,
      aadhaar: aadhaarPath,
      totalAmount,
    });

    res.status(201).json(newReservation);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error creating reservation" });
  }
};



const getAllReservation =async(req,res)=>{

    try{
        const reservations =await reservationModels.find()
        res.json(reservations)
    }
    catch(error){
        console.log(error);
        res.json({message:"error fetching reservation"})
    }

}

const deleteReservation = async (req, res) => {
  try {
    const { id } = req.params;

    await reservationModels.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Reservation deleted successfully"
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error deleting reservation"
    });
  }
};

const getRoomReservations = async (req, res) => {
  try {
    const { roomId } = req.params;

    const reservations = await reservationModels.find(
      { roomId },
      { checkin: 1, checkout: 1 }
    );

    res.json(reservations);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching reservations" });
  }
};



const getRoomAvailability = async (req, res) => {
  try {
    const { roomId, checkin, checkout } = req.query;

    // Validate inputs
    if (!roomId || !checkin || !checkout) {
      return res.status(400).json({ message: "roomId, checkin and checkout are required" });
    }

    const checkinDate = new Date(checkin);
    const checkoutDate = new Date(checkout);

    // Validate date format
    if (isNaN(checkinDate) || isNaN(checkoutDate)) {
      return res.status(400).json({ message: "Invalid checkin or checkout date" });
    }

    const room = await hotelModel.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    const overlappingReservations = await reservationModels.find({
      roomId,
      checkin: { $lt: checkoutDate },
      checkout: { $gt: checkinDate },
    });

    const roomsLeft = room.totalRooms - overlappingReservations.length;

    res.json({
      totalRooms: room.totalRooms,
      bookedRooms: overlappingReservations.length,
      roomsLeft: roomsLeft < 0 ? 0 : roomsLeft,
    });

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error checking availability" });
  }
};

export {createReservation,getAllReservation,deleteReservation,getRoomReservations, getRoomAvailability}