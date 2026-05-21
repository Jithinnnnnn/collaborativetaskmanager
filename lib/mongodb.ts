import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

export const connectMongoDB = async () => {
  try {
    if (mongoose.connection.readyState === 1) {
      return; // Already connected
    }
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB Compass.");
  } catch (error) {
    console.log("Error connecting to MongoDB: ", error);
  }
};