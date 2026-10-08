// ═══════════════════════════════════════════════════════
// 🎯 TAZKIA Notification Service
// সব application feature-এর জন্য centralized notification
// ═══════════════════════════════════════════════════════

import Notification from '@/models/Notification';

/**
 * Internal helper — create a notification
 */
async function create(userId, type, title, message, link) {
  try {
    return await Notification.create({
      userId,
      type,
      title,
      message,
      link,
      read: false,
    });
  } catch (e) {
    console.error('🔴 Notification create error:', e.message);
    return null;
  }
}

// ═══════════════════════════════════════════════════════
// 🕌 PRAYER NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifyPrayerSoon(userId, prayerName, minutes) {
  return create(
    userId,
    'prayer',
    `${prayerName} prayer in ${minutes} minutes`,
    `Prepare for ${prayerName} prayer`,
    '/prayer'
  );
}

export async function notifyJumuah(userId) {
  return create(
    userId,
    'prayer',
    "🕌 Jumu'ah tomorrow",
    'Prepare for Friday prayer',
    '/prayer'
  );
}

// ═══════════════════════════════════════════════════════
// 📖 QURAN NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifyQuranDaily(userId) {
  return create(
    userId,
    'quran',
    '📖 Time for Quran',
    'Read at least one ayah today',
    '/quran'
  );
}

export async function notifySurahComplete(userId, surahName) {
  return create(
    userId,
    'quran',
    `🎉 Completed Surah ${surahName}!`,
    'MashaAllah! Continue to next surah',
    '/quran'
  );
}

export async function notifyQuranStreak(userId, days) {
  return create(
    userId,
    'achievement',
    `🔥 ${days}-day Quran streak!`,
    'Keep up the consistency',
    '/quran'
  );
}

// ═══════════════════════════════════════════════════════
// 📚 HADITH NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifyHadithDaily(userId, topic) {
  return create(
    userId,
    'hadith',
    `📚 Hadith of the day`,
    topic || 'Learn from the Prophet ﷺ',
    '/hadith'
  );
}

export async function notifyNewCollection(userId, collectionName) {
  return create(
    userId,
    'hadith',
    `New collection: ${collectionName}`,
    'Explore new hadith collection',
    '/hadith'
  );
}

// ═══════════════════════════════════════════════════════
// 🤲 DU'A NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifyDuaMorning(userId) {
  return create(
    userId,
    'dua',
    '🤲 Morning Du\'a',
    'Start your day with remembrance of Allah',
    '/duas'
  );
}

export async function notifyDuaEvening(userId) {
  return create(
    userId,
    'dua',
    '🌙 Evening Du\'a',
    'End your day with gratitude',
    '/duas'
  );
}

export async function notifyDuaSaved(userId, duaTitle) {
  return create(
    userId,
    'system',
    `💾 Du'a saved`,
    duaTitle || 'You saved a du\'a',
    '/duas/saved'
  );
}

// ═══════════════════════════════════════════════════════
// 🏆 ACHIEVEMENT NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifyTasbihComplete(userId, count, dhikr) {
  return create(
    userId,
    'achievement',
    `🎉 Completed ${count}x ${dhikr}!`,
    'MashaAllah! Keep going',
    '/tasbih'
  );
}

export async function notifyStreak(userId, days) {
  const milestones = {
    3: '🌱 3-day streak started!',
    7: '🔥 7-day streak — one week!',
    30: '⭐ 30-day streak — one month!',
    100: '🏆 100-day streak — century!',
    365: '👑 365-day streak — a full year!',
  };
  const title = milestones[days] || `🔥 ${days}-day streak!`;
  return create(
    userId,
    'achievement',
    title,
    'Your consistency is inspiring',
    '/dashboard'
  );
}

// ═══════════════════════════════════════════════════════
// 💾 USER ACTION NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifyBookmarkAdded(userId, itemTitle) {
  return create(
    userId,
    'system',
    `💾 Bookmark saved`,
    itemTitle || 'You bookmarked an item',
    '/bookmarks'
  );
}

export async function notifyProfileUpdated(userId) {
  return create(
    userId,
    'system',
    '✅ Profile updated',
    'Your changes have been saved',
    '/profile'
  );
}

export async function notifyPasswordChanged(userId) {
  return create(
    userId,
    'system',
    '🔐 Password changed',
    'Your password was successfully updated',
    '/settings'
  );
}

// ═══════════════════════════════════════════════════════
// 🌙 ISLAMIC EVENT NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifyRamadanStart(userId) {
  return create(
    userId,
    'system',
    '🌙 Ramadan Mubarak!',
    'The blessed month has begun',
    '/calendar'
  );
}

export async function notifyEid(userId, eidName) {
  return create(
    userId,
    'system',
    `🎉 ${eidName} Mubarak!`,
    'May Allah accept your worship',
    '/calendar'
  );
}

export async function notifyIslamicEvent(userId, eventName, days) {
  return create(
    userId,
    'system',
    `📅 ${eventName} in ${days} days`,
    'Mark your calendar',
    '/calendar'
  );
}

// ═══════════════════════════════════════════════════════
// 🎉 WELCOME NOTIFICATION
// ═══════════════════════════════════════════════════════
export async function notifyWelcome(userId, name) {
  // Welcome + first steps
  await create(
    userId,
    'welcome',
    `স্বাগতম ${name || 'বন্ধু'}! 🎉`,
    'TAZKIA-তে আপনার ইসলামিক যাত্রা শুরু হোক',
    '/dashboard'
  );

  // Setup guide
  await create(
    userId,
    'system',
    '🚀 Getting Started',
    'Explore Quran, Hadith, Du\'a এবং Prayer times',
    '/quran'
  );
}

// ═══════════════════════════════════════════════════════
// 📢 SYSTEM NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function notifySystem(userId, title, message, link) {
  return create(userId, 'system', title, message, link || '');
}

const notificationService = {
  notifyPrayerSoon,
  notifyJumuah,
  notifyQuranDaily,
  notifySurahComplete,
  notifyQuranStreak,
  notifyHadithDaily,
  notifyNewCollection,
  notifyDuaMorning,
  notifyDuaEvening,
  notifyDuaSaved,
  notifyTasbihComplete,
  notifyStreak,
  notifyBookmarkAdded,
  notifyProfileUpdated,
  notifyPasswordChanged,
  notifyRamadanStart,
  notifyEid,
  notifyIslamicEvent,
  notifyWelcome,
  notifySystem,
};

export default notificationService;
