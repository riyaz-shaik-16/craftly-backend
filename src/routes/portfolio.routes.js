import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  getPortfolio,
  savePortfolio,
  updateTemplate,
  updateTheme
} from "../controllers/portfolio.controller.js";

const router = express.Router();
router.post(
  "/",
  protect,
  upload.any(),   
  savePortfolio
);
router.post(
  "/update-theme",
  protect,
  updateTheme
);


router.post(
  "/update-template",
  protect,
  updateTemplate
);


router.get("/", protect, getPortfolio);

export default router;
