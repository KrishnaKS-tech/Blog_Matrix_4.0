import express from "express";
import authenticate from "../middlewares/auth.middleware.js";
import SignUpData from "../models/signUpData.js";

const router = express.Router();

// GET /api/profile
router.get("/", authenticate, async (req, res) => {
  try {
    const user = await SignUpData.findById(req.userId).select("-password");
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to load profile" });
  }
});

// PUT /api/profile
router.put("/", authenticate, async (req, res) => {
  const { firstname, lastname, avatar, bio } = req.body;

  try {
    const user = await SignUpData.findByIdAndUpdate(
      req.userId,
      { firstname, lastname, avatar, bio }, // ✅ Include bio here
      { new: true }
    ).select("-password");

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update profile" });
  }
});

export default router;
