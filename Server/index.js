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
//import { fileURLToPath } from "url"; // Import the 'fileURLToPath' function
//import path from "path";

//const __filename = fileURLToPath(import.meta.url); // Get the current module's filename
//const __dirname = path.dirname(__filename); // Get the directory name

const app = express();
dotenv.config();

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to the database");
  } catch (error) {
    throw error;
  }
};

// MIDDLEWARES
app.use(cors({ origin: "*" }));
// app.use(
//   cors({
//     origin: "https://bookingwebapp.onrender.com",
//   })
// );

app.use(cookieParser());
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

const port = process.env.PORT;
app.listen(port, () => {
  connect();
  console.log(`Server is running on port ${port}`);
});
