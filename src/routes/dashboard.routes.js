import express from "express";
import { getBuilderOverview, getDashboard } from "../controllers/dashboard.controller.js";
import { protect } from "../middlewares/auth.middleware.js";

const router = express.Router();

/*
  GET /dashboard
  Protected
*/
router.get("/", protect, getDashboard);
router.get(
  "/builder/overview",
  protect,
  getBuilderOverview
);

export default router;
