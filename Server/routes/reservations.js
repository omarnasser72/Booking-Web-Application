import Express from "express";
import {
  deleteReservation,
  getAllReservations,
  getReservation,
  stripePayment,
  stripePayments,
  updateReservation,
} from "../controllers/reservationController.js";
import { verifyAdmin, verifyUser } from "../utils/jwt.js";

const router = Express.Router();

//POST
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
