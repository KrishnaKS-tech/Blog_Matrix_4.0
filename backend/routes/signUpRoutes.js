// Import Express framework
import express from "express";

// Import Mongoose model for signup data
import SignUpData from "../models/signUpData.js";

// Create a new Express router
const router = express.Router();

/**
 * 🟢 SIGN UP ROUTE
 * Method: POST
 * Access: Public
 * Purpose:
 *  - Registers a new user
 *  - Stores user details in database
 */
router.post("/", async (req, res) => {
  try {
    // Destructure user data from request body
    const { firstname, lastname, username, password } = req.body;

    // 🔍 Validation: Check if all required fields are provided
    if (!firstname || !lastname || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 🔍 Check if a user with the same username already exists
    const existingUser = await SignUpData.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🆕 Create a new user document
    const newUser = new SignUpData({
      firstname,
      lastname,
      username,
      password, // ⚠️ Should be hashed in production (bcrypt)
    });

    // 💾 Save user to database
    await newUser.save();

    // ✅ Send success response
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // ❌ Handle server errors
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

/**
 * 🟢 GET ALL USERS
 * Method: GET
 * Access: Public (can be protected later)
 * Purpose:
 *  - Fetches all registered users from database
 */
router.get("/", async (req, res) => {
  try {
    // Fetch all users from database
    const users = await SignUpData.find();

    // Send users as JSON response
    res.json(users);
  } catch (error) {
    // Handle server errors
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Export router to be used in main server file
export default router;
