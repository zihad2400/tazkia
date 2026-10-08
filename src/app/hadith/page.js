'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaBookOpen, FaChevronRight, FaStar, FaMosque,
  FaCheckCircle, FaGlobe,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { collections, preloadCollection } from '@/lib/services/hadithApi';

export default function HadithPage() {
  const [hoveredId, setHoveredId] = useState(null);

  const handleHover = (collectionId) => {
    setHoveredId(collectionId);
    // Preload in background — will be cached
    preloadCollection(collectionId, 'ben');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
      <Breadcrumb items={[{ label: 'Hadith' }]} showBack={false} />

      <div className="text-center mb-8 lg:mb-10">
        <div className="w-16 h-16 lg:w-20 lg:h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl lg:text-3xl shadow-xl mb-4">
          <FaBookOpen />
        </div>
        <p className="font-arabic text-gold text-2xl md:text-3xl mb-2">
          الحديث النبوي الشريف
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-2">
          Hadith Collection
        </h1>
        <p className="text-sm sm:text-base text-base-content/60 max-w-2xl mx-auto">
          সাতটি বিশুদ্ধ হাদিস গ্রন্থ · বাংলা অনুবাদ সহ
        </p>
        <p className="text-xs text-base-content/50 mt-3">
          💡 প্রথমবার collection খুললে data cache হবে — পরেরবার instant load হবে।
        </p>
      </div>

      {/* Featured */}
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
              إِنَّمَا الأَعْمَالُ بِالنِّيَّاتِ
            </p>
            <p className="text-sm sm:text-base font-medium mb-1">
              &ldquo;নিশ্চয়ই সকল আমল নিয়তের উপর নির্ভরশীল&rdquo;
            </p>
            <p className="text-xs text-white/70">— সহীহ বুখারী, হাদিস নং ১</p>
          </div>
        </div>
      </div>

      {/* Collections */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {collections.map((col) => (
          <Link
            key={col.id}
            href={`/hadith/${col.id}`}
            onMouseEnter={() => handleHover(col.id)}
            onTouchStart={() => handleHover(col.id)}
            className="group relative overflow-hidden bg-base-200 border border-base-300 rounded-2xl p-5 hover:border-primary hover:shadow-xl transition-all active:scale-[0.98]"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${col.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

            <div className="relative">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br ${col.color} flex items-center justify-center text-white text-2xl shadow-lg mb-4 group-hover:scale-110 transition-transform`}>
                {col.icon}
              </div>

              <p className="font-arabic text-base sm:text-lg text-primary mb-1">
                {col.nameAr}
              </p>

              <h3 className="font-bold text-sm sm:text-base text-base-content mb-0.5">
                {col.name}
              </h3>

              <p className="text-[11px] sm:text-xs text-base-content/60 mb-2">
                {col.nameBn}
              </p>

              <p className="text-[10px] sm:text-xs text-base-content/50 line-clamp-2 mb-3">
                {col.description}
              </p>

              {/* Cache indicator on hover */}
              {hoveredId === col.id && (
                <div className="mb-3 flex items-center gap-1.5 text-[10px] text-green-600 dark:text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                  <span>Background এ preload হচ্ছে...</span>
                </div>
              )}

              <div className="flex items-center gap-1.5 mb-3">
                {col.hasBengali ? (
                  <>
                    <FaCheckCircle size={10} className="text-green-600" />
                    <span className="text-[10px] text-green-700 dark:text-green-400 font-medium">
                      বাংলা অনুবাদ আছে
                    </span>
                  </>
                ) : (
                  <>
                    <FaGlobe size={10} className="text-amber-600" />
                    <span className="text-[10px] text-amber-700 dark:text-amber-400 font-medium">
                      ইংরেজি অনুবাদ
                    </span>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-base-300">
                <span className="text-[10px] text-base-content/50">
                  {col.totalHadith.toLocaleString()} হাদিস
                </span>
                <span className="flex items-center gap-1 text-xs font-medium text-primary group-hover:gap-2 transition-all">
                  পড়ুন
                  <FaChevronRight size={9} />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Info */}
      <div className="mt-8 sm:mt-12 bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <FaMosque size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-sm sm:text-base text-base-content mb-2">
              ⚡ Fast Loading Tips
            </h3>
            <ul className="text-xs sm:text-sm text-base-content/70 leading-relaxed space-y-1.5">
              <li>• Collection card এ <strong>hover</strong> করলে data background এ preload হবে</li>
              <li>• প্রথমবার load হয়েছে → পরেরবার <strong>instant</strong> (cache থেকে)</li>
              <li>• Cache <strong>২৪ ঘণ্টা</strong> valid থাকে</li>
              <li>• Bengali না থাকলে automatic English fallback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
