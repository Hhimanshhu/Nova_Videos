import { NextResponse } from 'next/server';
import User from '@/models/User';
import {connectToDatabase} from '@/lib/db';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }

    // Generate reset token (valid for 1 hour)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });

    const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${token}`;

    // Send email with nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.EMAIL_FROM || 'no-reply@yourapp.com',
      to: email,
      subject: 'Reset your password',
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5">
          <h2>Password Reset</h2>
          <p>Hello <strong>${user.name}</strong>,</p>
          <p>You requested a password reset. Click the link below to reset your password:</p>
          <a href="${resetUrl}" style="display:inline-block;padding:10px 20px;margin-top:10px;background-color:#ef4444;color:white;text-decoration:none;border-radius:5px;">Reset Password</a>
          <p>This link will expire in 1 hour.</p>
          <p>If you didn’t request this, you can ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json({ message: 'Reset email sent' });
  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
