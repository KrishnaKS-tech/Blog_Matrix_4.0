// Import Express framework
import express from "express";

// Import Blog mongoose model
import BlogFormData from "../models/blogformData.js";

// Import authentication middleware (JWT verification)
import authenticate from "../middlewares/auth.middleware.js";

// Create router instance
const router = express.Router();

/**
 * 🔹 CREATE BLOG (Protected Route)
 * Method: POST
 * Access: Only authenticated users
 * Description:
 *  - Creates a new blog post
 *  - Links the blog to the logged-in user via JWT
 */
router.post("/", authenticate, async (req, res) => {
  try {
    // Extract blog data from request body
    const { title, description, tags } = req.body;

    // Create new blog document
    const blog = new BlogFormData({
      title,
      description,
      tags,
      author: req.userId, // 🔐 userId injected by auth middleware
    });

    // Save blog to database
    await blog.save();

    // Return created blog
    res.status(201).json(blog);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Failed to create blog" });
  }
});

/**
 * 🔹 GET MY BLOGS (Protected Route)
 * Method: GET
 * Access: Only authenticated users
 * Description:
 *  - Fetches blogs created by the logged-in user
 */
router.get("/myblogs", authenticate, async (req, res) => {
  try {
    // Find blogs where author matches logged-in user
    const blogs = await BlogFormData.find({ author: req.userId });

    // Return user's blogs
    res.json(blogs);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

/**
 * 🔹 GET ALL BLOGS (Public Route)
 * Method: GET
 * Access: Public
 * Description:
 *  - Fetches all blogs
 *  - Populates author field with username
 */
router.get("/allblogs", async (req, res) => {
  try {
    // Fetch all blogs and include author's username
    const blogs = await BlogFormData.find().populate("author", "username"); // Only fetch username from author

    // Return blogs
    res.json(blogs);
  } catch (error) {
    // Handle server errors
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
});

/**
 * 🔹 DELETE BLOG (Protected Route)
 * Method: DELETE
 * Access: Only authenticated users
 * Description:
 *  - Deletes a blog by ID
 *  - Only the blog's author can delete their blog
 */
router.delete("/:id", authenticate, async (req, res) => {
  try {
    // Find blog by ID
    const blog = await BlogFormData.findById(req.params.id);

    // If blog does not exist
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Authorization check:
    // Logged-in user must be the blog author
    if (blog.author.toString() !== req.userId)
      return res.status(403).json({ message: "Not authorized" });

    // Delete blog
    await blog.deleteOne();

    // Success response
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    // Handle server errors
    res.status(500).json({ message: "Failed to delete blog" });
  }
});

// Export router to use in main app
export default router;
