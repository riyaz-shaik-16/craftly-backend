import express from "express";
import {
  register,
  login,
  updateProfile,
  getProfile,
} from "../controllers/auth.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.put("/update-profile", protect, updateProfile);
router.get("/profile", protect, getProfile);

export default router;
