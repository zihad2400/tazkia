'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FaBell, FaClock, FaQuran, FaBookOpen, FaHands, FaTrophy,
  FaInfoCircle, FaSpinner, FaCheck, FaTrash,
} from 'react-icons/fa';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { playNotificationSound } from '@/lib/utils/notificationSound';

const TYPE_CONFIG = {
  prayer: { icon: FaClock, color: 'text-emerald-500 bg-emerald-500/10' },
  quran: { icon: FaQuran, color: 'text-blue-500 bg-blue-500/10' },
  hadith: { icon: FaBookOpen, color: 'text-purple-500 bg-purple-500/10' },
  dua: { icon: FaHands, color: 'text-gold bg-gold/10' },
  achievement: { icon: FaTrophy, color: 'text-amber-500 bg-amber-500/10' },
  welcome: { icon: FaInfoCircle, color: 'text-primary bg-primary/10' },
  system: { icon: FaInfoCircle, color: 'text-base-content/60 bg-base-content/10' },
};

export default function NotificationBell() {
  const { t, lang } = useLanguage();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const dropdownRef = useRef(null);
  const prevUnreadRef = useRef(null);
  const soundEnabledRef = useRef(true);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/user/notifications?limit=20');
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      const newUnread = data.unreadCount || 0;

      // 🔔 Play sound only when unread count INCREASES (new notification)
      if (
        prevUnreadRef.current !== null &&
        newUnread > prevUnreadRef.current &&
        soundEnabledRef.current
      ) {
        try { playNotificationSound(); } catch (e) {}
      }
      prevUnreadRef.current = newUnread;

      setNotifications(data.notifications || []);
      setUnreadCount(newUnread);
    } catch (e) {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial + polling
  useEffect(() => {
    fetchNotifications();
    const iv = setInterval(fetchNotifications, 30000);
    return () => clearInterval(iv);
  }, [fetchNotifications]);

  // Click outside
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleMarkAllRead = async (e) => {
    e.stopPropagation();
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await fetch('/api/user/notifications', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      setUnreadCount(0);
    } catch (e) {}
    finally { setMarkingAll(false); }
  };

  const handleDelete = async (e, n) => {
    e.stopPropagation();
    e.preventDefault();
    if (deletingId === n.id) return;
    setDeletingId(n.id);
    try {
      const res = await fetch(`/api/user/notifications/${n.id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
        if (!n.read) setUnreadCount((c) => Math.max(0, c - 1));
      }
    } catch (e) {}
    finally { setDeletingId(null); }
  };

  const handleItemClick = async (n) => {
    setOpen(false);
    if (!n.read) {
      setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
      setUnreadCount((c) => Math.max(0, c - 1));
      try {
        await fetch(`/api/user/notifications/${n.id}`, { method: 'PUT' });
      } catch (e) {}
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return lang === 'bn' ? 'এখন' : lang === 'ar' ? 'الآن' : 'now';
    if (mins < 60) return lang === 'bn' ? `${mins} মিনিট আগে` : lang === 'ar' ? `قبل ${mins} دقيقة` : `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return lang === 'bn' ? `${hours} ঘণ্টা আগে` : lang === 'ar' ? `قبل ${hours} ساعة` : `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return lang === 'bn' ? `${days} দিন আগে` : lang === 'ar' ? `قبل ${days} يوم` : `${days}d ago`;
    return new Date(date).toLocaleDateString();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative p-2 sm:p-2.5 rounded-lg hover:bg-primary/10 text-base-content transition-all active:scale-95"
        aria-label={t.notifications}
      >
        <FaBell size={14} />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center ring-2 ring-base-100 animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

          {/* Dropdown — Mobile: near-full width, Desktop: 96 (384px) */}
          <div className="absolute right-0 mt-2 w-[calc(100vw-24px)] max-w-sm sm:w-96 z-50 bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden animate-fadeIn">

            {/* Header */}
            <div className="p-3 border-b border-base-300 flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-bold text-sm text-base-content truncate">
                  {t.notifications}
                </span>
                {unreadCount > 0 && (
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-bold shrink-0">
                    {unreadCount}
                  </span>
                )}
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  disabled={markingAll}
                  className="text-[10px] text-primary hover:underline font-semibold flex items-center gap-1 disabled:opacity-50 shrink-0"
                >
                  {markingAll ? <FaSpinner size={9} className="animate-spin" /> : <FaCheck size={9} />}
                  {lang === 'bn' ? 'সব পড়া' : lang === 'ar' ? 'تحديد الكل' : 'Mark all'}
                </button>
              )}
            </div>

            {/* Body */}
            <div className="max-h-[60vh] sm:max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-8 flex flex-col items-center justify-center text-base-content/50">
                  <FaSpinner className="animate-spin mb-2" size={18} />
                  <p className="text-xs">{t.loading}</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <div className="w-12 h-12 mx-auto rounded-full bg-base-200 flex items-center justify-center mb-3">
                    <FaBell size={18} className="text-base-content/40" />
                  </div>
                  <p className="text-sm font-semibold text-base-content/70">
                    {lang === 'bn' ? 'কোনো নোটিফিকেশন নেই' : lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications'}
                  </p>
                  <p className="text-[11px] text-base-content/40 mt-1">
                    {lang === 'bn' ? 'নতুন আপডেট এলে এখানে দেখাবে' : lang === 'ar' ? 'ستظهر التحديثات هنا' : "You're all caught up"}
                  </p>
                </div>
              ) : (
                notifications.map((n) => {
                  const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
                  const Icon = cfg.icon;
                  const isDeleting = deletingId === n.id;
                  const content = (
                    <div
                      className={`group relative flex items-start gap-3 p-3 hover:bg-primary/5 border-b border-base-300 last:border-0 cursor-pointer transition-colors ${
                        !n.read ? 'bg-primary/[0.04]' : ''
                      } ${isDeleting ? 'opacity-50' : ''}`}
                    >
                      <div className={`w-9 h-9 rounded-lg ${cfg.color} flex items-center justify-center shrink-0`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0 pr-7">
                        <p className={`text-xs sm:text-sm ${!n.read ? 'font-semibold' : 'font-medium'} text-base-content leading-tight`}>
                          {n.title}
                        </p>
                        {n.message && (
                          <p className="text-[11px] text-base-content/60 mt-0.5 line-clamp-2 leading-snug">
                            {n.message}
                          </p>
                        )}
                        <p className="text-[10px] text-base-content/40 mt-1">
                          {timeAgo(n.createdAt)}
                        </p>
                      </div>
                      {!n.read && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
                      )}
                      <button
                        onClick={(e) => handleDelete(e, n)}
                        disabled={isDeleting}
                        className="absolute right-2 top-2 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-red-500/10 text-base-content/40 hover:text-red-600 disabled:opacity-50"
                        aria-label="Delete"
                        title="Delete"
                      >
                        {isDeleting ? <FaSpinner className="animate-spin" size={10} /> : <FaTrash size={10} />}
                      </button>
                    </div>
                  );

                  return n.link ? (
                    <Link key={n.id} href={n.link} onClick={() => handleItemClick(n)}>
                      {content}
                    </Link>
                  ) : (
                    <div key={n.id} onClick={() => handleItemClick(n)}>
                      {content}
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-2 border-t border-base-300 bg-base-200/50">
                <Link
                  href="/notifications"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center py-2 text-xs font-semibold text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  {lang === 'bn' ? 'সব নোটিফিকেশন দেখুন' : lang === 'ar' ? 'عرض كل الإشعارات' : 'View all notifications'}
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
