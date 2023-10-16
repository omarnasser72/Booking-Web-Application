import Express from "express";
import {
  countByCity,
  countByType,
  createHotel,
  deleteHotel,
  getAllHotles,
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
  Object.keys(req.query).length !== 0
    ? getHotels(req, res)
    : getAllHotles(req, res);
});

//-----------------------

router.get("/countByCity", verifyUser, countByCity);
router.get("/countByType", verifyUser, countByType);
router.get("/room/:id", verifyUser, getHotelRooms);
//--------------------
//reserve rooms

router.post("/reserve/:id", verifyUser, createReservation);

export default router;
