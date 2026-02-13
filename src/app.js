import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import { errorHandler, notFound } from "./middlewares/error.middleware.js";

import authRoutes from "./routes/auth.routes.js";
import portfolioRoutes from "./routes/portfolio.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import previewRoutes from "./routes/preview.routes.js";




dotenv.config();

const app = express();
app.use(helmet());
app.use(express.json({ limit: "2mb" }));

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true
  })
);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/auth", authRoutes);
app.use("/api/portfolio", portfolioRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/preview", previewRoutes);
// app.use("/", publicRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
