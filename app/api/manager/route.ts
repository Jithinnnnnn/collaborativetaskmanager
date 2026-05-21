import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Manager from "../../../lib/Manager";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectMongoDB();

    // REGISTRATION LOGIC
    if (body.action === "register") {
      const existingManager = await Manager.findOne({ email: body.email });
      if (existingManager) return NextResponse.json({ message: "Email already exists." }, { status: 400 });

      const hashedPassword = await bcrypt.hash(body.password, 10);
      await Manager.create({ name: body.name, email: body.email, password: hashedPassword });
      return NextResponse.json({ message: "Manager registered successfully." }, { status: 201 });
    }

    // LOGIN LOGIC
    if (body.action === "login") {
      const manager = await Manager.findOne({ email: body.email });
      if (!manager) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

      const match = await bcrypt.compare(body.password, manager.password);
      if (!match) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

      return NextResponse.json({
        message: "Logged in",
        manager: { id: manager._id, name: manager.name, email: manager.email, role: "manager" }
      }, { status: 200 });
    }

    return NextResponse.json({ message: "Invalid action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ message: "Server error." }, { status: 500 });
  }
}