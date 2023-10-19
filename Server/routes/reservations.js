import Express from "express";
import {
  deleteReservation,
  getAllReservations,
  getReservation,
  updateReservation,
} from "../controllers/reservationController.js";
import { verifyAdmin, verifyUser } from "../utils/jwt.js";

const router = Express.Router();

//GETALL
router.get("/", verifyAdmin, getAllReservations);

//GET
router.get("/:id", verifyUser, getReservation);

//UPDATE
router.put("/:id", verifyAdmin, updateReservation);

//DELETE
router.delete("/:id", verifyAdmin, deleteReservation);

export default router;
