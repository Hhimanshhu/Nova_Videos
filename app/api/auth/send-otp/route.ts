import { NextResponse } from 'next/server';
import { transporter } from '@/lib/mailer';

declare global {
  var otpStore: {
    [email: string]: { otp: string; expires: number };
  } | undefined;
}

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await transporter.sendMail({
      from: `"VideoUploader" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: 'Your OTP for Registration',
      html: `
        <h2>Welcome to VideoUploader!</h2>
        <p>Your OTP for registration is:</p>
        <h3 style="font-size: 24px; color: #ef4444;">${otp}</h3>
        <p>This OTP is valid for 5 minutes.</p>
      `,
    });

    globalThis.otpStore = globalThis.otpStore || {};
    globalThis.otpStore[email] = { otp, expires: Date.now() + 5 * 60 * 1000 };

    return NextResponse.json({ success: true, message: 'OTP sent to email' });
  } catch (err) {
    console.error('Error sending OTP:', err);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}
