import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

// Middleware to verify token
const verifyToken = (request) => {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  return jwt.verify(token, process.env.JWT_SECRET);
};

// GET /api/tasks/[id] - Retrieve a single task by ID
export async function GET(request, context) {
  await connectDB();
  try {
    const { userId } = verifyToken(request);
    const { id } = await context.params; // FIX: Await params

    console.log('Fetching Task ID:', id); // Debugging

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
    }

    const task = await Task.findOne({ _id: id, user: userId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// PUT /api/tasks/[id] - Update a task
export async function PUT(request, context) {
  await connectDB(); // Ensure the database is connected

  try {
    // Verify the user's token and get the user ID
    const { userId } = verifyToken(request);

    // Extract the task ID from the URL parameters
    const { id } = await context.params;

    // Validate the task ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
    }

    // Extract the updated fields from the request body
    const { title, description, status } = await request.json();

    // Update the task if it belongs to the authenticated user
    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId }, // Ensure the task belongs to the user
      { title, description, status }, // Fields to update
      { new: true, runValidators: true } // Return the updated task and run schema validators
    );

    // If the task is not found, return a 404 error
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Return the updated task
    return NextResponse.json(task);
  } catch (error) {
    // Handle errors (e.g., invalid token, database errors, etc.)
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// DELETE /api/tasks/[id] - Delete a task
export async function DELETE(request, context) {
  await connectDB();
  try {
    const { userId } = verifyToken(request);
    const { id } = await context.params; // FIX: Await params

    console.log('Deleting Task ID:', id); // Debugging

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
    }

    const task = await Task.findOneAndDelete({ _id: id, user: userId });

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Task deleted' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}
