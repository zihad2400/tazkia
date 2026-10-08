'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaSearch, FaArrowLeft, FaCopy, FaShare, FaCheck,
  FaBookmark, FaRegBookmark, FaExclamationTriangle, FaTimes,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import BookmarkButton from '@/components/ui/BookmarkButton';
import toast from 'react-hot-toast';
import { duaCategories, getDuasByCategory } from '@/lib/data/duasData';
import { useSavedDuas } from '@/hooks/useSavedDuas';

export default function DuasCategoryPage() {
  const params = useParams();
  const categoryId = params.category;

  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const { isSaved, toggle } = useSavedDuas();

  const categoryInfo = duaCategories.find((c) => c.id === categoryId);
  const duas = getDuasByCategory(categoryId);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return duas;

    return duas.filter((dua) => {
      return (
        (dua.title || '').toLowerCase().includes(q) ||
        (dua.arabic || '').includes(search.trim()) ||
        (dua.transliteration || '').toLowerCase().includes(q) ||
        (dua.translation || '').toLowerCase().includes(q) ||
        (dua.reference || '').toLowerCase().includes(q)
      );
    });
  }, [duas, search]);

  const handleToggleSave = (dua) => {
    const wasSaved = isSaved(dua.id);
    toggle(dua);
    toast.success(wasSaved ? 'সেভ থেকে সরানো হয়েছে' : 'সেভ করা হয়েছে', {
      icon: wasSaved ? '🗑️' : '🔖',
    });
  };

  const copyDua = (dua) => {
    const text = `${dua.arabic}\n\n${dua.transliteration}\n\n${dua.translation}\n\n— ${dua.reference}`;
    navigator.clipboard.writeText(text);
    setCopiedId(dua.id);
    toast.success('কপি হয়েছে', { icon: '📋' });
    setTimeout(() => setCopiedId(null), 2000);
  };

  const shareDua = async (dua) => {
    const text = `${dua.arabic}\n\n${dua.translation}\n\n— ${dua.reference}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: dua.title, text });
      } catch (err) {}
    } else {
      navigator.clipboard.writeText(text);
      toast.success('কপি হয়েছে', { icon: '📋' });
    }
  };

  if (!categoryInfo) {
    return (
      <div className="max-w-4xl mx-auto px-3 py-20 text-center">
        <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
        <p className="text-base-content/60 mb-4">ক্যাটাগরি পাওয়া যায়নি</p>
        <Link href="/duas" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm">
          <FaArrowLeft size={12} /> সব দুআ
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: "Du'as", href: '/duas' },
          { label: categoryInfo.name },
        ]}
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-center mb-4 sm:mb-6 shadow-xl">
        <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2 sm:mb-3 border border-white/20">
          <span className="text-xl sm:text-2xl md:text-3xl">{categoryInfo.icon}</span>
        </div>
        <p className="font-arabic text-xl sm:text-2xl md:text-3xl text-gold mb-1 sm:mb-2">{categoryInfo.nameAr}</p>
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold mb-1">{categoryInfo.name}</h1>
        <p className="text-[11px] sm:text-xs md:text-sm text-white/70">{categoryInfo.nameEn}</p>
      </div>

      {/* Search */}
      <div className="relative mb-4 sm:mb-6">
        <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-base-content/40 z-10" size={13} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="এই ক্যাটাগরিতে খুঁজুন..."
          className="w-full pl-9 sm:pl-11 pr-10 py-2.5 sm:py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-base-300 text-base-content/60"
          >
            <FaTimes size={11} />
          </button>
        )}
      </div>

      {/* Info bar */}
      <div className="flex items-center justify-between text-xs text-base-content/60 mb-3 px-1">
        <span>{filtered.length} টি দুআ</span>
        <Link href="/duas/saved" className="flex items-center gap-1 text-gold-dark hover:underline">
          <FaBookmark size={10} />
          সেভ করা দেখুন
        </Link>
      </div>

      {/* Empty */}
      {filtered.length === 0 && search && (
        <div className="text-center py-16">
          <p className="text-base-content/60 mb-3">কিছু পাওয়া যায়নি</p>
          <button
            onClick={() => setSearch('')}
            className="text-sm text-primary hover:underline"
          >
            Search clear করুন
          </button>
        </div>
      )}

      {/* Du'as */}
      <div className="space-y-3 sm:space-y-4">
        {filtered.map((dua) => {
          const saved = isSaved(dua.id);
          return (
            <div
              key={dua.id}
              className="bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 hover:border-primary/40 transition-all"
            >
              {/* Title + Save + Count */}
              <div className="flex items-start justify-between mb-3 gap-2">
                <h3 className="font-bold text-sm sm:text-base text-base-content flex-1 min-w-0">
                  {dua.title}
                </h3>
                <div className="flex items-center gap-1 shrink-0">
                  {dua.count > 1 && (
                    <span className="text-[10px] px-2 py-1 rounded-full bg-gold/20 text-gold-dark font-bold">
                      ×{dua.count}
                    </span>
                  )}
                  <button
                    onClick={() => handleToggleSave(dua)}
                    className={`p-2 rounded-lg transition-all active:scale-95 ${
                      saved
                        ? 'text-gold bg-gold/15'
                        : 'text-base-content/50 hover:text-gold hover:bg-gold/10'
                    }`}
                    title={saved ? 'সেভ থেকে সরান' : 'সেভ করুন'}
                  >
                    {saved ? <FaBookmark size={13} /> : <FaRegBookmark size={13} />}
                  </button>
                </div>
              </div>

              {/* Arabic */}
              <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-3 sm:p-4 mb-3">
                <p className="font-arabic text-lg sm:text-xl md:text-2xl text-base-content leading-loose text-right">
                  {dua.arabic}
                </p>
              </div>

              {/* Transliteration */}
              {dua.transliteration && (
                <p className="text-xs sm:text-sm italic text-primary/80 mb-3">
                  {dua.transliteration}
                </p>
              )}

              {/* Translation */}
              {dua.translation && (
                <p className="text-sm sm:text-base text-base-content leading-relaxed mb-3">
                  {dua.translation}
                </p>
              )}

              {/* Reference */}
              {dua.reference && (
                <p className="text-[10px] sm:text-xs text-base-content/50 mb-3">
                  📚 {dua.reference}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-base-300">
                <button
                  onClick={() => copyDua(dua)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-base-100 border border-base-300 text-xs font-medium hover:border-primary active:scale-95 transition-all"
                >
                  {copiedId === dua.id ? (
                    <><FaCheck size={11} className="text-green-600" /><span className="text-green-700">হয়ে গেছে</span></>
                  ) : (
                    <><FaCopy size={11} /><span>কপি</span></>
                  )}
                </button>
                <button
                  onClick={() => shareDua(dua)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg bg-base-100 border border-base-300 text-xs font-medium hover:border-primary active:scale-95 transition-all"
                >
                  <FaShare size={11} />
                  <span>শেয়ার</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Back */}
      <div className="mt-6 sm:mt-8 text-center">
        <Link
          href="/duas"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium active:scale-[0.98]"
        >
          <FaArrowLeft size={12} />
          সব দুআ
        </Link>
      </div>
    </div>
  );
}
