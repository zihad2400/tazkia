'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FaSearch, FaArrowLeft, FaCopy, FaShare, FaCheck,
  FaBookmark, FaTrash, FaStar, FaTimes, FaHands,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';
import { duaCategories } from '@/lib/data/duasData';
import { useSavedDuas } from '@/hooks/useSavedDuas';

export default function SavedDuasPage() {
  const { saved, remove, clearAll, mounted } = useSavedDuas();
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return saved;

    return saved.filter((dua) => {
      return (
        (dua.title || '').toLowerCase().includes(q) ||
        (dua.arabic || '').includes(search.trim()) ||
        (dua.transliteration || '').toLowerCase().includes(q) ||
        (dua.translation || '').toLowerCase().includes(q) ||
        (dua.reference || '').toLowerCase().includes(q)
      );
    });
  }, [saved, search]);

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

  const handleRemove = (dua) => {
    remove(dua.id);
    toast.success('সেভ থেকে সরানো হয়েছে', { icon: '🗑️' });
  };

  const handleClearAll = () => {
    if (saved.length === 0) return;
    if (confirm(`আপনি কি ${saved.length}টি সেভ করা দুআ মুছে ফেলতে চান?`)) {
      clearAll();
      toast.success('সব সেভ করা দুআ মুছে ফেলা হয়েছে', { icon: '🗑️' });
    }
  };

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-10">
        <div className="h-32 bg-base-200 rounded-2xl animate-pulse mb-6" />
        <div className="h-64 bg-base-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  const getCategoryInfo = (categoryId) =>
    duaCategories.find((c) => c.id === categoryId);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: "Du'as", href: '/duas' },
          { label: 'সেভ করা' },
        ]}
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gold to-gold-dark text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 text-center mb-5 sm:mb-6 shadow-xl">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/30">
          <FaBookmark className="text-white text-2xl sm:text-3xl" />
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1">
          সেভ করা দুআ
        </h1>
        <p className="text-xs sm:text-sm text-white/80">
          {saved.length}টি দুআ সেভ করা হয়েছে
        </p>
      </div>

      {saved.length === 0 ? (
        /* Empty state */
        <div className="text-center py-16 sm:py-20">
          <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto rounded-3xl bg-base-200 flex items-center justify-center mb-5">
            <FaBookmark className="text-base-content/30 text-3xl" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-base-content mb-2">
            কোনো দুআ সেভ করা নেই
          </h2>
          <p className="text-sm text-base-content/60 mb-6 max-w-md mx-auto px-4">
            দুআ পড়ার সময় <FaBookmark className="inline" size={11} /> বাটনে ক্লিক করুন যাতে এখানে জমা হয়।
          </p>
          <Link
            href="/duas"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium active:scale-95"
          >
            <FaHands size={12} />
            দুআ দেখুন
          </Link>
        </div>
      ) : (
        <>
          {/* Search */}
          <div className="relative mb-4">
            <FaSearch
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-base-content/40 z-10"
              size={13}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="সেভ করা দুআ খুঁজুন..."
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

          {/* Action bar */}
          <div className="flex items-center justify-between mb-4 px-1">
            <span className="text-xs text-base-content/60">
              {filtered.length}টি দুআ
            </span>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              <FaTrash size={10} />
              সব মুছুন
            </button>
          </div>

          {/* Du'as list */}
          <div className="space-y-3 sm:space-y-4">
            {filtered.map((dua) => {
              const catInfo = getCategoryInfo(dua.categoryId);
              return (
                <div
                  key={dua.id}
                  className="bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 hover:border-gold/40 transition-all"
                >
                  {/* Category + Remove */}
                  <div className="flex items-center justify-between mb-3 gap-2">
                    <Link
                      href={`/duas/${dua.categoryId}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/20 transition-colors"
                    >
                      <span>{catInfo?.icon || '🤲'}</span>
                      <span className="truncate">{catInfo?.name || dua.categoryId}</span>
                    </Link>
                    <div className="flex items-center gap-1 shrink-0">
                      {dua.count > 1 && (
                        <span className="text-[10px] px-2 py-1 rounded-full bg-gold/20 text-gold-dark font-bold">
                          ×{dua.count}
                        </span>
                      )}
                      <button
                        onClick={() => handleRemove(dua)}
                        className="p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                        title="সেভ থেকে সরান"
                      >
                        <FaTrash size={11} />
                      </button>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-bold text-sm sm:text-base text-base-content mb-3">
                    {dua.title}
                  </h3>

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
                        <>
                          <FaCheck size={11} className="text-green-600" />
                          <span className="text-green-700">হয়ে গেছে</span>
                        </>
                      ) : (
                        <>
                          <FaCopy size={11} />
                          <span>কপি</span>
                        </>
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
        </>
      )}

      {/* Back button */}
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
