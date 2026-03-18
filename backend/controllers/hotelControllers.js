import hotelModel from "../models/hotelModels.js";
import { v2 as cloudinary } from "cloudinary";
import reservationModel from "../models/reservationModels.js";

const addHotel = async (req, res) => {
  try {
   const { name, description, price, totalRooms, maxAdults, maxChildren } = req.body;


   const roomNumbersArray = req.body.roomNumbers
  .split(",")
  .map(num => Number(num.trim()));

    const images = req.files; // ✅ changed from req.file

    let imageUrls = [];

    if (images && images.length > 0) {

      // Upload each image to Cloudinary
      for (let file of images) {
        let result = await cloudinary.uploader.upload(file.path, {
          resource_type: "image"
        });

        imageUrls.push(result.secure_url);
      }

    } else {
      imageUrls.push("https://via.placeholder.com/150");
    }

const hotelData = {
  name,
  description,
  price: Number(price),
  totalRooms: Number(totalRooms),
  maxAdults: Number(maxAdults),
  maxChildren: Number(maxChildren),
    roomNumbers: roomNumbersArray,
  image: imageUrls,
  date: Date.now()
};


    const hotel = new hotelModel(hotelData);
    await hotel.save();

    res.json({
      success: true,
      message: "Hotel room added successfully"
    });

  } catch (error) {
    console.log("ADD HOTEL ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const listHotel = async (req, res) => {
  try {

    const { checkin, checkout } = req.query;

    const hotels = await hotelModel.find({});

    const updatedHotels = await Promise.all(
      hotels.map(async (hotel) => {

        let bookedRooms = 0;

        if (checkin && checkout) {

          bookedRooms = await reservationModel.countDocuments({
            roomId: hotel._id,
            checkin: { $lt: new Date(checkout) },
            checkout: { $gt: new Date(checkin) }
          });

        }

        const availableRooms = hotel.totalRooms - bookedRooms;

        return {
          ...hotel._doc,
          availableRooms: availableRooms < 0 ? 0 : availableRooms
        };

      })
    );

    res.json({ success: true, hotels: updatedHotels });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error fetching rooms" });
  }
};

const removeHotel = async (req, res) => {
  try {
    const { id } = req.params;

    await hotelModel.findByIdAndDelete(id);

    res.json({
      success: true,
      message: "Hotel deleted successfully"
    });

  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error deleting hotel"
    });
  }
};

const singleHotel = async (req, res) => {
     try{
  const hotel =await hotelModel.findById(req.params.id)
  if(!hotel) return res.json({message :"Room not found"})
    res.json({hotel})
     }
     catch(error){
        console.log(error);
        res.json({success:false,message:"Error fetching specific hotel room"})

     }
};

export { addHotel, listHotel, removeHotel, singleHotel };
