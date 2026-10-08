import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

// PUT — mark one as read
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    await Notification.findOneAndUpdate(
      { _id: params.id, userId: session.user.id },
      { $set: { read: true, readAt: new Date() } }
    );

    return NextResponse.json({ message: 'Marked as read' });
  } catch (err) {
    console.error('🔴 Notification PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — delete one
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    await Notification.findOneAndDelete({
      _id: params.id,
      userId: session.user.id,
    });

    return NextResponse.json({ message: 'Deleted' });
  } catch (err) {
    console.error('🔴 Notification DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
