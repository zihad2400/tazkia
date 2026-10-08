'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FaSearch, FaTimes, FaQuran, FaBookOpen, FaHands, FaClock,
  FaCompass, FaStar, FaCalendar, FaMosque, FaArrowRight,
  FaSpinner, FaHashtag, FaBookmark, FaHome, FaChevronRight,
} from 'react-icons/fa';

const quickLinks = [
  { name: 'Al-Quran', nameBn: 'কুরআন', href: '/quran', icon: FaQuran, category: 'Quran', color: 'from-emerald-500 to-teal-700' },
  { name: 'Sahih Bukhari', nameBn: 'সহীহ বুখারী', href: '/hadith/bukhari', icon: FaBookOpen, category: 'Hadith', color: 'from-blue-500 to-indigo-700' },
  { name: 'Sahih Muslim', nameBn: 'সহীহ মুসলিম', href: '/hadith/muslim', icon: FaBookOpen, category: 'Hadith', color: 'from-blue-600 to-indigo-800' },
  { name: 'Morning Du\'as', nameBn: 'সকালের দুআ', href: '/duas/morning-evening', icon: FaHands, category: "Du'a", color: 'from-amber-500 to-orange-700' },
  { name: 'Sleep Du\'as', nameBn: 'ঘুমের দুআ', href: '/duas/sleep', icon: FaHands, category: "Du'a", color: 'from-amber-600 to-orange-800' },
  { name: 'Prayer Times', nameBn: 'নামাজের সময়', href: '/prayer', icon: FaClock, category: 'Prayer', color: 'from-cyan-500 to-blue-700' },
  { name: 'Qibla', nameBn: 'কিবলা', href: '/qibla', icon: FaCompass, category: 'Tools', color: 'from-purple-500 to-violet-700' },
  { name: 'Tasbih', nameBn: 'তাসবিহ', href: '/tasbih', icon: FaStar, category: 'Tools', color: 'from-rose-500 to-pink-700' },
  { name: 'Saved', nameBn: 'বুকমার্ক', href: '/bookmarks', icon: FaBookmark, category: 'Saved', color: 'from-gold to-gold-dark' },
  { name: 'Calendar', nameBn: 'ক্যালেন্ডার', href: '/calendar', icon: FaCalendar, category: 'Tools', color: 'from-teal-500 to-cyan-700' },
];

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  // Focus input when opened
  useEffect(() => {
    if (open && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
    if (!open) {
      setQuery('');
      setResults(null);
      setActiveTab('all');
    }
  }, [open]);

  // Search
  const doSearch = useCallback(async (q) => {
    if (!q || q.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=15`);
      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error(err);
      setResults(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounce
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query || query.trim().length < 2) {
      setResults(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    debounceRef.current = setTimeout(() => doSearch(query), 400);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, doSearch]);

  // ESC to close
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (open) window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  // Prevent body scroll
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  const hasResults = results && results.total > 0;
  const tabs = [
    { id: 'all', label: 'সব', count: results?.total || 0 },
    { id: 'quran', label: 'কুরআন', count: results?.results?.quran?.length || 0 },
    { id: 'hadith', label: 'হাদিস', count: results?.results?.hadith?.length || 0 },
    { id: 'duas', label: 'দুআ', count: results?.results?.duas?.length || 0 },
  ];

  const showQuran = activeTab === 'all' || activeTab === 'quran';
  const showHadith = activeTab === 'all' || activeTab === 'hadith';
  const showDuas = activeTab === 'all' || activeTab === 'duas';

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center p-3 sm:p-4 pt-12 sm:pt-20 md:pt-28">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-md animate-fadeIn"
        onClick={onClose}
      />

      <div className="relative w-full max-w-2xl bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden animate-fadeIn max-h-[85vh] flex flex-col">

        {/* Search Input */}
        <div className="flex items-center gap-2.5 sm:gap-3 px-3 sm:px-4 py-3 sm:py-4 border-b border-base-300 shrink-0">
          <FaSearch className="text-primary shrink-0" size={14} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="কুরআন, হাদিস, দুআ... সব কিছু খুঁজুন"
            className="flex-1 bg-transparent text-base-content placeholder:text-base-content/40 outline-none text-sm sm:text-base"
          />
          {loading && <FaSpinner className="animate-spin text-primary shrink-0" size={13} />}
          <button
            onClick={onClose}
            className="p-1.5 sm:p-2 rounded-lg hover:bg-primary/10 text-base-content/60 transition-colors shrink-0"
            aria-label="Close"
          >
            <FaTimes size={13} />
          </button>
        </div>

        {/* Tabs */}
        {hasResults && (
          <div className="flex items-center gap-1 px-3 py-2 border-b border-base-300 overflow-x-auto scrollbar-hide shrink-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-white'
                    : 'text-base-content/60 hover:bg-primary/10'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] sm:text-[10px] ${
                    activeTab === tab.id ? 'bg-white/25' : 'bg-base-300 text-base-content/70'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Results Area */}
        <div className="overflow-y-auto flex-1">
          {/* No query — Quick links */}
          {!query && (
            <>
              <p className="px-3 sm:px-4 py-3 text-[10px] font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-2">
                <FaStar size={9} className="text-gold" />
                দ্রুত লিংক
              </p>
              <div className="px-2 pb-3">
                {quickLinks.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={i}
                      href={item.href}
                      onClick={onClose}
                      className="group flex items-center gap-2.5 sm:gap-3 px-2.5 sm:px-3 py-2.5 rounded-xl hover:bg-primary/10 transition-colors"
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${item.color} text-white flex items-center justify-center shrink-0 shadow-sm`}>
                        <Icon size={13} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                          {item.nameBn}
                        </p>
                        <p className="text-[10px] text-base-content/50 truncate">{item.name} · {item.category}</p>
                      </div>
                      <FaChevronRight size={9} className="text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </>
          )}

          {/* Loading */}
          {query && loading && !results && (
            <div className="p-4 space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-base-200 rounded-xl animate-pulse" />
              ))}
            </div>
          )}

          {/* No results */}
          {query && !loading && results && results.total === 0 && (
            <div className="p-8 sm:p-12 text-center">
              <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-base-200 flex items-center justify-center mb-3">
                <FaSearch className="text-base-content/30" size={18} />
              </div>
              <p className="text-sm font-semibold text-base-content/70 mb-1.5">
                কিছু পাওয়া যায়নি
              </p>
              <p className="text-xs text-base-content/50 mb-3">
                &ldquo;{query}&rdquo; এর জন্য ফলাফল নেই
              </p>
              <p className="text-[10px] text-base-content/40">
                ভিন্ন কীওয়ার্ড দিয়ে চেষ্টা করুন
              </p>
            </div>
          )}

          {/* Results */}
          {hasResults && (
            <div className="py-2">
              {/* Quran */}
              {showQuran && results.results.quran?.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-1.5">
                    <FaQuran size={9} className="text-emerald-500" />
                    কুরআন ({results.results.quran.length})
                  </p>
                  {results.results.quran.map((s) => (
                    <Link
                      key={s.id}
                      href={`/quran/${s.number}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-emerald-500/10 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                        {s.number}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                          {s.name}
                        </p>
                        <p className="text-[10px] text-base-content/60 truncate">
                          {s.translation} · {s.numberOfAyahs} আয়াত
                        </p>
                      </div>
                      <span className="font-arabic text-sm text-primary shrink-0">
                        {s.nameAr?.replace('سُورَةُ ', '')}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {/* Hadith */}
              {showHadith && results.results.hadith?.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-1.5">
                    <FaBookOpen size={9} className="text-blue-500" />
                    হাদিস ({results.results.hadith.length})
                  </p>
                  {results.results.hadith.map((h) => (
                    <Link
                      key={h.id}
                      href={`/hadith/${h.collectionId}/${h.hadithNumber}`}
                      onClick={onClose}
                      className="group flex items-start gap-3 px-3 sm:px-4 py-2.5 hover:bg-blue-500/10 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center text-[11px] font-bold shrink-0">
                        {h.hadithNumber}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm text-base-content line-clamp-2 leading-relaxed">
                          {h.text}
                        </p>
                        <p className="text-[10px] text-base-content/50 mt-1 flex items-center gap-1">
                          <FaHashtag size={8} />
                          {h.collectionId} · হাদিস #{h.hadithNumber}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Du'a Categories */}
              {showDuas && results.results.categories?.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-1.5">
                    <FaHands size={9} className="text-amber-500" />
                    দুআ ক্যাটাগরি ({results.results.categories.length})
                  </p>
                  {results.results.categories.map((c) => (
                    <Link
                      key={c.id}
                      href={`/duas/${c.categoryId}`}
                      onClick={onClose}
                      className="group flex items-center gap-3 px-3 sm:px-4 py-2.5 hover:bg-amber-500/10 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white flex items-center justify-center text-lg shrink-0">
                        {c.icon}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                          {c.name}
                        </p>
                        <p className="text-[10px] text-base-content/60 truncate">{c.nameEn}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Du'as */}
              {showDuas && results.results.duas?.length > 0 && (
                <div className="mb-2">
                  <p className="px-3 sm:px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-base-content/40 flex items-center gap-1.5">
                    <FaHands size={9} className="text-amber-600" />
                    দুআ ({results.results.duas.length})
                  </p>
                  {results.results.duas.map((d) => (
                    <Link
                      key={d.id}
                      href={`/duas/${d.categoryId}`}
                      onClick={onClose}
                      className="group flex items-start gap-3 px-3 sm:px-4 py-2.5 hover:bg-amber-600/10 transition-colors"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-violet-700 text-white flex items-center justify-center text-lg shrink-0">
                        🤲
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                          {d.title}
                        </p>
                        <p className="text-[10px] text-base-content/70 line-clamp-1 mt-0.5">
                          {d.translation}
                        </p>
                        <p className="text-[9px] text-base-content/50 mt-0.5">
                          📚 {d.reference}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}

              {/* Footer hint */}
              <div className="px-4 py-3 text-center text-[10px] text-base-content/40 border-t border-base-300">
                {results.total} টি ফলাফল · {results.elapsed || 0}ms
              </div>
            </div>
          )}
        </div>

        {/* Bottom Bar */}
        <div className="px-3 sm:px-4 py-2.5 border-t border-base-300 flex items-center justify-between text-[10px] text-base-content/50 bg-base-200/50 shrink-0">
          <span className="flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-base-300 rounded text-[9px] font-mono">ESC</kbd>
            বন্ধ
          </span>
          <span className="hidden sm:inline flex items-center gap-1.5">
            <kbd className="px-1.5 py-0.5 bg-base-300 rounded text-[9px] font-mono">⌘K</kbd>
            খুলুন
          </span>
        </div>
      </div>
    </div>
  );
}
