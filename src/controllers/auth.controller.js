import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { registerSchema, loginSchema } from "../validations/auth.schema.js";
import { generateToken } from "../utils/jwt.js"

export const register = async (req, res, next) => {
  try {
    // Validate input
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400);
      throw new Error(parsed.error.errors[0].message);
    }

    const { fullName, email, username, password } = parsed.data;

    // Check email
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      res.status(409);
      throw new Error("Email already registered");
    }

    // Check username
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      res.status(409);
      throw new Error("Username already taken");
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      fullName,
      email,
      username,
      passwordHash
    });

    // Issue token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username
      }
    });
  } catch (error) {
    next(error);
  }
};

/* -------------------------------------------------
   Login
------------------------------------------------- */
export const login = async (req, res, next) => {
  try {
    // Validate input
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400);
      throw new Error(parsed.error.errors[0].message);
    }

    const { email, password } = parsed.data;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    // Issue token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName:user.fullName
      }
    });
  } catch (error) {
    next(error);
  }
};
