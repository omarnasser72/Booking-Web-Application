import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const createToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin }, // Include user role (isAdmin) in the token
    "1234"
  );
  return accessToken;
};

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken) {
    next(createError(400, "no token exists"));
  }
  try {
    const validToken = jwt.verify(accessToken, "1234", (err, decoded) => {
      if (err) {
        next(err);
      }
      req.user = decoded;
    });
    if (validToken) {
      req.authenticated = true;
      next();
    } else {
      next(createError(403, "invalid token"));
    }
  } catch (error) {
    next(error);
  }
};

export const verifyUser = (req, res, next) => {
  validateToken(req, res, () => {
    if (req.user) {
      next();
    } else {
      return next(createError(403, "You aren't user"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  validateToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You aren't admin"));
    }
  });
};
