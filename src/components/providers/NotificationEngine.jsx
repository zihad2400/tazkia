'use client';

import { useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { playNotificationSound } from '@/lib/utils/notificationSound';

/**
 * 🔔 NotificationEngine
 * সব auto-notification triggers handle করে
 * Navbar-এ থাকবে → সব page-এ কাজ করবে
 */
export default function NotificationEngine() {
  const { data: session, status } = useSession();
  const firedRef = useRef(new Set());

  useEffect(() => {
    if (status !== 'authenticated' || !session?.user?.id) return;

    const fire = async (trigger, extra = {}) => {
      try {
        const res = await fetch('/api/user/notifications/trigger', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ trigger, ...extra }),
        });
        if (res.ok) {
          try { playNotificationSound(); } catch (e) {}
        }
      } catch (e) {}
    };

    const checkTriggers = () => {
      const now = new Date();
      const hour = now.getHours();
      const minute = now.getMinutes();
      const day = now.getDay(); // 0=Sun, 5=Fri
      const today = now.toISOString().split('T')[0];
      const dayKey = (name) => `${name}-${today}`;

      // ═══ 🕌 Prayer time reminders ═══
      // 5 prayers — 15 min before
      const prayerHours = [5, 13, 16, 18, 20]; // approx
      const prayerNames = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
      prayerHours.forEach((h, i) => {
        if (hour === h && minute === 45) {
          const key = dayKey(`prayer-${prayerNames[i]}`);
          if (!firedRef.current.has(key)) {
            firedRef.current.add(key);
            fire('prayer_soon', {
              title: `${prayerNames[i]} prayer in 15 minutes`,
              message: `Prepare for ${prayerNames[i]}`,
              link: '/prayer',
            });
          }
        }
      });

      // ═══ 🕌 Jumu'ah reminder (Thursday night 8pm) ═══
      if (day === 4 && hour === 20) {
        const key = dayKey('jumuah');
        if (!firedRef.current.has(key)) {
          firedRef.current.add(key);
          fire('system', {
            title: "🕌 Jumu'ah tomorrow",
            message: 'Prepare for Friday prayer',
            link: '/prayer',
          });
        }
      }

      // ═══ 📖 Quran daily (9am) ═══
      if (hour === 9 && minute === 0) {
        const key = dayKey('quran');
        if (!firedRef.current.has(key)) {
          firedRef.current.add(key);
          fire('quran_daily');
        }
      }

      // ═══ 📚 Hadith daily (12pm) ═══
      if (hour === 12 && minute === 0) {
        const key = dayKey('hadith');
        if (!firedRef.current.has(key)) {
          firedRef.current.add(key);
          fire('hadith_daily');
        }
      }

      // ═══ 🤲 Morning Du'a (6am) ═══
      if (hour === 6 && minute === 0) {
        const key = dayKey('dua-morning');
        if (!firedRef.current.has(key)) {
          firedRef.current.add(key);
          fire('dua_morning');
        }
      }

      // ═══ 🌙 Evening Du'a (6pm) ═══
      if (hour === 18 && minute === 0) {
        const key = dayKey('dua-evening');
        if (!firedRef.current.has(key)) {
          firedRef.current.add(key);
          fire('dua_evening');
        }
      }
    };

    // Run immediately + every 60s
    checkTriggers();
    const iv = setInterval(checkTriggers, 60000);
    return () => clearInterval(iv);
  }, [status, session?.user?.id]);

  return null;
}
