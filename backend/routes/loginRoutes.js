import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import SignUpData from "../models/signUpData.js";

const router = express.Router();
const SECRET_KEY = "yourSecretKey123"; // ⚠️ move to .env in production

// 🟢 LOGIN route
router.post("/", async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await SignUpData.findOne({ username });
    if (!user) return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid password" });

    // ✅ Generate JWT
    const token = jwt.sign(
      { id: user._id, username: user.username },
      SECRET_KEY,
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
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await SignUpData.findById(decoded.id).select("-password"); // exclude password
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: "Invalid or expired token" });
  }
});

export default router;
