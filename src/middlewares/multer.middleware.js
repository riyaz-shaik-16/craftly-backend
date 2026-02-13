import multer from "multer";

// Store uploaded files in memory instead of disk
const storage = multer.memoryStorage();

// Validate that only image files are accepted
const fileFilter = (_req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

// Configure multer with storage, file validation, and 5MB size limit
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export default upload;