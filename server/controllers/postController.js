const Post = require("../models/Post");


 // Create new blog post (default: draft)
 exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const post = await Post.create({
      title,
      content,
      category,
      author: req.user,
      status: "draft",
      image: req.file ? req.file.path : null
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Get published Post
exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "published" })
      .populate("author", "name")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//Logged User Posts
exports.getMyPosts = async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user })
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//update post- author only
exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.category = req.body.category || post.category;

 if (req.file) {
  post.image = req.file.path;
}

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



//publish and unpublish (draft posts)
exports.togglePostStatus = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user) {
      return res.status(403).json({ message: "Not allowed" });
    }

    post.status = post.status === "draft" ? "published" : "draft";
    await post.save();

    res.json({ status: post.status });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//search published post with title or content
exports.searchPosts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ message: "Search query missing" });
    }

    const posts = await Post.find({
      status: "published",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } }
      ]
    }).populate("author", "name");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//Filter published posts by category
exports.getPostsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const posts = await Post.find({
      category,
      status: "published"
    }).populate("author", "name");

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Lik oe Unlike
exports.toggleLike = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post || post.status !== "published") {
      return res.status(404).json({ message: "Post not found" });
    }

    const userId = req.user;
    const index = post.likes.indexOf(userId);

    if (index === -1) {
      post.likes.push(userId);
    } else {
      post.likes.splice(index, 1);
    }

    await post.save();

    res.json({ likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//get published posts by a specific user
exports.getUserProfilePosts = async (req, res) => {
  try {
    const userId = req.params.userId;

    const posts = await Post.find({
      author: userId,
      status: "published"
    }).sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSinglePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("author", "name");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};