import reservationModels from "../models/reservationModels.js";
import hotelModel from "../models/hotelModels.js";

export const assignAvailableRoomNumber = async (roomId, checkinDate, checkoutDate) => {
  const room = await hotelModel.findById(roomId);
  if (!room || !room.roomNumbers || room.roomNumbers.length === 0) {
    return null; // Fallback if no room numbers are specified
  }

  const existingReservations = await reservationModels.find({
    roomId,
    checkin: { $lt: checkoutDate },
    checkout: { $gt: checkinDate }
  });

  const usedRoomNumbers = existingReservations
    .map(res => res.roomNumber)
    .filter(num => num !== null && num !== undefined);

  const availableRoomNumbers = room.roomNumbers.filter(
    num => !usedRoomNumbers.includes(num)
  );

  if (availableRoomNumbers.length > 0) {
    return availableRoomNumbers[0];
  }

  return null; // Fallback if full (should have been caught earlier)
};
