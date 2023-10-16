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
import { verifyAdmin } from "../utils/jwt.js";

import { getRoomNumbers } from "../controllers/roomController.js";
const router = Express.Router();

//CREATE
router.post("/:hotelId", verifyAdmin, createRoom);
//UPDATE
router.put("/:id", verifyAdmin, updateRoom);
router.put("/availability/:id", updateRoomAvailability);
//DELETE
router.delete("/:id/", verifyAdmin, deleteRoom);
//GET
router.get("/:id", getRoom);
//GETALL
router.get("/", getAllRooms);
//GET ROOMS NUMBERS
router.get("/:roomId/:roomNumberId", getRoomNumbers);
//DELETE RESERVATION
router.delete(
  "/:hotelId/:id/:roomNumberId/:startDate/:endDate",
  deleteRoomReservation
);
export default router;
