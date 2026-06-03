const multer = require("multer");
const cloudinary = require("cloudinary").v2;

// Configure Cloudinary
// Check if credentials are present, otherwise log warning
if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
} else {
  console.warn("WARNING: Cloudinary is not fully configured in environment variables!");
}

// Memory storage is used since we stream directly to Cloudinary
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only image files are allowed"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware to upload file to Cloudinary
const handleCloudinaryUpload = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  // Ensure Cloudinary is configured
  if (!process.env.CLOUDINARY_CLOUD_NAME || process.env.CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
    return res.status(500).json({
      message: "Cloudinary upload failed: Cloud name is not configured. Please add CLOUDINARY_CLOUD_NAME to server/.env file."
    });
  }

  try {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "blog_platform",
        resource_type: "auto"
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary Upload Error:", error);
          return res.status(500).json({ message: "Cloudinary upload failed", error: error.message });
        }
        // Store the secure url in req.file.path so controllers can use it uniformly
        req.file.path = result.secure_url;
        next();
      }
    );

    uploadStream.end(req.file.buffer);
  } catch (error) {
    console.error("Cloudinary upload middleware error:", error);
    res.status(500).json({ message: "Server error during image upload", error: error.message });
  }
};

module.exports = {
  upload,
  handleCloudinaryUpload
};

