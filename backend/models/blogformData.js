import mongoose from "mongoose";

const blogformSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    tags: {
      type: String,
      required: true,
    },

    // 🔐 Link blog to user
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SignUpData", // your User model name
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("BlogFormData", blogformSchema);
