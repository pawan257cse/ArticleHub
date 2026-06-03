const express = require("express");
const auth = require("../middleware/authMiddleware");
const { upload, handleCloudinaryUpload } = require("../middleware/upload"); // multer config
const {
  createPost,
  getPublishedPosts,
  getMyPosts,
  updatePost,
  togglePostStatus,
  searchPosts,
  getPostsByCategory,
  toggleLike,
  getUserProfilePosts,
  getSinglePost
} = require("../controllers/postController");

const router = express.Router();


// PUBLIC
router.get("/", getPublishedPosts);
router.get("/search", searchPosts);
router.get("/category/:category", getPostsByCategory);
router.get("/user/:userId", getUserProfilePosts);

// AUTH (MUST be above :id)
router.get("/my", auth, getMyPosts);

// CREATE / UPDATE
router.post("/", auth, upload.single("image"), handleCloudinaryUpload, createPost);
router.put("/:id", auth, upload.single("image"), handleCloudinaryUpload, updatePost);

router.patch("/:id/status", auth, togglePostStatus);
router.post("/:id/like", auth, toggleLike);

// SINGLE POST (LAST)
router.get("/:id", getSinglePost);

module.exports = router;
