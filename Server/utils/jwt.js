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
  const cookieHeader = req.headers.cookie;
  const cookies = cookieHeader.split("; ");
  let accessToken;

  for (const cookie of cookies) {
    const [name, value] = cookie.split("=");
    if (name === "accessToken") {
      accessToken = value;
      break;
    }
  }

  if (!accessToken) {
    next(createError(400, "no token exists"));
  }
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT);
    req.user = decoded;
    req.authenticated = true;
    next();
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
