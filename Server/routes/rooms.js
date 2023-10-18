import Express from "express";
import {
  createRoom,
  deleteRoom,
  deleteRoomReservation,
  getAllRooms,
  getRoom,
  updateRoom,
  updateRoomAvailability,
} from "../controllers/roomController.js";
import { verifyAdmin, verifyUser } from "../utils/jwt.js";

import { getRoomNumbers } from "../controllers/roomController.js";
const router = Express.Router();

//CREATE
router.post("/:hotelId", verifyAdmin, createRoom);
//UPDATE
router.put("/:id", verifyAdmin, updateRoom);
router.put("/availability/:id", verifyUser, updateRoomAvailability);
//DELETE
router.delete("/:id/", verifyAdmin, deleteRoom);
//GET
router.get("/:id", verifyUser, getRoom);
//GETALL
router.get("/", verifyUser, getAllRooms);
//GET ROOMS NUMBERS
router.get("/:roomId/:roomNumberId", verifyUser, getRoomNumbers);
//DELETE RESERVATION
router.delete(
  "/:hotelId/:id/:roomNumberId/:startDate/:endDate",
  verifyUser,
  deleteRoomReservation
);
export default router;
