import mongoose, { Schema, models } from "mongoose";

const managerSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "manager" },
  },
  { timestamps: true }
);

// Forces Mongoose to use the exact collection name 'manager'
const Manager = models.Manager || mongoose.model("Manager", managerSchema, "manager");

export default Manager;