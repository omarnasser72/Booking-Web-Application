import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const createToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT
  );
  return accessToken;
};

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];

  if (!accessToken) {
    next(createError(400, "no token exists"));
  }
  try {
    const validToken = jwt.verify(
      accessToken,
      process.env.JWT,
      (err, decoded) => {
        if (err) {
          next(err);
        }
        req.user = decoded;
      }
    );
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
    if (req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You aren't admin"));
    }
  });
};
