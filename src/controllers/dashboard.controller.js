import Portfolio from "../models/portfolio.model.js";

export const getDashboard = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    // Case 1: No portfolio yet
    if (!portfolio) {
      return res.status(200).json({
        success: true,
        state: "empty"
      });
    }

    // Case 2: Draft portfolio
    if (portfolio.status === "draft") {
      return res.status(200).json({
        success: true,
        state: "draft",
        portfolio: {
          template: portfolio.template,
          updatedAt: portfolio.updatedAt
        }
      });
    }

    // Case 3: Live portfolio
    return res.status(200).json({
      success: true,
      state: "live",
      portfolio: {
        template: portfolio.template,
        deployedUrl: portfolio.deployedUrl,
        updatedAt: portfolio.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
};
