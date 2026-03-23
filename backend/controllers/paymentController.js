import Razorpay from "razorpay";
import crypto from "crypto";
import Reservation from "../models/reservationModels.js";
import { assignAvailableRoomNumber } from "../utils/roomUtils.js";
import { sendBookingEmail } from "../utils/sendEmail.js";
import { sendWhatsappMessage } from "../utils/sendWhatsapp.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {

    

    const { totalAmount } = req.body;

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

   

    res.json(order);

  } catch (error) {

    console.log("CREATE ORDER ERROR:", error);

    res.status(500).json({ error: error.message });
  }
};



// ✅ VERIFY PAYMENT
export const verifyPayment = async (req, res) => {

  

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData,
    paymentMode
  } = req.body;

  try {

    // =========================
    // PAY AT HOTEL (ADMIN)
    // =========================

    let selections = [];
    if (bookingData.roomSelections && Array.isArray(bookingData.roomSelections)) {
        selections = bookingData.roomSelections;
    } else if (bookingData.roomId) {
        const qty = bookingData.numberOfRooms ? Number(bookingData.numberOfRooms) : 1;
        selections = [{ roomId: bookingData.roomId, roomName: bookingData.roomName, quantity: qty, price: bookingData.totalAmount / qty }];
    }

    const totalRoomsBooked = selections.reduce((acc, s) => acc + s.quantity, 0);

    if (paymentMode === "cash") {
      let assignedRoomNumbersText = [];
      
      for (const selection of selections) {
        const fallbackPrice = bookingData.totalAmount / totalRoomsBooked;
        const amountPerRoom = selection.price ? (selection.price * Math.ceil(
          ((new Date(bookingData.checkout + "T00:00:00")) - (new Date(bookingData.checkin + "T00:00:00"))) / (1000 * 60 * 60 * 24)
        )) : fallbackPrice;

        for (let i = 0; i < selection.quantity; i++) {
          let assignedRoomNumber = bookingData.roomNumber || null;
          if (totalRoomsBooked > 1) assignedRoomNumber = null;

          if (!assignedRoomNumber) {
            assignedRoomNumber = await assignAvailableRoomNumber(
              selection.roomId,
              new Date(bookingData.checkin + "T00:00:00"),
              new Date(bookingData.checkout + "T00:00:00")
            );
          }

          const reservation = new Reservation({
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            checkin: bookingData.checkin,
            checkout: bookingData.checkout,
            roomId: selection.roomId,
            roomName: selection.roomName,
            adults: Math.ceil(bookingData.adults / totalRoomsBooked),
            children: Math.ceil(bookingData.children / totalRoomsBooked),
            guests: Math.ceil((bookingData.guests || 0) / totalRoomsBooked),
            totalAmount: amountPerRoom,
            aadhaar: bookingData.aadhaar ? String(bookingData.aadhaar) : "",
            paymentId: "PAY_AT_HOTEL",
            roomNumber: assignedRoomNumber
          });

          await reservation.save();
          if (assignedRoomNumber) assignedRoomNumbersText.push(assignedRoomNumber);
        }
      }

      const bookingWithPayment = {
        ...bookingData,
        paymentId: "Cash",
        roomNumbersAllocated: assignedRoomNumbersText.join(", ")
      };
     
      await sendWhatsappMessage(bookingWithPayment);
      await sendBookingEmail(bookingWithPayment);

      return res.json({
        success: true,
        message: "Reservation created (Pay at Hotel)"
      });
    }

    // =========================
    // ONLINE PAYMENT
    // =========================

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      let assignedRoomNumbersText = [];

      for (const selection of selections) {
        const fallbackPrice = bookingData.totalAmount / totalRoomsBooked;
        const amountPerRoom = selection.price ? (selection.price * Math.ceil(
          ((new Date(bookingData.checkout + "T00:00:00")) - (new Date(bookingData.checkin + "T00:00:00"))) / (1000 * 60 * 60 * 24)
        )) : fallbackPrice;

        for (let i = 0; i < selection.quantity; i++) {
          let assignedOnlineRoomNumber = bookingData.roomNumber || null;
          if (totalRoomsBooked > 1) assignedOnlineRoomNumber = null;

          if (!assignedOnlineRoomNumber) {
            assignedOnlineRoomNumber = await assignAvailableRoomNumber(
              selection.roomId,
              new Date(bookingData.checkin + "T00:00:00"),
              new Date(bookingData.checkout + "T00:00:00")
            );
          }

          const reservation = new Reservation({
            name: bookingData.name,
            email: bookingData.email,
            phone: bookingData.phone,
            checkin: bookingData.checkin,
            checkout: bookingData.checkout,
            roomId: selection.roomId,
            roomName: selection.roomName,
            adults: Math.ceil(bookingData.adults / totalRoomsBooked),
            children: Math.ceil(bookingData.children / totalRoomsBooked),
            totalAmount: amountPerRoom,
            aadhaar: bookingData.aadhaar ? String(bookingData.aadhaar) : "",
            paymentId: razorpay_payment_id,        
            razorpayOrderId: razorpay_order_id,    
            paymentMode: "online",
            paymentStatus: "paid",
            roomNumber: assignedOnlineRoomNumber
          });

          await reservation.save();
          if (assignedOnlineRoomNumber) assignedRoomNumbersText.push(assignedOnlineRoomNumber);
        }
      }

      const bookingWithPayment = {
        ...bookingData,
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id,
        roomNumbersAllocated: assignedRoomNumbersText.join(", ")
      };

      await sendWhatsappMessage(bookingWithPayment);
      await sendBookingEmail (bookingWithPayment);
  
      return res.json({
        success: true,
        message: "Payment verified & reservation created"
      });

    } else {

      return res.status(400).json({
        success: false,
        message: "Payment verification failed"
      });

    }

  } catch (error) {

    console.log("SAVE ERROR:", error);

    res.status(500).json({
      error: error.message
    });

  }

};