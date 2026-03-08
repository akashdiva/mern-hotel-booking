import express from 'express'
import upload from "../middleware/multer.js"

import { 
  createReservation, 
  getAllReservation, 
  deleteReservation,
  getRoomReservations ,
  getRoomAvailability
} from '../controllers/reservationControllers.js'

const router = express.Router()



router.post("/create", upload.single("aadhaar"), createReservation)
router.get("/get", getAllReservation)
router.get("/room/:roomId", getRoomReservations)
router.delete("/delete/:id", deleteReservation)
router.get("/availability", getRoomAvailability);

export default router
