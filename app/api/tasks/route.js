import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Task from '@/lib/models/Task';
import jwt from 'jsonwebtoken';

// Middleware to verify token
const verifyToken = (request) => {
  const token = request.headers.get('authorization')?.split(' ')[1];
  if (!token) throw new Error('Unauthorized');
  return jwt.verify(token, process.env.JWT_SECRET);
};

// GET /api/tasks - Retrieve all tasks for the user
export async function GET(request) {
  await connectDB();
  try {
    const { userId } = verifyToken(request);
    const tasks = await Task.find({ user: userId });
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// POST /api/tasks - Create a new task for the user
export async function POST(request) {
  await connectDB();
  try {
    const { userId } = verifyToken(request);
    const { title, description } = await request.json();
    const task = new Task({ title, description, status: 'pending', user: userId });
    await task.save();
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
}

// import { NextResponse } from 'next/server';
// import connectDB from '@/lib/mongodb';
// import Task from '@/lib/models/Task';
// import jwt from 'jsonwebtoken';

// // Middleware to verify token
// const verifyToken = (request) => {
//   const token = request.headers.get('authorization')?.split(' ')[1];
//   if (!token) throw new Error('Unauthorized');
//   console.log('Token:', token); // Debugging: Check the token
//   return jwt.verify(token, process.env.JWT_SECRET);
// };

// // GET /api/tasks - Retrieve all tasks for the user
// export async function GET(request) {
//   await connectDB();
//   try {
//     const { userId } = verifyToken(request);
//     const tasks = await Task.find({ user: userId });
//     return NextResponse.json(tasks);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 401 });
//   }
// }

// // POST /api/tasks - Create a new task for the user
// export async function POST(request) {
//   await connectDB();
//   try {
//     const { userId } = verifyToken(request);
//     const { title, description } = await request.json();
//     const task = new Task({ title, description, user: userId });
//     await task.save();
//     return NextResponse.json(task, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 401 });
//   }
// }

// // PUT /api/tasks/:id - Update a task
// export async function PUT(request, { params }) {
//   await connectDB();
//   try {
//     const { userId } = verifyToken(request);
//     const { id } = params;
//     const { title, description, status } = await request.json();

//     const task = await Task.findOneAndUpdate(
//       { _id: id, user: userId },
//       { title, description, status },
//       { new: true, runValidators: true }
//     );

//     if (!task) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }

//     return NextResponse.json(task);
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 401 });
//   }
// }

// // DELETE /api/tasks/:id - Delete a task
// export async function DELETE(request, { params }) {
//   await connectDB();
//   try {
//     const { userId } = verifyToken(request);
//     const { id } = params;
//     const task = await Task.findOneAndDelete({ _id: id, user: userId });
//     if (!task) {
//       return NextResponse.json({ error: 'Task not found' }, { status: 404 });
//     }
//     return NextResponse.json({ message: 'Task deleted' });
//   } catch (error) {
//     return NextResponse.json({ error: error.message }, { status: 401 });
//   }
// }