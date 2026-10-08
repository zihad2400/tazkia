'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FaBookmark, FaTrash, FaSearch, FaTimes,
  FaQuran, FaBookOpen, FaHands, FaStar, FaBook,
  FaHome, FaChevronRight, FaExclamationTriangle,
  FaSpinner,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

const STORAGE_KEY = 'tazkia-bookmarks';
const SYNC_EVENT = 'tazkia-bookmarks-sync';

const TABS = [
  { id: 'all', name: 'সব', icon: FaBookmark, color: 'from-primary to-primary-dark' },
  { id: 'quran', name: 'কুরআন', icon: FaQuran, color: 'from-emerald-500 to-teal-700' },
  { id: 'hadith', name: 'হাদিস', icon: FaBookOpen, color: 'from-blue-500 to-indigo-700' },
  { id: 'dua', name: 'দুআ', icon: FaHands, color: 'from-amber-500 to-orange-700' },
  { id: 'verse', name: 'আয়াত', icon: FaStar, color: 'from-purple-500 to-violet-700' },
  { id: 'article', name: 'আর্টিকেল', icon: FaBook, color: 'from-cyan-500 to-blue-700' },
];

export default function BookmarksPage() {
  const [bookmarks, setBookmarks] = useState([]);
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // ═══ Load bookmarks directly ═══
  const loadBookmarks = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      setBookmarks(Array.isArray(parsed) ? parsed : []);
    } catch (e) {
      setBookmarks([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadBookmarks();
    setMounted(true);

    // Sync listener
    const handler = () => loadBookmarks();
    window.addEventListener(SYNC_EVENT, handler);
    window.addEventListener('storage', handler);
    window.addEventListener('focus', handler);

    // Periodic refresh (safety net)
    const interval = setInterval(loadBookmarks, 2000);

    return () => {
      window.removeEventListener(SYNC_EVENT, handler);
      window.removeEventListener('storage', handler);
      window.removeEventListener('focus', handler);
      clearInterval(interval);
    };
  }, []);

  // ═══ Counts ═══
  const counts = useMemo(
    () => ({
      all: bookmarks.length,
      quran: bookmarks.filter((b) => b.type === 'quran').length,
      hadith: bookmarks.filter((b) => b.type === 'hadith').length,
      dua: bookmarks.filter((b) => b.type === 'dua').length,
      verse: bookmarks.filter((b) => b.type === 'verse').length,
      article: bookmarks.filter((b) => b.type === 'article').length,
    }),
    [bookmarks]
  );

  // ═══ Filtered ═══
  const filtered = useMemo(() => {
    let list = activeTab === 'all' ? bookmarks : bookmarks.filter((b) => b.type === activeTab);
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((b) => {
        return (
          (b.title || '').toLowerCase().includes(q) ||
          (b.text || '').toLowerCase().includes(q) ||
          (b.translation || '').toLowerCase().includes(q) ||
          (b.reference || '').toLowerCase().includes(q) ||
          (b.arabic || '').includes(search.trim()) ||
          (b.subtitle || '').toLowerCase().includes(q)
        );
      });
    }
    return list;
  }, [bookmarks, activeTab, search]);

  // ═══ Remove ═══
  const handleRemove = (id) => {
    try {
      const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const updated = current.filter((b) => b.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setBookmarks(updated);
      window.dispatchEvent(new Event(SYNC_EVENT));
      toast.success('বুকমার্ক সরানো হয়েছে', { icon: '🗑️' });
    } catch (e) {
      toast.error('মুছতে সমস্যা');
    }
  };

  // ═══ Clear ═══
  const handleClear = () => {
    try {
      if (activeTab === 'all') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify([]));
        setBookmarks([]);
        toast.success('সব বুকমার্ক মুছে ফেলা হয়েছে', { icon: '🗑️' });
      } else {
        const current = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const updated = current.filter((b) => b.type !== activeTab);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setBookmarks(updated);
        const tab = TABS.find((t) => t.id === activeTab);
        toast.success(`${tab?.name} মুছে ফেলা হয়েছে`, { icon: '🗑️' });
      }
      window.dispatchEvent(new Event(SYNC_EVENT));
      setShowClearConfirm(false);
      setSearch('');
    } catch (e) {
      toast.error('মুছতে সমস্যা');
    }
  };

  // ═══ Time ago ═══
  const formatTimeAgo = (iso) => {
    if (!iso) return '';
    const d = new Date(iso);
    const now = new Date();
    const diffMins = Math.floor((now - d) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'এখন';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    if (diffDays < 7) return `${diffDays} দিন আগে`;
    return d.toLocaleDateString('bn-BD', { month: 'short', day: 'numeric' });
  };

  // ═══ Bookmark meta ═══
  const getBookmarkMeta = (b) => {
    const config = {
      quran: { icon: FaQuran, color: 'from-emerald-500 to-teal-700', link: `/quran/${b.surahNumber || 1}`, label: 'কুরআন' },
      hadith: { icon: FaBookOpen, color: 'from-blue-500 to-indigo-700', link: `/hadith/${b.collectionId || 'bukhari'}/${b.hadithNumber || 1}`, label: 'হাদিস' },
      dua: { icon: FaHands, color: 'from-amber-500 to-orange-700', link: `/duas/${b.categoryId || ''}`, label: 'দুআ' },
      verse: { icon: FaStar, color: 'from-purple-500 to-violet-700', link: `/quran/${b.surahNumber || 1}`, label: 'আয়াত' },
      article: { icon: FaBook, color: 'from-cyan-500 to-blue-700', link: `/articles/${b.slug || ''}`, label: 'আর্টিকেল' },
    };
    return config[b.type] || config.quran;
  };

  // ═══ Loading ═══
  if (!mounted || loading) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 py-10">
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="animate-spin text-primary text-2xl mb-4" />
          <p className="text-sm text-base-content/60">বুকমার্ক লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Bookmarks' }]} showBack={false} />

      {/* Header */}
      <div className="text-center mb-5">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl mb-3">
          <FaBookmark />
        </div>
        <p className="font-arabic text-gold text-lg sm:text-xl mb-0.5">المحفوظات</p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
          My Bookmarks
        </h1>
        <p className="text-xs text-base-content/60">
          {counts.all > 0
            ? `${counts.all}টি সেভ করা কনটেন্ট`
            : 'সেভ করা কনটেন্ট দেখুন'}
        </p>
      </div>

      {/* ═══ Empty State ═══ */}
      {counts.all === 0 ? (
        <div className="text-center py-12 sm:py-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-base-200 flex items-center justify-center mb-4">
            <FaBookmark className="text-base-content/30 text-3xl sm:text-4xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-base-content mb-2">
            এখনো কিছু সেভ করা হয়নি
          </h2>
          <p className="text-sm text-base-content/60 mb-6 max-w-md mx-auto px-4">
            কুরআন, হাদিস, দুআ বা আর্টিকেল পড়ার সময়{' '}
            <FaBookmark className="inline text-gold" size={11} /> আইকনে ক্লিক করে সেভ করুন।
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-lg mx-auto px-4">
            <Link href="/quran" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary transition-all active:scale-95">
              <FaQuran className="text-emerald-500 text-lg" />
              <span className="text-[11px] font-medium">কুরআন</span>
            </Link>
            <Link href="/hadith" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary transition-all active:scale-95">
              <FaBookOpen className="text-blue-500 text-lg" />
              <span className="text-[11px] font-medium">হাদিস</span>
            </Link>
            <Link href="/duas" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary transition-all active:scale-95">
              <FaHands className="text-amber-500 text-lg" />
              <span className="text-[11px] font-medium">দুআ</span>
            </Link>
            <Link href="/articles" className="flex flex-col items-center gap-2 p-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary transition-all active:scale-95">
              <FaBook className="text-cyan-500 text-lg" />
              <span className="text-[11px] font-medium">আর্টিকেল</span>
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Tabs */}
          <div className="mb-3 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
            <div className="flex items-center gap-1.5 pb-1 min-w-max">
              {TABS.map((tab) => {
                const Icon = tab.icon;
                const count = counts[tab.id] || 0;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] sm:text-xs font-semibold transition-all active:scale-95 ${
                      isActive
                        ? `bg-gradient-to-r ${tab.color} text-white shadow-md`
                        : 'bg-base-200 border border-base-300 hover:border-primary text-base-content'
                    }`}
                  >
                    <Icon size={10} />
                    <span>{tab.name}</span>
                    <span
                      className={`text-[9px] px-1.5 py-0.5 rounded-full ${
                        isActive ? 'bg-white/25' : 'bg-base-300'
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search + Clear */}
          <div className="flex items-center gap-2 mb-4">
            <div className="relative flex-1">
              <FaSearch
                className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40"
                size={11}
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="বুকমার্ক খুঁজুন..."
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-xs sm:text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-base-300 text-base-content/60"
                >
                  <FaTimes size={10} />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowClearConfirm(true)}
              className="shrink-0 px-3 py-2.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-xs font-medium hover:bg-red-100 active:scale-95 transition-all"
              title="মুছে ফেলুন"
            >
              <FaTrash size={11} />
            </button>
          </div>

          {/* Count */}
          <div className="flex items-center justify-between text-[11px] text-base-content/50 mb-3 px-1">
            <span>
              {filtered.length} টি বুকমার্ক
              {search && ` · "${search}"`}
            </span>
          </div>

          {/* List */}
          {filtered.length > 0 ? (
            <div className="space-y-2.5">
              {filtered.map((bookmark) => {
                const meta = getBookmarkMeta(bookmark);
                const Icon = meta.icon;
                return (
                  <div
                    key={bookmark.id}
                    className="bg-base-200 border border-base-300 rounded-2xl p-3 sm:p-4 hover:border-primary/40 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br ${meta.color} flex items-center justify-center text-white text-base sm:text-lg shrink-0 shadow-sm`}
                      >
                        <Icon />
                      </div>

                      <div className="flex-1 min-w-0">
                        {/* Badge + time */}
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span
                            className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${meta.color} text-white font-bold uppercase tracking-wider`}
                          >
                            {meta.label}
                          </span>
                          <span className="text-[9px] sm:text-[10px] text-base-content/40 shrink-0">
                            {formatTimeAgo(bookmark.addedAt)}
                          </span>
                        </div>

                        {/* Title */}
                        {bookmark.title && (
                          <h3 className="font-bold text-xs sm:text-sm text-base-content mb-1 line-clamp-2">
                            {bookmark.title}
                          </h3>
                        )}

                        {/* Subtitle */}
                        {bookmark.subtitle && (
                          <p className="text-[10px] sm:text-[11px] text-base-content/60 mb-1.5 line-clamp-1">
                            {bookmark.subtitle}
                          </p>
                        )}

                        {/* Arabic */}
                        {bookmark.arabic && (
                          <p
                            className="font-arabic text-sm sm:text-base text-primary mb-1.5 line-clamp-2 text-right"
                            dir="rtl"
                          >
                            {bookmark.arabic}
                          </p>
                        )}

                        {/* Text */}
                        {bookmark.text && (
                          <p className="text-[11px] sm:text-xs text-base-content/70 mb-1.5 line-clamp-2">
                            {bookmark.text}
                          </p>
                        )}

                        {/* Translation */}
                        {bookmark.translation &&
                          bookmark.translation !== bookmark.text && (
                            <p className="text-[11px] sm:text-xs text-base-content/70 mb-1.5 line-clamp-2">
                              {bookmark.translation}
                            </p>
                          )}

                        {/* Reference */}
                        {bookmark.reference && (
                          <p className="text-[9px] sm:text-[10px] text-base-content/50 mb-2">
                            📚 {bookmark.reference}
                          </p>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-base-300">
                          <Link
                            href={meta.link}
                            className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg bg-base-100 border border-base-300 hover:border-primary text-primary text-[10px] sm:text-[11px] font-semibold active:scale-95 transition-all"
                          >
                            পড়ুন
                            <FaChevronRight size={8} />
                          </Link>
                          <button
                            onClick={() => handleRemove(bookmark.id)}
                            className="flex items-center justify-center gap-1 px-3 py-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-[10px] sm:text-[11px] font-medium hover:bg-red-100 active:scale-95 transition-all"
                          >
                            <FaTrash size={9} />
                            <span className="hidden xs:inline">মুছুন</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-base-200 flex items-center justify-center mb-3">
                <FaSearch className="text-base-content/30 text-xl" />
              </div>
              <p className="text-sm text-base-content/70 mb-1.5">
                {search
                  ? `"${search}" এর জন্য কিছু পাওয়া যায়নি`
                  : `${TABS.find((t) => t.id === activeTab)?.name} এ কোনো বুকমার্ক নেই`}
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-xs text-primary hover:underline mt-2"
                >
                  Search clear করুন
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* Clear Confirm */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowClearConfirm(false)}
          />
          <div className="relative w-full max-w-sm bg-base-100 rounded-2xl shadow-2xl border border-base-300 p-5">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 text-xl mb-2.5">
                <FaExclamationTriangle />
              </div>
              <h3 className="font-bold text-base text-base-content mb-1.5">
                {activeTab === 'all'
                  ? 'সব বুকমার্ক মুছবেন?'
                  : `${TABS.find((t) => t.id === activeTab)?.name} এর সব মুছবেন?`}
              </h3>
              <p className="text-xs text-base-content/60">
                এই কাজটি undo করা যাবে না।
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-medium hover:border-primary active:scale-95"
              >
                বাতিল
              </button>
              <button
                onClick={handleClear}
                className="py-2.5 rounded-xl bg-red-500 text-white text-xs font-medium active:scale-95"
              >
                মুছুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Home */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs font-medium active:scale-[0.98]"
        >
          <FaHome size={11} />
          হোম
        </Link>
      </div>
    </div>
  );
}
