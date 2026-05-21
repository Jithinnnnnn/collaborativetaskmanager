import { NextResponse } from "next/server";
import { connectMongoDB } from "@/lib/mongodb";
import User from "@/lib/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    await connectMongoDB();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return NextResponse.json({ message: "Invalid email or password." }, { status: 401 });
    }

    // Create JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET as string,
      { expiresIn: "24h" }
    );

    // Return the user data and token to be saved in Zustand frontend state
    return NextResponse.json({
      message: "Logged in successfully.",
      user: { id: user._id, name: user.name, email: user.email, role: user.role, token }
    }, { status: 200 });

  } catch (error) {
    return NextResponse.json({ message: "An error occurred during login." }, { status: 500 });
  }
}