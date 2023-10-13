import User from "../models/User.js";
import bcrypt from "bcrypt";
import { createError } from "../utils/error.js";
import nodemailer from "nodemailer";

export const changePwd = async (req, res, next) => {
  try {
    const email = req.body.email;
    const { newPwd } = req.body;
    const user = await User.findById(req.params.id);
    if (!bcrypt.compareSync(req.body.password, user.password))
      return next(createError(400, "Wrong Password !"));

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          ...req.body,
          password: bcrypt.hashSync(newPwd, 10),
        },
      },
      { new: true }
    );
    console.log("updatedUser.password: ", updatedUser.password);
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
      subject: "Changing Password",
      html: "<h2>You have changed your password on My Nights web app</h2>",
    };

    transport.sendMail(mailOptions, function (err, info) {
      if (err) next(err);
      console.log("email sent:", info.response);
    });

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const email = req.body.email;
    let user;

    const currentUser = await User.findById(req.params.id);

    const usernameExist = await User.find({
      _id: { $ne: currentUser._id },
      username: req.body.username,
    });
    if (usernameExist.length > 0)
      next(createError(400, "Username Already exists"));

    const emailExist = await User.find({
      _id: { $ne: currentUser._id },
      email: email,
    });
    if (emailExist.length > 0) next(createError(400, "Email Already exists"));

    const phoneExist = await User.find({
      _id: { $ne: currentUser._id },
      phone: req.body.phone,
    });
    if (phoneExist.length > 0) throw createError(400, "Phone Already exists");

    if (req.body.password) {
      const hashedPassword = bcrypt.hashSync(req.body.password, 10);
      user = { ...req.body, password: hashedPassword };
    } else {
      user = req.body;
    }
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: user,
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
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
      subject: "Update Profile",
      html: "<h2>You have just updated your profile on My Nights web app</h2>",
    };

    transport.sendMail(mailOptions, function (err, info) {
      if (err) next(err);
      else res.status(200).json({ "email sent": info.response });
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const existedUser = await User.findById(req.params.id);
    res.status(200).json(existedUser);
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

export const getUserReservations = async (req, res, next) => {
  try {
    const reservation = await Reservation.find({
      userId: req.params.id,
    }).exec();
    console.log(reservation);
    if (!reservation) {
      return res
        .status(404)
        .json({ success: false, message: "Reservation not found" });
    }
    res.status(200).json(reservation);
  } catch (error) {
    next(error);
  }
};
