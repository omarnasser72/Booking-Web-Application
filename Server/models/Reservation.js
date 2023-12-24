import mongoose from "mongoose";

const ReservationSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  hotelId: {
    type: String,
    required: true,
  },
  roomTypeId: {
    type: String,
    required: true,
  },
  roomNumberId: {
    type: String,
    required: true,
  },
  reservationDuration: {
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
  },
  cost: {
    type: Number,
    required: true,
  },
  payed: {
    type: Boolean,
    required: true,
    default: false,
  },
});

export default mongoose.model("Reservation", ReservationSchema);
