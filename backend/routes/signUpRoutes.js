import express from "express";
import SignUpData from "../models/signUpData.js";

const router = express.Router();

// Add a new user
router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, username, password } = req.body;

    // Check if all fields are filled
    if (!firstname || !lastname || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Check if user already exists
    const existingUser = await SignUpData.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create and save new user
    const newUser = new SignUpData({
      firstname,
      lastname,
      username,
      password,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch all data
router.get("/", async (req, res) => {
  try {
    const users = await SignUpData.find();
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
