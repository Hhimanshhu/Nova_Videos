import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: 'Missing token or password' }, { status: 400 });
    }

    await connectToDatabase();

    // ✅ Verify JWT token
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // ✅ Hash new password and save
    // const salt = await bcrypt.genSalt(10);
    user.password = password;
    await user.save();

    return NextResponse.json({ message: 'Password reset successful' });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
  }
}
