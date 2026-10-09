'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaBell, FaClock, FaQuran, FaBookOpen, FaHands, FaTrophy,
  FaInfoCircle, FaSpinner, FaCheck, FaTrash, FaHome,
  FaCheckDouble, FaFilter,
} from 'react-icons/fa';
import { useLanguage } from '@/components/providers/LanguageProvider';
import toast from 'react-hot-toast';

const TYPE_CONFIG = {
  prayer: { icon: FaClock, color: 'text-emerald-500 bg-emerald-500/10' },
  quran: { icon: FaQuran, color: 'text-blue-500 bg-blue-500/10' },
  hadith: { icon: FaBookOpen, color: 'text-purple-500 bg-purple-500/10' },
  dua: { icon: FaHands, color: 'text-gold bg-gold/10' },
  achievement: { icon: FaTrophy, color: 'text-amber-500 bg-amber-500/10' },
  welcome: { icon: FaInfoCircle, color: 'text-primary bg-primary/10' },
  system: { icon: FaInfoCircle, color: 'text-base-content/60 bg-base-content/10' },
};

const FILTERS = [
  { id: 'all', label: 'All', bn: 'সব', ar: 'الكل' },
  { id: 'unread', label: 'Unread', bn: 'অপঠিত', ar: 'غير المقروءة' },
  { id: 'prayer', label: 'Prayer', bn: 'নামাজ', ar: 'الصلاة' },
  { id: 'quran', label: 'Quran', bn: 'কুরআন', ar: 'القرآن' },
  { id: 'hadith', label: 'Hadith', bn: 'হাদিস', ar: 'الحديث' },
  { id: 'dua', label: 'Du\'a', bn: 'দুআ', ar: 'الدعاء' },
  { id: 'achievement', label: 'Achievement', bn: 'অর্জন', ar: 'الإنجازات' },
];

export default function NotificationsPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { t, lang } = useLanguage();

  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [markingAll, setMarkingAll] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/user/notifications?limit=50');
      if (!res.ok) throw new Error('fetch failed');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (e) {
      toast.error('লোড ব্যর্থ');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') fetchNotifications();
  }, [status, fetchNotifications]);

  const filtered = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleMarkAllRead = async () => {
    if (markingAll || unreadCount === 0) return;
    setMarkingAll(true);
    try {
      await fetch('/api/user/notifications', { method: 'PUT' });
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
      toast.success(lang === 'bn' ? 'সব পড়া হয়েছে' : lang === 'ar' ? 'تم تحديد الكل كمقروء' : 'All marked as read');
    } catch (e) {
      toast.error('ব্যর্থ');
    } finally { setMarkingAll(false); }
  };

  const handleItemClick = async (n) => {
    if (!n.read) {
      setNotifications((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x));
      try {
        await fetch(`/api/user/notifications/${n.id}`, { method: 'PUT' });
      } catch (e) {}
    }
    if (n.link) router.push(n.link);
  };

  const handleDelete = async (e, n) => {
    e.stopPropagation();
    if (deletingId === n.id) return;
    setDeletingId(n.id);
    try {
      const res = await fetch(`/api/user/notifications/${n.id}`, { method: 'DELETE' });
      if (res.ok) {
        setNotifications((prev) => prev.filter((x) => x.id !== n.id));
        toast.success(lang === 'bn' ? 'মুছে ফেলা হয়েছে' : lang === 'ar' ? 'تم الحذف' : 'Deleted');
      } else {
        toast.error('ব্যর্থ');
      }
    } catch (e) {
      toast.error('সার্ভার সমস্যা');
    } finally { setDeletingId(null); }
  };

  const handleDeleteAll = async () => {
    if (!confirm(lang === 'bn' ? 'সব notification মুছবেন?' : lang === 'ar' ? 'حذف جميع الإشعارات؟' : 'Delete all notifications?')) return;
    try {
      await fetch('/api/user/notifications', { method: 'DELETE' });
      setNotifications([]);
      toast.success(lang === 'bn' ? 'সব মুছে ফেলা হয়েছে' : lang === 'ar' ? 'تم حذف الكل' : 'All cleared');
    } catch (e) {
      toast.error('ব্যর্থ');
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

  const tFilter = (f) => lang === 'bn' ? f.bn : lang === 'ar' ? f.ar : f.label;

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10">

      {/* ═══ Header ═══ */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5 sm:mb-6">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <FaBell size={18} />
          </div>
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-base-content flex items-center gap-2">
              {t.notifications}
              {unreadCount > 0 && (
                <span className="text-xs sm:text-sm bg-red-500 text-white px-2 py-0.5 rounded-full font-bold">
                  {unreadCount}
                </span>
              )}
            </h1>
            <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">
              {lang === 'bn' ? 'আপনার সব আপডেট এক জায়গায়' :
               lang === 'ar' ? 'جميع تحديثاتك في مكان واحد' :
               'All your updates in one place'}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              disabled={markingAll}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-semibold rounded-lg transition-all active:scale-95 disabled:opacity-50"
            >
              {markingAll ? <FaSpinner className="animate-spin" size={11} /> : <FaCheckDouble size={11} />}
              {lang === 'bn' ? 'সব পড়া' : lang === 'ar' ? 'قراءة الكل' : 'Mark all'}
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleDeleteAll}
              className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-600 text-xs font-semibold rounded-lg transition-all active:scale-95"
            >
              <FaTrash size={11} />
              {lang === 'bn' ? 'সব মুছুন' : lang === 'ar' ? 'حذف الكل' : 'Clear all'}
            </button>
          )}
        </div>
      </div>

      {/* ═══ Filters — horizontal scroll on mobile ═══ */}
      <div className="-mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto mb-4 scrollbar-hide">
        <div className="flex gap-2 pb-1 min-w-max">
          {FILTERS.map((f) => {
            const isActive = filter === f.id;
            const count = f.id === 'all' ? notifications.length : f.id === 'unread' ? unreadCount : notifications.filter((n) => n.type === f.id).length;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-base-200 text-base-content/70 border border-base-300 hover:border-primary/40'
                }`}
              >
                {tFilter(f)}
                {count > 0 && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                    isActive ? 'bg-white/20' : 'bg-base-300'
                  }`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ List ═══ */}
      {filtered.length === 0 ? (
        <div className="bg-base-200 border border-base-300 rounded-2xl p-10 sm:p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-base-300/50 flex items-center justify-center mb-4">
            <FaBell size={22} className="text-base-content/30" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-base-content mb-1">
            {filter === 'unread'
              ? (lang === 'bn' ? 'সব পড়া হয়ে গেছে!' : lang === 'ar' ? 'كل شيء مقروء!' : 'All caught up!')
              : (lang === 'bn' ? 'কোনো notification নেই' : lang === 'ar' ? 'لا توجد إشعارات' : 'No notifications')}
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 max-w-md mx-auto">
            {lang === 'bn' ? 'নতুন আপডেট এলে এখানে দেখাবে ইনশাআল্লাহ' :
             lang === 'ar' ? 'ستظهر التحديثات الجديدة هنا' :
             'New updates will appear here'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 bg-primary hover:bg-primary-dark text-white text-sm font-semibold rounded-xl transition-all active:scale-95"
          >
            <FaHome size={12} />
            {t.backHome}
          </Link>
        </div>
      ) : (
        <div className="bg-base-200 border border-base-300 rounded-2xl overflow-hidden">
          {filtered.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.system;
            const Icon = cfg.icon;
            const isDeleting = deletingId === n.id;
            return (
              <div
                key={n.id}
                onClick={() => handleItemClick(n)}
                className={`notif-item-force ${!n.read ? 'notif-unread-force' : ''} ${isDeleting ? 'opacity-50' : ''}`}
              >
                <div className={`notif-icon-force ${cfg.color}`}>
                  <Icon size={18} />
                </div>

                <div className="notif-content-force">
                  <div className="notif-title-row-force">
                    <p className={`notif-title-force ${!n.read ? 'font-bold' : ''}`}>
                      {n.title}
                    </p>
                    {!n.read && <span className="notif-dot-force" />}
                  </div>
                  {n.message && (
                    <p className="notif-message-force">
                      {n.message}
                    </p>
                  )}
                  <p className="notif-time-force">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>

                <button
                  onClick={(e) => handleDelete(e, n)}
                  disabled={isDeleting}
                  className="notif-delete-force"
                  aria-label="Delete"
                >
                  {isDeleting ? <FaSpinner className="animate-spin" size={12} /> : <FaTrash size={12} />}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ═══ Bottom Home Button ═══ */}
      <div className="mt-6 flex justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 px-5 py-3 bg-base-200 hover:bg-base-300 border border-base-300 text-base-content font-semibold rounded-xl transition-all active:scale-95 text-sm"
        >
          <FaHome size={13} />
          {t.backHome}
        </Link>
      </div>

    </div>
  );
}
