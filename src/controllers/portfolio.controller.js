import Portfolio from "../models/portfolio.model.js";
import User from "../models/user.model.js";
import fs from "fs";
import path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { uploadToCloudinary } from "../utils/uploadToCloudinary.js";
import { normalizeUrl } from "../utils/normalizeUrl.js";
import { renderTemplate } from "../services/template.service.js";
import { parseResume } from "../services/gemini.js";


const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY
  }
});

const uploadToS3 = async (username, html) => {
  const key = `${username}/index.html`;

  await s3.send(
    new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: key,
      Body: html,
      ContentType: "text/html"
    })
  );
};


export const savePortfolio = async (req, res, next) => {
  try {
    const { template } = req.body;

    if(!template){
      return res.status(400).json({
        success:false,
        message:"Select a template!"
      })
    }

    if (!req.body.data) {
      return res.status(400).json({
        success: false,
        message: "Details required",
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
        hasChanges:true
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
      { $set: { theme, hasChanges: true } },
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
      { $set: { template, hasChanges:  true } },
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


export const deployPortfolio = async (req, res) => {
  try {
    if (!req.user?._id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    if (!/^[a-z0-9-]+$/i.test(user.username)) {
      return res.status(400).json({
        success: false,
        message: "Invalid username"
      });
    }

    const portfolio = await Portfolio.findOne({ userId: user._id });
    if (!portfolio) {
      return res.status(404).json({
        success: false,
        message: "Portfolio not found"
      });
    }

    const html = renderTemplate({
      template: portfolio.template,
      data: portfolio.data,
      theme: portfolio.theme
    });

    await uploadToS3(user.username, html);

    portfolio.deployedUrl = `https://${user.username}.craftly.live`;
    portfolio.status = "live";
    portfolio.hasChanges = false;
    await portfolio.save();

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
    console.error("Deploy error:", error);
    return res.status(500).json({
      success: false,
      message: "Deployment failed"
    });
  }
};

export const getTemplate = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      return res.status(200).json({
        success: true,
        template: null,
      });
    }

    return res.status(200).json({
      success: true,
      template: portfolio.template,
    });
  } catch (error) {
    next(error);
  }
};

export const getTheme = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      return res.status(200).json({
        success: true,
        theme: null,
      });
    }

    return res.status(200).json({
      success: true,
      theme: portfolio.theme,
    });
  } catch (error) {
    next(error);
  }
};



export const getDetails = async (req, res, next) => {
  try {
    const file = req.file;


    if (!file) {
      return res.status(400).json({
        success: false,
        message: "Please upload a resume!",
      });
    }

    const uploadDir = path.join(process.cwd(), "public/uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const fileName = `${file.originalname}`;
    const filePath = path.join(uploadDir, fileName);

    // Save file to disk
    fs.writeFileSync(filePath, file.buffer);

    const details = await parseResume(filePath);

    fs.unlinkSync(filePath);

    return res.status(200).json({
      success: true,
      message: "File uploaded and processed successfully",
      details
    });

  } catch (error) {
    next(error);
  }
};