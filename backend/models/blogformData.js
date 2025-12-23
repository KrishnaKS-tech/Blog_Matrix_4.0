import mongoose from "mongoose";

const blogformSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String, // HTML from TipTap
      required: true,
    },

    tags: {
      type: String,
      required: true,
      trim: true,
    },

    // 🔐 Link blog to logged-in user
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignUpData",
      required: true,
    },
  },
  {
    timestamps: true, // ✅ adds createdAt & updatedAt automatically
  }
);

export default mongoose.model("BlogFormData", blogformSchema);
