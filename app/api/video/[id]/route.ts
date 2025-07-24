import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import ImageKit from "imagekit";

const imagekit = new ImageKit({
  publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
});

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const video = await Video.findById(params.id);
    if (!video) {
      return NextResponse.json({ error: "Video not found" }, { status: 404 });
    }

    if (video.userId.toString() !== session.user.id) {
      return NextResponse.json({ error: "Not allowed" }, { status: 403 });
    }

    // Extract ImageKit fileId from URL (Recommended: store fileId in DB in future)
    const fileName = video.url.split("/").pop()?.split(".")[0];
    if (fileName) {
      try {
        await imagekit.deleteFile(fileName);
      } catch (ikError) {
        console.warn("ImageKit deletion failed (may not exist):", ikError);
      }
    }

    await Video.deleteOne({ _id: params.id });

    return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });

  } catch (error) {
    console.error("Delete video error:", error);
    return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
  }
}
