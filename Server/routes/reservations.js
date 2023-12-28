import Express from "express";
import {
  createReservation,
  deleteReservation,
  getAllReservations,
  getReservation,
  stripePayment,
  updateReservation,
} from "../controllers/reservationController.js";
import { verifyAdmin, verifyUser } from "../utils/jwt.js";

const router = Express.Router();

//POST
router.post("/", verifyUser, createReservation);

router.post("/create-checkout-session", verifyUser, stripePayment);

//GETALL
router.get("/", verifyAdmin, getAllReservations);

//GET
router.get("/:id", verifyUser, getReservation);

//UPDATE
router.put("/:id", verifyUser, updateReservation);

//DELETE
router.delete("/:id", verifyUser, deleteReservation);

export default router;
