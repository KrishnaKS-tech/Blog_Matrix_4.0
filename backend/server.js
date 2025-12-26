// Import Express framework to create server and routes
import express from "express";

// Import CORS middleware to allow cross-origin requests (frontend ↔ backend)
import cors from "cors";

// Import Mongoose to connect and interact with MongoDB
import mongoose from "mongoose";

// Import dotenv to load environment variables from .env file
import dotenv from "dotenv";

// Import application routes
import signUpRoutes from "./routes/signUpRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";
import blogFormRoutes from "./routes/blogFormRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

// Load environment variables (MONGO_URL, PORT, SECRET_KEY, etc.)
dotenv.config();

// Create Express application
const app = express();

// Enable CORS so frontend (e.g., React) can call backend APIs
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

/**
 * 🔹 API Routes
 * These routes handle different parts of the application
 */

// User signup routes
app.use("/api/signupdata", signUpRoutes);

// User login + token verification routes
app.use("/api/login", loginRoutes);

// Blog CRUD routes (create, read, delete, etc.)
app.use("/api/blogs", blogFormRoutes);

app.use("/api/profile", profileRoutes);

/**
 * 🔹 MongoDB Connection
 * Connects backend to MongoDB using Mongoose
 */
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

/**
 * 🔹 Start Server
 * Listens on the port defined in .env
 */
app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
