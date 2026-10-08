'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  FaChartLine, FaQuran, FaClock, FaStar, FaFire,
  FaBookmark, FaUser, FaChevronRight, FaArrowRight,
  FaBookOpen, FaCompass, FaCalendar, FaHands, FaSpinner,
  FaTrophy, FaHeart, FaHistory, FaAward,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [recentBookmarks, setRecentBookmarks] = useState([]);
  const [recentSessions, setRecentSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  // ═══ Redirect if not authenticated ═══
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // ═══ Load user data ═══
  useEffect(() => {
    if (status !== 'authenticated') return;

    try {
      // Bookmarks
      const bookmarks = JSON.parse(localStorage.getItem('tazkia-bookmarks') || '[]');
      // Tasbih
      const tasbih = JSON.parse(localStorage.getItem('tazkia-tasbih-state') || '{}');
      // Tasbih sessions
      const sessions = JSON.parse(localStorage.getItem('tazkia-tasbih-sessions') || '[]');
      // Quran progress
      const quranProgress = JSON.parse(localStorage.getItem('quran-progress') || '{}');
      // Newsletter
      const newsletter = JSON.parse(localStorage.getItem('tazkia-newsletter') || '[]');

      // Compute stats
      const bookmarkCount = Array.isArray(bookmarks) ? bookmarks.length : 0;
      const totalDhikr = tasbih.totalToday || 0;
      const sessionCount = Array.isArray(sessions) ? sessions.length : 0;

      // Calculate reading streak (very simplified)
      const today = new Date().toDateString();
      const lastRead = localStorage.getItem('last-quran-read');
      let streak = 0;
      if (lastRead) {
        const lastDate = new Date(lastRead);
        const diffDays = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));
        streak = Math.max(1, 7 - diffDays);
      }

      setStats({
        bookmarks: bookmarkCount,
        totalDhikr,
        sessions: sessionCount,
        streak,
        quranProgress: quranProgress.percent || 0,
        lastSurah: quranProgress.surahName || null,
        newsletter: newsletter.length > 0,
      });

      // Recent bookmarks (first 3)
      setRecentBookmarks(Array.isArray(bookmarks) ? bookmarks.slice(0, 3) : []);

      // Recent tasbih sessions (first 3)
      setRecentSessions(Array.isArray(sessions) ? sessions.slice(0, 3) : []);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }, [status]);

  // ═══ Loading state ═══
  if (status === 'loading' || loading) {
    return (
      <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="h-32 bg-base-200 rounded-2xl animate-pulse mb-4" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-base-200 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="h-64 bg-base-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const firstName = user.name?.split(' ')[0] || 'User';
  const userInitial = firstName[0]?.toUpperCase() || 'U';

  // ═══ Stat Cards Data ═══
  const statCards = [
    {
      icon: FaBookmark,
      label: 'বুকমার্ক',
      value: stats.bookmarks,
      suffix: 'টি',
      color: 'from-gold to-gold-dark',
      href: '/bookmarks',
    },
    {
      icon: FaQuran,
      label: 'কুরআন প্রগ্রেস',
      value: `${Math.round(stats.quranProgress)}%`,
      suffix: '',
      color: 'from-emerald-500 to-teal-700',
      href: '/quran',
    },
    {
      icon: FaStar,
      label: 'আজকের জিকির',
      value: stats.totalDhikr,
      suffix: 'বার',
      color: 'from-rose-500 to-pink-700',
      href: '/tasbih',
    },
    {
      icon: FaFire,
      label: 'রিডিং স্ট্রিক',
      value: stats.streak,
      suffix: 'দিন',
      color: 'from-amber-500 to-orange-700',
      href: '/quran',
    },
  ];

  // ═══ Quick Actions ═══
  const quickActions = [
    { icon: FaQuran, name: 'কুরআন পড়ুন', href: '/quran', color: 'from-emerald-500 to-teal-700' },
    { icon: FaClock, name: 'নামাজের সময়', href: '/prayer', color: 'from-cyan-500 to-blue-700' },
    { icon: FaStar, name: 'তাসবিহ', href: '/tasbih', color: 'from-rose-500 to-pink-700' },
    { icon: FaCompass, name: 'কিবলা', href: '/qibla', color: 'from-purple-500 to-violet-700' },
    { icon: FaHands, name: 'দুআ', href: '/duas', color: 'from-amber-500 to-orange-700' },
    { icon: FaBookmark, name: 'বুকমার্ক', href: '/bookmarks', color: 'from-gold to-gold-dark' },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Dashboard' }]} showBack={false} />

      {/* ═══ Welcome Hero ═══ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-5 sm:p-8 mb-5 shadow-xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="relative flex items-center gap-4 flex-wrap sm:flex-nowrap">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover ring-4 ring-gold/30 shrink-0 shadow-lg"
            />
          ) : (
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gold flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-lg ring-4 ring-white/20 shrink-0">
              {userInitial}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gold/90 uppercase tracking-widest font-semibold mb-1">
              আসসালামু আলাইকুম
            </p>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold truncate">
              {firstName} 👋
            </h1>
            <p className="text-xs sm:text-sm text-white/70 mt-1">
              আপনার ইসলামিক যাত্রা এখানেই চলছে
            </p>
          </div>
          <Link
            href="/profile"
            className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-sm font-medium transition-all active:scale-95 shrink-0"
          >
            <FaUser size={12} />
            প্রোফাইল
          </Link>
        </div>
      </div>

      {/* ═══ Stats Grid ═══ */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Link
              key={i}
              href={stat.href}
              className="group bg-base-200 border border-base-300 rounded-2xl p-3.5 sm:p-4 hover:border-primary/40 active:scale-[0.98] transition-all"
            >
              <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-2.5 shadow-md group-hover:scale-110 transition-transform`}>
                <Icon size={16} />
              </div>
              <p className="text-[10px] sm:text-xs text-base-content/60 uppercase tracking-wider font-semibold mb-1">
                {stat.label}
              </p>
              <p className="text-xl sm:text-2xl font-bold text-base-content leading-none">
                {stat.value}
                {stat.suffix && (
                  <span className="text-xs text-base-content/50 ml-1 font-medium">
                    {stat.suffix}
                  </span>
                )}
              </p>
            </Link>
          );
        })}
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm sm:text-base font-bold text-base-content flex items-center gap-2">
            <span className="w-1 h-4 bg-gold rounded-full" />
            দ্রুত অ্যাকশন
          </h2>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <Link
                key={i}
                href={action.href}
                className="group flex flex-col items-center gap-2 p-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary active:scale-[0.98] transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                  <Icon size={14} />
                </div>
                <span className="text-[10px] sm:text-xs font-semibold text-base-content text-center leading-tight">
                  {action.name}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══ Recent Bookmarks ═══ */}
      {recentBookmarks.length > 0 && (
        <div className="bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-bold text-base-content flex items-center gap-2">
              <FaBookmark size={13} className="text-gold" />
              সাম্প্রতিক বুকমার্ক
            </h2>
            <Link
              href="/bookmarks"
              className="text-xs text-primary hover:underline font-medium flex items-center gap-1"
            >
              সব দেখুন
              <FaArrowRight size={9} />
            </Link>
          </div>
          <div className="space-y-2">
            {recentBookmarks.map((bm, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-3 rounded-xl bg-base-100 border border-base-300"
              >
                <div className="w-8 h-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold shrink-0">
                  <FaBookmark size={11} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                    {bm.title || 'Bookmark'}
                  </p>
                  {bm.reference && (
                    <p className="text-[10px] text-base-content/50 mt-0.5 truncate">
                      📚 {bm.reference}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Recent Activity ═══ */}
      {recentSessions.length > 0 && (
        <div className="bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm sm:text-base font-bold text-base-content flex items-center gap-2">
              <FaHistory size={13} className="text-primary" />
              সম্প্রতি সম্পন্ন সেশন
            </h2>
          </div>
          <div className="space-y-2">
            {recentSessions.map((s, i) => (
              <div
                key={i}
                className="flex items-center gap-3 p-3 rounded-xl bg-base-100 border border-base-300"
              >
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600 shrink-0">
                  <FaStar size={11} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                    {s.dhikrId || 'Dhikr'} × {s.count}
                  </p>
                  <p className="text-[10px] text-base-content/50 mt-0.5">
                    {s.completedAt
                      ? new Date(s.completedAt).toLocaleDateString('bn-BD')
                      : ''}
                  </p>
                </div>
                <FaTrophy size={12} className="text-gold shrink-0" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══ Empty State — No Activity ═══ */}
      {recentBookmarks.length === 0 && recentSessions.length === 0 && (
        <div className="text-center py-12 sm:py-16 bg-base-200 border border-base-300 rounded-2xl mb-5">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gold/10 flex items-center justify-center text-gold text-2xl mb-3">
            <FaAward />
          </div>
          <h3 className="text-base sm:text-lg font-bold text-base-content mb-2">
            আপনার যাত্রা শুরু হোক
          </h3>
          <p className="text-xs sm:text-sm text-base-content/60 mb-5 max-w-md mx-auto px-4">
            কুরআন পড়ুন, দুআ সেভ করুন, জিকির করুন — সব আপনার ড্যাশবোর্ডে দেখা যাবে।
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            <Link
              href="/quran"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-medium active:scale-95"
            >
              <FaQuran size={12} />
              কুরআন পড়ুন
            </Link>
            <Link
              href="/tasbih"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-base-100 border border-base-300 hover:border-primary text-sm font-medium active:scale-95"
            >
              <FaStar size={12} />
              তাসবিহ শুরু
            </Link>
          </div>
        </div>
      )}

      {/* ═══ Explore Links ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Link
          href="/articles"
          className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-white shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <FaBookOpen size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">ইসলামিক জ্ঞান</p>
            <p className="text-[11px] text-white/70">২০+ আর্টিকেল পড়ুন</p>
          </div>
          <FaChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>

        <Link
          href="/calendar"
          className="group flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          <div className="w-11 h-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
            <FaCalendar size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-sm">হিজরি ক্যালেন্ডার</p>
            <p className="text-[11px] text-white/80">ইসলামিক তারিখ দেখুন</p>
          </div>
          <FaChevronRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
