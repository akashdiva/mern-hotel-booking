import Razorpay from "razorpay";
import crypto from "crypto";
import Reservation from "../models/reservationModels.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ CREATE ORDER
export const createOrder = async (req, res) => {
  try {

    const { totalAmount } = req.body;

    const options = {
      amount: totalAmount * 100, // Razorpay uses paise
      currency: "INR",
      receipt: "receipt_" + Date.now(),
    };

    const order = await razorpay.orders.create(options);

    res.json(order);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
// ✅ VERIFY PAYMENT



export const verifyPayment = async (req, res) => {
   console.log("VERIFY PAYMENT BODY:", req.body);

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    bookingData
  } = req.body;

  const secret = process.env.RAZORPAY_KEY_SECRET;

  const generated_signature = crypto
    .createHmac("sha256", secret)
    .update(razorpay_order_id + "|" + razorpay_payment_id)
    .digest("hex");

  if (generated_signature === razorpay_signature) {

    try {

      // 👉 SAVE RESERVATION HERE
     
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
  paymentId: razorpay_payment_id
});
     

      await reservation.save();

      res.json({
        success: true,
        message: "Payment verified & reservation created"
      });

    } catch (error) {
    console.log("SAVE ERROR:", error);
res.status(500).json({ error: error.message });
    }

  } else {
    res.status(400).json({
      success: false,
      message: "Payment verification failed"
    });
  }
};