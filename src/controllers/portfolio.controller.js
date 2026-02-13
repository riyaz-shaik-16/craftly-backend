import Portfolio from "../models/portfolio.model.js";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { normalizeUrl } from "../utils/normalizeUrl.js";

export const savePortfolio = async (req, res, next) => {
  try {
    const { template } = req.body;

    if (!template || !req.body.theme || !req.body.data) {
      return res.status(400).json({
        success: false,
        message: "Template, theme and data are required",
      });
    }

    const theme = JSON.parse(req.body.theme);
    const parsedData = JSON.parse(req.body.data);
    const files = req.files || [];

    // Upload files to cloudinary and map them to their respective data sections
    for (const file of files) {
      const { fieldname, buffer } = file;
      const uploaded = await uploadToCloudinary(buffer, "portfolio");
      const imageUrl = uploaded.secure_url;

      if (fieldname === "avatar") {
        if (!parsedData.personal) {
          parsedData.personal = {};
        }
        parsedData.personal.avatar = imageUrl;
      }

      if (fieldname.startsWith("projectImages-")) {
        const index = parseInt(fieldname.split("-")[1]);
        if (!parsedData.projects?.[index]) continue;

        if (!parsedData.projects[index].images) {
          parsedData.projects[index].images = [];
        }
        parsedData.projects[index].images.push(imageUrl);
      }

      if (fieldname.startsWith("certificationImages-")) {
        const index = parseInt(fieldname.split("-")[1]);
        if (!parsedData.certifications?.[index]) continue;

        if (!parsedData.certifications[index].images) {
          parsedData.certifications[index].images = [];
        }
        parsedData.certifications[index].images.push(imageUrl);
      }

      if (fieldname.startsWith("achievementImages-")) {
        const index = parseInt(fieldname.split("-")[1]);
        if (!parsedData.achievements?.[index]) continue;

        if (!parsedData.achievements[index].images) {
          parsedData.achievements[index].images = [];
        }
        parsedData.achievements[index].images.push(imageUrl);
      }
    }

    // Normalize URLs to ensure consistent formatting across all links
    parsedData.projects?.forEach((project) => {
      project.githubLink = normalizeUrl(project.githubLink);
      project.demoLink = normalizeUrl(project.demoLink);
      project.liveLink = normalizeUrl(project.liveLink);
    });

    if (parsedData.socialLinks) {
      Object.keys(parsedData.socialLinks).forEach((key) => {
        parsedData.socialLinks[key] = normalizeUrl(parsedData.socialLinks[key]);
      });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      {
        template,
        theme,
        data: parsedData,
        status: "draft",
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    return res.status(200).json({
      success: true,
      message: "Portfolio saved successfully",
      portfolio: {
        template: portfolio.template,
        theme: portfolio.theme,
        status: portfolio.status,
        updatedAt: portfolio.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateTheme = async (req, res, next) => {
  try {
    const { theme } = req.body;

    if (!theme) {
      return res.status(400).json({
        success: false,
        message: "Theme is required",
      });
    }
    
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { theme } },
      { new: true, runValidators: true },
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Theme updated successfully",
      theme: portfolio.theme,
      updatedAt: portfolio.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const updateTemplate = async (req, res, next) => {
  try {
    const { template } = req.body;

    if (!template) {
      return res.status(400).json({
        success: false,
        message: "Template is required",
      });
    }

    const portfolio = await Portfolio.findOneAndUpdate(
      { userId: req.user._id },
      { $set: { template } },
      { new: true, runValidators: true },
    );

    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Template updated successfully",
      template: portfolio.template,
      updatedAt: portfolio.updatedAt,
    });
  } catch (error) {
    next(error);
  }
};

export const getPortfolio = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      return res.status(200).json({
        success: true,
        portfolio: null,
      });
    }

    return res.status(200).json({
      success: true,
      portfolio,
    });
  } catch (error) {
    next(error);
  }
};
