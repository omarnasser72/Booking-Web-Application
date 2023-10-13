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
import { fileURLToPath } from "url"; // Import fileURLToPath
import path from "path"; // Import path

const __filename = fileURLToPath(import.meta.url); // Get the current filename
const __dirname = path.dirname(__filename); // Get the directory name

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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "Client/build"))); // Use __dirname
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "../Client/build", "index.html")); // Use __dirname
//   });
// }

app.listen(8888, () => {
  connect();
  console.log("Connected with the backend...");
});
