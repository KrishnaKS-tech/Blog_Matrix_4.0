import mongoose from "mongoose";
import bycrpt from "bcrypt";

const signUpSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
});

signUpSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bycrpt.genSalt(10);
    this.password = await bycrpt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

export default mongoose.model("SignUpData", signUpSchema);
