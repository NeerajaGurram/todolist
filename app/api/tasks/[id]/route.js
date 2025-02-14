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
  await connectDB();
  try {
    const { userId } = verifyToken(request);
    const { id } = await context.params; // FIX: Await params
    const { title, description, status } = await request.json();

    console.log('Updating Task ID:', id); // Debugging

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid Task ID' }, { status: 400 });
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, user: userId },
      { title, description, status },
      { new: true, runValidators: true }
    );

    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
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
