import mongoose from "mongoose";

const HotelRateSchema = new mongoose.Schema({
  rating: {
    type: Number,
    min: 0,
  },
  hotelId: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
});

export default mongoose.model("HotelRates", HotelRateSchema);
