import Express from "express";
import {
  changePwd,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
} from "../controllers/userController.js";

import {
  deleteReservation,
  getUserReservations,
} from "../controllers/reservationController.js";
import { validateToken, verifyAdmin, verifyUser } from "../utils/jwt.js";

const router = Express.Router();

router.get("/checkAuthentication", validateToken, (req, res, next) => {
  res.send("user logged in");
});

router.get("/checkUser/:id", verifyUser, (req, res, next) => {
  res.send("user logged in and you can delete account");
});

router.get("/checkAdmin/:id", verifyAdmin, (req, res, next) => {
  res.send("admin logged in and can delete all accounts");
});

//UPDATE
router.put("/:id", verifyUser, updateUser);
router.put("/changePwd/:id", verifyUser, changePwd);
//DELETE
router.delete("/:id", verifyAdmin, deleteUser);
//GET
router.get("/:id", verifyUser, getUser);
//GETALL
router.get("/getUsers/all", verifyAdmin, getAllUsers);

//GET RESERVATION
router.get("/reservations/:id", verifyUser, getUserReservations);

//DELETE RESERVATION
router.delete("/reservations/:id", verifyUser, deleteReservation);

export default router;
