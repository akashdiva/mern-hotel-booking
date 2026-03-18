import reservationModels from "../models/reservationModels.js";
import hotelModel from "../models/hotelModels.js";

export const isRoomAvailable = async (roomId, checkin, checkout) => {

  const checkinDate = new Date(checkin + "T00:00:00");
  const checkoutDate = new Date(checkout + "T00:00:00");

  const room = await hotelModel.findById(roomId);

  if (!room) {
    return { available: false, message: "Room not found" };
  }

  const reservations = await reservationModels.find({
    roomId,
    checkin: { $lt: checkoutDate },
    checkout: { $gt: checkinDate },
  });

  let currentDate = new Date(checkinDate);

  while (currentDate < checkoutDate) {

    let roomsBookedForDay = 0;

    reservations.forEach((booking) => {
      const start = new Date(booking.checkin);
      start.setHours(0,0,0,0);

      const end = new Date(booking.checkout);
      end.setHours(0,0,0,0);

      if (currentDate >= start && currentDate < end) {
        roomsBookedForDay++;
      }
    });

    if (roomsBookedForDay >= room.totalRooms) {
      return {
        available: false,
        message: "Room not available for selected dates"
      };
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { available: true };
};