import mongoose from "mongoose";

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
      default:"modern"
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
          demoLink: String,
          liveLink: String,
          images: [String],
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
          images: [String]
        }
      ],

      achievements: [
        {
          title: String,
          description: String,
          date: Date,
          images: [String]
        }
      ],

      socialLinks: {
        github: String,
        linkedin: String,
        twitter: String,
        website: String
      }
    },

    status: {
      type: String,
      enum: ["draft", "live","new"],
      default: "new"
    },

    deployedUrl: String
  },
  { timestamps: true }
);

export default mongoose.model("Portfolio", portfolioSchema);
