import mongoose from "mongoose"

const portfolioSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    template: {
      type: String,
      required: true
    },

    theme: {
      primary: String,
      background: String,
      text: String,
      accent: String,
      font: String,
      layout: String
    },

    data: {
      personal: {
        name: String,
        title: String,
        email: String,
        phone: String,
        location: String,
        bio: String,
        avatar: String
      },

      projects: [
        {
          title: String,
          description: String,
          techStack: [String],
          githubLink: String,
          liveLink: String,
          featured: {
            type: Boolean,
            default: false
          }
        }
      ],

      experience: [
        {
          company: String,
          role: String,
          startDate: Date,
          endDate: Date,
          current: Boolean,
          description: String
        }
      ],

      skills: [
        {
          name: String,
          category: String,
          level: Number 
        }
      ],

      education: [
        {
          institution: String,
          degree: String,
          field: String,
          startDate: Date,
          endDate: Date
        }
      ],

      certifications: [
        {
          name: String,
          issuer: String,
          issueDate: Date,
          credentialUrl: String
        }
      ],

      achievements: [
        {
          title: String,
          description: String,
          date: Date
        }
      ],

      socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        website: String
      }
    },

    seo: {
      metaTitle: String,
      metaDescription: String,
      keywords: [String]
    },

    analytics: {
      views: {
        type: Number,
        default: 0
      }
    },

    status: {
      type: String,
      enum: ["draft", "live"],
      default: "draft"
    },

    deployedUrl: String
  },
  { timestamps: true }
);


export default mongoose.model("Portfolio", portfolioSchema);