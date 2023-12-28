import Express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getAllHotles,
  getFeaturedHotels,
  getHotel,
  getHotelRooms,
  getHotels,
  updateHotel,
} from "../controllers/hotelController.js";
import { createReservation } from "../controllers/reservationController.js";
import { verifyAdmin, verifyUser } from "../utils/jwt.js";

const router = Express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);
//UPDATE
router.put("/:id", verifyUser, updateHotel);
//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);
//GET
router.get("/find/:id", verifyUser, getHotel);
// GET HOTELS
router.get("/", verifyUser, (req, res) => {
  if (Object.keys(req.query).length === 3) getHotels(req, res);
  else if (Object.keys(req.query).length === 2) getFeaturedHotels(req, res);
  else getAllHotles(req, res);
});

//-----------------------

router.get("/countByCity", verifyUser, countByCity);
router.get("/countByType", verifyUser, countByType);
router.get("/room/:id", verifyUser, getHotelRooms);

export default router;
