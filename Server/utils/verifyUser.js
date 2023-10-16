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
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(createError(401, "You aren't authenticated (no token)"));
  }

  const tokenData = authHeader.split(" ");

  if (tokenData[0] !== "Bearer" || !tokenData[1]) {
    return next(createError(403, "Invalid token format"));
  }

  jwt.verify(tokenData[1], process.env.JWT, (err, decoded) => {
    if (err) {
      return next(createError(403, "Token isn't valid"));
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
