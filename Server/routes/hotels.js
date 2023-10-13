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
import { verifyAdmin, verifyUser } from "../utils/verifyUser.js";
import { createReservation } from "../controllers/reservationController.js";

const router = Express.Router();

//CREATE
router.post("/", verifyAdmin, createHotel);
//UPDATE
router.put("/:id", verifyUser, updateHotel);
//DELETE
router.delete("/:id", verifyAdmin, deleteHotel);
//GET
router.get("/find/:id", getHotel);
// GET HOTELS
router.get("/", (req, res) => {
  Object.keys(req.query).length !== 0
    ? getHotels(req, res)
    : getAllHotles(req, res);
});

//-----------------------

router.get("/countByCity", countByCity);
router.get("/countByType", countByType);
router.get("/room/:id", getHotelRooms);
//--------------------
//reserve rooms

router.post("/reserve/:id", createReservation);

export default router;
