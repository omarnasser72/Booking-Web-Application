import Express from "express";
import {
  createRate,
  deleteRate,
  getAllRates,
  updateRate,
} from "../controllers/hotelRatesController.js";
import { verifyAdmin, verifyUser } from "../utils/verifyUser.js";

const router = Express.Router();

//CREATE RATE
router.post("/:userId/:hotelId", verifyUser, createRate);

//UPDATE RATE
router.put("/:id", verifyUser, updateRate);

//DELETE RATE
router.delete("/:id", verifyUser, deleteRate);

//GET RATE
router.get("/:id", verifyUser, deleteRate);

//GET ALL RATES
router.get("", verifyAdmin, getAllRates);

export default router;
