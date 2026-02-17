import Portfolio from "../models/portfolio.model.js";

export const getDashboard = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({ userId: req.user._id });

    // Return empty state if no portfolio exists
    if (!portfolio) {
      return res.status(200).json({
        success: true,
        state: "empty"
      });
    }

    // Return draft state with minimal portfolio info
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

    if (portfolio.status === "new") {
      return res.status(200).json({
        success: true,
        state: "new",
        portfolio: {
          template: portfolio.template,
          updatedAt: portfolio.updatedAt
        }
      });
    }

    // Return live state with deployed URL
    return res.status(200).json({
      success: true,
      state: "live",
      portfolio: {
        template: portfolio.template,
        deployedUrl: portfolio.deployedUrl,
        updatedAt: portfolio.updatedAt,
        hasChanges: portfolio.hasChanges
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getBuilderOverview = async (req, res, next) => {
  try {
    const portfolio = await Portfolio.findOne({
      userId: req.user._id,
    });

    if (!portfolio) {
      return res.status(200).json({
        state: "empty",
      });
    }

    const data = portfolio.data || {};

    // Calculate completion status for each portfolio section
    const completion = {
      personal: !!data.personal?.name,
      projects: (data.projects?.length || 0) > 0,
      experience: (data.experience?.length || 0) > 0,
      skills: (data.skills?.length || 0) > 0,
      education: (data.education?.length || 0) > 0,
      certifications: (data.certifications?.length || 0) > 0,
      achievements: (data.achievements?.length || 0) > 0,
      theme: !!portfolio.theme,
    };

    // Calculate overall completion percentage
    const totalSections = Object.keys(completion).length;
    const completedSections = Object.values(completion).filter(Boolean).length;
    const percentage = Math.round((completedSections / totalSections) * 100);

    return res.status(200).json({
      state: portfolio.status, 
      template: portfolio.template,
      completion,
      completionPercentage: percentage,
      counts: {
        projects: data.projects?.length || 0,
        experience: data.experience?.length || 0,
        skills: data.skills?.length || 0,
      },
      updatedAt: portfolio.updatedAt,
    });

  } catch (error) {
    next(error);
  }
};