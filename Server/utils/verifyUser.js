import jwt from "jsonwebtoken";
import { createError } from "../utils/error.js";

export const verifyToken = (req, res, next) => {
  if (!req.cookies || !req.cookies.accessToken)
    return next(createError(401, "You aren't authenticated (no token)"));

  const token = req.cookies.accessToken;
  jwt.verify(token, process.env.JWT, (err, decoded) => {
    if (err) {
      return next(createError(403, "token isn't valid"));
    }
    req.user = decoded;

    next();
  });
};

// export const verifyToken = (req, res, next) => {
//   const authHeader = req.headers["authorization"];

//   if (!authHeader) {
//     return next(createError(401, "You aren't authenticated (no token)"));
//   }

//   const token = authHeader.replace("Bearer ", ""); // Assuming the token is sent as "Bearer your-token-here"

//   jwt.verify(token, process.env.JWT, (err, decoded) => {
//     console.log("Decoded token:", decoded);
//     if (err) {
//       console.error("Token verification error:", err);
//       return next(createError(403, "Token isn't valid"));
//     }
//     req.user = decoded;
//     console.log("req.user", req.user);
//     next();
//   });
// };

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
