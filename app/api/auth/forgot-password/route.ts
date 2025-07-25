import { connectToDatabase } from '@/lib/db';
import User from '@/models/User';
import { sendResetEmail } from '@/lib/mailer';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: Request) {
  await connectToDatabase();
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expireTime = Date.now() + 1000 * 60 * 30; // 30 minutes

  user.resetToken = token;
  user.resetTokenExpiry = expireTime;
  await user.save();

  try {
    await sendResetEmail(user.email, token);
    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (err) {
    console.error('Email send error:', err);
    return NextResponse.json({ error: 'Email failed to send' }, { status: 500 });
  }
}
