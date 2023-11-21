import Express from "express";
import {
  forgetPwd,
  getPendingUser,
  getUserInfo,
  login,
  logout,
  register,
  resetPwd,
  signup,
  verifyEmail,
} from "../controllers/authenticationController.js";
import { body, validationResult } from "express-validator";

const router = Express.Router();

//REGISTER
router.post("/signup", signup);
//REGISTER
router.post("/register", register);
//LOGIN
router.post("/login", login);
//LOGOUT
router.get("/logout", logout);
//RESET
router.post("/resetPwd", resetPwd);
//VERIFY EMAIL
router.delete("/verifyEmail/:email", verifyEmail);
//GET PENDING USER
router.get("/pendingUser/:id", getPendingUser);
//GET USER INFO
router.get("/getUserInfo", getUserInfo);
export default router;
