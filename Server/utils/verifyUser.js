import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

// export const verifyToken = (req, res, next) => {
//   if (!req.cookies.accessToken)
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

export const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

export const verifyUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user) {
      next();
    } else {
      return next(createError(403, "You aren't user"));
    }
  });
};

export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      return next(createError(403, "You aren't admin"));
    }
  });
};
