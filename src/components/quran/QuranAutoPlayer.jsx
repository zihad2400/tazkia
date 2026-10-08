'use client';

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import {
  FaPlay, FaPause, FaStepForward, FaStepBackward,
  FaVolumeUp, FaSpinner, FaTimes, FaRedo,
} from 'react-icons/fa';
import { getEveryAyahUrl } from '@/lib/services/quranApi';
import { qaris } from '@/lib/data/qaris';
import toast from 'react-hot-toast';

export default function QuranAutoPlayer({
  ayahs,
  surahNumber,
  surahName,
  qariId,
  currentAyahIndex,
  setCurrentAyahIndex,
  isAutoPlaying,
  setIsAutoPlaying,
}) {
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [repeat, setRepeat] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const audioRef = useRef(null);

  const currentAyah = ayahs?.[currentAyahIndex];
  const qari = qaris.find((q) => q.id === qariId);

  // ═══ Build EveryAyah URL ═══
  const audioUrl = useMemo(() => {
    if (!currentAyah || !qari) return null;
    return getEveryAyahUrl(qariId, surahNumber, currentAyah.numberInSurah);
  }, [qariId, surahNumber, currentAyah, qari]);

  // ═══ Load & auto-play on URL change ═══
  useEffect(() => {
    const el = audioRef.current;
    if (!el || !audioUrl) return;

    let cancelled = false;

    const load = async () => {
      try {
        el.pause();
        el.currentTime = 0;
      } catch (e) {}

      setCurrentTime(0);
      setDuration(0);
      setPlaying(false);

      el.src = audioUrl;
      el.load();

      if (isAutoPlaying && !cancelled) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 100));
        if (cancelled) return;

        try {
          await el.play();
          if (!cancelled) {
            setPlaying(true);
            setLoading(false);
            setFailCount(0);
          }
        } catch (err) {
          if (cancelled) return;
          // Retry once (autoplay policy)
          setTimeout(async () => {
            if (cancelled) return;
            try {
              await el.play();
              if (!cancelled) {
                setPlaying(true);
                setLoading(false);
              }
            } catch (e2) {
              if (!cancelled) {
                console.error('Play failed:', e2.message);
                setLoading(false);
                setFailCount((c) => c + 1);
              }
            }
          }, 300);
        }
      }
    };

    load();
    return () => { cancelled = true; };
    // eslint-disable-next-line
  }, [audioUrl]);

  // ═══ Audio events ═══
  useEffect(() => {
    const el = audioRef.current;
    if (!el) return;

    const onTime = () => setCurrentTime(el.currentTime);
    const onMeta = () => setDuration(el.duration || 0);
    const onPlaying = () => {
      setPlaying(true);
      setLoading(false);
    };
    const onPause = () => setPlaying(false);
    const onEnd = () => {
      setPlaying(false);
      if (!isAutoPlaying) return;
      // Move to next ayah
      if (currentAyahIndex < ayahs.length - 1) {
        setCurrentAyahIndex(currentAyahIndex + 1);
      } else if (repeat) {
        setCurrentAyahIndex(0);
      } else {
        setIsAutoPlaying(false);
        toast.success(`${surahName} completed 🎉`, { icon: '📖' });
      }
    };
    const onErr = () => {
      if (el.error?.code === 1) return; // abort, ignore
      console.error('Audio error:', el.error?.code, el.src);
      setLoading(false);
      setPlaying(false);
      // Skip on error
      if (isAutoPlaying && currentAyahIndex < ayahs.length - 1) {
        setTimeout(() => {
          setCurrentAyahIndex(currentAyahIndex + 1);
        }, 1500);
      }
    };

    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('playing', onPlaying);
    el.addEventListener('pause', onPause);
    el.addEventListener('ended', onEnd);
    el.addEventListener('error', onErr);

    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('playing', onPlaying);
      el.removeEventListener('pause', onPause);
      el.removeEventListener('ended', onEnd);
      el.removeEventListener('error', onErr);
    };
    // eslint-disable-next-line
  }, [currentAyahIndex, ayahs?.length, repeat, surahName, isAutoPlaying, setCurrentAyahIndex, setIsAutoPlaying]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const handlePlayPause = useCallback(async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
      setIsAutoPlaying(false);
    } else {
      setLoading(true);
      try {
        await el.play();
        setPlaying(true);
        setIsAutoPlaying(true);
      } catch (err) {
        toast.error('Tap page first, then play');
      }
      setLoading(false);
    }
  }, [playing, setIsAutoPlaying]);

  const handleNext = () => {
    if (currentAyahIndex < ayahs.length - 1) setCurrentAyahIndex(currentAyahIndex + 1);
  };
  const handlePrev = () => {
    if (currentAyahIndex > 0) setCurrentAyahIndex(currentAyahIndex - 1);
  };
  const handleStop = () => {
    const el = audioRef.current;
    if (el) { el.pause(); el.currentTime = 0; }
    setPlaying(false);
    setIsAutoPlaying(false);
    setCurrentAyahIndex(0);
  };

  const seek = (e) => {
    const el = audioRef.current;
    if (!el || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    el.currentTime = ((e.clientX - rect.left) / rect.width) * duration;
  };

  const formatTime = (sec) => {
    if (!sec || isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  if (!currentAyah) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-base-100/98 backdrop-blur-xl border-t border-base-300 shadow-2xl">
      <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-3">
        {/* Info bar */}
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-[10px] font-bold shrink-0">
              {currentAyah.numberInSurah}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-base-content truncate">
                {surahName} · Ayah {currentAyah.numberInSurah}/{ayahs.length}
              </p>
              <p className="text-[10px] text-base-content/60 truncate">
                🎧 {qari?.name || qariId}
                {failCount > 0 && ` · ${failCount} skipped`}
              </p>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] text-base-content/60 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
          <button onClick={handleStop} className="p-2 rounded-lg hover:bg-red-50 text-red-500 shrink-0">
            <FaTimes size={14} />
          </button>
        </div>

        {/* Progress */}
        <div onClick={seek} className="relative h-2 bg-base-300 rounded-full cursor-pointer group mb-2">
          <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary to-gold rounded-full transition-all" style={{ width: duration ? `${(currentTime / duration) * 100}%` : '0%' }} />
          <div className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-primary rounded-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ left: duration ? `calc(${(currentTime / duration) * 100}% - 7px)` : '0px' }} />
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 sm:gap-4">
          <button onClick={handlePrev} disabled={currentAyahIndex === 0} className="w-10 h-10 rounded-lg bg-base-200 border border-base-300 flex items-center justify-center hover:border-primary disabled:opacity-40">
            <FaStepBackward size={12} />
          </button>
          <button onClick={handlePlayPause} className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white flex items-center justify-center hover:scale-105 shadow-lg">
            {loading ? <FaSpinner className="animate-spin" size={16} /> : playing ? <FaPause size={16} /> : <FaPlay size={16} className="ml-0.5" />}
          </button>
          <button onClick={handleNext} disabled={currentAyahIndex === ayahs.length - 1 && !repeat} className="w-10 h-10 rounded-lg bg-base-200 border border-base-300 flex items-center justify-center hover:border-primary disabled:opacity-40">
            <FaStepForward size={12} />
          </button>
          <button onClick={() => setRepeat((v) => !v)} className={`w-10 h-10 rounded-lg flex items-center justify-center ${repeat ? 'bg-primary text-white' : 'bg-base-200 border border-base-300 hover:border-primary'}`}>
            <FaRedo size={12} />
          </button>
          <div className="hidden sm:flex items-center gap-2 ml-2">
            <FaVolumeUp className="text-base-content/50" size={12} />
            <input type="range" min="0" max="1" step="0.05" value={volume} onChange={(e) => setVolume(parseFloat(e.target.value))} className="w-24 accent-primary" />
          </div>
        </div>
      </div>
      <audio ref={audioRef} preload="auto" />
    </div>
  );
}
