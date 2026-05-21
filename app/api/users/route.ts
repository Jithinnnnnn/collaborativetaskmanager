import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../lib/User";

export async function GET() {
  try {
    await connectMongoDB();
    const users = await User.find({}, "_id name email"); // Only fetch necessary fields
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching users" }, { status: 500 });
  }
}