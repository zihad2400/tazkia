'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  FaQuran, FaBookOpen, FaHands, FaClock, FaCompass,
  FaStar, FaCalendar, FaBookmark, FaUser, FaCog,
  FaHome, FaSearch, FaMoon, FaSun, FaGlobe,
  FaChevronRight, FaHeart, FaInfoCircle, FaEnvelope,
  FaShieldAlt, FaFileContract, FaSignInAlt, FaSignOutAlt,
  FaChartLine, FaFire,
} from 'react-icons/fa';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useSession, signOut } from 'next-auth/react';
import toast from 'react-hot-toast';

export default function MorePage() {
  const { theme, setTheme } = useTheme();
  const { lang, setLang } = useLanguage();
  const { data: session } = useSession();
  const [stats, setStats] = useState({ bookmarks: 0, quranReads: 0, totalDhikr: 0, streak: 0 });

  // ═══ Load stats from localStorage ═══
  useEffect(() => {
    try {
      const bookmarks = JSON.parse(localStorage.getItem('tazkia-bookmarks') || '[]');
      const tasbih = JSON.parse(localStorage.getItem('tazkia-tasbih-state') || '{}');
      const quranProgress = JSON.parse(localStorage.getItem('quran-bookmarks') || '[]');
      const sessions = JSON.parse(localStorage.getItem('tazkia-tasbih-sessions') || '[]');

      setStats({
        bookmarks: Array.isArray(bookmarks) ? bookmarks.length : 0,
        quranReads: Array.isArray(quranProgress) ? quranProgress.length : 0,
        totalDhikr: tasbih.totalToday || 0,
        streak: Array.isArray(sessions) ? sessions.length : 0,
      });
    } catch (e) {}
  }, []);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);

  // ═══ Main Sections ═══
  const mainSections = [
    {
      title: 'প্রধান',
      titleEn: 'Main',
      items: [
        { icon: FaQuran, name: 'কুরআন', nameEn: 'Quran', href: '/quran', color: 'from-emerald-500 to-teal-700' },
        { icon: FaBookOpen, name: 'হাদিস', nameEn: 'Hadith', href: '/hadith', color: 'from-blue-500 to-indigo-700' },
        { icon: FaHands, name: 'দুআ', nameEn: "Du'as", href: '/duas', color: 'from-amber-500 to-orange-700' },
        { icon: FaClock, name: 'নামাজ', nameEn: 'Prayer', href: '/prayer', color: 'from-cyan-500 to-blue-700' },
      ],
    },
    {
      title: 'টুলস',
      titleEn: 'Tools',
      items: [
        { icon: FaCompass, name: 'কিবলা', nameEn: 'Qibla', href: '/qibla', color: 'from-purple-500 to-violet-700' },
        { icon: FaStar, name: 'তাসবিহ', nameEn: 'Tasbih', href: '/tasbih', color: 'from-rose-500 to-pink-700' },
        { icon: FaCalendar, name: 'ক্যালেন্ডার', nameEn: 'Calendar', href: '/calendar', color: 'from-teal-500 to-cyan-700' },
        { icon: FaBookmark, name: 'বুকমার্ক', nameEn: 'Bookmarks', href: '/bookmarks', color: 'from-gold to-gold-dark' },
      ],
    },
    {
      title: 'শেখা',
      titleEn: 'Learn',
      items: [
        { icon: FaBookOpen, name: 'জ্ঞান', nameEn: 'Knowledge', href: '/articles', color: 'from-indigo-500 to-purple-700' },
      ],
    },
  ];

  // ═══ Account Items ═══
  const accountItems = session?.user
    ? [
        { icon: FaChartLine, name: 'ড্যাশবোর্ড', nameEn: 'Dashboard', href: '/dashboard', color: 'from-primary to-primary-dark' },
        { icon: FaUser, name: 'প্রোফাইল', nameEn: 'Profile', href: '/profile', color: 'from-blue-500 to-indigo-700' },
        { icon: FaCog, name: 'সেটিংস', nameEn: 'Settings', href: '/settings', color: 'from-cyan-500 to-blue-700' },
      ]
    : [];

  // ═══ Other Items ═══
  const otherItems = [
    { icon: FaInfoCircle, name: 'পরিচিতি', nameEn: 'About', href: '/about', color: 'from-teal-500 to-cyan-700' },
    { icon: FaEnvelope, name: 'যোগাযোগ', nameEn: 'Contact', href: '/contact', color: 'from-amber-500 to-orange-700' },
    { icon: FaShieldAlt, name: 'গোপনীয়তা', nameEn: 'Privacy', href: '/privacy', color: 'from-green-500 to-emerald-700' },
    { icon: FaFileContract, name: 'শর্তাবলী', nameEn: 'Terms', href: '/terms', color: 'from-slate-500 to-gray-700' },
  ];

  const handleOpenSearch = () => {
    window.dispatchEvent(new Event('open-search'));
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 sm:px-4 py-4 pb-32 overflow-x-hidden">

      {/* ═══ Header ═══ */}
      <div className="text-center mb-5 pt-2">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl shadow-xl mb-3">
          <GridIcon />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-primary mb-1">
          আরও অপশন
        </h1>
        <p className="text-xs text-base-content/60">
          সব ফিচার এক জায়গায়
        </p>
      </div>

      {/* ═══ Quick Stats ═══ */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        <div className="bg-gradient-to-br from-gold/20 to-gold/5 border border-gold/30 rounded-2xl p-2.5 text-center">
          <FaBookmark className="text-gold mx-auto mb-1" size={14} />
          <p className="text-base font-bold text-gold leading-none">{stats.bookmarks}</p>
          <p className="text-[8px] text-base-content/60 uppercase tracking-wider mt-1">
            সেভ
          </p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 border border-emerald-500/30 rounded-2xl p-2.5 text-center">
          <FaQuran className="text-emerald-600 mx-auto mb-1" size={14} />
          <p className="text-base font-bold text-emerald-600 leading-none">{stats.quranReads}</p>
          <p className="text-[8px] text-base-content/60 uppercase tracking-wider mt-1">
            কুরআন
          </p>
        </div>
        <div className="bg-gradient-to-br from-rose-500/20 to-rose-500/5 border border-rose-500/30 rounded-2xl p-2.5 text-center">
          <FaStar className="text-rose-500 mx-auto mb-1" size={14} />
          <p className="text-base font-bold text-rose-500 leading-none">{stats.totalDhikr}</p>
          <p className="text-[8px] text-base-content/60 uppercase tracking-wider mt-1">
            জিকির
          </p>
        </div>
        <div className="bg-gradient-to-br from-amber-500/20 to-amber-500/5 border border-amber-500/30 rounded-2xl p-2.5 text-center">
          <FaFire className="text-amber-600 mx-auto mb-1" size={14} />
          <p className="text-base font-bold text-amber-600 leading-none">{stats.streak}</p>
          <p className="text-[8px] text-base-content/60 uppercase tracking-wider mt-1">
            সেশন
          </p>
        </div>
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={handleOpenSearch}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-95 transition-all"
        >
          <FaSearch className="text-primary" size={15} />
          <span className="text-[10px] font-medium text-base-content">সার্চ</span>
        </button>
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-95 transition-all"
        >
          {isDark ? (
            <FaSun className="text-gold" size={15} />
          ) : (
            <FaMoon className="text-primary" size={15} />
          )}
          <span className="text-[10px] font-medium text-base-content">
            {isDark ? 'লাইট' : 'ডার্ক'}
          </span>
        </button>
        <button
          onClick={() => {
            const langs = ['en', 'bn', 'ar'];
            const next = langs[(langs.indexOf(lang) + 1) % langs.length];
            setLang(next);
            toast.success(`ভাষা: ${next.toUpperCase()}`);
          }}
          className="flex flex-col items-center gap-1.5 p-3 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-95 transition-all"
        >
          <FaGlobe className="text-primary" size={15} />
          <span className="text-[10px] font-medium text-base-content uppercase">
            {lang}
          </span>
        </button>
      </div>

      {/* ═══ Main Sections ═══ */}
      {mainSections.map((section, idx) => (
        <div key={idx} className="mb-5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1 h-4 bg-gold rounded-full" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-base-content/70">
              {section.title}
            </h2>
            <span className="text-[10px] text-base-content/40">
              ({section.items.length})
            </span>
          </div>

          {/* ═══ SINGLE COLUMN on mobile, 2 on tablet+ ═══ */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center gap-3 p-3 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-[0.98] transition-all"
                >
                  {/* Icon — Fixed Width */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform shrink-0`}>
                    <Icon size={16} />
                  </div>

                  {/* Text — Full Width, No Truncate */}
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-base-content leading-tight mb-0.5">
                      {item.name}
                    </p>
                    <p className="text-[11px] text-base-content/50 leading-tight">
                      {item.nameEn}
                    </p>
                  </div>

                  {/* Chevron */}
                  <FaChevronRight
                    size={10}
                    className="text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
                  />
                </Link>
              );
            })}
          </div>
        </div>
      ))}

      {/* ═══ Account Section ═══ */}
      {session?.user && (
        <div className="mb-5">
          <div className="flex items-center gap-2 mb-3 px-1">
            <div className="w-1 h-4 bg-primary rounded-full" />
            <h2 className="text-sm font-bold uppercase tracking-widest text-base-content/70">
              একাউন্ট
            </h2>
          </div>

          {/* User Card */}
          <div className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-4 mb-3 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gold flex items-center justify-center font-bold text-xl shadow-md shrink-0">
                {session.user.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate">{session.user.name}</p>
                <p className="text-xs text-white/70 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {accountItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-3 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-[0.98] transition-all"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm shrink-0`}>
                    <Icon size={14} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-base-content leading-tight">
                      {item.name}
                    </p>
                    <p className="text-[10px] text-base-content/50 leading-tight mt-0.5">
                      {item.nameEn}
                    </p>
                  </div>
                  <FaChevronRight size={10} className="text-base-content/30 shrink-0" />
                </Link>
              );
            })}
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/' })}
            className="w-full flex items-center gap-3 p-3 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 active:scale-[0.98] transition-all mt-2"
          >
            <div className="w-10 h-10 rounded-xl bg-red-500 flex items-center justify-center text-white shadow-sm shrink-0">
              <FaSignOutAlt size={14} />
            </div>
            <span className="text-sm font-semibold">লগ আউট</span>
          </button>
        </div>
      )}

      {/* ═══ Sign In ═══ */}
      {!session?.user && (
        <div className="mb-5">
          <Link
            href="/login"
            className="flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-br from-gold to-gold-dark text-white shadow-lg active:scale-[0.98] transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <FaSignInAlt size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm">সাইন ইন করুন</p>
              <p className="text-[11px] text-white/80 leading-tight mt-0.5">
                বুকমার্ক ও প্রোগ্রেস সেভ করতে
              </p>
            </div>
            <FaChevronRight size={12} />
          </Link>
        </div>
      )}

      {/* ═══ Other Links ═══ */}
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-3 px-1">
          <div className="w-1 h-4 bg-gold rounded-full" />
          <h2 className="text-sm font-bold uppercase tracking-widest text-base-content/70">
            অন্যান্য
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {otherItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 p-3 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-[0.98] transition-all"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm shrink-0`}>
                  <Icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-base-content leading-tight">
                    {item.name}
                  </p>
                  <p className="text-[10px] text-base-content/50 leading-tight mt-0.5">
                    {item.nameEn}
                  </p>
                </div>
                <FaChevronRight size={10} className="text-base-content/30 shrink-0" />
              </Link>
            );
          })}
        </div>
      </div>

      {/* ═══ Big Home Button — Bottom ═══ */}
      <div className="mt-8 mb-4">
        <Link
          href="/"
          className="group flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-gradient-to-r from-primary via-primary-dark to-primary text-white font-bold text-base shadow-xl hover:shadow-2xl hover:scale-[1.01] active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
            <FaHome size={16} />
          </div>
          <span>হোম পেজে ফিরুন</span>
          <FaChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* ═══ Small Footer Note ═══ */}
      <div className="text-center py-3">
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-base-content/50">
          <span>Made with</span>
          <FaHeart size={9} className="text-red-500 animate-pulse" />
          <span>for the Ummah</span>
        </div>
        <p className="text-[10px] text-base-content/40 mt-2">
          TAZKIA © {new Date().getFullYear()}
        </p>
      </div>
    </div>
  );
}

// ═══ Grid Icon ═══
function GridIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}
