import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/lib/User";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();
    await connectMongoDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 400 });
    }

    // Hash the password for security
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save to the 'user' collection
    await User.create({ name, email, password: hashedPassword });

    return NextResponse.json({ message: "User registered successfully." }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "An error occurred during registration." }, { status: 500 });
  }
}