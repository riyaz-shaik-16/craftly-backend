import { renderTemplate } from "../services/template.service.js";
import Portfolio from "../models/portfolio.model.js";


export const previewPortfolio = async (req, res, next) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Get saved portfolio from DB
    const portfolio = await Portfolio.findOne({
      userId: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    // Generate HTML from saved portfolio
    const html = renderTemplate({
      template:"modern",
      data: portfolio.data,
    });

    return res.status(200).json({
      success: true,
      html
    });

  } catch (error) {
    next(error);
  }
};
