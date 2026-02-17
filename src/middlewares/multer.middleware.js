import multer from "multer";

// Store uploaded files in memory instead of disk
const storage = multer.memoryStorage();

// Allow images + PDFs
const fileFilter = (_req, file, cb) => {
  const isImage = file.mimetype.startsWith("image/");
  const isPDF = file.mimetype === "application/pdf";

  if (isImage || isPDF) {
    cb(null, true);
  } else {
    cb(new Error("Only image files and PDFs are allowed"), false);
  }
};

// Configure multer with storage, validation, and 5MB size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;