import Hotel from "../models/Hotel.js";
import Reservation from "../models/Reservation.js";
import Room from "../models/Room.js";
import { createError } from "../utils/error.js";
import { deleteRoom } from "./roomController.js";

export const createHotel = async (req, res, next) => {
  const newHotel = new Hotel(req.body);

  const hotelNameExist = await Hotel.find({
    name: req.body.name,
  });
  if (hotelNameExist.length > 0)
    return next(createError(400, "Hotel Name Already exists"));

  try {
    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const updatedData = req.body;
    const previousState = await Hotel.findById(req.params.id);
    const rate = (req.body.rating + previousState.rating) % 5;
    updatedData.rating = isNaN(rate) ? 0 : rate;

    console.log(updatedData.rating);

    const currentHotel = await Hotel.findById(req.params.id);
    const nameExist = await Hotel.find({
      _id: { $ne: currentHotel._id },
      name: req.body.name,
    });
    if (nameExist.length > 0) next(createError(400, "Name Already exists"));

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      {
        $set: updatedData,
      },
      { new: true }
    );

    res.status(200).json(updatedHotel);
  } catch (error) {
    next(error);
  }
};

const deleteRoomForHotel = async (req, res, next) => {
  try {
    console.log("room._id: ", req.params.id);
    const exist = await Room.findById(req.params.id);
    if (!exist) res.status(404).json("this room isn't found");

    const hotelId = await Hotel.findById(exist.hotelId);

    await Room.findByIdAndDelete(req.params.id);

    await Hotel.findByIdAndUpdate(hotelId, {
      $pull: { rooms: req.params.id },
    });

    await Reservation.deleteMany({
      roomTypeId: req.params.id,
    });

    console.log(exist, "deleted successfully");
  } catch (error) {
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotelId = req.params.id;
    const hotel = await Hotel.findById(hotelId);
    console.log("hotel: ", hotel);
    const rooms = hotel?.rooms;

    for (const room of rooms) {
      try {
        req.params.id = room; // Update the parameter for the room being deleted
        await deleteRoomForHotel(req, res, next);
      } catch (error) {
        next(error);
      }
    }

    await Hotel.findByIdAndDelete(hotelId);

    return res.status(200).json("Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getHotel = async (req, res, next) => {
  try {
    const existedHotel = await Hotel.findById(req.params.id);
    res.status(200).json(existedHotel);
  } catch (error) {
    next(error);
  }
};

export const getAllHotles = async (req, res, next) => {
  try {
    const maxLimit = req.query.max;
    const allHotels = await Hotel.find().limit(Number(maxLimit));
    res.status(200).json(allHotels);
  } catch (error) {
    next(error);
  }
};

export const getHotels = async (req, res, next) => {
  const { min, max, city } = req.query;
  try {
    const hotels = await Hotel.find({
      city: { $regex: `^${city}`, $options: "i" },
      cheapestPrice: { $gt: min, $lt: max },
    });
    res.status(200).json(hotels);
  } catch (error) {
    next(error);
  }
};

export const countByCity = async (req, res, next) => {
  const cities = await req.query.cities.split(",");
  try {
    const list = await Promise.all(
      cities.map((city) => {
        return Hotel.countDocuments({ city: city });
      })
    );
    res.status(200).json(list);
  } catch (error) {
    next(error);
  }
};

export const countByType = async (req, res, next) => {
  try {
    const hotelCount = await Hotel.countDocuments({ type: "hotel" });
    const apartmentCount = await Hotel.countDocuments({ type: "apartment" });
    const resortCount = await Hotel.countDocuments({ type: "resort" });
    const villaCount = await Hotel.countDocuments({ type: "villa" });
    const cabinCount = await Hotel.countDocuments({ type: "cabin" });

    res.status(200).json([
      { type: "hotel", count: hotelCount },
      { type: "apartment", count: apartmentCount },
      { type: "resort", count: resortCount },
      { type: "villa", count: villaCount },
      { type: "cabin", count: cabinCount },
    ]);
  } catch (error) {
    next(error);
  }
};

export const getHotelRooms = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    const roomsList = await Promise.all(
      hotel.rooms.map((room) => {
        return Room.findById(room);
      })
    );
    const filteredRoomsList = roomsList.filter(Boolean);
    res.status(200).json(filteredRoomsList);
  } catch (error) {
    next(error);
  }
};
