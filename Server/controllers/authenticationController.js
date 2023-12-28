import User from "../models/User.js";
import bcrypt, { hashSync } from "bcrypt";
import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";
import nodemailer from "nodemailer";
import crypto, { verify } from "crypto";
import { createToken } from "../utils/jwt.js";
import { error, log } from "console";
import PendingUser from "../models/PendingUser.js";

const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

function generateRandomPassword() {
  const characters =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%";
  let password = "";

  while (true) {
    for (let i = 0; i < 8; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters.charAt(randomIndex);
    }

    if (PWD_REGEX.test(password)) {
      return password;
    } else {
      // The generated password doesn't match the pattern, so generate a new one.
      password = "";
      createError(400, "can't create reset password");
    }
  }
}

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

    const pendingUser = await PendingUser.findOne({
      username: req.body.username,
    });

    if (pendingUser) return next(createError(400, "Email not verified yet"));

    const token = createToken(user);
    const { password, ...otherDetails } = user._doc;
    res
      .status(200)
      .cookie("accessToken", token)
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

    const pendingUser = new PendingUser({
      userId: newUser._id,
      username: newUser.username,
      email: newUser.email,
    });

    console.log("PendingUser:", pendingUser);
    const pendingUserExists = await PendingUser.findOne({
      userId: newUser._id,
    });
    if (pendingUserExists)
      throw createError(400, "Pending User Already exists");
    else await pendingUser.save();

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
      html: `<link
      href="https://fonts.googleapis.com/css2?family=Nunito:ital,wght@0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap"
      rel="stylesheet"
    /><h2>You registered on My Nights web app</h2><p><button style="background-color: #fffb06; border: none; width: fit-content; padding: 10px; justify-content: center; align-items: center"><a href="${process.env.CLIENT_URL}/#verifyEmail?id=${pendingUser._id}" style="text-decoration:none; color:rgb(66,66,66); font-size:large; font-weight:500;">Verify Your Email</a></button></p>`,
    };
    transport.sendMail(mailOptions, function (err, info) {
      if (err) next(err);
      else res.status(200).json({ "email sent": info.response });
    });
  } catch (error) {
    next(error);
  }
};

export const forgetPwd = async (req, res, next) => {
  try {
    const email = req.body.email;

    const user = await User.findOne({ email });

    if (user) {
      const resetPwd = generateRandomPassword();

      user.password = bcrypt.hashSync(resetPwd, 10);
      await user.save();

      console.log("process.env.EMAIL: ", process.env.EMAIL);
      console.log("process.env.PASSWORD: ", process.env.PASSWORD);

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
        subject: "Reset Password",
        html: `<h2>
            Please, change your password after logging in
            <div style="background-color: #fffb06; border: none; font-family: Nunito; width: fit-content; padding: 10px; justify-content: center; align-items: center">
              ${resetPwd}
            </div>
          </h2>`,
      };

      transport.sendMail(mailOptions, function (err, info) {
        if (err) next(err);
        else res.status(200).json({ "email sent": info.response });
      });
    } else {
      // Handle the case where the user with the provided email is not found.
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const resetPwd = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    const userToken = createToken(user);

    if (user) {
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
        subject: "Reset Password",
        html: `<h2>
            <div style="background-color: #fffb06; border: none; font-family: Nunito; width: fit-content; padding: 10px; justify-content: center; align-items: center">
              <a style="text-decoration: none; color:#000; font-family: Nunito;" href="${process.env.CLIENT_URL}/#/newPassword?token=${userToken}">Reset Password</a>
            </div>
          </h2>`,
      };

      transport.sendMail(mailOptions, function (err, info) {
        if (err) next(err);
        else res.status(200).json({ "email sent": info.response });
      });
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    next(error);
  }
};

export const getPendingUser = async (req, res, next) => {
  try {
    const pendingUser = await PendingUser.findById(req.params.id);
    res.status(200).json(pendingUser);
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    console.log(req?.params);
    await PendingUser.deleteOne({ email: req.params.email });
    res.status(200).json({ message: `${req.params.email} is verified` });
  } catch (error) {
    next(error);
  }
};

export const getUserInfo = async (req, res, next) => {
  console.log(req.query.token);
  const token = req.query.token;
  try {
    const decoded = jwt.verify(token, process.env.JWT);
    console.log(decoded);
    req.user = decoded;
    req.authenticated = true;
    if (req.user) {
      res.status(200).json(req.user.id);
    } else {
      next(createError(403, "You aren't user"));
    }
  } catch (error) {
    next(error);
  }
};
