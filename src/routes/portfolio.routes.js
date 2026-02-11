import express from "express";
import { protect } from "../middlewares/auth.middleware.js";
import { savePortfolio } from "../controllers/portfolio.controller.js";

const router = express.Router();

/*
  POST /portfolio
  Save or update portfolio (draft)
*/
router.post("/", protect, savePortfolio);

export default router;
