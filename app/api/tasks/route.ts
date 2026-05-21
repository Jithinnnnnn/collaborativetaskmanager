import { NextResponse } from "next/server";
import { connectMongoDB } from "../../../lib/mongodb";
import Task from "../../../lib/Task";
import User from "../../../lib/User"; // Needed to populate user details

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectMongoDB();
    const newTask = await Task.create(body);
    return NextResponse.json({ message: "Task created", task: newTask }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating task" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId");
    
    await connectMongoDB();
    // Fetch tasks created by this manager and populate the assigned user's name
    const tasks = await Task.find({ createdBy: managerId }).populate('assignedTo', 'name email');
    return NextResponse.json({ tasks }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error fetching tasks" }, { status: 500 });
  }
}