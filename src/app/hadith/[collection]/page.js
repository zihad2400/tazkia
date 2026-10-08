'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaSearch, FaSpinner, FaBookOpen, FaChevronRight,
  FaArrowLeft, FaInfoCircle, FaCheckCircle, FaTimes,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

const COLLECTIONS_INFO = {
  bukhari: { name: 'Sahih al-Bukhari', nameBn: 'সহীহ বুখারী', nameAr: 'صحيح البخاري', icon: '📗' },
  muslim: { name: 'Sahih Muslim', nameBn: 'সহীহ মুসলিম', nameAr: 'صحيح مسلم', icon: '📘' },
  abudawud: { name: 'Sunan Abu Dawud', nameBn: 'সুনান আবু দাউদ', nameAr: 'سنن أبي داود', icon: '📕' },
  tirmidhi: { name: 'Jami at-Tirmidhi', nameBn: 'জামে তিরমিজি', nameAr: 'جامع الترمذي', icon: '📙' },
  nasai: { name: "Sunan an-Nasa'i", nameBn: 'সুনান নাসাঈ', nameAr: 'سنن النسائي', icon: '📓' },
  ibnmajah: { name: 'Sunan Ibn Majah', nameBn: 'সুনান ইবনে মাজাহ', nameAr: 'سنن ابن ماجه', icon: '📔' },
  malik: { name: 'Muwatta Malik', nameBn: 'মুয়াত্তা মালিক', nameAr: 'موطأ مالك', icon: '📚' },
};

export default function CollectionPage() {
  const params = useParams();
  const collectionId = params.collection;

  const [hadiths, setHadiths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMsg, setLoadingMsg] = useState('প্রস্তুত করা হচ্ছে...');
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalHadiths, setTotalHadiths] = useState(0);
  const [fallbackUsed, setFallbackUsed] = useState(false);
  const [actualLang, setActualLang] = useState('ben');
  const [pageLoading, setPageLoading] = useState(false);

  const perPage = 20;
  const info = COLLECTIONS_INFO[collectionId];

  // Fetch page
  const fetchPage = useCallback(
    async (page, searchQuery = '') => {
      try {
        const url = new URL('/api/hadith/collection', window.location.origin);
        url.searchParams.set('c', collectionId);
        url.searchParams.set('page', String(page));
        url.searchParams.set('limit', String(perPage));
        if (searchQuery) url.searchParams.set('q', searchQuery);

        const res = await fetch(url.toString());
        if (!res.ok) throw new Error('Fetch failed');

        const data = await res.json();

        setHadiths(data.hadiths || []);
        setTotalPages(data.pages || 0);
        setTotalHadiths(data.total || 0);
        setFallbackUsed(data.fallbackUsed || false);
        setActualLang(data.actualLang || 'ben');
      } catch (err) {
        console.error(err);
        toast.error('লোড করা যায়নি');
      }
    },
    [collectionId]
  );

  // Initial load
  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setLoadingMsg('📥 প্রথমবার data load হচ্ছে (৫-১০ সেকেন্ড)...');

      const timer = setTimeout(() => {
        if (!cancelled) {
          setLoadingMsg('✅ Data cache হয়েছে — পরেরবার instant load হবে');
        }
      }, 3000);

      await fetchPage(1);

      clearTimeout(timer);
      if (!cancelled) setLoading(false);
    };

    load();
    return () => { cancelled = true; };
  }, [collectionId, fetchPage]);

  // Page change
  const handlePageChange = async (newPage) => {
    setCurrentPage(newPage);
    setPageLoading(true);
    await fetchPage(newPage, search.trim());
    setPageLoading(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Search
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (search.trim() !== '') {
        setCurrentPage(1);
        setPageLoading(true);
        await fetchPage(1, search.trim());
        setPageLoading(false);
      } else if (search === '') {
        setCurrentPage(1);
        setPageLoading(true);
        await fetchPage(1);
        setPageLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [search]);

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10">
      <Breadcrumb
        items={[
          { label: 'Hadith', href: '/hadith' },
          { label: info?.nameBn || collectionId },
        ]}
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 text-center mb-4 sm:mb-6 shadow-xl">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-2 border border-white/20">
          <span className="text-xl sm:text-2xl">{info?.icon || '📚'}</span>
        </div>
        <p className="font-arabic text-xl sm:text-2xl md:text-3xl text-gold mb-1">
          {info?.nameAr}
        </p>
        <h1 className="text-base sm:text-xl md:text-2xl font-bold mb-1">
          {info?.name}
        </h1>
        <p className="text-[11px] sm:text-xs md:text-sm text-white/70">
          {info?.nameBn}
        </p>
      </div>

      {/* Fallback warning */}
      {fallbackUsed && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-2.5 sm:p-3 mb-3 flex items-start gap-2">
          <FaInfoCircle className="text-amber-600 shrink-0 mt-0.5" size={12} />
          <div className="text-[11px] sm:text-xs text-amber-800 dark:text-amber-200">
            <strong>বাংলা অনুবাদ নেই</strong> — ইংরেজি দেখানো হচ্ছে।
          </div>
        </div>
      )}

      {/* Search */}
      <div className="relative mb-3 sm:mb-4">
        <FaSearch
          className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-base-content/40"
          size={13}
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-base-300 text-base-content/50"
          >
            <FaTimes size={10} />
          </button>
        )}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="হাদিস খুঁজুন (টেক্সট বা নম্বর)..."
          className="w-full pl-9 sm:pl-11 pr-9 sm:pr-10 py-2.5 sm:py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
        />
      </div>

      {/* Info bar */}
      {!loading && (
        <div className="flex items-center justify-between text-[11px] sm:text-xs text-base-content/50 mb-3 sm:mb-4 px-1">
          <span className="flex items-center gap-1.5">
            <FaCheckCircle className="text-green-600 shrink-0" size={10} />
            <span>মোট {totalHadiths.toLocaleString()} হাদিস · পৃষ্ঠা {currentPage}/{totalPages}</span>
          </span>
          <span className="shrink-0">
            {actualLang === 'ben' ? '🇧🇩 বাংলা' : '🇬🇧 English'}
          </span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16 sm:py-20">
          <FaSpinner className="animate-spin text-primary text-2xl sm:text-3xl mb-3 sm:mb-4" />
          <p className="text-xs sm:text-sm text-base-content/60 text-center px-4">
            {loadingMsg}
          </p>
          <div className="w-40 sm:w-48 h-1 bg-base-200 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-gold rounded-full animate-pulse w-3/5" />
          </div>
        </div>
      ) : (
        <>
          {/* Page loading overlay */}
          {pageLoading && (
            <div className="flex items-center justify-center py-4 text-xs text-base-content/50">
              <FaSpinner className="animate-spin mr-2" size={11} />
              লোড হচ্ছে...
            </div>
          )}

          {/* Hadith list */}
          <div className={`space-y-2.5 sm:space-y-3 transition-opacity ${pageLoading ? 'opacity-50' : ''}`}>
            {hadiths.map((hadith, i) => (
              <Link
                key={hadith.hadithnumber || i}
                href={`/hadith/${collectionId}/${hadith.hadithnumber}`}
                className="block bg-base-200 border border-base-300 rounded-xl sm:rounded-2xl p-3 sm:p-4 lg:p-5 hover:border-primary hover:shadow-lg transition-all active:scale-[0.99]"
              >
                <div className="flex items-start gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[11px] sm:text-xs font-bold shrink-0">
                    {hadith.hadithnumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] sm:text-sm text-base-content leading-relaxed line-clamp-3">
                      {hadith.text || 'No text'}
                    </p>
                    <div className="flex items-center justify-between mt-2 sm:mt-2.5 pt-2 border-t border-base-300">
                      <span className="text-[10px] sm:text-[11px] text-base-content/50 font-mono">
                        হাদিস #{hadith.hadithnumber}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] sm:text-xs font-medium text-primary">
                        <span>বিস্তারিত</span>
                        <FaChevronRight size={8} />
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {hadiths.length === 0 && (
            <div className="text-center py-16 sm:py-20 px-4">
              <p className="text-sm text-base-content/60">কোনো হাদিস পাওয়া যায়নি</p>
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

          {/* Pagination */}
          {totalPages > 1 && !search && (
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 mt-6 sm:mt-8 flex-wrap">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1 || pageLoading}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-base-200 border border-base-300 text-xs hover:border-primary disabled:opacity-40 flex items-center justify-center"
              >
                ⇤
              </button>
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1 || pageLoading}
                className="px-2.5 sm:px-3 h-8 sm:h-10 rounded-lg bg-base-200 border border-base-300 text-xs sm:text-sm hover:border-primary disabled:opacity-40"
              >
                ←
              </button>
              <span className="text-[11px] sm:text-xs text-base-content/60 px-2 sm:px-3 font-mono">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages || pageLoading}
                className="px-2.5 sm:px-3 h-8 sm:h-10 rounded-lg bg-base-200 border border-base-300 text-xs sm:text-sm hover:border-primary disabled:opacity-40"
              >
                →
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages || pageLoading}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-base-200 border border-base-300 text-xs hover:border-primary disabled:opacity-40 flex items-center justify-center"
              >
                ⇥
              </button>
            </div>
          )}

          {/* Back */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href="/hadith"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs sm:text-sm font-medium"
            >
              <FaArrowLeft size={11} />
              সব হাদিস গ্রন্থ
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
