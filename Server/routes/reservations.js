import Express from "express";
import {
  deleteReservation,
  getAllReservations,
  getReservation,
  updateReservation,
} from "../controllers/reservationController.js";
import { verifyAdmin } from "../utils/jwt.js";

const router = Express.Router();

//GETALL
router.get("/", verifyAdmin, getAllReservations);

//GET
router.get("/:id", verifyAdmin, getReservation);

//UODATE
router.put("/:id", verifyAdmin, updateReservation);

//DELETE
router.delete("/:id", verifyAdmin, deleteReservation);

export default router;
