import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import { createError } from "../utils/error.js";
import { login } from "./authenticationController.js";
import Reservation from "../models/Reservation.js";

export const createRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  const newRoom = new Room(req.body);

  try {
    const savedRoom = await newRoom.save();
    try {
      await Hotel.findByIdAndUpdate(hotelId, {
        $push: { rooms: savedRoom._id },
      });
    } catch (error) {
      next(err);
    }
    res.status(200).json(savedRoom);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};
export const updateRoomAvailability = async (req, res, next) => {
  try {
    await Room.updateOne(
      { "roomNumbers._id": req.params.id },
      {
        $push: {
          "roomNumbers.$.unavailableDates": req.body.dates,
        },
      }
    );
    res.status(200).json("Room has been updated");
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  const hotelId = req.params.hotelId;
  try {
    console.log("room._id: ", req.params.id);
    const exist = await Room.findById(req.params.id);
    if (!exist) res.status(404).json("this room isn't found");

    const hotelId = await Hotel.findById(exist.hotelId);

    await Room.findByIdAndDelete(req.params.id);

    await Hotel.findByIdAndUpdate(hotelId, {
      $pull: { rooms: req.params.id },
    });

    // Use deleteMany to delete all reservations matching the query
    await Reservation.deleteMany({
      roomTypeId: req.params.id,
    });

    return res.status(200).json("Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getRoom = async (req, res, next) => {
  try {
    const existedRoom = await Room.findById(req.params.id);
    res.status(200).json(existedRoom);
  } catch (error) {
    next(error);
  }
};

export const getAllRooms = async (req, res, next) => {
  try {
    const allRooms = await Room.find();
    res.status(200).json(allRooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomNumbers = async (req, res, next) => {
  try {
    const { roomId, roomNumberId } = req.params;
    const room = await Room.findById(roomId);

    let foundRoomNumber = null;

    for (const roomNumber of room.roomNumbers) {
      if (roomNumber._id.toString() === roomNumberId) {
        foundRoomNumber = roomNumber;
        break;
      }
    }

    if (!foundRoomNumber) {
      return res.status(404).json({ message: "Room number not found" });
    }

    return res.status(200).json(foundRoomNumber);
  } catch (error) {
    next(error);
  }
};

export const deleteRoomReservation = async (req, res, next) => {
  try {
    //const hotelId = req.params.id;
    console.log("deleteRoomReservation");
    const roomId = req.params.id;
    const roomNumberId = req.params.roomNumberId;
    const startDate = new Date(req.params.startDate);
    const endDate = new Date(req.params.endDate);
    console.log(roomId, roomNumberId, startDate, endDate);

    const room = await Room.findById(req.params.id);
    console.log("room:", room);
    if (room) {
      let targetRoomNumber = null;
      for (const roomNumber of room?.roomNumbers) {
        console.log(roomNumber?._id?.toString(), roomNumberId);
        if (roomNumber?._id?.toString().trim() === roomNumberId.trim()) {
          console.log("found");
          targetRoomNumber = roomNumber;
          break;
        }
      }
      console.log("targetRoomNumber:", targetRoomNumber);
      if (targetRoomNumber === null)
        return res.status(404).json({ message: "room Number doesn't exist" });
      const roomNumberIndex = room.roomNumbers.findIndex(
        (roomNumber) => roomNumber?._id?.toString() === roomNumberId
      );

      const updatedUnavailableDates = targetRoomNumber.unavailableDates.filter(
        (date) => {
          console.log("date:", date, "\n");
          // Check if date is outside the range of startDate and endDate
          if (date) {
            return (
              date.getTime() < startDate.getTime() ||
              date.getTime() > endDate.getTime()
            );
          }
        }
      );
      console.log(updatedUnavailableDates);

      targetRoomNumber.unavailableDates = updatedUnavailableDates;
      console.log(11111111);
      await room.save();
    }
    res.status(200).json({ message: "Reservation Dates deleted successfully" });
  } catch (error) {
    next(error);
  }
};
