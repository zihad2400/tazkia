import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { confirmText, password } = body;

    // ═══ Step 1: Confirm text check ═══
    if (confirmText !== 'DELETE') {
      return NextResponse.json(
        { error: 'নিশ্চিত করতে "DELETE" লিখুন' },
        { status: 400 }
      );
    }

    await dbConnect();

    // ═══ Step 2: Password verify (credentials user হলে) ═══
    const user = await User.findById(session.user.id).select('+password');
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.password) {
      if (!password) {
        return NextResponse.json(
          { error: 'পাসওয়ার্ড দিন' },
          { status: 400 }
        );
      }
      const isValid = await user.comparePassword(password);
      if (!isValid) {
        return NextResponse.json(
          { error: 'পাসওয়ার্ড ভুল' },
          { status: 400 }
        );
      }
    }

    // ═══ Step 3: Delete all user data ═══
    // 3.1 Delete notifications
    await Notification.deleteMany({ userId: session.user.id });

    // 3.2 Delete user
    await User.findByIdAndDelete(session.user.id);

    console.log('🗑️ User deleted:', user.email);

    return NextResponse.json({
      message: 'একাউন্ট সফলভাবে মুছে ফেলা হয়েছে',
    });
  } catch (err) {
    console.error('🔴 Delete account error:', err);
    return NextResponse.json(
      { error: err.message || 'সার্ভার সমস্যা' },
      { status: 500 }
    );
  }
}
