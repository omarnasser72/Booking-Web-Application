import jwt from "jsonwebtoken";
import { createError } from "./error.js";
const jwtRegex = /^[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.[A-Za-z0-9-_.+/=]*$/;

export const createToken = (user) => {
  const accessToken = jwt.sign(
    { id: user._id, isAdmin: user.isAdmin },
    process.env.JWT
  );
  return accessToken;
};

export const verifyUser = async (req, res, next) => {
  let accessToken = req.headers.authorization || req.cookies["accessToken"];

  if (!accessToken || accessToken === null || !jwtRegex.test(accessToken))
    next(createError(400, "Invalid or missing token"));

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT);
    req.user = decoded;
    req.authenticated = true;
    if (req.user) {
      next();
    } else {
      return next(createError(403, "You aren't a user"));
    }
  } catch (error) {
    next(error);
  }
};

export const verifyAdmin = async (req, res, next) => {
  let accessToken = req.headers.authorization || req.cookies["accessToken"];

  if (!accessToken || accessToken === null || !jwtRegex.test(accessToken))
    next(createError(400, "Invalid or missing token"));

  try {
    const decoded = jwt.verify(accessToken, process.env.JWT);
    req.user = decoded;
    req.authenticated = true;
    if (req?.user?.isAdmin) {
      next();
    } else {
      return next(createError(403, "You aren't Admin"));
    }
  } catch (error) {
    next(error);
  }
};

export const validateToken = (req, res, next) => {
  console.log("req.headers:", req.headers);
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    next(createError(400, "no token exists"));
  } else {
    const cookies = cookieHeader.split("; ");
    let accessToken;

    for (const cookie of cookies) {
      const [name, value] = cookie.split("=");
      if (name === "accessToken") {
        accessToken = value;
        break;
      }
    }
    console.log("req.headers:", req.headers);
    if (!accessToken) accessToken = req.headers.authorization;
    if (!accessToken) next(createError(400, "no token exists"));

    try {
      const decoded = jwt.verify(accessToken, process.env.JWT);
      console.log(decoded);
      req.user = decoded;
      req.authenticated = true;
      if (req.user) {
        next();
      } else {
        return next(createError(403, "You aren't user"));
      }
    } catch (error) {
      next(error);
    }
  }
};
