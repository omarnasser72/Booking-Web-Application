import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken) {
    return next(createError(400, "No token exists"));
  }

  jwt.verify(accessToken, process.env.JWT, (err, decoded) => {
    if (err) {
      return next(createError(403, "Invalid token"));
    }

    req.user = decoded;
    req.authenticated = true;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  validateToken(req, res, () => {
    if (req.user) {
      next();
    } else {
      return next(createError(403, "You aren't authorized"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  validateToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You aren't authorized as an admin"));
    }
  });
};
