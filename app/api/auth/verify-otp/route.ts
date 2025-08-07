import { NextResponse } from 'next/server';

declare global {
  var otpStore: {
    [email: string]: { otp: string; expires: number };
  } | undefined;
}

export async function POST(req: Request) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
  }

  const store = globalThis.otpStore;
  const entry = store?.[email];

  if (!entry) {
    return NextResponse.json({ error: 'No OTP found for this email' }, { status: 400 });
  }

  if (Date.now() > entry.expires) {
    delete store[email];
    return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
  }

  if (otp !== entry.otp) {
    return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
  }

  // OTP is correct — you can allow registration
  delete store[email]; // optional: remove OTP after successful validation
  return NextResponse.json({ success: true, message: 'OTP verified' });
}
