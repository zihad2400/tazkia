import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

// GET — list notifications
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();

    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 50);
    const unreadOnly = searchParams.get('unread') === '1';

    const query = { userId: session.user.id };
    if (unreadOnly) query.read = false;

    const [items, unreadCount] = await Promise.all([
      Notification.find(query).sort({ createdAt: -1 }).limit(limit).lean(),
      Notification.countDocuments({ userId: session.user.id, read: false }),
    ]);

    return NextResponse.json({
      notifications: items.map((n) => ({
        id: n._id.toString(),
        type: n.type,
        title: n.title,
        message: n.message,
        link: n.link,
        read: n.read,
        createdAt: n.createdAt,
      })),
      unreadCount,
    });
  } catch (err) {
    console.error('🔴 Notifications GET error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// PUT — mark all as read
export async function PUT() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    await Notification.updateMany(
      { userId: session.user.id, read: false },
      { $set: { read: true, readAt: new Date() } }
    );

    return NextResponse.json({ message: 'All marked as read' });
  } catch (err) {
    console.error('🔴 Notifications PUT error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// POST — create a notification (for internal use / testing)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { type, title, message, link } = await request.json();
    if (!title) {
      return NextResponse.json({ error: 'Title required' }, { status: 400 });
    }

    await dbConnect();
    const notif = await Notification.create({
      userId: session.user.id,
      type: type || 'system',
      title,
      message: message || '',
      link: link || '',
    });

    return NextResponse.json({ notification: notif }, { status: 201 });
  } catch (err) {
    console.error('🔴 Notifications POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

// DELETE — clear all
export async function DELETE() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    await Notification.deleteMany({ userId: session.user.id });

    return NextResponse.json({ message: 'All cleared' });
  } catch (err) {
    console.error('🔴 Notifications DELETE error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
