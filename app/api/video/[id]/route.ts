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
