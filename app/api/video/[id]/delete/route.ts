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





// // app/api/video/[id]/delete/route.ts
// import { connectToDatabase } from "@/lib/db";
// import Video from "@/models/Video";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";

// // Define the type for params
// interface RouteParams {
//   params: {
//     id: string;
//   };
// }

// export async function DELETE(req: NextRequest, { params }: RouteParams) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();

//     const result = await Video.deleteOne({
//       _id: params.id,
//       userId: session.user.id,
//     });

//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { error: "Video not found or not deleted" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Video permanently deleted" },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Delete error:", err);
//     return NextResponse.json(
//       { error: "Failed to delete video" },
//       { status: 500 }
//     );
//   }
// }

// import { connectToDatabase } from "@/lib/db";
// import Video from "@/models/Video";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function DELETE(req: NextRequest, { params }: any) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();

//     const result = await Video.deleteOne({
//       _id: params.id,
//       userId: session.user.id,
//     });

//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { error: "Video not found or not deleted" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Video permanently deleted" },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Delete error:", err);
//     return NextResponse.json(
//       { error: "Failed to delete video" },
//       { status: 500 }
//     );
//   }
// }




// import { connectToDatabase } from "@/lib/db";
// import Video from "@/models/Video";
// import { getServerSession } from "next-auth";
// import { authOptions } from "@/lib/auth";
// import { NextRequest, NextResponse } from "next/server";

// export async function DELETE(
//   req: NextRequest,
//   context: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);
//     if (!session?.user?.id) {
//       return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
//     }

//     await connectToDatabase();

//     const result = await Video.deleteOne({
//       _id: context.params.id,
//       userId: session.user.id,
//     });

//     if (result.deletedCount === 0) {
//       return NextResponse.json(
//         { error: "Video not found or not deleted" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(
//       { message: "Video permanently deleted" },
//       { status: 200 }
//     );
//   } catch (err) {
//     console.error("Delete error:", err);
//     return NextResponse.json(
//       { error: "Failed to delete video" },
//       { status: 500 }
//     );
//   }
// }