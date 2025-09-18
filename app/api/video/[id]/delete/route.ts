import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // 👈 await because params is a Promise

    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const video = await Video.findOne({
      _id: id,
      userId: session.user.id,
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    video.isTrashed = false;
    await video.save();

    return NextResponse.json({ message: "Video restored successfully" }, { status: 200 });
  } catch (err) {
    console.error("Restore error:", err);
    return NextResponse.json({ error: "Failed to restore video" }, { status: 500 });
  }
}
