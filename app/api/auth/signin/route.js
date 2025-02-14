import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/lib/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  await connectDB();
  const { email, password } = await request.json();

  // Find user by email
  const user = await User.findOne({ email });
  if (!user) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  // Compare password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return NextResponse.json({ error: 'Invalid credentials' }, { status: 400 });
  }

  // Generate JWT token
  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

  return NextResponse.json({ token }, { status: 200 });
}