import Razorpay from "razorpay";
import crypto from "crypto";
import Reservation from "../models/reservationModels.js";
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

    if (paymentMode === "cash") {

      const reservation = new Reservation({
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        checkin: bookingData.checkin,
        checkout: bookingData.checkout,
        roomId: bookingData.roomId,
        roomName: bookingData.roomName,
        adults: bookingData.adults,
        children: bookingData.children,
        guests: bookingData.guests,
        totalAmount: bookingData.totalAmount,
        aadhaar: bookingData.aadhaar ? String(bookingData.aadhaar) : "",
        paymentId: "PAY_AT_HOTEL"
      });

      await reservation.save();

       const bookingWithPayment = {
    ...bookingData,
    paymentId: "Cash"
  };
     
await sendWhatsappMessage(bookingWithPayment);

 await sendBookingEmail(bookingWithPayment);

      return res.json({
        success: true,
        message: "Reservation created (Pay at Hotel)"
      });
    }


    // =========================
    // ONLINE PAYMENT (OLD FLOW)
    // =========================

    const secret = process.env.RAZORPAY_KEY_SECRET;

    const generated_signature = crypto
      .createHmac("sha256", secret)
      .update(razorpay_order_id + "|" + razorpay_payment_id)
      .digest("hex");

    if (generated_signature === razorpay_signature) {

   const reservation = new Reservation({
  name: bookingData.name,
  email: bookingData.email,
  phone: bookingData.phone,
  checkin: bookingData.checkin,
  checkout: bookingData.checkout,
  roomId: bookingData.roomId,
  roomName: bookingData.roomName,
  adults: bookingData.adults,
  children: bookingData.children,
  totalAmount: bookingData.totalAmount,
 aadhaar: bookingData.aadhaar ? String(bookingData.aadhaar) : "",

  paymentId: razorpay_payment_id,        
  razorpayOrderId: razorpay_order_id,    

  paymentMode: "online",
  paymentStatus: "paid"
});

      await reservation.save();

  const bookingWithPayment = {
  ...bookingData,
  paymentId: razorpay_payment_id,
  orderId: razorpay_order_id
};

await sendWhatsappMessage( bookingWithPayment);

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