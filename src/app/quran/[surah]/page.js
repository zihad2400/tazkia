'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaArrowLeft, FaArrowRight, FaMosque, FaPlay, FaStop } from 'react-icons/fa';
import { getAllSurahs, getSurahText } from '@/lib/services/quranApi';
import { defaultQari, defaultTranslation } from '@/lib/data/qaris';
import AyahCard from '@/components/quran/AyahCard';
import QuranControls from '@/components/quran/QuranControls';
import QuranAutoPlayer from '@/components/quran/QuranAutoPlayer';
import TajweedLegend from '@/components/ui/TajweedLegend';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

export default function SurahPage() {
  const params = useParams();
  const surahNumber = parseInt(params.surah);

  const [data, setData] = useState(null);
  const [surahsList, setSurahsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [wordsMap, setWordsMap] = useState({});

  const [qari, setQari] = useState(defaultQari);
  const [translation, setTranslation] = useState(defaultTranslation);
  const [fontSize, setFontSize] = useState(32);
  const [showWordByWord, setShowWordByWord] = useState(false);
  const [bookmarks, setBookmarks] = useState([]);

  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);

  useEffect(() => {
    const saved = localStorage.getItem('quran-settings');
    if (saved) {
      try {
        const s = JSON.parse(saved);
        if (s.qari) setQari(s.qari);
        if (s.translation) setTranslation(s.translation);
        if (s.fontSize) setFontSize(s.fontSize);
        if (typeof s.showWordByWord === 'boolean') setShowWordByWord(s.showWordByWord);
      } catch (e) {}
    }
    const bm = localStorage.getItem('quran-bookmarks');
    if (bm) {
      try { setBookmarks(JSON.parse(bm)); } catch (e) {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('quran-settings', JSON.stringify({
      qari, translation, fontSize, showWordByWord,
    }));
  }, [qari, translation, fontSize, showWordByWord]);

  useEffect(() => {
    getAllSurahs().then(setSurahsList).catch(() => {});
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setCurrentAyahIndex(0);
    setIsAutoPlaying(false);
    setWordsMap({});

    getSurahText(surahNumber, translation)
      .then((res) => {
        if (cancelled) return;
        setData(res);
        setLoading(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      })
      .catch(() => {
        if (cancelled) return;
        toast.error('Failed to load');
        setLoading(false);
      });

    return () => { cancelled = true; };
  }, [surahNumber, translation]);

  useEffect(() => {
    if (!showWordByWord || !data?.arabic?.ayahs) return;
    if (Object.keys(wordsMap).length > 0) return;

    const loadAll = async () => {
      const map = {};
      const ayahs = data.arabic.ayahs;
      for (let i = 0; i < ayahs.length; i += 10) {
        const chunk = ayahs.slice(i, i + 10);
        const results = await Promise.all(
          chunk.map((a) =>
            fetch(
              `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${a.numberInSurah}?words=true&word_fields=text_uthmani,translation&word_translation_language=bn`
            ).then((r) => r.json()).then((j) => j.verse?.words || []).catch(() => [])
          )
        );
        chunk.forEach((a, idx) => { map[a.number] = results[idx]; });
      }
      setWordsMap(map);
    };
    loadAll();
    // eslint-disable-next-line
  }, [showWordByWord, data]);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const el = document.getElementById(`ayah-${currentAyahIndex}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentAyahIndex, isAutoPlaying]);

  const toggleBookmark = (ayahNumber) => {
    const nb = bookmarks.includes(ayahNumber)
      ? bookmarks.filter((n) => n !== ayahNumber)
      : [...bookmarks, ayahNumber];
    setBookmarks(nb);
    localStorage.setItem('quran-bookmarks', JSON.stringify(nb));
  };

  const startAutoPlay = (startIndex = 0) => {
    setCurrentAyahIndex(startIndex);
    setIsAutoPlaying(true);
    toast.success(`Playing ${data?.arabic?.englishName}`, { icon: '🎧', duration: 2000 });
  };

  const stopAutoPlay = () => {
    setIsAutoPlaying(false);
    toast('Stopped', { icon: '⏹️' });
  };

  const prevSurah = surahNumber > 1 ? surahNumber - 1 : null;
  const nextSurah = surahNumber < 114 ? surahNumber + 1 : null;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-10">
        <div className="h-40 bg-base-200 rounded-2xl animate-pulse mb-6" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-40 bg-base-200 rounded-2xl animate-pulse mb-4" />
        ))}
      </div>
    );
  }

  if (!data?.arabic) return null;

  return (
    <div className={`max-w-3xl mx-auto px-3 sm:px-4 py-6 lg:py-10 ${isAutoPlaying ? 'pb-44' : 'pb-28'}`}>
      <Breadcrumb
        items={[
          { label: 'Quran', href: '/quran' },
          { label: data.arabic.englishName },
        ]}
      />

      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary to-primary-dark text-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 md:p-10 text-center mb-5 shadow-xl">
        <div className="relative">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/20">
            <FaMosque className="text-gold text-xl sm:text-2xl" />
          </div>
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl text-gold mb-2">{data.arabic.name}</p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5">{data.arabic.englishName}</h1>
          <p className="text-xs sm:text-sm text-white/70 mb-4">{data.arabic.englishNameTranslation}</p>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-[10px] sm:text-xs mb-5">
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20">
              📖 {data.arabic.numberOfAyahs} Ayahs
            </span>
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20 capitalize">
              📍 {data.arabic.revelationType}
            </span>
            <span className="px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full bg-white/10 border border-white/20">
              🔢 {data.arabic.number}
            </span>
          </div>

          <button
            onClick={() => isAutoPlaying ? stopAutoPlay() : startAutoPlay(0)}
            className={`inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl font-semibold text-xs sm:text-sm transition-all shadow-lg hover:scale-105 active:scale-95 ${
              isAutoPlaying ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-gold hover:bg-gold-dark text-white'
            }`}
          >
            {isAutoPlaying ? (<><FaStop size={12} />Stop</>) : (<><FaPlay size={12} />Play Full Surah</>)}
          </button>
        </div>
      </div>

      {/* Bismillah */}
      {surahNumber !== 1 && surahNumber !== 9 && (
        <div className="text-center py-4 sm:py-6 mb-3">
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl text-primary">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
        </div>
      )}

      {/* ═══ TAJWEED LEGEND — Always visible ═══ */}
      <TajweedLegend collapsible={true} defaultOpen={false} />

      {/* Info */}
      <div className="flex items-center justify-between text-[10px] sm:text-xs text-base-content/50 mb-3 px-1">
        <span>🎧 {qari}</span>
        <span>{bookmarks.length > 0 && `🔖 ${bookmarks.length}`}</span>
      </div>

      {/* Ayahs — tajweedText always passed */}
      <div className="space-y-3 sm:space-y-4">
        {data.arabic.ayahs.map((ayah, i) => {
          const translationAyah = data.translation?.ayahs?.[i];
          const tajweedAyah = data.tajweed?.ayahs?.[i];
          const isCurrentAyah = isAutoPlaying && i === currentAyahIndex;

          return (
            <div
              key={`${qari}-${ayah.number}`}
              id={`ayah-${i}`}
              style={{ '--ayah-font-size': `${fontSize}px` }}
              className="quran-ayah-wrapper"
            >
              <AyahCard
                ayah={ayah}
                translation={translationAyah}
                qariId={qari}
                surahName={data.arabic.englishName}
                surahNumber={surahNumber}
                tajweedText={tajweedAyah?.text}
                showWordByWord={showWordByWord}
                words={wordsMap[ayah.number] || []}
                onBookmark={toggleBookmark}
                isBookmarked={bookmarks.includes(ayah.number)}
                onPlayFromHere={() => startAutoPlay(i)}
                isCurrentAyah={isCurrentAyah}
              />
            </div>
          );
        })}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between gap-2 sm:gap-3 mt-8">
        {prevSurah ? (
          <Link
            href={`/quran/${prevSurah}`}
            className="flex-1 flex items-center gap-2 sm:gap-3 p-3 sm:p-4 bg-base-200 border border-base-300 rounded-2xl hover:border-primary active:scale-[0.98]"
          >
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FaArrowLeft size={12} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase text-base-content/50">Previous</p>
              <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                {surahsList[prevSurah - 1]?.englishName || `Surah ${prevSurah}`}
              </p>
            </div>
          </Link>
        ) : <div className="flex-1" />}

        {nextSurah ? (
          <Link
            href={`/quran/${nextSurah}`}
            className="flex-1 flex items-center justify-end gap-2 sm:gap-3 p-3 sm:p-4 bg-base-200 border border-base-300 rounded-2xl hover:border-primary active:scale-[0.98] text-right"
          >
            <div className="min-w-0">
              <p className="text-[9px] uppercase text-base-content/50">Next</p>
              <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                {surahsList[nextSurah - 1]?.englishName || `Surah ${nextSurah}`}
              </p>
            </div>
            <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FaArrowRight size={12} />
            </div>
          </Link>
        ) : <div className="flex-1" />}
      </div>

      <QuranControls
        qari={qari} setQari={setQari}
        translation={translation} setTranslation={setTranslation}
        fontSize={fontSize} setFontSize={setFontSize}
        showWordByWord={showWordByWord} setShowWordByWord={setShowWordByWord}
      />

      {isAutoPlaying && data?.arabic?.ayahs && (
        <QuranAutoPlayer
          ayahs={data.arabic.ayahs}
          surahNumber={surahNumber}
          surahName={data.arabic.englishName}
          qariId={qari}
          currentAyahIndex={currentAyahIndex}
          setCurrentAyahIndex={setCurrentAyahIndex}
          isAutoPlaying={isAutoPlaying}
          setIsAutoPlaying={setIsAutoPlaying}
        />
      )}
    </div>
  );
}
