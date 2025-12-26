// Import mongoose to define schema and interact with MongoDB
import mongoose from "mongoose";

// Import bcrypt for hashing passwords before saving
import bcrypt from "bcrypt";

// Define schema for user signup data
const signUpSchema = new mongoose.Schema({
  // User's first name
  firstname: {
    type: String,
    required: true, // Mandatory field
  },

  // User's last name
  lastname: {
    type: String,
    required: true, // Mandatory field
  },

  // Username used for login
  username: {
    type: String,
    required: true, // Mandatory field
    unique: true, // Ensures no duplicate usernames
  },

  // User password (will be hashed before saving)
  password: {
    type: String,
    required: true, // Mandatory field
  },
  avatar: {
    type: String,
    default: "/avatars/default.jpg",
  },
  bio: { type: String, default: "" },
});

/**
 * 🔐 Pre-save Middleware
 * Purpose:
 *  - Hash the password before saving it to the database
 *  - Runs automatically before `.save()` is executed
 */
signUpSchema.pre("save", async function (next) {
  // If password is NOT modified, skip hashing
  // (important for updates where password doesn't change)
  if (!this.isModified("password")) return next();

  try {
    // Generate salt with 10 rounds
    const salt = await bcrypt.genSalt(10);

    // Hash the password using the generated salt
    this.password = await bcrypt.hash(this.password, salt);

    // Continue saving the document
    next();
  } catch (error) {
    // Pass error to mongoose error handler
    next(error);
  }
});

// Export the model to use in routes/controllers
export default mongoose.model("SignUpData", signUpSchema);
