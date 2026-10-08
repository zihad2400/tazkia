'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaSpinner, FaBookOpen, FaCopy, FaShare, FaBookmark,
  FaRegBookmark, FaArrowLeft, FaArrowRight, FaCheck,
  FaInfoCircle, FaExclamationTriangle, FaStar, FaUser,
  FaBook, FaHashtag, FaGlobe,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import BookmarkButton from '@/components/ui/BookmarkButton';
import toast from 'react-hot-toast';

const COLLECTIONS_INFO = {
  bukhari: { name: 'Sahih al-Bukhari', nameAr: 'صحيح البخاري', nameBn: 'সহীহ বুখারী', icon: '📗', author: 'ইমাম মুহাম্মদ ইবনে ইসমাইল আল-বুখারী', deathYear: '২৫৬ হিজরি' },
  muslim: { name: 'Sahih Muslim', nameAr: 'صحيح مسلم', nameBn: 'সহীহ মুসলিম', icon: '📘', author: 'ইমাম মুসলিম ইবনে আল-হাজ্জাজ', deathYear: '২৬১ হিজরি' },
  abudawud: { name: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', nameBn: 'সুনান আবু দাউদ', icon: '📕', author: 'ইমাম আবু দাউদ সুলাইমান', deathYear: '২৭৫ হিজরি' },
  tirmidhi: { name: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', nameBn: 'জামে তিরমিজি', icon: '📙', author: 'ইমাম আবু ঈসা মুহাম্মদ আত-তিরমিজি', deathYear: '২৭৯ হিজরি' },
  nasai: { name: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', nameBn: 'সুনান নাসাঈ', icon: '📓', author: 'ইমাম আহমদ ইবনে শুয়াইব আন-নাসাঈ', deathYear: '৩০৩ হিজরি' },
  ibnmajah: { name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', nameBn: 'সুনান ইবনে মাজাহ', icon: '📔', author: 'ইমাম মুহাম্মদ ইবনে ইয়াযীদ ইবনে মাজাহ', deathYear: '২৭৩ হিজরি' },
  malik: { name: 'Muwatta Malik', nameAr: 'موطأ مالك', nameBn: 'মুয়াত্তা মালিক', icon: '📚', author: 'ইমাম মালিক ইবনে আনাস', deathYear: '১৭৯ হিজরি' },
};

export default function HadithDetailPage() {
  const params = useParams();
  const collectionId = params.collection;
  const hadithId = params.hadithId;

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarked, setBookmarked] = useState(false);
  const [copied, setCopied] = useState(false);

  const info = COLLECTIONS_INFO[collectionId];

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setError(null);

      try {
        const url = new URL('/api/hadith/item', window.location.origin);
        url.searchParams.set('c', collectionId);
        url.searchParams.set('n', hadithId);

        const res = await fetch(url.toString());
        if (cancelled) return;

        if (!res.ok) {
          setError('হাদিসটি খুঁজে পাওয়া যায়নি');
          setLoading(false);
          return;
        }

        const result = await res.json();
        setData(result);
        setLoading(false);

        const bm = JSON.parse(localStorage.getItem('hadith-bookmarks') || '[]');
        setBookmarked(bm.some((b) => b.id === `${collectionId}-${hadithId}`));
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setError('লোড করতে সমস্যা হয়েছে');
          setLoading(false);
        }
      }
    };

    load();
    return () => { cancelled = true; };
  }, [collectionId, hadithId]);

  const toggleBookmark = () => {
    if (!data?.hadith) return;
    const bm = JSON.parse(localStorage.getItem('hadith-bookmarks') || '[]');
    const id = `${collectionId}-${hadithId}`;
    let nb;
    if (bookmarked) {
      nb = bm.filter((b) => b.id !== id);
      toast.success('বুকমার্ক সরানো হয়েছে', { icon: '🗑️' });
    } else {
      nb = [...bm, { id, collectionId, hadithId, name: info?.nameBn, addedAt: Date.now() }];
      toast.success('বুকমার্ক করা হয়েছে', { icon: '🔖' });
    }
    localStorage.setItem('hadith-bookmarks', JSON.stringify(nb));
    setBookmarked(!bookmarked);
  };

  const copyHadith = () => {
    if (!data?.hadith?.text) return;
    let text = `📚 ${info?.nameBn} | হাদিস #${hadithId}\n`;
    if (data.arabicHadith?.text) text += `\n${data.arabicHadith.text}\n`;
    text += `\n${data.hadith.text}`;
    if (data.hadith.grades?.[0]) text += `\n\n📊 মান: ${data.hadith.grades[0].grade}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('কপি হয়েছে', { icon: '📋' });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareHadith = async () => {
    if (!data?.hadith?.text) return;
    const text = `${data.hadith.text}\n\n— ${info?.nameBn} #${hadithId}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${info?.name} #${hadithId}`, text }); } catch (e) {}
    } else {
      copyHadith();
    }
  };

  const currentNum = parseInt(hadithId) || 1;
  const prevId = currentNum > 1 ? currentNum - 1 : null;
  const nextId = currentNum + 1;

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-10">
        <div className="h-32 bg-base-200 rounded-2xl animate-pulse mb-6" />
        <div className="h-64 bg-base-200 rounded-2xl animate-pulse mb-4" />
        <div className="h-48 bg-base-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 lg:py-10">
        <Breadcrumb
          items={[
            { label: 'Hadith', href: '/hadith' },
            { label: info?.nameBn || 'Collection', href: `/hadith/${collectionId}` },
            { label: `হাদিস #${hadithId}` },
          ]}
        />
        <div className="text-center py-20">
          <FaExclamationTriangle className="text-red-500 text-3xl mx-auto mb-4" />
          <p className="text-base-content/60 mb-4">{error || 'পাওয়া যায়নি'}</p>
          <Link
            href={`/hadith/${collectionId}`}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm"
          >
            <FaBookOpen size={12} /> সব হাদিস
          </Link>
        </div>
      </div>
    );
  }

  const { hadith, arabicHadith, usedLang, sectionName, totalHadiths } = data;
  const isBengali = usedLang === 'ben';
  const primaryGrade = hadith?.grades?.[0];
  const referenceBook = hadith?.reference?.book;
  const referenceHadith = hadith?.reference?.hadith;

  return (
    <div className="max-w-3xl mx-auto px-3 sm:px-4 py-6 lg:py-10 pb-24">
      <Breadcrumb
        items={[
          { label: 'Hadith', href: '/hadith' },
          { label: info?.nameBn || 'Collection', href: `/hadith/${collectionId}` },
          { label: `হাদিস #${hadithId}` },
        ]}
      />

      <div className="relative overflow-hidden bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-5 sm:p-6 text-center mb-5 shadow-xl">
        <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-3 border border-white/20">
          <span className="text-xl sm:text-2xl">{info?.icon}</span>
        </div>
        <p className="font-arabic text-xl sm:text-2xl text-gold mb-1">{info?.nameAr}</p>
        <h1 className="text-lg sm:text-xl font-bold mb-1">{info?.name}</h1>
        <p className="text-xs text-white/70 mb-2">{info?.nameBn}</p>
        {sectionName && <p className="text-[11px] text-gold/80 mb-2">অধ্যায়: {sectionName}</p>}
        <div className="inline-flex items-center gap-2 mt-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/30">
          <span className="text-xs text-gold font-bold">হাদিস নং {hadith.hadithnumber}</span>
        </div>
      </div>

      {!isBengali && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 mb-4 flex items-start gap-3">
          <FaInfoCircle className="text-amber-600 shrink-0 mt-0.5" size={14} />
          <div className="text-xs text-amber-800 dark:text-amber-200">
            <strong>বাংলা অনুবাদ নেই</strong> — ইংরেজি দেখানো হচ্ছে।
          </div>
        </div>
      )}

      <div className="grid grid-cols-3 gap-2 mb-5">
        <button
          onClick={toggleBookmark}
          className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium active:scale-95 ${
            bookmarked ? 'bg-gold/20 text-gold-dark border border-gold/40' : 'bg-base-200 border border-base-300 hover:border-primary text-base-content'
          }`}
        >
          {bookmarked ? <FaBookmark size={11} /> : <FaRegBookmark size={11} />}
          <span>{bookmarked ? 'সেভ' : 'বুকমার্ক'}</span>
        </button>
        <button onClick={copyHadith} className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium bg-base-200 border border-base-300 hover:border-primary active:scale-95">
          {copied ? <FaCheck size={11} className="text-green-600" /> : <FaCopy size={11} />}
          <span>{copied ? 'হয়েছে' : 'কপি'}</span>
        </button>
        <button onClick={shareHadith} className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium bg-base-200 border border-base-300 hover:border-primary active:scale-95">
          <FaShare size={11} />
          <span>শেয়ার</span>
        </button>
      </div>

      {arabicHadith?.text && (
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-2xl p-4 sm:p-6 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-3">মূল আরবি</p>
          <p className="font-arabic text-lg sm:text-2xl text-base-content leading-loose text-right">
            {arabicHadith.text}
          </p>
        </div>
      )}

      <div className="bg-base-200 border-2 border-primary/30 rounded-2xl p-4 sm:p-6 mb-4">
        <p className="text-xs font-bold uppercase tracking-widest text-primary mb-4 pb-3 border-b border-base-300">
          {isBengali ? '🇧🇩 বাংলা অনুবাদ' : '🇬🇧 English Translation'}
        </p>
        {hadith.text && hadith.text.length > 0 ? (
          <p className="text-base sm:text-lg text-base-content leading-loose whitespace-pre-wrap">
            {hadith.text}
          </p>
        ) : (
          <p className="text-sm text-base-content/50 italic text-center py-4">
            টেক্সট লোড করা যায়নি
          </p>
        )}
      </div>

      {/* Reference card */}
      <div className="bg-base-200 border-2 border-primary/20 rounded-2xl p-4 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-9 h-9 rounded-lg bg-primary text-white flex items-center justify-center shadow-md">
            <FaBookOpen size={14} />
          </div>
          <div>
            <h3 className="font-bold text-base text-base-content">সম্পূর্ণ রেফারেন্স</h3>
            <p className="text-[10px] text-base-content/50">Complete Reference</p>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="bg-base-100 rounded-xl p-3 border border-base-300">
            <div className="flex items-center gap-2 mb-1.5">
              <FaBook size={10} className="text-primary" />
              <p className="text-[10px] uppercase tracking-widest text-base-content/50">গ্রন্থ</p>
            </div>
            <p className="font-bold text-sm text-base-content">{info?.nameBn}</p>
            <p className="text-xs text-base-content/70 mt-0.5">{info?.name}</p>
            <p className="font-arabic text-base text-primary/80 mt-1 text-right">{info?.nameAr}</p>
          </div>

          <div className="bg-base-100 rounded-xl p-3 border border-base-300">
            <div className="flex items-center gap-2 mb-1.5">
              <FaUser size={10} className="text-primary" />
              <p className="text-[10px] uppercase tracking-widest text-base-content/50">সংকলক</p>
            </div>
            <p className="font-semibold text-sm text-base-content">{info?.author}</p>
            <p className="text-xs text-base-content/60 mt-0.5">ইন্তেকাল: {info?.deathYear}</p>
          </div>

          {sectionName && (
            <div className="bg-base-100 rounded-xl p-3 border border-base-300">
              <div className="flex items-center gap-2 mb-1.5">
                <FaHashtag size={10} className="text-primary" />
                <p className="text-[10px] uppercase tracking-widest text-base-content/50">অধ্যায়</p>
              </div>
              <p className="font-semibold text-sm text-base-content">{sectionName}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-base-100 rounded-xl p-3 border border-base-300">
              <p className="text-[10px] uppercase tracking-widest text-base-content/50 mb-1">হাদিস নম্বর</p>
              <p className="font-bold text-base text-primary">#{hadith.hadithnumber}</p>
            </div>
            {hadith.arabicnumber && (
              <div className="bg-base-100 rounded-xl p-3 border border-base-300">
                <p className="text-[10px] uppercase tracking-widest text-base-content/50 mb-1">আরবি নম্বর</p>
                <p className="font-bold text-base text-primary">#{hadith.arabicnumber}</p>
              </div>
            )}
          </div>

          {referenceBook && referenceHadith && (
            <div className="bg-primary/5 rounded-xl p-3 border border-primary/20">
              <p className="text-[10px] uppercase tracking-widest text-primary mb-1.5">রেফারেন্স</p>
              <p className="text-sm font-bold text-base-content font-mono">
                {info?.nameBn} {referenceBook}:{referenceHadith}
              </p>
            </div>
          )}

          {primaryGrade && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
              <div className="flex items-center gap-2 mb-1.5">
                <FaStar size={10} className="text-green-600" />
                <p className="text-[10px] uppercase tracking-widest text-green-700 dark:text-green-400">মান</p>
              </div>
              <p className="font-bold text-sm text-green-800 dark:text-green-300">{primaryGrade.grade}</p>
              {primaryGrade.name && (
                <p className="text-[10px] text-green-700/70 mt-0.5">যাচাইকারী: {primaryGrade.name}</p>
              )}
            </div>
          )}

          {totalHadiths > 0 && (
            <div className="bg-base-100 rounded-xl p-3 border border-base-300">
              <div className="flex items-center gap-2 mb-1.5">
                <FaGlobe size={10} className="text-primary" />
                <p className="text-[10px] uppercase tracking-widest text-base-content/50">সংকলনে মোট</p>
              </div>
              <p className="font-bold text-sm text-base-content">
                {totalHadiths.toLocaleString('bn-BD')} টি হাদিস
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {prevId ? (
          <Link
            href={`/hadith/${collectionId}/${prevId}`}
            className="flex items-center gap-2 p-3 sm:p-4 bg-base-200 border border-base-300 rounded-2xl hover:border-primary active:scale-[0.98]"
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <FaArrowLeft size={11} />
            </div>
            <div className="min-w-0">
              <p className="text-[9px] uppercase text-base-content/50">Previous</p>
              <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
                হাদিস #{prevId}
              </p>
            </div>
          </Link>
        ) : <div />}

        <Link
          href={`/hadith/${collectionId}/${nextId}`}
          className="flex items-center justify-end gap-2 p-3 sm:p-4 bg-base-200 border border-base-300 rounded-2xl hover:border-primary active:scale-[0.98] text-right"
        >
          <div className="min-w-0">
            <p className="text-[9px] uppercase text-base-content/50">Next</p>
            <p className="text-xs sm:text-sm font-semibold text-base-content truncate">
              হাদিস #{nextId}
            </p>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <FaArrowRight size={11} />
          </div>
        </Link>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row gap-2 justify-center">
        <Link
          href={`/hadith/${collectionId}`}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium"
        >
          <FaBookOpen size={12} />
          সব হাদিস
        </Link>
        <Link
          href="/hadith"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium"
        >
          <FaArrowLeft size={12} />
          Hadith Home
        </Link>
      </div>
    </div>
  );
}
