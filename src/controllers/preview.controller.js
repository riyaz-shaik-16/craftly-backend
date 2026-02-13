import { renderTemplate } from "../services/template.service.js";
import Portfolio from "../models/portfolio.model.js";

// Preview a user's portfolio by rendering it with their template, data, and theme
export const previewPortfolio = async (req, res, next) => {
  try {
    // Check if user is authenticated
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Fetch portfolio from database
    const portfolio = await Portfolio.findOne({
      userId: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    // Render portfolio HTML with user's template configuration
    const html = renderTemplate({
      template: portfolio.template,
      data: portfolio.data,
      theme: portfolio.theme
    });

    return res.status(200).json({
      success: true,
      html
    });

  } catch (error) {
    next(error);
  }
};
