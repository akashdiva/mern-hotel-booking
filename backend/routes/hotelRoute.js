import express from "express";
import {
  addHotel,
  listHotel,
  removeHotel,
  singleHotel,
} from "../controllers/hotelControllers.js";
import upload from "../middleware/multer.js";

const hotelRouter = express.Router();

hotelRouter.post("/add", upload.array("image", 5), addHotel); 
hotelRouter.get("/list", listHotel);
hotelRouter.delete("/delete/:id", removeHotel);
hotelRouter.get("/rooms/:id", singleHotel);

export default hotelRouter;


