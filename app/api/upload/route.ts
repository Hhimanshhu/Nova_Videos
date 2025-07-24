import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await req.json();

    const { title, description, url, thumbnailUrl, isPublic } = body;

    if (!title || !description || !url || !thumbnailUrl) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const newVideo = await Video.create({
      title,
      description,
      url,
      thumbnailUrl,
      userId: session.user.id,
      isPublic,
    });

    return NextResponse.json(newVideo, { status: 201 });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Failed to upload video" }, { status: 500 });
  }
}



