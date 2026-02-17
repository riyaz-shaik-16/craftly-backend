import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { generateToken } from "../utils/jwt.js";
import Portfolio from "../models/portfolio.model.js";

export const register = async (req, res, next) => {
  try {
    const { fullName, email, username, password } = req.body;

    if (!fullName || !email || !username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(409).json({
        success: false,
        message: "Username already taken",
      });
    }

    // Hash password with bcrypt
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email,
      username,
      passwordHash,
    });

    await Portfolio.create({
      userId:user?._id,
    });
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Verify password against stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        fullName: user.fullName,
      },
    });
  } catch (error) {
    next(error);
  }
};


export const updateProfile = async (req, res, next) => {
  try {
    const { fullName, email } = req.body

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Full name and email are required"
      })
    }

    const user = await User.findById(req.user._id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      })
    }

    // Check if email is changing
    if (email !== user.email) {
      const existingEmail = await User.findOne({ email })

      if (existingEmail) {
        return res.status(409).json({
          success: false,
          message: "Email already in use"
        })
      }

      user.email = email
    }

    user.fullName = fullName

    await user.save()

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username
      }
    })

  } catch (error) {
    next(error)
  }
}


export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        username: user.username,
      },
    });
  } catch (error) {
    next(error);
  }
};