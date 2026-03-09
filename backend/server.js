import express from "express"
import cors from "cors"
import "dotenv/config"

import connectDB from "./config/mongodb.js"
import connectCloudinary from "./config/cloudinary.js"

import hotelRouter from "./routes/hotelRoute.js"
import reservationRoute from "./routes/reservationRoute.js"
import userRouter from "./routes/userRoute.js"
import paymentRoute from "./routes/paymentRoute.js"
import aadhaarRoute from "./routes/aadhaarRoute.js"

const app = express()
const port = process.env.PORT || 4000

// DB connections
connectDB()
connectCloudinary()

// Middlewares
app.use(cors({
  origin: "https://raghuresidency.in",
  credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use("/uploads", express.static("uploads"))

// Routes
app.use("/api/hotel", hotelRouter)
app.use("/api/reservations", reservationRoute)
app.use("/api/user", userRouter)
app.use("/api/aadhaar", aadhaarRoute)
app.use("/api/payment", paymentRoute)

// Test route
app.get("/", (req,res)=>{
  res.send("API Working")
})

app.listen(port, ()=>{
  console.log("Server started on Port: " + port)
})