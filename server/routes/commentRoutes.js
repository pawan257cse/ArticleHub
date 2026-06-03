const express = require("express");
const auth = require("../middleware/authMiddleware");
const {
  addComment,
  deleteComment
} = require("../controllers/commentController");

const router = express.Router();

router.post("/:postId", auth, addComment);
router.delete("/:id", auth, deleteComment);

module.exports = router;
