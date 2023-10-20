import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import nodemailer from "nodemailer";
import crypto from "crypto";
import { createToken } from "../utils/jwt.js";

function generateRandomPassword(length) {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_";
  const password = [];

  for (let i = 0; i < length; i++) {
    const randomIndex = crypto.randomInt(characters.length);
    password.push(characters[randomIndex]);
  }

  return password.join("");
}

const password = generateRandomPassword(12); // Change the length as needed
console.log(password);

export const register = async (req, res, next) => {
  try {
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found!"));

    if (!bcrypt.compareSync(req.body.password, user.password))
      return next(createError(400, "Wrong Password!"));

    const token = createToken(user);
    const { password, ...otherDetails } = user._doc;
    res
      .status(200)
      .cookie("accessToken", token, {
        domain: "booking-fwaz.onrender.com",
      })
      .json({ accessToken: token, details: { ...otherDetails } });
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res, next) => {
  try {
    res.cookie("accessToken", " ");
    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};

export const signup = async (req, res, next) => {
  try {
    const email = req.body.email;
    const hashedPassword = bcrypt.hashSync(req.body.password, 10);

    const usernameExist = await User.find({
      username: req.body.username,
    });
    if (usernameExist.length > 0)
      throw createError(400, "Username Already exists");

    const emailExist = await User.find({
      email: email,
    });
    if (emailExist.length > 0) throw createError(400, "Email Already exists");

    const phoneExist = await User.find({
      phone: req.body.phone,
    });
    if (phoneExist.length > 0) throw createError(400, "Phone Already exists");

    console.log("before creating object");
    const newUser = new User({
      ...req.body,
      password: hashedPassword,
    });
    console.log("newUser:", newUser);
    const savedUser = await newUser.save();
    res.status(200).json(savedUser);

    const transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Registration",
      html: "<h2>You registered on My Nights web app</h2>",
    };

    transport.sendMail(mailOptions, function (err, info) {
      if (err) next(err);
      else res.status(200).json({ "email sent": info.response });
    });
  } catch (error) {
    next(error);
  }
};
