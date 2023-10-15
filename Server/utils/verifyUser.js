import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// export const verifyToken = (req, res, next) => {
//   if (!req.cookies || !req.cookies.accessToken)
//     return next(createError(401, "You aren't authenticated (no token)"));

//   const token = req.cookies.accessToken;
//   jwt.verify(token, process.env.JWT, (err, decoded) => {
//     if (err) {
//       return next(createError(403, "token isn't valid"));
//     }
//     req.user = decoded;

//     next();
//   });
// };

import winston from "winston";
// Create a logger with different log levels
const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({ level: "info" }), // Log to console for info level and above
    new winston.transports.File({ filename: "error.log", level: "error" }), // Log errors to a file
  ],
});

// Usage in your code
logger.info("This is an info message.");
logger.warn("This is a warning message.");
logger.error("This is an error message.");

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(createError(401, "You aren't authenticated (no token)"));
  }

  const token = authHeader.replace("Bearer ", ""); // Assuming the token is sent as "Bearer your-token-here"

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return next(createError(403, "Token isn't valid"));
    }
    req.user = decoded;
    logger.info("req.user", req.user);
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user) {
      next();
    } else {
      return next(createError(403, "You aren't authorized"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You aren't authorized"));
    }
  });
};
