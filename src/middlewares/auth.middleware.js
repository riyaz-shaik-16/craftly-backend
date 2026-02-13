import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {
  let token;

  // Extract JWT token from Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error("Not authorized, token missing"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from database and attach to request object
    req.user = await User.findById(decoded.userId).select("-passwordHash");

    if (!req.user) {
      res.status(401);
      return next(new Error("Not authorized, user not found"));
    }

    next();
  } catch (error) {
    res.status(401);
    next(new Error("Not authorized, invalid token"));
  }
};
