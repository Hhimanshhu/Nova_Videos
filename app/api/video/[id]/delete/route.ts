import { connectToDatabase } from "@/lib/db";
import Video from "@/models/Video";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest, { params }: any) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectToDatabase();

    const result = await Video.deleteOne({
      _id: params.id,
      userId: session.user.id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Video not found or not deleted" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Video permanently deleted" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Delete error:", err);
    return NextResponse.json(
      { error: "Failed to delete video" },
      { status: 500 }
    );
  }
}




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