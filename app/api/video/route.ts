import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const session = await getServerSession(authOptions);
    const searchParams = req.nextUrl.searchParams;
    const filter = searchParams.get("filter"); // 'my' or undefined
    const visibility = searchParams.get("visibility"); // 'public' | 'private' | 'trash'
    const search = searchParams.get("search")?.toLowerCase() || "";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 6;
    const skip = (page - 1) * limit;

    const query: Record<string, unknown> = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (filter === "my") {
      if (!session?.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      query.userId = session.user.id;

      if (visibility === "public") {
        query.isPublic = true;
        query.$or = [{ isTrashed: false }, { isTrashed: { $exists: false } }];
      } else if (visibility === "private") {
        query.isPublic = false;
        query.$or = [{ isTrashed: false }, { isTrashed: { $exists: false } }];
      } else if (visibility === "trash") {
        query.isTrashed = true;
      } else {
        // "all"
        query.$or = [{ isTrashed: false }, { isTrashed: { $exists: false } }];
      }
    } else {
      query.isPublic = true;
      query.$or = [{ isTrashed: false }, { isTrashed: { $exists: false } }];
    }

    // Count total videos matching the query
    const totalCount = await Video.countDocuments(query);

    // Fetch videos for current page
    const videos = await Video.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Send paginated response
    return NextResponse.json(
      {
        videos,
        totalPages: Math.ceil(totalCount / limit),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch videos error:", error);
    return NextResponse.json(
      { error: "Failed to fetch videos" },
      { status: 500 }
    );
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

    const {
      title,
      description,
      url,
      thumbnailUrl,
      dimensions,
    } = body;

    if (!title || !description || !url || !thumbnailUrl || !dimensions) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newVideo = await Video.create({
      title,
      description,
      url,
      thumbnailUrl,
      dimensions,
      userId: session.user.id,
      isPublic: body.isPublic ?? true,
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
    return NextResponse.json(
      { error: "Failed to create video" },
      { status: 500 }
    );
  }
}
