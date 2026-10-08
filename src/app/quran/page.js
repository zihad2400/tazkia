'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { FaSearch, FaSpinner, FaQuran, FaChevronRight } from 'react-icons/fa';
import { getAllSurahs } from '@/lib/services/quranApi';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function QuranPage() {
  const { t } = useLanguage();
  const [surahs, setSurahs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    getAllSurahs()
      .then((data) => {
        setSurahs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = surahs.filter(
    (s) =>
      s.englishName.toLowerCase().includes(search.toLowerCase()) ||
      s.number.toString() === search ||
      s.name.includes(search) ||
      s.englishNameTranslation.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      {/* Breadcrumb */}
      <Breadcrumb items={[{ label: 'Quran' }]} showBack={false} />

      {/* Header */}
      <div className="text-center mb-8 lg:mb-10">
        <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl lg:text-3xl shadow-xl mb-4">
          <FaQuran />
        </div>
        <p className="font-arabic text-gold text-2xl md:text-3xl mb-2">القرآن الكريم</p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
          {t.quran || 'Al-Quran'}
        </h1>
        <p className="text-sm sm:text-base text-base-content/60">
          The Noble Quran · 114 Surahs · 6,236 Verses
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-6 lg:mb-8 max-w-2xl mx-auto">
        <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-base-content/40" size={14} />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search surah by name, number, or meaning..."
          className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content text-sm"
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <FaSpinner className="animate-spin text-primary text-3xl mb-4" />
          <p className="text-base-content/60 text-sm">Loading the Quran...</p>
        </div>
      ) : (
        <>
          <p className="text-xs sm:text-sm text-base-content/50 mb-4 text-center sm:text-left">
            Showing {filtered.length} of {surahs.length} Surahs
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((s) => (
              <Link
                key={s.number}
                href={`/quran/${s.number}`}
                className="group flex items-center gap-3 p-3 sm:p-4 bg-base-200 border border-base-300 rounded-2xl hover:border-primary hover:shadow-lg transition-all active:scale-[0.98]"
              >
                {/* Number badge */}
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold shadow-md group-hover:scale-105 transition-transform">
                    <span className="text-sm sm:text-base">{s.number}</span>
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm sm:text-base text-base-content truncate">
                    {s.englishName}
                  </p>
                  <p className="text-[11px] sm:text-xs text-base-content/60 truncate">
                    {s.englishNameTranslation}
                  </p>
                  <p className="text-[10px] text-base-content/40 mt-0.5">
                    {s.numberOfAyahs} Ayahs · {s.revelationType}
                  </p>
                </div>

                {/* Arabic name */}
                <div className="text-right shrink-0 flex items-center gap-2">
                  <p className="font-arabic text-base sm:text-lg text-primary leading-none">
                    {s.name.replace('سُورَةُ ', '')}
                  </p>
                  <FaChevronRight
                    size={10}
                    className="text-base-content/30 group-hover:text-primary group-hover:translate-x-0.5 transition-all"
                  />
                </div>
              </Link>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto rounded-full bg-base-200 flex items-center justify-center mb-4">
                <FaSearch className="text-base-content/30 text-xl" />
              </div>
              <p className="text-base-content/60">No surah found for &quot;{search}&quot;</p>
              <button
                onClick={() => setSearch('')}
                className="mt-4 text-sm text-primary hover:underline"
              >
                Clear search
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
