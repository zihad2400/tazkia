'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import {
  FaPlus, FaMinus, FaRedo, FaCheck, FaTimes, FaCog,
  FaHistory, FaVolumeUp, FaVolumeMute, FaHome,
  FaStar, FaChevronDown, FaChevronUp, FaTrash, FaTrophy,
  FaSearch, FaFilter, FaHeart,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';
import {
  dhikrPresets,
  targetOptions,
  dhikrCategories,
} from '@/lib/data/dhikrData';
import { useTasbih } from '@/hooks/useTasbih';

export default function TasbihPage() {
  const {
    count, target, dhikrId, totalToday, sessions, mounted,
    increment, decrement, reset, complete, changeDhikr, changeTarget, resetAll,
    progress, isComplete,
  } = useTasbih();

  const [pulse, setPulse] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customTarget, setCustomTarget] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [favorites, setFavorites] = useState([]);
  const audioCtxRef = useRef(null);

  const currentDhikr = dhikrPresets.find((d) => d.id === dhikrId) || dhikrPresets[0];

  // ═══ Audio setup ═══
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    } catch (e) {}
  }, []);

  // ═══ Load favorites ═══
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('tazkia-tasbih-favorites') || '[]');
      setFavorites(stored);
    } catch (e) {}
  }, []);

  const toggleFavorite = (id) => {
    const nb = favorites.includes(id)
      ? favorites.filter((f) => f !== id)
      : [...favorites, id];
    setFavorites(nb);
    try {
      localStorage.setItem('tazkia-tasbih-favorites', JSON.stringify(nb));
    } catch (e) {}
    toast.success(favorites.includes(id) ? 'প্রিয় থেকে সরানো' : 'প্রিয়তে যোগ হয়েছে', {
      icon: favorites.includes(id) ? '🗑️' : '❤️',
    });
  };

  const playClickSound = useCallback(() => {
    if (!soundEnabled || !audioCtxRef.current) return;
    try {
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') ctx.resume();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
  }, [soundEnabled]);

  const handleTap = useCallback(() => {
    increment();
    playClickSound();
    setPulse(true);
    setTimeout(() => setPulse(false), 150);
  }, [increment, playClickSound]);

  useEffect(() => {
    if (isComplete && mounted) {
      complete();
      if (navigator.vibrate) navigator.vibrate([50, 100, 50]);
      toast.success(`🎉 ${currentDhikr.transliteration} — ${target} বার সম্পন্ন!`, {
        duration: 3000,
      });
    }
    // eslint-disable-next-line
  }, [isComplete]);

  useEffect(() => {
    const handler = (e) => {
      if (e.target.tagName === 'INPUT') return;
      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleTap();
      } else if (e.code === 'KeyR' && (e.ctrlKey || e.metaKey)) {
        e.preventDefault();
        reset();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [handleTap, reset]);

  const formatDate = (iso) => {
    const d = new Date(iso);
    const now = new Date();
    const diffMins = Math.floor((now - d) / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    if (diffMins < 1) return 'এখন';
    if (diffMins < 60) return `${diffMins} মিনিট আগে`;
    if (diffHours < 24) return `${diffHours} ঘণ্টা আগে`;
    return `${diffDays} দিন আগে`;
  };

  // ═══ Filter dhikr ═══
  const filteredDhikr = useMemo(() => {
    let list = dhikrPresets;

    // Category filter
    if (selectedCategory === 'favorites') {
      list = list.filter((d) => favorites.includes(d.id));
    } else if (selectedCategory !== 'all') {
      const cat = dhikrCategories.find((c) => c.id === selectedCategory);
      if (cat) {
        list = list.filter((d) => cat.dhikrIds.includes(d.id));
      }
    }

    // Search
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (d) =>
          d.transliteration.toLowerCase().includes(q) ||
          d.translation.toLowerCase().includes(q) ||
          d.arabic.includes(searchQuery) ||
          d.reference.toLowerCase().includes(q)
      );
    }

    return list;
  }, [selectedCategory, searchQuery, favorites]);

  const radius = 130;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!mounted) {
    return (
      <div className="max-w-3xl mx-auto px-3 py-10">
        <div className="h-96 bg-base-200 rounded-3xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Tasbih' }]} showBack={false} />

      {/* Header */}
      <div className="text-center mb-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl sm:text-2xl shadow-xl mb-2">
          📿
        </div>
        <p className="font-arabic text-gold text-lg sm:text-xl mb-0.5">التسبيح</p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
          Digital Tasbih
        </h1>
        <p className="text-xs text-base-content/60">
          {dhikrPresets.length}টি সহীহ জিকির · জিকির গুনুন · হৃদয় শান্ত করুন
        </p>
      </div>

      {/* Today's total */}
      {totalToday > 0 && (
        <div className="mb-3 flex justify-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 border border-gold/30 text-gold text-xs font-semibold">
            <FaTrophy size={10} />
            আজ: {totalToday.toLocaleString('bn-BD')} বার
          </span>
        </div>
      )}

      {/* Current Dhikr Card */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${currentDhikr.color} text-white rounded-2xl p-3.5 sm:p-5 mb-3 shadow-xl`}>
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-white/20 rounded-full blur-3xl" />
        </div>

        <div className="relative text-center">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] text-white/70 uppercase tracking-widest">
              এখন পড়ছেন
            </p>
            <button
              onClick={() => toggleFavorite(dhikrId)}
              className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all active:scale-95"
            >
              <FaHeart size={11} className={favorites.includes(dhikrId) ? 'text-red-300' : 'text-white/60'} />
            </button>
          </div>
          <p className="font-arabic text-2xl sm:text-3xl md:text-4xl mb-1.5 leading-tight">
            {currentDhikr.arabic}
          </p>
          <p className="text-sm sm:text-base font-bold mb-0.5">
            {currentDhikr.transliteration}
          </p>
          <p className="text-[11px] sm:text-xs text-white/85 mb-1.5">
            {currentDhikr.translation}
          </p>
          {currentDhikr.description && (
            <p className="text-[10px] text-gold/90 italic mb-1.5">
              💡 {currentDhikr.description}
            </p>
          )}
          <p className="text-[10px] text-white/60 italic">
            📚 {currentDhikr.reference}
          </p>
        </div>
      </div>

      {/* COUNTER */}
      <div className="relative bg-base-200 border border-base-300 rounded-3xl p-4 sm:p-6 mb-3 shadow-lg">
        <div className="relative w-full max-w-[260px] sm:max-w-[300px] md:max-w-[320px] mx-auto aspect-square mb-3">
          <svg className="absolute inset-0 -rotate-90" viewBox="0 0 300 300">
            <defs>
              <linearGradient id="tazkiaProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C9A227" />
                <stop offset="50%" stopColor="#FFD966" />
                <stop offset="100%" stopColor="#C9A227" />
              </linearGradient>
            </defs>
            <circle cx="150" cy="150" r={radius} fill="none" stroke="currentColor" strokeWidth="10" className="text-base-300" />
            <circle
              cx="150" cy="150" r={radius} fill="none"
              stroke="url(#tazkiaProgressGrad)" strokeWidth="10" strokeLinecap="round"
              strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
              className="transition-all duration-500 ease-out"
              style={{ filter: 'drop-shadow(0 0 8px rgba(201, 162, 39, 0.5))' }}
            />
          </svg>

          <button
            onClick={handleTap}
            onTouchStart={(e) => e.preventDefault()}
            className={`absolute inset-[12%] rounded-full bg-gradient-to-br from-primary via-primary-dark to-primary flex flex-col items-center justify-center text-white shadow-2xl transition-all duration-150 select-none ${
              pulse ? 'scale-95' : 'scale-100'
            } ${isComplete ? 'ring-4 ring-gold ring-offset-4 ring-offset-base-200' : ''} active:scale-95`}
            style={{ touchAction: 'manipulation' }}
          >
            {pulse && <span className="absolute inset-0 rounded-full bg-gold/30 animate-ping" />}
            <span className={`text-4xl sm:text-5xl md:text-6xl font-bold font-mono text-gold transition-transform ${pulse ? 'scale-110' : 'scale-100'}`}>
              {count}
            </span>
            <span className="text-[10px] text-white/60 mt-1 uppercase tracking-widest">
              / {target}
            </span>
            <span className="text-[9px] text-white/40 mt-1.5 uppercase tracking-wider">
              ট্যাপ করুন
            </span>
          </button>
        </div>

        <div className="text-center mb-3">
          <p className="text-xl sm:text-2xl font-bold text-primary">{Math.round(progress)}%</p>
          <p className="text-[9px] text-base-content/50 uppercase tracking-widest mt-0.5">সম্পন্ন</p>
        </div>

        <div className="grid grid-cols-4 gap-1.5 sm:gap-2">
          <button onClick={decrement} disabled={count === 0} className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-base-100 border border-base-300 hover:border-primary text-base-content/70 hover:text-primary disabled:opacity-30 transition-all active:scale-95">
            <FaMinus size={12} /><span className="text-[9px] sm:text-[10px] font-medium">কমান</span>
          </button>
          <button onClick={reset} disabled={count === 0} className="flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl bg-base-100 border border-base-300 hover:border-primary text-base-content/70 hover:text-primary disabled:opacity-30 transition-all active:scale-95">
            <FaRedo size={12} /><span className="text-[9px] sm:text-[10px] font-medium">রিসেট</span>
          </button>
          <button onClick={() => setSoundEnabled((v) => !v)} className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border transition-all active:scale-95 ${soundEnabled ? 'bg-primary/10 border-primary/40 text-primary' : 'bg-base-100 border-base-300 text-base-content/70'}`}>
            {soundEnabled ? <FaVolumeUp size={12} /> : <FaVolumeMute size={12} />}
            <span className="text-[9px] sm:text-[10px] font-medium">সাউন্ড</span>
          </button>
          <button onClick={() => setShowHistory((v) => !v)} className={`flex flex-col items-center justify-center gap-1 py-2.5 rounded-xl border transition-all active:scale-95 ${showHistory ? 'bg-primary text-white border-primary' : 'bg-base-100 border-base-300 text-base-content/70 hover:text-primary'}`}>
            <FaHistory size={12} /><span className="text-[9px] sm:text-[10px] font-medium">হিস্টোরি</span>
          </button>
        </div>
      </div>

      {/* Settings Toggle */}
      <button
        onClick={() => setShowSettings((v) => !v)}
        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all active:scale-[0.98] mb-3 ${
          showSettings ? 'bg-primary text-white border-primary' : 'bg-base-200 border-base-300 hover:border-primary'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <FaCog size={13} />
          <span className="font-semibold text-sm">জিকির নির্বাচন ({dhikrPresets.length}টি)</span>
        </div>
        {showSettings ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
      </button>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-3 p-3.5 rounded-2xl bg-base-200 border border-base-300 space-y-4">

          {/* Target */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-2">
              🎯 টার্গেট
            </p>
            <div className="flex flex-wrap gap-1.5">
              {targetOptions.map((t) => (
                <button key={t} onClick={() => changeTarget(t)} className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${target === t ? 'bg-primary text-white shadow-md' : 'bg-base-100 border border-base-300 hover:border-primary'}`}>
                  {t}
                </button>
              ))}
              <button onClick={() => setShowCustomInput((v) => !v)} className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all active:scale-95 ${showCustomInput ? 'bg-gold text-white border-gold' : 'bg-base-100 border-dashed border-base-300 hover:border-primary'}`}>
                কাস্টম
              </button>
            </div>
            {showCustomInput && (
              <div className="mt-2.5 flex gap-2">
                <input type="number" value={customTarget} onChange={(e) => setCustomTarget(e.target.value)} placeholder="300" className="flex-1 px-3 py-2 rounded-lg border border-base-300 bg-base-100 text-sm outline-none focus:border-primary" />
                <button
                  onClick={() => {
                    const t = parseInt(customTarget);
                    if (t > 0 && t <= 100000) {
                      changeTarget(t); setCustomTarget(''); setShowCustomInput(false);
                      toast.success(`টার্গেট ${t} সেট হয়েছে`);
                    } else toast.error('১-১০০০০০ এর মধ্যে সংখ্যা দিন');
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-xs sm:text-sm font-medium active:scale-95"
                >সেভ</button>
              </div>
            )}
          </div>

          {/* Search */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-2">
              🔍 জিকির খুঁজুন
            </p>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={11} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম, অর্থ বা সূত্র..."
                className="w-full pl-9 pr-8 py-2.5 rounded-lg border border-base-300 bg-base-100 outline-none focus:border-primary text-xs"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-base-300">
                  <FaTimes size={10} />
                </button>
              )}
            </div>
          </div>

          {/* Category filter */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-2">
              🏷️ ক্যাটাগরি
            </p>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${selectedCategory === 'all' ? 'bg-primary text-white' : 'bg-base-100 border border-base-300 hover:border-primary'}`}
              >
                সব ({dhikrPresets.length})
              </button>
              <button
                onClick={() => setSelectedCategory('favorites')}
                className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all flex items-center gap-1 ${selectedCategory === 'favorites' ? 'bg-gold text-white' : 'bg-base-100 border border-base-300 hover:border-primary'}`}
              >
                <FaHeart size={8} /> প্রিয় ({favorites.length})
              </button>
              {dhikrCategories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-all ${selectedCategory === cat.id ? 'bg-primary text-white' : 'bg-base-100 border border-base-300 hover:border-primary'}`}
                >
                  {cat.icon} {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dhikr list */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-2">
              📿 জিকির নির্বাচন ({filteredDhikr.length})
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[500px] overflow-y-auto pr-1">
              {filteredDhikr.map((d) => (
                <div key={d.id} className="relative group">
                  <button
                    onClick={() => changeDhikr(d.id, d.target)}
                    className={`w-full flex items-start gap-2.5 p-2.5 rounded-xl border text-left transition-all active:scale-[0.98] ${
                      dhikrId === d.id ? `bg-gradient-to-br ${d.color} text-white border-transparent shadow-md` : 'bg-base-100 border-base-300 hover:border-primary'
                    }`}
                  >
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-base shrink-0 ${dhikrId === d.id ? 'bg-white/20' : `bg-gradient-to-br ${d.color} text-white`}`}>
                      {d.icon}
                    </div>
                    <div className="min-w-0 flex-1 pr-6">
                      <p className={`text-[10px] font-arabic mb-0.5 truncate ${dhikrId === d.id ? 'text-white/90' : 'text-primary'}`} dir="rtl">
                        {d.arabic.slice(0, 40)}{d.arabic.length > 40 ? '...' : ''}
                      </p>
                      <p className={`text-[11px] font-semibold truncate ${dhikrId === d.id ? 'text-white' : 'text-base-content'}`}>
                        {d.transliteration}
                      </p>
                      <p className={`text-[9px] truncate ${dhikrId === d.id ? 'text-white/70' : 'text-base-content/60'}`}>
                        ×{d.target} · {d.reference}
                      </p>
                    </div>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(d.id); }}
                    className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all active:scale-90 ${favorites.includes(d.id) ? 'bg-red-500/20 text-red-500' : 'bg-base-200/50 text-base-content/30 hover:text-red-500'}`}
                    aria-label="Favorite"
                  >
                    <FaHeart size={9} />
                  </button>
                </div>
              ))}
            </div>

            {filteredDhikr.length === 0 && (
              <div className="text-center py-6">
                <p className="text-xs text-base-content/50">কোনো জিকির পাওয়া যায়নি</p>
              </div>
            )}
          </div>

          {/* Danger */}
          <div className="pt-3 border-t border-base-300">
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 text-xs font-medium active:scale-95"
            >
              <FaTrash size={11} /> সব ডেটা মুছুন
            </button>
          </div>
        </div>
      )}

      {/* History */}
      {showHistory && (
        <div className="mb-3 p-3.5 rounded-2xl bg-base-200 border border-base-300">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <FaHistory size={11} className="text-primary" /> সম্পন্ন সেশন
            </h3>
            <span className="text-[10px] text-base-content/50">{sessions.length} টি</span>
          </div>
          {sessions.length > 0 ? (
            <div className="space-y-1.5 max-h-72 overflow-y-auto">
              {sessions.slice(0, 15).map((s) => {
                const dhikr = dhikrPresets.find((d) => d.id === s.dhikrId);
                return (
                  <div key={s.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-base-100 border border-base-300">
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${dhikr?.color || 'from-primary to-primary-dark'} flex items-center justify-center text-white text-sm shrink-0`}>
                      {dhikr?.icon || '📿'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-semibold text-base-content truncate">{dhikr?.transliteration || 'Dhikr'}</p>
                      <p className="text-[9px] text-base-content/50">{s.count} / {s.target} · {formatDate(s.completedAt)}</p>
                    </div>
                    <FaCheck size={10} className="text-green-600 shrink-0" />
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-5"><p className="text-[11px] text-base-content/50">এখনো কোনো সেশন সম্পন্ন হয়নি</p></div>
          )}
        </div>
      )}

      {/* Reset confirm */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowResetConfirm(false)} />
          <div className="relative w-full max-w-sm bg-base-100 rounded-2xl shadow-2xl border border-base-300 p-5">
            <div className="text-center mb-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center text-red-600 text-xl mb-2.5"><FaTrash /></div>
              <h3 className="font-bold text-base text-base-content mb-1.5">সব ডেটা মুছবেন?</h3>
              <p className="text-xs text-base-content/60">আপনার সব সেশন, হিস্টোরি ও কাউন্টার মুছে যাবে।</p>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button onClick={() => setShowResetConfirm(false)} className="py-2.5 rounded-xl bg-base-200 border border-base-300 text-xs font-medium hover:border-primary active:scale-95">বাতিল</button>
              <button onClick={() => { resetAll(); setShowResetConfirm(false); toast.success('মুছে ফেলা হয়েছে', { icon: '🗑️' }); }} className="py-2.5 rounded-xl bg-red-500 text-white text-xs font-medium active:scale-95">মুছুন</button>
            </div>
          </div>
        </div>
      )}

      {/* Keyboard hint */}
      <div className="hidden md:block mb-3 p-2.5 rounded-xl bg-base-200 border border-base-300 text-center">
        <p className="text-[10px] text-base-content/50">
          ⌨️ <kbd className="px-1.5 py-0.5 bg-base-300 rounded text-[9px] font-mono">Space</kbd> ট্যাপ ·{' '}
          <kbd className="px-1.5 py-0.5 bg-base-300 rounded text-[9px] font-mono">⌘R</kbd> রিসেট
        </p>
      </div>

      <div className="text-center">
        <Link href="/" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs font-medium active:scale-[0.98]">
          <FaHome size={11} /> হোম
        </Link>
      </div>
    </div>
  );
}
