import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import {
  deployPortfolio,
  getPortfolio,
  getTemplate,
  getTheme,
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

router.get(
  "/get-theme",
  protect,
  getTheme
);

router.get(
  "/get-template",
  protect,
  getTemplate
);


router.post(
  "/update-template",
  protect,
  updateTemplate
);


router.post(
  "/deploy",
  protect,
  deployPortfolio
);


router.get("/", protect, getPortfolio);

export default router;
