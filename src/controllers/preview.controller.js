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

    const portfolio = await Portfolio.findOne({
      userId: req.user._id
    });

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    const html = renderTemplate({
      template: portfolio.template,
      data: portfolio.data,
      theme:portfolio.theme
    });

    return res.status(200).json({
      success: true,
      html
    });

  } catch (error) {
    console.log(error);
    next(error);
  }
};
