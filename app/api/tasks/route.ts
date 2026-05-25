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
  } catch (error: any) {
    console.error("Error creating task:", error);
    return NextResponse.json({ message: "Error creating task", error: error.message }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const managerId = searchParams.get("managerId");
    const userId = searchParams.get("userId");
    
    await connectMongoDB();
    
    // If userId is provided, fetch tasks assigned to this user
    if (userId) {
      const tasks = await Task.find({ assignedTo: userId })
        .populate('assignedTo', 'name email')
        .lean();
      return NextResponse.json({ tasks }, { status: 200 });
    }
    
    // If managerId is provided, fetch tasks created by this manager
    if (managerId) {
      const tasks = await Task.find({ createdBy: managerId })
        .populate('assignedTo', 'name email')
        .lean();
      return NextResponse.json({ tasks }, { status: 200 });
    }
    
    // If no filter provided, return all tasks
    const tasks = await Task.find({})
      .populate('assignedTo', 'name email')
      .lean();
    return NextResponse.json({ tasks }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json({ message: "Error fetching tasks", error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const { taskId, updates } = await req.json();
    await connectMongoDB();
    
    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      updates,
      { new: true }
    ).populate('assignedTo', 'name email').lean();
    
    if (!updatedTask) {
      return NextResponse.json({ message: "Task not found" }, { status: 404 });
    }
    
    return NextResponse.json({ message: "Task updated", task: updatedTask }, { status: 200 });
  } catch (error: any) {
    console.error("Error updating task:", error);
    return NextResponse.json({ message: "Error updating task", error: error.message }, { status: 500 });
  }
}