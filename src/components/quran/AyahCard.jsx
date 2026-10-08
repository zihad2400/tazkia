'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import {
  FaPlay, FaPause, FaCopy, FaShare, FaSpinner,
  FaEye, FaEyeSlash, FaVolumeUp, FaStepForward,
} from 'react-icons/fa';
import { getEveryAyahUrl } from '@/lib/services/quranApi';
import { parseTajweed, stripTajweed } from '@/lib/tajweedColors';
import BookmarkButton from '@/components/ui/BookmarkButton';
import toast from 'react-hot-toast';

export default function AyahCard({
  ayah,
  translation,
  qariId,
  surahName,
  surahNumber,
  tajweedText,
  showWordByWord = false,
  words = [],
  onPlayFromHere,
  isCurrentAyah = false,
}) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showWords, setShowWords] = useState(false);
  const audioRef = useRef(null);

  const ayahNumber = ayah?.number || 0;

  const audioUrl = useMemo(() => {
    if (qariId && surahNumber && ayah?.numberInSurah) {
      return getEveryAyahUrl(qariId, surahNumber, ayah.numberInSurah);
    }
    return null;
  }, [qariId, surahNumber, ayah?.numberInSurah]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    try { el.pause(); el.currentTime = 0; } catch (e) {}
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    el.src = audioUrl;
    el.load();
  }, [audioUrl]);

  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onEnd = () => setPlaying(false);
    const onCanPlay = () => setLoading(false);
    const onErr = () => {
      if (el.error?.code === 1) return;
      setLoading(false);
      setPlaying(false);
    };
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnd);
    el.addEventListener('canplay', onCanPlay);
    el.addEventListener('error', onErr);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('canplay', onCanPlay);
      el.removeEventListener('error', onErr);
    };
  }, []);

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;
    if (playing) { el.pause(); setPlaying(false); }
    else {
      setLoading(true);
      try {
        if (el.src !== audioUrl) { el.src = audioUrl; el.load(); }
        await el.play();
        setPlaying(true);
      } catch (err) { toast.error('Audio play failed'); }
      setLoading(false);
    }
  };

  const seek = (e) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const copyAyah = () => {
    const plain = tajweedText ? stripTajweed(tajweedText) : ayah?.text || '';
    const text = `${plain}\n\n${translation?.text || ''}\n\n— ${surahName} ${surahNumber}:${ayah?.numberInSurah}`;
    navigator.clipboard.writeText(text);
    toast.success('Ayah copied', { icon: '📋' });
  };

  const shareAyah = async () => {
    const plain = tajweedText ? stripTajweed(tajweedText) : ayah?.text || '';
    const text = `${plain}\n\n${translation?.text || ''}\n\n— ${surahName} ${surahNumber}:${ayah?.numberInSurah}`;
    if (navigator.share) {
      try { await navigator.share({ title: `${surahName} ${surahNumber}:${ayah?.numberInSurah}`, text }); } catch (e) {}
    } else { copyAyah(); }
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const { arabicHtml, isTajweed } = useMemo(() => {
    if (tajweedText) {
      const stripped = stripTajweed(tajweedText);
      if (stripped.trim().length > 0) {
        return { arabicHtml: parseTajweed(tajweedText), isTajweed: true };
      }
    }
    return { arabicHtml: null, isTajweed: false };
  }, [tajweedText]);

  const plainArabic = ayah?.text || '';

  return (
    <div className={`bg-base-200 border rounded-2xl p-5 md:p-6 transition-all ${
      isCurrentAyah ? 'border-primary shadow-lg bg-primary/5' : 'border-base-300 hover:border-primary/40'
    }`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className={`w-9 h-9 rounded-xl text-white flex items-center justify-center text-xs font-bold shadow-sm ${
            isCurrentAyah ? 'bg-gradient-to-br from-gold to-gold-dark animate-pulse' : 'bg-gradient-to-br from-primary to-primary-dark'
          }`}>
            {ayah?.numberInSurah}
          </span>
          <span className="text-xs text-base-content/50 font-mono">{surahNumber}:{ayah?.numberInSurah}</span>
          {isCurrentAyah && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-gold/20 text-gold-dark font-bold uppercase tracking-wider">
              Now Playing
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {words.length > 0 && (
            <button onClick={() => setShowWords((v) => !v)} className="p-2 rounded-lg hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors" title="Word-by-word">
              {showWords ? <FaEyeSlash size={13} /> : <FaEye size={13} />}
            </button>
          )}

          {/* ⭐ BOOKMARK */}
          <BookmarkButton
            bookmark={{
              id: `quran-${surahNumber}-${ayah?.numberInSurah}`,
              type: 'quran',
              title: `সূরা ${surahName} - আয়াত ${ayah?.numberInSurah}`,
              subtitle: translation?.edition?.englishName || 'Translation',
              arabic: plainArabic,
              text: translation?.text || '',
              reference: `${surahName} ${surahNumber}:${ayah?.numberInSurah}`,
              surahNumber: surahNumber,
              ayahNumber: ayah?.numberInSurah,
            }}
            size="md"
          />

          <button onClick={copyAyah} className="p-2 rounded-lg hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors" title="Copy">
            <FaCopy size={13} />
          </button>
          <button onClick={shareAyah} className="p-2 rounded-lg hover:bg-primary/10 text-base-content/60 hover:text-primary transition-colors" title="Share">
            <FaShare size={13} />
          </button>
        </div>
      </div>

      <div className="mb-5">
        {isTajweed && arabicHtml ? (
          <p className="font-arabic ayah-arabic text-base-content leading-[2.4] text-right" dangerouslySetInnerHTML={{ __html: arabicHtml }} />
        ) : (
          <p className="font-arabic ayah-arabic text-base-content leading-[2.4] text-right">{plainArabic}</p>
        )}
      </div>

      {showWords && words.length > 0 && (
        <div className="mb-5 p-4 bg-base-100 rounded-xl border border-base-300">
          <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 mb-3">Word by Word</p>
          <div className="flex flex-wrap gap-2" dir="rtl">
            {words.map((w, i) => (
              <div key={i} className="flex flex-col items-center px-3 py-2 bg-base-200 rounded-lg border border-base-300 min-w-[80px]">
                <span className="font-arabic text-lg text-primary leading-none mb-1">{w.text_uthmani || w.text}</span>
                <span className="text-[10px] text-base-content/70 text-center">{w.translation?.text || ''}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {translation?.text && (
        <div className="mb-4 pt-4 border-t border-base-300">
          <span className="text-[10px] font-bold uppercase tracking-widest text-base-content/40 block mb-2">
            {translation?.edition?.englishName || 'Translation'}
          </span>
          <p className="text-base-content/85 leading-relaxed text-sm md:text-base">{translation.text}</p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-base-300">
        <button onClick={togglePlay} className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center hover:scale-105 transition-transform shadow-md shrink-0">
          {loading ? <FaSpinner className="animate-spin" size={13} /> : playing ? <FaPause size={13} /> : <FaPlay size={13} className="ml-0.5" />}
        </button>

        {onPlayFromHere && (
          <button onClick={onPlayFromHere} className="h-11 px-3 rounded-full bg-base-100 border border-base-300 text-primary hover:border-primary flex items-center gap-2 text-xs font-semibold transition-colors shrink-0">
            <FaStepForward size={11} />
            <span className="hidden sm:inline">Play Surah</span>
          </button>
        )}

        <div className="flex-1 min-w-0">
          <div onClick={seek} className="relative h-1.5 bg-base-300 rounded-full cursor-pointer group">
            <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
          </div>
          <div className="flex justify-between text-[10px] text-base-content/50 mt-1 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <FaVolumeUp className="text-base-content/40 shrink-0" size={12} />
        <audio ref={audioRef} preload="none" />
      </div>
    </div>
  );
}
