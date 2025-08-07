import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const video = await Video.findOne({
      _id: context.params.id,
      userId: session.user.id,
    });

    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    video.isTrashed = false;
    await video.save();

    return NextResponse.json(
      { message: "Video restored successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Restore error:", err);
    return NextResponse.json(
      { error: "Failed to restore video" },
      { status: 500 }
    );
  }
}
