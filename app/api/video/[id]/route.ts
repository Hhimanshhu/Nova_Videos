import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import Video from '@/models/Video';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import mongoose from 'mongoose';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    await connectToDatabase();

    const video = await Video.findOne({
      _id: new mongoose.Types.ObjectId(params.id),
      userId: session.user.id,
    });

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 });
    }

    video.isDeleted = true;
    await video.save();

    return NextResponse.json({ message: 'Video moved to trash successfully' });
  } catch (err) {
    console.error('Error soft-deleting video:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// import { NextRequest, NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import { connectToDatabase } from '@/lib/db';
// import Video from '@/models/Video';
// import { Types } from 'mongoose';

// export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
//   const session = await getServerSession(authOptions);
//   if (!session || !session.user?.email) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//   }

//   const videoId = params.id;
//   const { title, description } = await req.json();

//   // DELETE: Mark video as deleted
// if (req.method === 'DELETE') {
//   const video = await Video.findByIdAndUpdate(videoId, { isDeleted: true });
//   return NextResponse.json({ message: 'Moved to Trash' });
// }

//   if (!title || !description) {
//     return NextResponse.json({ error: 'Title and description are required' }, { status: 400 });
//   }

//   try {
//     await connectToDatabase();

//     const video = await Video.findById(videoId);
//     if (!video) {
//       return NextResponse.json({ error: 'Video not found' }, { status: 404 });
//     }

//     // Ensure only the owner can update
//     const userId = (session.user as any).id;
//     if (video.userId.toString() !== userId) {
//       return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
//     }

//     video.title = title;
//     video.description = description;
//     await video.save();

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Update error:', error);
//     return NextResponse.json({ error: 'Server error' }, { status: 500 });
//   }
// }


// import { connectToDatabase } from "@/lib/db";
// import Video from "@/models/Video";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";
// import ImageKit from "imagekit";

// const imagekit = new ImageKit({
//   publicKey: process.env.NEXT_PUBLIC_PUBLIC_KEY!,
//   privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
//   urlEndpoint: process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!,
// });

// export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();

//     const video = await Video.findById(params.id);
//     if (!video) {
//       return NextResponse.json({ error: "Video not found" }, { status: 404 });
//     }

//     if (video.userId.toString() !== session.user.id) {
//       return NextResponse.json({ error: "Not allowed" }, { status: 403 });
//     }

//     // Extract ImageKit fileId from URL (Recommended: store fileId in DB in future)
//     const fileName = video.url.split("/").pop()?.split(".")[0];
//     if (fileName) {
//       try {
//         await imagekit.deleteFile(fileName);
//       } catch (ikError) {
//         console.warn("ImageKit deletion failed (may not exist):", ikError);
//       }
//     }

//     await Video.deleteOne({ _id: params.id });

//     return NextResponse.json({ message: "Video deleted successfully" }, { status: 200 });

//   } catch (error) {
//     console.error("Delete video error:", error);
//     return NextResponse.json({ error: "Failed to delete video" }, { status: 500 });
//   }
// }
