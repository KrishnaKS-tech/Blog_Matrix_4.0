import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SignUpData from "../models/signUpData.js";

const router = express.Router();

// 🟢 LOGIN route
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await SignUpData.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // ✅ Generate JWT using secret from .env
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.SECRET_KEY, // now uses .env
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login successful",
      token,
      user: { id: user._id, username: user.username },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// 🟢 VERIFY TOKEN route
router.get("/verify", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY); // uses .env
    const user = await SignUpData.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
