import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
{
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },

  orderId: String,
  paymentId: String,

  paymentMode: {
    type: String,
    enum: ["online", "cash"],
    default: "online"
  },

  paymentStatus: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending"
  },

  totalAmount: {
    type: Number,
    required: true
  },

  checkin: { type: Date, required: true },
  checkout: { type: Date, required: true },

  aadhaar: {
    type: String,
    required: true,
  },
  razorpayOrderId: {
  type: String
},


  adults: { type: Number, required: true },
  children: { type: Number, required: true },

  roomName: { type: String, required: true },

  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "hotel",
    required: true
  },
roomNumber: {
  type: Number,
  default: null
}
},
{ timestamps: true }
);

export default mongoose.model("Reservation", reservationSchema);