

import reservationModels from "../models/reservationModels.js";
import hotelModel from "../models/hotelModels.js";
import { assignAvailableRoomNumber } from "../utils/roomUtils.js";



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
  paymentMethod
} = req.body;

let roomSelections = [];
if (req.body.roomSelections) {
  roomSelections = typeof req.body.roomSelections === 'string' 
    ? JSON.parse(req.body.roomSelections) 
    : req.body.roomSelections;
} else if (req.body.roomId) {
  const qty = req.body.numberOfRooms ? Number(req.body.numberOfRooms) : 1;
  roomSelections = [{ roomId: req.body.roomId, quantity: qty, price: 0 }];
}

let roomNumber = req.body.roomNumber ? Number(req.body.roomNumber) : null;

  console.log("Body keys:", Object.keys(req.body));
console.log("RoomNumber value:", req.body.roomNumber);
  console.log("Room Number received:", roomNumber);
   console.log("Incoming reservation request");
  console.log("Body:", req.body);
  console.log("AADHAAR FROM BODY:", req.body.aadhaarPath);
console.log("AADHAAR FROM FILE:", req.file);
  console.log("File:", req.file);



const aadhaarPath = req.body.aadhaarPath || (req.file ? req.file.path : null);
    console.log("aadhar ",req.file)
const checkinDate = new Date(checkin + "T00:00:00");
const checkoutDate = new Date(checkout + "T00:00:00");

console.log({
  name,
  email,
  phone,
  checkin,
  checkout,
  roomId,
  adults,
  children,
  aadhaarPath
});

  if (
  !name ||
  !email ||
  !phone ||
  !checkin ||
  !checkout ||
  roomSelections.length === 0 ||
  !adults ||
  children === undefined ||
  !aadhaarPath
) {
  return res.status(400).json({ message: "All fields are required" });
}

  if (roomNumber) {
    const existingRoomBooking = await reservationModels.findOne({
      roomNumber,
      checkin: { $lt: checkoutDate },
      checkout: { $gt: checkinDate }
    });
    if (existingRoomBooking) {
      return res.status(400).json({
        message: `Room ${roomNumber} is already booked for the selected dates`
      });
    }
  }

  // ✅ Multi-Room Capacity & Availability Validation
  let maxA = 0;
  let maxC = 0;

  for (const selection of roomSelections) {
    const room = await hotelModel.findById(selection.roomId);
    if (!room) return res.status(400).json({ message: "Room not found" });

    maxA += room.maxAdults * selection.quantity;
    maxC += room.maxChildren * selection.quantity;

    let reservations;
    if (roomNumber && roomSelections.length === 1 && selection.quantity === 1) {
      reservations = await reservationModels.find({
        roomNumber, checkin: { $lt: checkoutDate }, checkout: { $gt: checkinDate },
      });
    } else {
      reservations = await reservationModels.find({
        roomId: selection.roomId, checkin: { $lt: checkoutDate }, checkout: { $gt: checkinDate },
      });
    }

    let currentDate = new Date(checkinDate);
    while (currentDate < checkoutDate) {
      let roomsBookedForDay = 0;
      reservations.forEach((booking) => {
        const start = new Date(booking.checkin); start.setHours(0,0,0,0);
        const end = new Date(booking.checkout); end.setHours(0,0,0,0);
        if (currentDate >= start && currentDate < end) {
          roomsBookedForDay++;
        }
      });
      if (roomsBookedForDay + selection.quantity > room.totalRooms) {
        return res.status(400).json({ message: `Not enough availability for ${room.name}` });
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
  }

  if (adults > maxA || children > maxC) {
    return res.status(400).json({ message: `Exceeded max capacity of ${maxA} adults and ${maxC} children.` });
  }

  // Check if rooms available
  

    const nights = Math.ceil(
      ((checkoutDate - checkinDate)) /
        (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return res.status(400).json({ message: "Invalid booking dates" });
    }

    let paymentStatus = paymentMethod === "online" ? "paid" : "pending";

    const createdReservations = [];
    const totalRoomsBooked = roomSelections.reduce((acc, s) => acc + s.quantity, 0);

    for (const selection of roomSelections) {
      const room = await hotelModel.findById(selection.roomId);
      const amountPerRoom = selection.price ? (selection.price * nights) : (room.price * nights);

      for (let i = 0; i < selection.quantity; i++) {
        let currentRoomNumber = roomNumber;
        if (totalRoomsBooked > 1) currentRoomNumber = null;

        if (!currentRoomNumber) {
          currentRoomNumber = await assignAvailableRoomNumber(selection.roomId, checkinDate, checkoutDate);
        }

        const newRes = await reservationModels.create({
          name,
          email,
          phone,
          checkin: checkinDate,
          checkout: checkoutDate,
          adults: Math.ceil(adults / totalRoomsBooked),
          children: Math.ceil(children / totalRoomsBooked),
          roomName: room.name,
          roomId: selection.roomId,
          roomNumber: currentRoomNumber,
          aadhaar: aadhaarPath,
          totalAmount: amountPerRoom,
          paymentMode: paymentMethod,
          paymentStatus
        });
        createdReservations.push(newRes);
      }
    }

    res.status(201).json(createdReservations.length === 1 ? createdReservations[0] : createdReservations);

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
      { checkin: 1, checkout: 1, roomNumber: 1 }
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

    console.log("Incoming query:", { roomId, checkin, checkout });

    if (!roomId || !checkin || !checkout) {
      console.log("Missing required fields");
      return res.status(400).json({
        message: "roomId, checkin and checkout are required",
      });
    }

    const checkinDate = new Date(checkin + "T00:00:00");
    const checkoutDate = new Date(checkout + "T00:00:00");

    console.log("Parsed Dates:", { checkinDate, checkoutDate });

    if (isNaN(checkinDate) || isNaN(checkoutDate)) {
      console.log("Invalid date format");
      return res.status(400).json({
        message: "Invalid checkin or checkout date",
      });
    }

    const room = await hotelModel.findById(roomId);

    console.log("Fetched room:", room);

    if (!room) {
      console.log("Room not found");
      return res.status(404).json({ message: "Room not found" });
    }

    const reservations = await reservationModels.find({
      roomId,
      checkin: { $lt: checkoutDate },
      checkout: { $gt: checkinDate },
    });

    console.log("Matching reservations:", reservations);

    let maxRoomsBooked = 0;
    let currentDate = new Date(checkinDate);

    while (currentDate < checkoutDate) {
      console.log("Checking date:", currentDate);

      let roomsBookedForDay = 0;

      reservations.forEach((booking) => {
        const start = new Date(booking.checkin);
        const end = new Date(booking.checkout);

        console.log("Booking range:", { start, end });

        if (currentDate >= start && currentDate < end) {
          roomsBookedForDay++;
        }
      });

      console.log("Rooms booked for this day:", roomsBookedForDay);

      if (roomsBookedForDay > maxRoomsBooked) {
        maxRoomsBooked = roomsBookedForDay;
      }

      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("Max rooms booked in range:", maxRoomsBooked);

    const roomsLeft = room.totalRooms - maxRoomsBooked;

    console.log("Final availability:", {
      totalRooms: room.totalRooms,
      bookedRooms: maxRoomsBooked,
      roomsLeft: roomsLeft < 0 ? 0 : roomsLeft,
    });

    res.json({
      totalRooms: room.totalRooms,
      bookedRooms: maxRoomsBooked,
      roomsLeft: roomsLeft < 0 ? 0 : roomsLeft,
    });

  } catch (error) {
    console.log("Error occurred:", error);
    res.status(500).json({ message: "Error checking availability" });
  }
};

export {createReservation,getAllReservation,deleteReservation,getRoomReservations, getRoomAvailability}