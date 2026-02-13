// import fs from "fs";
// import path from "path";
// import Handlebars from "handlebars";

// const loadTemplate = (templateName) => {
//   const templateDir = path.join(process.env.TEMPLATE_DIR, templateName);

//   const htmlPath = path.join(templateDir, "index.html");
//   const cssPath = path.join(templateDir, "style.css");

//   if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath)) {
//     throw new Error("Template files not found");
//   }

//   const html = fs.readFileSync(htmlPath, "utf-8");
//   const css = fs.readFileSync(cssPath, "utf-8");

//   return { html, css };
// };

// const formatDate = (date) => {
//   if (!date) return "";
//   const d = new Date(date);
//   return d.toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "short",
//   });
// };

// const normalizePortfolioData = (data) => {
//   return {
//     // Personal
//     personal: {
//       name: data.personal?.name || "",
//       title: data.personal?.title || "",
//       summary: data.personal?.bio || "",
//       email: data.personal?.email || "",
//       phone: data.personal?.phone || "",
//       location: data.personal?.location || "",
//       avatar: data.personal?.avatar || null,
//     },

//     // Skills → Only names
//     skills: Array.isArray(data.skills)
//       ? data.skills.map((skill) => skill.name)
//       : [],

//     // Projects → Unified structure
//     projects: Array.isArray(data.projects)
//       ? data.projects.map((project) => ({
//           name: project.title,
//           description: project.description,
//           link:
//             project.liveLink && project.liveLink !== "na"
//               ? project.liveLink
//               : project.githubLink
//                 ? `https://${project.githubLink}`
//                 : null,
//           featured: project.featured || false,
//         }))
//       : [],

//     // Experience
//     experience: Array.isArray(data.experience)
//       ? data.experience.map((exp) => ({
//           position: exp.position || "",
//           company: exp.company || "",
//           startDate: formatDate(exp.startDate),
//           endDate: formatDate(exp.endDate) || "Present",
//           description: exp.description || "",
//         }))
//       : [],

//     // Education
//     education: Array.isArray(data.education)
//       ? data.education.map((edu) => ({
//           degree: edu.degree,
//           field: edu.field,
//           institution: edu.institution,
//           startDate: formatDate(edu.startDate),
//           endDate: formatDate(edu.endDate),
//         }))
//       : [],

//     // Certifications
//     certifications: Array.isArray(data.certifications)
//       ? data.certifications.map((cert) => ({
//           name: cert.name,
//           issuer: cert.issuer,
//           year: cert.issueDate ? new Date(cert.issueDate).getFullYear() : "",
//         }))
//       : [],

//     // Achievements
//     achievements: Array.isArray(data.achievements)
//       ? data.achievements.map((ach) => ({
//           title: ach.title,
//           description: ach.description,
//           date: formatDate(ach.date),
//         }))
//       : [],

//     // Social Links → Convert object to array
//     socialLinks: data.socialLinks
//       ? Object.entries(data.socialLinks).map(([platform, url]) => ({
//           platform,
//           url,
//         }))
//       : [],
//   };
// };

// export const renderTemplate = ({ template, theme, data }) => {
//   const { html, css } = loadTemplate(template);
//   const transformedData = normalizePortfolioData(data);
//   // console.log(transformedData);

//   console.log(theme)
//   // Inline CSS into HTML (iframe-safe)
//   const fullHtml = `
//     <!DOCTYPE html>
//     <html>
//       <head>
//         <meta charset="UTF-8" />
//         <style>
//           ${css}
//         </style>
//       </head>
//       <body>
//         ${html}
//       </body>
//     </html>
//   `;

//   const compiled = Handlebars.compile(fullHtml);

//   return compiled({
//     theme,
//     ...transformedData,
//   });
// };

import fs from "fs";
import path from "path";
import Handlebars from "handlebars";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ---------- REGISTER CUSTOM HANDLEBARS HELPERS ----------
Handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});

Handlebars.registerHelper("firstLetter", function (str) {
  return str && typeof str === "string" ? str.charAt(0).toUpperCase() : "";
});

// ---------- UTILITIES ----------
const loadTemplate = (templateName) => {
  console.log("Template name: ", templateName);
  const templateDir = path.join(__dirname, "../../templates", templateName);

  console.log("templateDir: ", templateDir);

  const htmlPath = path.join(templateDir, "index.html");
  const cssPath = path.join(templateDir, "style.css");

  console.log("htmlpath: ", htmlPath);
  console.log("csspath: ", cssPath);

  console.log("!fs.existsSync(htmlPath): ", !fs.existsSync(htmlPath));

  if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath)) {
    throw new Error("Template files not found");
  }

  const html = fs.readFileSync(htmlPath, "utf-8");
  const css = fs.readFileSync(cssPath, "utf-8");

  return { html, css };
};

const formatDate = (date) => {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
};

const hexToRgb = (hex) => {
  // Remove # if present
  hex = hex.replace(/^#/, "");
  // Parse 3- or 6-digit hex
  let r, g, b;
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }
  return `${r}, ${g}, ${b}`;
};

const normalizePortfolioData = (data) => {
  return {
    personal: {
      name: data.personal?.name || "",
      title: data.personal?.title || "",
      summary: data.personal?.bio || "",
      email: data.personal?.email || "",
      phone: data.personal?.phone || "",
      location: data.personal?.location || "",
      avatar: data.personal?.avatar || null,
    },
    skills: Array.isArray(data.skills)
      ? data.skills.map((skill) => skill.name)
      : [],
    projects: Array.isArray(data.projects)
      ? data.projects.map((project) => ({
          title: project.title || "",
          description: project.description || "",
          techStack: Array.isArray(project.techStack) ? project.techStack : [],
          githubLink: project.githubLink
            ? project.githubLink.startsWith("http")
              ? project.githubLink
              : `https://${project.githubLink}`
            : null,
          demoLink: project.demoLink
            ? project.demoLink.startsWith("http")
              ? project.demoLink
              : `https://${project.demoLink}`
            : null,
          liveLink: project.liveLink
            ? project.liveLink.startsWith("http")
              ? project.liveLink
              : `https://${project.liveLink}`
            : null,
          images: Array.isArray(project.images) ? project.images : [],
          featured: project.featured || false,
        }))
      : [],

    experience: Array.isArray(data.experience)
      ? data.experience.map((exp) => ({
          position: exp.position || "",
          company: exp.company || "",
          startDate: formatDate(exp.startDate),
          endDate: formatDate(exp.endDate) || "Present",
          description: exp.description || "",
        }))
      : [],
    education: Array.isArray(data.education)
      ? data.education.map((edu) => ({
          degree: edu.degree,
          field: edu.field,
          institution: edu.institution,
          startDate: formatDate(edu.startDate),
          endDate: formatDate(edu.endDate),
        }))
      : [],
    certifications: Array.isArray(data.certifications)
  ? data.certifications.map((cert) => ({
      name: cert.name || "",
      issuer: cert.issuer || "",
      year: cert.issueDate
        ? new Date(cert.issueDate).getFullYear()
        : "",
      images: Array.isArray(cert.images)
        ? cert.images
        : [],
    }))
  : [],

    achievements: Array.isArray(data.achievements)
      ? data.achievements.map((ach) => ({
          title: ach.title,
          description: ach.description,
          date: formatDate(ach.date),
        }))
      : [],
    socialLinks: data.socialLinks
      ? Object.entries(data.socialLinks).map(([platform, url]) => ({
          platform,
          url,
        }))
      : [],
  };
};

Handlebars.registerHelper("rand", function (min, max) {
  min = parseInt(min);
  max = parseInt(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
});

Handlebars.registerHelper("capitalize", function (str) {
  if (!str) return "";
  str = String(str);
  return str.charAt(0).toUpperCase() + str.slice(1);
});


Handlebars.registerHelper("multiply", function (a, b) {
  return Number(a) * Number(b);
});


// ---------- MAIN RENDER FUNCTION ----------
export const renderTemplate = ({ template, theme, data }) => {
  const { html, css } = loadTemplate(template);
  const transformedData = normalizePortfolioData(data);

  // Prepare theme variables for CSS injection
  const themeVars = `
    :root {
      --primary: ${theme.primary || "#6366f1"};
      --primary-rgb: ${hexToRgb(theme.primary || "#6366f1")};
      --accent: ${theme.accent || "#22c55e"};
      --accent-rgb: ${hexToRgb(theme.accent || "#22c55e")};
      --background: ${theme.background || "#ffffff"};
      --text: ${theme.text || "#111827"};
    }
  `;

  // Build the full HTML document with proper <head>
  const fullHtml = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${transformedData.personal.name || "Portfolio"}</title>
        
        <!-- Google Fonts -->
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        
        <!-- Font Awesome 6 -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
        
        <!-- User‑selected theme as CSS variables -->
        <style>${themeVars}</style>
        
        <!-- Main template styles -->
        <style>${css}</style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  // Compile the full HTML with Handlebars and inject the data
  const compiled = Handlebars.compile(fullHtml);
  return compiled({
    theme, // still passed if needed inside body
    ...transformedData,
  });
};
