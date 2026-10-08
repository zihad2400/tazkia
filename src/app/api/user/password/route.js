import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { notifyPasswordChanged } from '@/lib/services/notificationService';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'বর্তমান ও নতুন পাসওয়ার্ড দিন' },
        { status: 400 }
      );
    }
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: 'নতুন পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে' },
        { status: 400 }
      );
    }

    await dbConnect();
    const user = await User.findById(session.user.id).select('+password');

    if (!user) {
      return NextResponse.json({ error: 'ইউজার পাওয়া যায়নি' }, { status: 404 });
    }
    if (!user.password) {
      return NextResponse.json(
        { error: 'Google দিয়ে সাইন ইন করা একাউন্টে পাসওয়ার্ড নেই' },
        { status: 400 }
      );
    }

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return NextResponse.json(
        { error: 'বর্তমান পাসওয়ার্ড ভুল' },
        { status: 400 }
      );
    }

    user.password = newPassword;
    await user.save();

    try { await notifyPasswordChanged(session.user.id); } catch (e) {}

    return NextResponse.json({ message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত' });
  } catch (err) {
    console.error('🔴 Password change error:', err);
    return NextResponse.json({ error: 'সার্ভার সমস্যা' }, { status: 500 });
  }
}
