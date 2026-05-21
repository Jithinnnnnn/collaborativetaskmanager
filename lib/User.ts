// lib/User.ts
import mongoose, { Schema, models } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" }, 
  },
  { timestamps: true }
);

// The "user" at the end explicitly tells Mongoose to use your exact collection name.
const User = models.User || mongoose.model("User", userSchema, "user");

export default User;