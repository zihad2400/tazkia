'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FaQuoteLeft, FaCopy, FaShare, FaCheck, FaBookOpen,
  FaChevronLeft, FaChevronRight, FaStar, FaPlay,
  FaBookmark, FaRegBookmark,
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import BookmarkButton from '@/components/ui/BookmarkButton';

// ═══════════════════════════════════════════════════════════
// Verified Quranic Verses — Authentic (from Quran)
// ═══════════════════════════════════════════════════════════
const VERSES = [
  {
    id: 'talaq-2',
    arabic: 'وَمَن يَتَّقِ اللَّهَ يَجْعَل لَّهُ مَخْرَجًا',
    translation: 'And whoever fears Allah — He will make for him a way out.',
    translationBn: 'আর যে আল্লাহকে ভয় করে, আল্লাহ তার জন্য উত্তরণের পথ করে দেবেন।',
    surah: 'At-Talaq',
    surahBn: 'আত-তালাক',
    surahNumber: 65,
    ayah: 2,
    theme: 'Taqwa',
  },
  {
    id: 'baqarah-286',
    arabic: 'لَا يُكَلِّفُ اللَّهُ نَفْسًا إِلَّا وُسْعَهَا',
    translation: 'Allah does not burden a soul beyond that it can bear.',
    translationBn: 'আল্লাহ কারও উপর তার সামর্থ্যের বাইরে বোঝা চাপান না।',
    surah: 'Al-Baqarah',
    surahBn: 'আল-বাকারা',
    surahNumber: 2,
    ayah: 286,
    theme: 'Mercy',
  },
  {
    id: 'sharh-6',
    arabic: 'إِنَّ مَعَ الْعُسْرِ يُسْرًا',
    translation: 'Indeed, with hardship comes ease.',
    translationBn: 'নিশ্চয়ই কষ্টের সাথে স্বস্তি রয়েছে।',
    surah: 'Ash-Sharh',
    surahBn: 'আশ-শারহ',
    surahNumber: 94,
    ayah: 6,
    theme: 'Hope',
  },
  {
    id: 'baqarah-152',
    arabic: 'فَاذْكُرُونِي أَذْكُرْكُمْ وَاشْكُرُوا لِي وَلَا تَكْفُرُونِ',
    translation: 'So remember Me; I will remember you. And be grateful to Me and do not deny Me.',
    translationBn: 'তোমরা আমাকে স্মরণ করো, আমিও তোমাদের স্মরণ করব। আমার প্রতি কৃতজ্ঞ থাকো, অকৃতজ্ঞ হয়ো না।',
    surah: 'Al-Baqarah',
    surahBn: 'আল-বাকারা',
    surahNumber: 2,
    ayah: 152,
    theme: 'Dhikr',
  },
  {
    id: 'ra\'d-28',
    arabic: 'أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ',
    translation: 'Verily, in the remembrance of Allah do hearts find rest.',
    translationBn: 'জেনে রাখো, আল্লাহর স্মরণেই হৃদয় শান্তি পায়।',
    surah: "Ar-Ra'd",
    surahBn: 'আর-রা\'দ',
    surahNumber: 13,
    ayah: 28,
    theme: 'Peace',
  },
  {
    id: 'zumar-53',
    arabic: 'لَا تَقْنَطُوا مِن رَّحْمَةِ اللَّهِ',
    translation: 'Do not despair of the mercy of Allah.',
    translationBn: 'আল্লাহর রহমত থেকে নিরাশ হয়ো না।',
    surah: 'Az-Zumar',
    surahBn: 'আয-যুমার',
    surahNumber: 39,
    ayah: 53,
    theme: 'Hope',
  },
  {
    id: 'nahl-128',
    arabic: 'إِنَّ اللَّهَ مَعَ الَّذِينَ اتَّقَوا وَّالَّذِينَ هُم مُّحْسِنُونَ',
    translation: 'Indeed, Allah is with those who fear Him and those who are doers of good.',
    translationBn: 'নিশ্চয়ই আল্লাহ তাদের সাথেই আছেন, যারা তাকওয়া অবলম্বন করে এবং যারা সৎকর্ম করে।',
    surah: 'An-Nahl',
    surahBn: 'আন-নাহল',
    surahNumber: 16,
    ayah: 128,
    theme: 'Righteousness',
  },
  {
    id: 'ankabut-69',
    arabic: 'وَالَّذِينَ جَاهَدُوا فِينَا لَنَهْدِيَنَّهُمْ سُبُلَنَا',
    translation: 'And those who strive for Us — We will surely guide them to Our ways.',
    translationBn: 'যারা আমার পথে সংগ্রাম করে, আমি তাদেরকে আমার পথ দেখাব।',
    surah: 'Al-Ankabut',
    surahBn: 'আল-আনকাবুত',
    surahNumber: 29,
    ayah: 69,
    theme: 'Struggle',
  },
  {
    id: 'duha-5',
    arabic: 'وَلَسَوْفَ يُعْطِيكَ رَبُّكَ فَتَرْضَىٰ',
    translation: 'And your Lord is going to give you, and you will be satisfied.',
    translationBn: 'আর অচিরেই তোমার রব তোমাকে দান করবেন, ফলে তুমি সন্তুষ্ট হবে।',
    surah: 'Ad-Duha',
    surahBn: 'আদ-দুহা',
    surahNumber: 93,
    ayah: 5,
    theme: 'Promise',
  },
  {
    id: 'hashr-22',
    arabic: 'هُوَ اللَّهُ الَّذِي لَا إِلَٰهَ إِلَّا هُوَ ۖ عَالِمُ الْغَيْبِ وَالشَّهَادَةِ',
    translation: 'He is Allah, other than whom there is no deity, Knower of the unseen and the witnessed.',
    translationBn: 'তিনিই আল্লাহ, তিনি ছাড়া কোনো ইলাহ নেই। তিনি অদৃশ্য ও দৃশ্যের জ্ঞাতা।',
    surah: 'Al-Hashr',
    surahBn: 'আল-হাশর',
    surahNumber: 59,
    ayah: 22,
    theme: 'Tawheed',
  },
  {
    id: 'ghafir-60',
    arabic: 'وَقَالَ رَبُّكُمُ ادْعُونِي أَسْتَجِبْ لَكُمْ',
    translation: 'And your Lord says, "Call upon Me; I will respond to you."',
    translationBn: 'তোমাদের রব বলেন, "আমাকে ডাকো, আমি তোমাদের ডাকে সাড়া দেব।"',
    surah: 'Ghafir',
    surahBn: 'গাফির',
    surahNumber: 40,
    ayah: 60,
    theme: 'Du\'a',
  },
  {
    id: 'baqarah-216',
    arabic: 'وَعَسَىٰ أَن تَكْرَهُوا شَيْئًا وَهُوَ خَيْرٌ لَّكُمْ',
    translation: 'Perhaps you hate a thing and it is good for you.',
    translationBn: 'হতে পারে তোমরা এমন কিছু অপছন্দ করছ যা তোমাদের জন্য মঙ্গলজনক।',
    surah: 'Al-Baqarah',
    surahBn: 'আল-বাকারা',
    surahNumber: 2,
    ayah: 216,
    theme: 'Wisdom',
  },
];

// ═══════════════════════════════════════════════════════════
// Get verse of the day — deterministic by date
// ═══════════════════════════════════════════════════════════
function getVerseOfDay() {
  const today = new Date();
  // Use day-of-year as index
  const start = new Date(today.getFullYear(), 0, 0);
  const diff = today - start;
  const dayOfYear = Math.floor(diff / (1000 * 60 * 60 * 24));
  return VERSES[dayOfYear % VERSES.length];
}

export default function VerseOfDay({ variant = 'default' }) {
  const [mounted, setMounted] = useState(false);
  const [verse, setVerse] = useState(VERSES[0]);
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    setMounted(true);
    setVerse(getVerseOfDay());

    // Check bookmark
    try {
      const bm = JSON.parse(localStorage.getItem('verse-bookmarks') || '[]');
      setBookmarked(bm.includes(getVerseOfDay().id));
    } catch (e) {}
  }, []);

  const { currentIndex } = useMemo(() => ({
    currentIndex: VERSES.findIndex((v) => v.id === verse.id),
  }), [verse]);

  const goToPrev = () => {
    const idx = (currentIndex - 1 + VERSES.length) % VERSES.length;
    setVerse(VERSES[idx]);
    setCopied(false);
  };

  const goToNext = () => {
    const idx = (currentIndex + 1) % VERSES.length;
    setVerse(VERSES[idx]);
    setCopied(false);
  };

  const copyVerse = () => {
    const text = `${verse.arabic}\n\n"${verse.translation}"\n\n${verse.translationBn}\n\n— Surah ${verse.surah} ${verse.surahNumber}:${verse.ayah}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('আয়াত কপি হয়েছে', { icon: '📋' });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareVerse = async () => {
    const text = `${verse.arabic}\n\n"${verse.translation}"\n\n— Surah ${verse.surah} ${verse.surahNumber}:${verse.ayah}`;
    if (navigator.share) {
      try {
        await navigator.share({ title: `Verse of the Day — ${verse.surah}`, text });
      } catch (e) {}
    } else {
      copyVerse();
    }
  };

  const toggleBookmark = () => {
    try {
      const bm = JSON.parse(localStorage.getItem('verse-bookmarks') || '[]');
      let nb;
      if (bookmarked) {
        nb = bm.filter((id) => id !== verse.id);
        toast.success('বুকমার্ক সরানো হয়েছে', { icon: '🗑️' });
      } else {
        nb = [...bm, verse.id];
        toast.success('বুকমার্ক করা হয়েছে', { icon: '🔖' });
      }
      localStorage.setItem('verse-bookmarks', JSON.stringify(nb));
      setBookmarked(!bookmarked);
    } catch (e) {}
  };

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 pb-16 sm:pb-20">
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-2xl bg-gradient-to-br from-primary via-primary-dark to-primary">

        {/* ═══ Decorative Orbs ═══ */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-orb-1 absolute -top-20 -right-20 w-64 h-64 sm:w-80 sm:h-80 bg-gold/20 rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-20 -left-20 w-72 h-72 sm:w-96 sm:h-96 bg-emerald-400/15 rounded-full blur-3xl" />
        </div>

        {/* ═══ Islamic Pattern ═══ */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="hero-pattern-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] islamic-geometric-bg" />
        </div>

        {/* ═══ Gold Border Accent ═══ */}
        <div className="absolute inset-0 rounded-2xl sm:rounded-3xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(201,162,39,0.4) 0%, transparent 25%, transparent 75%, rgba(201,162,39,0.4) 100%)',
            padding: '1px',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        {/* ═══ Content ═══ */}
        <div className="relative p-5 sm:p-8 lg:p-12">

          {/* ─── Top Row: Label + Navigation ─── */}
          <div className="flex items-center justify-between gap-3 mb-6 sm:mb-8 flex-wrap">
            <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gold/15 border border-gold/30 backdrop-blur-sm">
              <FaStar size={9} className="text-gold animate-pulse" />
              <span className="text-[10px] sm:text-xs text-gold font-bold uppercase tracking-widest">
                Verse of the Day
              </span>
              <span className="text-[10px] sm:text-xs text-gold/60 hidden sm:inline">
                · {verse.theme}
              </span>
            </div>

            {/* Navigation */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={goToPrev}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Previous verse"
              >
                <FaChevronLeft size={10} />
              </button>
              <span className="text-[10px] sm:text-xs text-white/60 font-mono px-1">
                {currentIndex + 1}/{VERSES.length}
              </span>
              <button
                onClick={goToNext}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Next verse"
              >
                <FaChevronRight size={10} />
              </button>
            </div>
          </div>

          {/* ─── Arabic Text ─── */}
          <div className="relative mb-6 sm:mb-8">
            {/* Decorative quote mark */}
            <FaQuoteLeft className="absolute top-0 left-0 text-gold/30 text-3xl sm:text-4xl hidden sm:block" size={32} />

            <p className="font-arabic text-gold hero-arabic-glow text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl leading-loose text-center px-2 sm:px-8 py-3">
              {verse.arabic}
            </p>
          </div>

          {/* ─── Divider ─── */}
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8 px-4">
            <span className="w-8 sm:w-16 h-px bg-gradient-to-r from-transparent to-gold/40" />
            <FaStar size={10} className="text-gold/60" />
            <span className="w-8 sm:w-16 h-px bg-gradient-to-l from-transparent to-gold/40" />
          </div>

          {/* ─── English Translation ─── */}
          <div className="mb-4 sm:mb-5 text-center px-2 sm:px-6">
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl italic text-white leading-relaxed font-medium max-w-3xl mx-auto">
              &ldquo;{verse.translation}&rdquo;
            </p>
          </div>

          {/* ─── Bengali Translation ─── */}
          <div className="mb-6 sm:mb-8 text-center px-2 sm:px-6">
            <p className="text-sm sm:text-base md:text-lg text-white/80 leading-relaxed font-bangla max-w-3xl mx-auto">
              {verse.translationBn}
            </p>
          </div>

          {/* ─── Reference ─── */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-6 sm:mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/15 border border-gold/30">
              <FaBookOpen size={10} className="text-gold" />
              <span className="text-[10px] sm:text-xs text-gold font-bold">
                সূরা {verse.surahBn}
              </span>
              <span className="text-[10px] sm:text-xs text-white/60">·</span>
              <span className="text-[10px] sm:text-xs text-white/80 font-mono">
                {verse.surahNumber}:{verse.ayah}
              </span>
            </span>
          </div>

          {/* ─── Actions ─── */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-md mx-auto">
            <button
              onClick={copyVerse}
              className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] sm:text-xs font-semibold transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <FaCheck size={11} className="text-green-400" />
                  <span className="text-green-400">হয়েছে</span>
                </>
              ) : (
                <>
                  <FaCopy size={11} />
                  <span>কপি</span>
                </>
              )}
            </button>

            <button
              onClick={shareVerse}
              className="flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[11px] sm:text-xs font-semibold transition-all active:scale-95"
            >
              <FaShare size={11} />
              <span>শেয়ার</span>
            </button>

            <button
              onClick={toggleBookmark}
              className={`flex items-center justify-center gap-1.5 py-2.5 sm:py-3 rounded-xl border text-[11px] sm:text-xs font-semibold transition-all active:scale-95 ${
                bookmarked
                  ? 'bg-gold text-white border-gold shadow-lg shadow-gold/30'
                  : 'bg-white/10 hover:bg-white/20 border-white/20 text-white'
              }`}
            >
              {bookmarked ? <FaBookmark size={11} /> : <FaRegBookmark size={11} />}
              <span>{bookmarked ? 'সেভ' : 'বুকমার্ক'}</span>
            </button>
          </div>

          {/* ─── Read Full Surah CTA ─── */}
          <div className="mt-6 sm:mt-8 text-center">
            <Link
              href={`/quran/${verse.surahNumber}`}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl bg-gold hover:bg-gold-dark text-white text-xs sm:text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-lg shadow-gold/30"
            >
              <FaBookOpen size={12} />
              পুরো সূরা পড়ুন
              <FaChevronRight size={10} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
