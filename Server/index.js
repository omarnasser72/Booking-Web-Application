import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import reservationsRoute from "./routes/reservations.js";
import rateRoute from "./routes/hotelRates.js";
import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("connected to the database");
  } catch (error) {
    throw error;
  }
};

// MIDDLEWARES
app.use(cors());
// app.use(
//   cors({
//     origin: "https://bookingwebapp.onrender.com",
//   })
// );

app.use(cookieParser());
// To send JSON to Express, we have to use its middleware
app.use(express.json());

app.use("/auth", authRoute);
app.use("/hotels", hotelsRoute);
app.use("/users", usersRoute);
app.use("/rooms", roomsRoute);
app.use("/reservations", reservationsRoute);
app.use("/rates", rateRoute);

// Error handler
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";

  return res.status(errorStatus).json({
    success: false,
    message: errorMessage,
  });
});

app.listen(8888, () => {
  connect();
  console.log("Connected with the backend...");
});
