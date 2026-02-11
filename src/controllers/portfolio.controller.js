import Portfolio from "../models/portfolio.model.js";
import { portfolioSchema } from "../validations/portfolio.schema.js";


export const savePortfolio = async (req, res, next) => {
  try {
    console.log(req?.body);
    const parsed = portfolioSchema.safeParse(req.body)

    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Enter all fields!"
      })
    }

    const {
      template,
      theme,
      data,
      seo,
      analytics
    } = parsed.data

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      {
        $set: {
          template,
          theme,
          data,
          seo,
          status: "draft" // Always save as draft here
        },
        $setOnInsert: {
          analytics: analytics || { views: 0 }
        }
      },
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    )

    return res.status(200).json({
      success: true,
      message: "Portfolio saved successfully",
      portfolio: {
        template: portfolio.template,
        status: portfolio.status,
        updatedAt: portfolio.updatedAt
      }
    })

  } catch (error) {
    next(error)
  }
}
