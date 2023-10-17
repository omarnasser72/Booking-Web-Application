import jwt from "jsonwebtoken";
import { createError } from "./error.js";

export const createToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    "secretToken"
  );
  return accessToken;
};

export const validateToken = (req, res, next) => {
  const accessToken = req.cookies["accessToken"];
  let userExist;
  if (!accessToken) {
    next(createError(400, "no token exists"));
  }
  try {
    jwt.verify(accessToken, "secretToken", (err, decoded) => {
      if (err) next(err);
      req.user = decoded;
      userExist = decoded;
      req.authenticated = true;
    });
    if (userExist) next();
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
