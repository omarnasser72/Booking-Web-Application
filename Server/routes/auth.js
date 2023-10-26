import Express from "express";
import {
  forgetPwd,
  login,
  logout,
  register,
  signup,
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
router.post("/resetPwd", forgetPwd);
export default router;
