'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  FaHands, FaChevronRight, FaSearch, FaStar,
  FaBookOpen, FaCopy, FaShare, FaCheck, FaTimes,
  FaBookmark, FaRegBookmark,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';
import { duaCategories, duasData } from '@/lib/data/duasData';
import { useSavedDuas } from '@/hooks/useSavedDuas';

export default function DuasPage() {
  const [search, setSearch] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const { isSaved, toggle, count: savedCount, mounted } = useSavedDuas();

  const catCounts = useMemo(() => {
    const counts = {};
    duasData.forEach((d) => {
      counts[d.categoryId] = (counts[d.categoryId] || 0) + 1;
    });
    return counts;
  }, []);

  const { isSearching, matchedDuas, matchedCategories } = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return { isSearching: false, matchedDuas: [], matchedCategories: duaCategories };
    }

    const matchedDuas = duasData.filter((dua) => {
      return (
        (dua.title || '').toLowerCase().includes(q) ||
        (dua.arabic || '').includes(search.trim()) ||
        (dua.transliteration || '').toLowerCase().includes(q) ||
        (dua.translation || '').toLowerCase().includes(q) ||
        (dua.reference || '').toLowerCase().includes(q) ||
        (dua.categoryId || '').toLowerCase().includes(q)
      );
    });

    const matchedCategories = duaCategories.filter((cat) => {
      return (
        cat.name.toLowerCase().includes(q) ||
        cat.nameEn.toLowerCase().includes(q) ||
        cat.nameAr.includes(search.trim()) ||
        cat.description.toLowerCase().includes(q)
      );
    });

    return { isSearching: true, matchedDuas, matchedCategories };
  }, [search]);

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

  const getCategoryInfo = (categoryId) =>
    duaCategories.find((c) => c.id === categoryId);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <Breadcrumb items={[{ label: "Du'as" }]} showBack={false} />

      {/* Header */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl lg:text-3xl shadow-xl mb-4">
          <FaHands />
        </div>
        <p className="font-arabic text-gold text-2xl md:text-3xl mb-2">
          الأدعية والأذكار
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
          Du&apos;a & Azkar
        </h1>
        <p className="text-sm sm:text-base text-base-content/60 max-w-2xl mx-auto">
          হিসনুল মুসলিম থেকে সংকলিত {duasData.length}টি দৈনন্দিন দুআ
        </p>

        {/* Saved counter button */}
        {mounted && savedCount > 0 && (
          <Link
            href="/duas/saved"
            className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full bg-gold/15 border border-gold/30 text-gold-dark text-sm font-semibold hover:bg-gold/25 transition-all active:scale-95"
          >
            <FaBookmark size={12} />
            <span>{savedCount}টি সেভ করা দুআ</span>
            <FaChevronRight size={10} />
          </Link>
        )}
      </div>

      {/* Featured */}
      {!isSearching && (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-8 mb-6 sm:mb-8 shadow-xl">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          </div>
          <div className="relative flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gold flex items-center justify-center shrink-0">
              <FaStar className="text-white text-xl" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-arabic text-gold text-lg sm:text-xl mb-1">
                رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الآخِرَةِ حَسَنَةً
              </p>
              <p className="text-sm sm:text-base font-medium mb-1">
                &ldquo;হে আমাদের রব! আমাদের দুনিয়াতে কল্যাণ দান করুন এবং আখিরাতেও কল্যাণ দান করুন&rdquo;
              </p>
              <p className="text-xs text-white/70">— সূরা আল-বাকারা ২:২০১</p>
            </div>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-4 sm:mb-6 max-w-2xl mx-auto">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40 z-10" size={14} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="সব দুআ থেকে খুঁজুন (নাম, আরবি, বাংলা, সূত্র)..."
          className="w-full pl-11 pr-11 py-3 sm:py-3.5 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-base-300 text-base-content/60"
          >
            <FaTimes size={12} />
          </button>
        )}
      </div>

      {/* SEARCH RESULTS */}
      {isSearching ? (
        <>
          <div className="mb-4 text-center">
            <p className="text-sm text-base-content/70">
              <strong className="text-primary">{search}</strong> এর জন্য{' '}
              <strong className="text-base-content">{matchedDuas.length}টি দুআ</strong>{' '}
              পাওয়া গেছে
            </p>
          </div>

          {matchedCategories.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-widest text-base-content/50 mb-3 flex items-center gap-2">
                <FaBookOpen size={11} /> ক্যাটাগরি
              </h3>
              <div className="flex flex-wrap gap-2">
                {matchedCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/duas/${cat.id}`}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-base-200 border border-base-300 hover:border-primary text-xs font-medium transition-all active:scale-95"
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {matchedDuas.length > 0 ? (
            <div className="space-y-3 sm:space-y-4">
              {matchedDuas.map((dua) => {
                const catInfo = getCategoryInfo(dua.categoryId);
                const saved = isSaved(dua.id);
                return (
                  <div
                    key={dua.id}
                    className="bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 hover:border-primary/40 transition-all"
                  >
                    {/* Top bar */}
                    <div className="flex items-center justify-between mb-3 gap-2">
                      <Link
                        href={`/duas/${dua.categoryId}`}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-semibold hover:bg-primary/20 transition-colors min-w-0"
                      >
                        <span>{catInfo?.icon}</span>
                        <span className="truncate">{catInfo?.name}</span>
                      </Link>
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
                    <p className="text-xs sm:text-sm italic text-primary/80 mb-3">
                      {dua.transliteration}
                    </p>

                    {/* Translation */}
                    <p className="text-sm sm:text-base text-base-content leading-relaxed mb-3">
                      {dua.translation}
                    </p>

                    {/* Reference */}
                    <p className="text-[10px] sm:text-xs text-base-content/50 mb-3">
                      📚 {dua.reference}
                    </p>

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
          ) : (
            <div className="text-center py-16 sm:py-20">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-base-200 flex items-center justify-center mb-4">
                <FaSearch className="text-base-content/30 text-2xl" />
              </div>
              <h3 className="text-base font-bold text-base-content mb-2">কোনো দুআ পাওয়া যায়নি</h3>
              <p className="text-sm text-base-content/60 mb-6">&ldquo;{search}&rdquo; এর জন্য কিছু পাওয়া যায়নি</p>
              <button
                onClick={() => setSearch('')}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
              >
                <FaTimes size={12} /> Search clear
              </button>
            </div>
          )}
        </>
      ) : (
        /* DEFAULT — Categories Grid */
        <>
          {/* Saved Du'as quick link (if any) */}
          {mounted && savedCount > 0 && (
            <Link
              href="/duas/saved"
              className="group mb-6 flex items-center gap-3 p-4 bg-gradient-to-br from-gold/10 to-gold/5 border-2 border-gold/30 rounded-2xl hover:border-gold transition-all active:scale-[0.98]"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold to-gold-dark text-white flex items-center justify-center text-xl shadow-lg group-hover:scale-110 transition-transform shrink-0">
                <FaBookmark />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-base text-base-content">সেভ করা দুআ</h3>
                <p className="text-xs text-base-content/60">
                  {savedCount}টি দুআ সেভ করা আছে
                </p>
              </div>
              <FaChevronRight className="text-gold group-hover:translate-x-0.5 transition-transform shrink-0" size={14} />
            </Link>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {duaCategories.map((cat) => (
              <Link
                key={cat.id}
                href={`/duas/${cat.id}`}
                className="group relative overflow-hidden bg-base-200 border border-base-300 rounded-2xl p-5 hover:border-primary hover:shadow-xl transition-all active:scale-[0.98]"
              >
                <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${cat.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                <div className="relative">
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                    {cat.icon}
                  </div>
                  <p className="font-arabic text-base sm:text-lg text-primary mb-1">{cat.nameAr}</p>
                  <h3 className="font-bold text-base sm:text-lg text-base-content mb-0.5">{cat.name}</h3>
                  <p className="text-[11px] sm:text-xs text-base-content/60 mb-2">{cat.nameEn}</p>
                  <p className="text-[10px] sm:text-xs text-base-content/50 line-clamp-2 mb-3">{cat.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-base-300">
                    <span className="text-[10px] text-base-content/50">
                      {catCounts[cat.id] || 0} টি দুআ
                    </span>
                    <FaChevronRight size={10} className="text-primary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 sm:mt-12 bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-6">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FaBookOpen size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm sm:text-base text-base-content mb-2">দুআ সম্পর্কে</h3>
                <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                  দুআ হলো বান্দার সাথে আল্লাহর সরাসরি যোগাযোগ। রাসূলুল্লাহ ﷺ বলেছেন, &ldquo;দুআই হলো ইবাদত।&rdquo; (তিরমিযি)।
                </p>
                <div className="mt-4 p-3 rounded-lg bg-base-100 border border-base-300">
                  <p className="text-xs text-base-content/70">
                    💡 <strong>টিপস:</strong> যেকোনো দুআর <FaBookmark className="inline" size={10} /> আইকনে ক্লিক করে সেভ করুন। পরে <Link href="/duas/saved" className="text-primary hover:underline font-medium">সেভ করা দুআ</Link> থেকে দেখতে পারবেন।
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
