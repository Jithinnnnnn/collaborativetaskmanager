import mongoose, { Schema, models } from "mongoose";

const taskSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Links to the User collection
    createdBy: { type: Schema.Types.ObjectId, ref: 'Manager', required: true }, // Links to the Manager collection
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    status: { type: String, enum: ['pending', 'completed'], default: 'pending' },
    deadline: { type: Date, required: true },
    updates: [{ type: String }],
  },
  { timestamps: true }
);

const Task = models.Task || mongoose.model("Task", taskSchema, "task");

export default Task;