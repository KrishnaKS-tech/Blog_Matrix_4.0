// Import Express framework to create routes
import express from "express";

// Import bcrypt for hashing & comparing passwords securely
import bcrypt from "bcrypt";

// Import jsonwebtoken for creating and verifying JWT tokens
import jwt from "jsonwebtoken";

// Import User (Signup) mongoose model
import SignUpData from "../models/signUpData.js";

// Create an Express router instance
const router = express.Router();

/**
 * 🟢 LOGIN ROUTE
 * Method: POST
 * URL: /api/login
 * Access: Public
 *
 * Purpose:
 *  - Authenticates user credentials
 *  - Generates JWT token on successful login
 */
router.post("/", async (req, res) => {
  // Extract username and password from request body
  const { username, password } = req.body;

  try {
    // 🔍 Find user by username in database
    const user = await SignUpData.findOne({ username });

    // If user does not exist, return error
    if (!user) return res.status(400).json({ message: "User not found" });

    // 🔐 Compare entered password with hashed password in DB
    const isMatch = await bcrypt.compare(password, user.password);

    // If password is incorrect, return error
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    /**
     * ✅ Generate JWT token
     * Payload:
     *  - user id
     *  - username
     *
     * Secret key:
     *  - Stored securely in .env file
     *
     * Token expires in 1 hour
     */
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Send success response with token & basic user info
    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (err) {
    // Handle unexpected server errors
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🟢 VERIFY TOKEN ROUTE
 * Method: GET
 * URL: /api/login/verify
 * Access: Protected
 *
 * Purpose:
 *  - Verifies JWT token
 *  - Returns logged-in user details
 *  - Used for auto-login / session persistence
 */
router.get("/verify", async (req, res) => {
  // Get Authorization header
  // Expected format: "Bearer <token>"
  const authHeader = req.headers.authorization;

  // If no token is provided, deny access
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  // Extract token from header
  const token = authHeader.split(" ")[1];

  try {
    // 🔐 Verify token using secret key
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    // Fetch user details using decoded user ID
    // Exclude password for security
    const user = await SignUpData.findById(decoded.id).select("-password");

    // If user does not exist
    if (!user) return res.status(404).json({ message: "User not found" });

    // Send authenticated user data
    res.json({ user });
  } catch (err) {
    // Token invalid or expired
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

// Export router to use in main app
export default router;
