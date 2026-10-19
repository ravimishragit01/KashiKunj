const router = require("express").Router();
const Blog = require("../models/Blog");

// GET: Fetch all blog posts (sorted by order)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ order: 1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
});

// GET: Fetch a single blog post by its slug
router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug });
    if (!blog) return res.status(404).json({ error: "Blog post not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
