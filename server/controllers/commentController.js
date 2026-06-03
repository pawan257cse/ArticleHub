const Comment = require("../models/Comment");
const Post = require("../models/Post");


// Add comment to a post
exports.addComment = async (req, res) => {
  try {
    if (!req.body || !req.body.content) {
      return res.status(400).json({ message: "Comment content required" });
    }

    const { content } = req.body;
    const postId = req.params.postId;

    const post = await Post.findById(postId);
    if (!post || post.status !== "published") {
      return res.status(404).json({ message: "Post not found" });
    }

    const comment = await Comment.create({
      content,
      author: req.user,
      post: postId
    });

    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


 //Delete comment (author )
exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    if (comment.author.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed" });
    }

    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
