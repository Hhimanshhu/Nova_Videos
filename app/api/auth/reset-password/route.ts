import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import User from "@/models/User";
import jwt, { JwtPayload } from "jsonwebtoken";

interface DecodedToken extends JwtPayload {
  userId: string;
}

export async function POST(req: Request) {
  try {
    const { token, password }: { token: string; password: string } = await req.json();
    if (!token || !password) {
      return NextResponse.json({ error: "Missing token or password" }, { status: 400 });
    }

    await connectToDatabase();

    // ✅ Properly typed JWT verify
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
    const userId = decoded.userId;

    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ⚠️ Hash password before saving (don’t store plain text!)
    user.password = password;
    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err: unknown) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}



// import { NextResponse } from 'next/server';
// import { connectToDatabase } from '@/lib/db';
// import User from '@/models/User';
// import jwt from 'jsonwebtoken';

// export async function POST(req: Request) {
//   try {
//     const { token, password } = await req.json();
//     if (!token || !password) {
//       return NextResponse.json({ error: 'Missing token or password' }, { status: 400 });
//     }

//     await connectToDatabase();

//     // ✅ Verify JWT token
//     const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
//     const userId = decoded.userId;

//     const user = await User.findById(userId);
//     if (!user) {
//       return NextResponse.json({ error: 'User not found' }, { status: 404 });
//     }

//     // ✅ Hash new password and save
//     // const salt = await bcrypt.genSalt(10);
//     user.password = password;
//     await user.save();

//     return NextResponse.json({ message: 'Password reset successful' });
//   } catch (err: any) {
//     console.error('Reset password error:', err);
//     return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 });
//   }
// }
