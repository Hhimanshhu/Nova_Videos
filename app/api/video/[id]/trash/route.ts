import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const session = await getServerSession(authOptions);
    if (!session?.user) {
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

    video.isTrashed = true;
    await video.save();

    return NextResponse.json({ message: "Video moved to trash" }, { status: 200 });
  } catch (err) {
    console.error("Trash error:", err);
    return NextResponse.json({ error: "Failed to trash video" }, { status: 500 });
  }
}








// // app/api/video/[id]/trash/route.ts
// import { connectToDatabase } from "@/lib/db";
// import Video from "@/models/Video";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function PUT(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const { id } = context.params;

//     const session = await getServerSession(authOptions);
//     if (!session?.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();

//     const video = await Video.findOne({
//       _id: id,
//       userId: session.user.id,
//     });

//     if (!video) {
//       return NextResponse.json({ error: "Video not found" }, { status: 404 });
//     }

//     video.isTrashed = true;
//     await video.save();

//     return NextResponse.json({ message: "Video moved to trash" }, { status: 200 });
//   } catch (err) {
//     console.error("Trash error:", err);
//     return NextResponse.json({ error: "Failed to trash video" }, { status: 500 });
//   }
// }
