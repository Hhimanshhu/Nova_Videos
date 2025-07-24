import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

// ✅ GET - Fetch Public Videos or My Videos (based on ?filter=my)
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const searchParams = req.nextUrl.searchParams;
    const filter = searchParams.get("filter"); // 'my' to fetch my videos

    let videos;

    if (filter === "my" && session?.user?.id) {
      // ✅ If user logged in & filter is "my" → fetch user's videos
      videos = await Video.find({ userId: session.user.id }).sort({ createdAt: -1 }).lean();
    } else {
      // ✅ Otherwise fetch only public videos
      videos = await Video.find({ isPublic: true }).sort({ createdAt: -1 }).lean();
    }

    return NextResponse.json(videos, { status: 200 });

  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}


// ✅ POST - Upload New Video
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const body = await request.json();

    const { title, description, url, thumbnailUrl, dimensions, isPublic = true } = body;

    if (!title || !description || !url || !thumbnailUrl || !dimensions) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newVideo = await Video.create({
      title,
      description,
      url,
      thumbnailUrl,
      dimensions,
      userId: session.user.id,
      isPublic : body.isPublic ?? true,   
      controls: true,
      transformation: {
        height: 1920,
        width: 1080,
        quality: 90,
      },
    });

    return NextResponse.json(newVideo, { status: 201 });

  } catch (error) {
    console.error("Video upload error:", error);
    return NextResponse.json({ error: "Failed to create video" }, { status: 500 });
  }
}





// import { authOptions } from "@/lib/auth";
// import { connectToDatabase } from "@/lib/db";
// import { IVideo } from "@/models/Video";
// import Video from "@/models/Video";
// import { getServerSession } from "next-auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function GET() {
//   try {
//     await connectToDatabase();
//     const videos = await Video.find({}).sort({ createdAt: -1 }).lean();

//     return NextResponse.json(videos, { status: 200 });

//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to fetch videos" },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session || !session.user) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();
//     const body: IVideo = await request.json();
//     if (
//       !body.title ||
//       !body.description ||
//       !body.url ||
//       !body.thumbnailUrl ||
//       !body.dimensions
//     ) {
//       return NextResponse.json(
//         { error: "Missing required fields" },
//         { status: 400 }
//       );
//     }

//     const videoData: IVideo = {
//       ...body,
//       controls: body.controls ?? true,
//       transformation: {
//         height: 1920,
//         width: 1080,
//         quality: body.transformation?.quality ?? 90,
//       },
//     };
//     const newVideo = await Video.create(videoData);
//     return NextResponse.json(newVideo, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: "Failed to create video" },
//       { status: 500 }
//     );
//   }
// }
