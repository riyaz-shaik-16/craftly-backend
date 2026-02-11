import { z } from "zod"

export const portfolioSchema = z.object({

  template: z.string().min(1),

  theme: z.object({
    primary: z.string().min(1),
    background: z.string().min(1),
    text: z.string().min(1),
    accent: z.string().optional(),
    font: z.string().optional(),
    layout: z.string().optional()
  }),

  data: z.object({

    /* ---------- PERSONAL ---------- */

    personal: z.object({
      name: z.string().optional(),
      title: z.string().optional(),
      email: z.string().email().optional(),
      phone: z.string().optional(),
      location: z.string().optional(),
      bio: z.string().optional(),
      avatar: z.string().optional()
    }),

    /* ---------- PROJECTS ---------- */

    projects: z.array(
      z.object({
        title: z.string().min(1),
        description: z.string().min(1),
        techStack: z.array(z.string()).optional(),
        githubLink: z.string().optional(),
        liveLink: z.string().optional(),
        featured: z.boolean().optional()
      })
    ).optional(),

    /* ---------- EXPERIENCE ---------- */

    experience: z.array(
      z.object({
        company: z.string().min(1),
        role: z.string().min(1),
        startDate: z.string().optional(), // can switch to z.date() if backend expects Date
        endDate: z.string().optional(),
        current: z.boolean().optional(),
        description: z.string().optional()
      })
    ).optional(),

    /* ---------- SKILLS ---------- */

    skills: z.array(
      z.object({
        name: z.string().min(1),
        category: z.string().optional(),
        level: z.number().min(1).max(5).optional()
      })
    ).optional(),

    /* ---------- EDUCATION ---------- */

    education: z.array(
      z.object({
        institution: z.string().min(1),
        degree: z.string().min(1),
        field: z.string().optional(),
        startDate: z.string().optional(),
        endDate: z.string().optional()
      })
    ).optional(),

    /* ---------- CERTIFICATIONS ---------- */

    certifications: z.array(
      z.object({
        name: z.string().min(1),
        issuer: z.string().optional(),
        issueDate: z.string().optional(),
        credentialUrl: z.string().optional()
      })
    ).optional(),

    /* ---------- ACHIEVEMENTS ---------- */

    achievements: z.array(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        date: z.string().optional()
      })
    ).optional(),

    /* ---------- SOCIAL LINKS ---------- */

    socialLinks: z.object({
      github: z.string().optional(),
      linkedin: z.string().optional(),
      twitter: z.string().optional(),
      website: z.string().optional()
    }).optional()
  }),

  /* ---------- SEO ---------- */

  seo: z.object({
    metaTitle: z.string().optional(),
    metaDescription: z.string().optional(),
    keywords: z.array(z.string()).optional()
  }).optional(),

  /* ---------- ANALYTICS ---------- */

  analytics: z.object({
    views: z.number().optional()
  }).optional()

})


