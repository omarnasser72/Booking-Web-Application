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

export const verifyUser = async (req, res, next) => {
  let accessToken = req.headers.authorization;

  if (!accessToken || accessToken === null || !jwtRegex.test(accessToken)) {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000); // 2000 milliseconds (2 seconds) delay
  }

  if (!accessToken || accessToken === null || !jwtRegex.test(accessToken)) {
    next(createError(400, "Invalid or missing token"));
  } else {
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
  }
};

export const verifyAdmin = async (req, res, next) => {
  let accessToken = req.headers.authorization;

  if (!accessToken || accessToken === null || !jwtRegex.test(accessToken)) {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    await delay(2000); // 2000 milliseconds (2 seconds) delay
  }

  if (!accessToken || accessToken === null || !jwtRegex.test(accessToken)) {
    next(createError(400, "Invalid or missing token"));
  } else {
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
  }
};
