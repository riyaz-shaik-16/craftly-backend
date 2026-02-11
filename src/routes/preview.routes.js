import express from "express";
import { previewPortfolio } from "../controllers/preview.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();


router.post("/", protect, previewPortfolio);

export default router;
