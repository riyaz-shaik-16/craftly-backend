import Portfolio from "../models/portfolio.model.js";

export const getDashboard = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    if (!portfolio) {
      return res.status(200).json({
        success: true,
        state: "empty"
      });
    }

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
