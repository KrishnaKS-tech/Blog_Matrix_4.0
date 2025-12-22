import express from "express";
import BlogFormData from "../models/blogformData.js";
import authenticate from "../middlewares/auth.middleware.js";

const router = express.Router();

/**
 * CREATE BLOG (Protected)
 */
router.post("/", authenticate, async (req, res) => {
  try {
    const { title, description, tags } = req.body;

    const blog = new BlogFormData({
      title,
      description,
      tags,
      author: req.userId, // 🔥 comes from JWT
    });

    await blog.save();
    res.status(201).json(blog);
  } catch (error) {
    res.status(500).json({ message: "Failed to create blog" });
  }
});

/**
 * GET MY BLOGS (Protected)
 */
router.get("/myblogs", authenticate, async (req, res) => {
  try {
    const blogs = await BlogFormData.find({ author: req.userId });
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

/**
 * GET ALL BLOGS (Public)
 */
router.get("/allblogs", async (req, res) => {
  try {
    const blogs = await BlogFormData.find().populate("author", "username"); // show author name
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

export default router;

// blogFormRoutes.js
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const blog = await BlogFormData.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Only author can delete
    if (blog.author.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    await blog.deleteOne();
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete blog" });
  }
});
