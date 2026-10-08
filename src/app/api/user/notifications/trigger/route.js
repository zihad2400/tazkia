import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dbConnect from '@/lib/db';
import Notification from '@/models/Notification';

export const dynamic = 'force-dynamic';

// ═══ Trigger Map ═══
const TRIGGERS = {
  prayer_soon: { type: 'prayer', title: '🕌 Prayer soon', message: 'A prayer time is approaching' },
  quran_daily: { type: 'quran', title: '📖 Time for Quran', message: 'Read a few ayahs today' },
  hadith_daily: { type: 'hadith', title: '📚 Hadith of the day', message: 'Learn from the Prophet ﷺ' },
  dua_morning: { type: 'dua', title: '🤲 Morning Du\'a', message: 'Start with remembrance' },
  dua_evening: { type: 'dua', title: '🌙 Evening Du\'a', message: 'End with gratitude' },
  streak: { type: 'achievement', title: '🔥 Streak milestone!', message: 'Keep up the consistency' },
  bookmark: { type: 'system', title: '💾 Bookmark saved', message: 'Saved to your bookmarks' },
  welcome: { type: 'welcome', title: 'স্বাগতম!', message: 'Welcome to TAZKIA' },
};

// POST /api/user/notifications/trigger
// body: { trigger: 'quran_daily', title?, message?, link? }
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { trigger, title, message, link, type } = body;

    if (!trigger && !title) {
      return NextResponse.json({ error: 'trigger or title required' }, { status: 400 });
    }

    await dbConnect();

    // If trigger is known → use predefined
    if (trigger && TRIGGERS[trigger]) {
      const t = TRIGGERS[trigger];
      const notif = await Notification.create({
        userId: session.user.id,
        type: type || t.type,
        title: title || t.title,
        message: message || t.message,
        link: link || '',
      });
      return NextResponse.json({ notification: notif }, { status: 201 });
    }

    // Otherwise use raw title/message
    const notif = await Notification.create({
      userId: session.user.id,
      type: type || 'system',
      title,
      message: message || '',
      link: link || '',
    });

    return NextResponse.json({ notification: notif }, { status: 201 });
  } catch (err) {
    console.error('🔴 Trigger error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
