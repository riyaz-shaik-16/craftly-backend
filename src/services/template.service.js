import fs from "fs";
import path from "path";
import Handlebars from "handlebars";

const loadTemplate = (templateName) => {
  const templateDir = path.join(process.env.TEMPLATE_DIR, templateName);

  const htmlPath = path.join(templateDir, "index.html");
  const cssPath = path.join(templateDir, "style.css");

  if (!fs.existsSync(htmlPath) || !fs.existsSync(cssPath)) {
    throw new Error("Template files not found");
  }

  const html = fs.readFileSync(htmlPath, "utf-8");
  const css = fs.readFileSync(cssPath, "utf-8");

  return { html, css };
};

export const renderTemplate = ({ template, theme, data }) => {
  const { html, css } = loadTemplate(template);

  // Inline CSS into HTML (iframe-safe)
  const fullHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          ${css}
        </style>
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  const compiled = Handlebars.compile(fullHtml);

  return compiled({
    theme,
    ...data
  });
};
