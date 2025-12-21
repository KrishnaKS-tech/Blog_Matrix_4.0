import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import signUpRoutes from "./routes/signUpRoutes.js";
import loginRoutes from "./routes/loginRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/signupdata", signUpRoutes);
app.use("/api/login", loginRoutes);

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(process.env.PORT, () =>
  console.log(`🚀 Server running on port ${process.env.PORT}`)
);
