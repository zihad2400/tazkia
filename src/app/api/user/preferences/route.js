import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import User from '@/models/User';

export const dynamic = 'force-dynamic';

export async function PUT(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const allowed = [
      'prayerNotifications',
      'quranNotifications',
      'hadithNotifications',
      'emailNewsletter',
      'soundEnabled',
      'vibrationEnabled',
      'autoPlayEnabled',
      'animationsEnabled',
      'quranFontSize',
      'translationFontSize',
      'lineHeight',
      'theme',
    ];

    const prefs = {};
    Object.keys(body).forEach((k) => {
      if (allowed.includes(k)) prefs[`preferences.${k}`] = body[k];
    });

    await dbConnect();
    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: prefs },
      { new: true }
    ).select('preferences');

    if (!user) {
      return NextResponse.json({ error: 'ইউজার পাওয়া যায়নি' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'প্রেফারেন্স সেভ হয়েছে',
      preferences: user.preferences,
    });
  } catch (err) {
    console.error('🔴 Preferences error:', err);
    return NextResponse.json({ error: 'সার্ভার সমস্যা' }, { status: 500 });
  }
}
