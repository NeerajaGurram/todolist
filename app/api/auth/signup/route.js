import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';

export async function POST(request) {
  await connectDB();
  const { name, email, password } = await request.json();

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json({ error: 'User already exists' }, { status: 400 });
  }

  // Create new user
  const user = new User({ name, email, password });
  await user.save();

  return NextResponse.json({ message: 'User created successfully' }, { status: 201 });
}