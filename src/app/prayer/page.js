'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import {
  FaMapMarkerAlt, FaSearch, FaTimes, FaCompass, FaCog,
  FaCheckCircle, FaArrowRight, FaInfoCircle, FaHome,
  FaSun, FaMoon, FaChevronDown, FaChevronUp, FaRedo,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import PrayerIcon from '@/components/prayer/PrayerIcon';
import toast from 'react-hot-toast';
import { bangladeshCities, searchCities } from '@/lib/data/bdCities';
import {
  getPrayerTimesByCoords,
  getPrayersList,
  getNextPrayer,
  getCurrentPrayer,
  calculationMethods,
  madhabs,
  DEFAULT_METHOD,
  DEFAULT_MADHAB,
} from '@/lib/services/prayerApi';

export default function PrayerPage() {
  const [city, setCity] = useState(bangladeshCities[0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [method, setMethod] = useState(DEFAULT_METHOD);
  const [madhhab, setMadhhab] = useState(DEFAULT_MADHAB);
  const [use24Hour, setUse24Hour] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [now, setNow] = useState(new Date());
  const searchRef = useRef(null);

  // Live clock
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  // Load settings
  useEffect(() => {
    try {
      const saved = localStorage.getItem('prayer-settings');
      if (saved) {
        const s = JSON.parse(saved);
        if (s.cityName) {
          const found = bangladeshCities.find((c) => c.name === s.cityName);
          if (found) setCity(found);
        }
        if (s.method) setMethod(s.method);
        if (s.madhhab !== undefined) setMadhhab(s.madhhab);
        if (typeof s.use24Hour === 'boolean') setUse24Hour(s.use24Hour);
      }
    } catch (e) {}
  }, []);

  // Save settings
  useEffect(() => {
    try {
      localStorage.setItem(
        'prayer-settings',
        JSON.stringify({ cityName: city.name, method, madhhab, use24Hour })
      );
    } catch (e) {}
  }, [city, method, madhhab, use24Hour]);

  // Fetch
  const fetchTimes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPrayerTimesByCoords(city.lat, city.lng, { method, school: madhhab });
      setData(result);
    } catch (err) {
      console.error(err);
      setError('নামাজের সময় লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  }, [city, method, madhhab]);

  useEffect(() => {
    fetchTimes();
  }, [fetchTimes]);

  // Click outside
  useEffect(() => {
    const h = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) setShowDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const prayers = data ? getPrayersList(data.timings, use24Hour) : [];
  const nextPrayer = data ? getNextPrayer(data.timings) : null;
  const currentPrayer = data ? getCurrentPrayer(data.timings) : null;

  const filteredCities = searchQuery ? searchCities(searchQuery) : bangladeshCities.slice(0, 12);

  const formatClock = () => {
    const h = now.getHours();
    const m = now.getMinutes();
    const s = now.getSeconds();
    if (use24Hour) return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${suffix}`;
  };

  const formatBanglaDate = () =>
    now.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const formatHijriDate = () => {
    if (!data) return '';
    const h = data.date.hijri;
    return `${h.day} ${h.month.en} ${h.year} AH`;
  };

  const selectedMadhab = madhabs.find((m) => m.id === madhhab);
  const selectedMethod = calculationMethods.find((m) => m.id === method);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-10 pb-24">
      <Breadcrumb items={[{ label: 'Prayer Times' }]} showBack={false} />

      {/* Header */}
      <div className="text-center mb-5 sm:mb-8">
        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl mb-3">
          🕌
        </div>
        <p className="font-arabic text-gold text-xl sm:text-2xl mb-1.5">أوقات الصلاة</p>
        <h1 className="text-xl sm:text-2xl md:text-4xl font-bold text-primary mb-1.5">
          Prayer Times
        </h1>
        <p className="text-xs sm:text-base text-base-content/60">
          নামাজের সময়সূচি · নির্ভুল ও প্রমাণিত
        </p>
      </div>

      {/* Search Bar */}
      <div className="relative mb-4" ref={searchRef}>
        <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-base-content/40 z-10" size={13} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          placeholder="শহর বা জেলা খুঁজুন..."
          className="w-full pl-9 sm:pl-11 pr-10 py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-base-300 text-base-content/60"
          >
            <FaTimes size={11} />
          </button>
        )}

        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-base-100 rounded-xl shadow-2xl border border-base-300 max-h-72 overflow-y-auto z-20">
            {filteredCities.length > 0 ? (
              <>
                <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-base-content/40 sticky top-0 bg-base-100 backdrop-blur">
                  {searchQuery ? `ফলাফল (${filteredCities.length})` : 'জনপ্রিয় শহর'}
                </p>
                {filteredCities.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setCity(c);
                      setSearchQuery('');
                      setShowDropdown(false);
                      toast.success(`${c.nameBn} সিলেক্ট হয়েছে`);
                    }}
                    className={`w-full text-left px-3 sm:px-4 py-2.5 hover:bg-primary/10 transition-colors flex items-center justify-between gap-2 ${
                      city.name === c.name ? 'bg-primary/10' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <FaMapMarkerAlt size={10} className={city.name === c.name ? 'text-primary' : 'text-base-content/40'} />
                      <div className="min-w-0">
                        <p className={`text-sm font-medium truncate ${city.name === c.name ? 'text-primary' : 'text-base-content'}`}>
                          {c.nameBn}
                        </p>
                        <p className="text-[10px] text-base-content/50 truncate">
                          {c.name} · {c.division}
                        </p>
                      </div>
                    </div>
                    {city.name === c.name && <FaCheckCircle size={12} className="text-primary shrink-0" />}
                  </button>
                ))}
              </>
            ) : (
              <div className="p-6 text-center">
                <p className="text-sm text-base-content/60">কোনো শহর পাওয়া যায়নি</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Location + Settings Row */}
      <div className="mb-4 flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-base-200 border border-base-300 min-w-0">
          <FaMapMarkerAlt className="text-primary shrink-0" size={11} />
          <span className="text-xs sm:text-sm font-medium text-base-content truncate">
            {city.nameBn}, BD
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={fetchTimes}
            className="p-2 rounded-lg bg-base-200 border border-base-300 hover:border-primary text-base-content/60 hover:text-primary transition-colors"
            aria-label="Refresh"
          >
            <FaRedo size={11} />
          </button>
          <button
            onClick={() => setShowSettings((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium transition-colors ${
              showSettings ? 'bg-primary text-white border-primary' : 'bg-base-200 border-base-300 hover:border-primary'
            }`}
          >
            <FaCog size={11} />
            সেটিংস
            {showSettings ? <FaChevronUp size={9} /> : <FaChevronDown size={9} />}
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="mb-4 p-4 rounded-2xl bg-base-200 border border-base-300 space-y-4">
          {/* Method */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-2 block">
              হিসাব পদ্ধতি
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(parseInt(e.target.value))}
              className="w-full px-3 py-2.5 rounded-lg border border-base-300 bg-base-100 text-sm text-base-content outline-none focus:border-primary"
            >
              {calculationMethods.map((m) => (
                <option key={m.id} value={m.id}>{m.nameBn}</option>
              ))}
            </select>
          </div>

          {/* Madhab — Salafi + Hanafi */}
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-2 block">
              মাযহাব (আসর সময়ের জন্য)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {madhabs.map((m) => (
                <button
                  key={m.id}
                  onClick={() => setMadhhab(m.id)}
                  className={`text-left p-3 rounded-xl border transition-all ${
                    madhhab === m.id
                      ? 'bg-primary text-white border-primary shadow-md'
                      : 'bg-base-100 border-base-300 hover:border-primary'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-sm font-bold">
                      {m.shortBn || m.nameBn}
                    </span>
                    {madhhab === m.id && <FaCheckCircle size={12} />}
                  </div>
                  <p className={`text-[10px] leading-relaxed ${madhhab === m.id ? 'text-white/80' : 'text-base-content/60'}`}>
                    {m.description}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-[10px] text-base-content/50 mt-2 flex items-start gap-1.5">
              <FaInfoCircle size={9} className="mt-0.5 shrink-0" />
              <span>
                <strong>সালাফি মানহাজ:</strong> আসর এর সময় ছায়া বস্তুর সমান হলে (Shafi/Maliki/Hanbali)।
              </span>
            </p>
          </div>

          {/* 24-hour */}
          <label className="flex items-center justify-between p-3 rounded-lg bg-base-100 border border-base-300 cursor-pointer">
            <span className="text-sm text-base-content">২৪-ঘণ্টা ফরম্যাট</span>
            <input
              type="checkbox"
              checked={use24Hour}
              onChange={(e) => setUse24Hour(e.target.checked)}
              className="toggle toggle-primary toggle-sm"
            />
          </label>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          <div className="h-40 bg-base-200 rounded-2xl animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
            {[1, 2, 3, 4, 5, 6, 7].map((i) => (
              <div key={i} className="h-32 bg-base-200 rounded-2xl animate-pulse" />
            ))}
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-4">
            <FaInfoCircle className="text-red-500 text-2xl" />
          </div>
          <p className="text-sm text-base-content/60 mb-4">{error}</p>
          <button
            onClick={fetchTimes}
            className="px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
          >
            আবার চেষ্টা করুন
          </button>
        </div>
      ) : data ? (
        <>
          {/* Hero — Current Time + Next Prayer */}
          <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-5 shadow-xl">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
            </div>

            <div className="relative space-y-4">
              {/* Location + Time Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <FaMapMarkerAlt className="text-gold shrink-0" size={11} />
                    <span className="text-sm sm:text-base font-semibold">{city.nameBn}</span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-white/70">{formatBanglaDate()}</p>
                  <p className="text-[10px] sm:text-xs text-gold/90 mt-0.5">🌙 {formatHijriDate()}</p>
                </div>
                <div className="sm:text-right">
                  <p className="text-[10px] text-white/60 uppercase tracking-widest mb-1">
                    বর্তমান সময়
                  </p>
                  <p className="text-2xl sm:text-3xl font-bold font-mono text-gold">
                    {formatClock()}
                  </p>
                </div>
              </div>

              {/* Next Prayer */}
              {nextPrayer && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 sm:p-4">
                  <div className="flex items-center justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gold flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0">
                        <PrayerIcon prayerKey={nextPrayer.key} size="lg" isNext={true} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[9px] sm:text-[10px] text-white/60 uppercase tracking-widest">
                          পরবর্তী নামাজ
                        </p>
                        <p className="text-base sm:text-xl font-bold truncate">{nextPrayer.name}</p>
                        <p className="text-[11px] sm:text-xs text-white/70 font-arabic" dir="rtl">
                          {nextPrayer.arabic}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[9px] sm:text-[10px] text-white/60 uppercase tracking-widest mb-1">
                        বাকি আছে
                      </p>
                      <p className="text-xl sm:text-3xl font-bold font-mono text-gold">
                        {String(nextPrayer.hoursLeft).padStart(2, '0')}:
                        {String(nextPrayer.minsLeft).padStart(2, '0')}
                      </p>
                      <p className="text-[9px] text-white/60 mt-0.5">ঘণ্টা : মিনিট</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prayer Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-3 mb-4 sm:mb-5">
            {prayers.map((p) => {
              const isNext = nextPrayer?.key === p.key;
              const isCurrent = currentPrayer?.key === p.key && !isNext;

              return (
                <div
                  key={p.key}
                  className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-3 sm:p-4 border transition-all ${
                    isNext
                      ? 'bg-gradient-to-br from-gold/20 to-gold/5 border-gold shadow-lg ring-2 ring-gold/30'
                      : isCurrent
                      ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/40'
                      : 'bg-base-200 border-base-300 hover:border-primary/40'
                  }`}
                >
                  {isNext && (
                    <span className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded-full bg-gold text-white font-bold uppercase tracking-wider">
                      Next
                    </span>
                  )}
                  {isCurrent && (
                    <span className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded-full bg-primary text-white font-bold uppercase tracking-wider">
                      Now
                    </span>
                  )}

                  <PrayerIcon prayerKey={p.key} size="md" isNext={isNext} isCurrent={isCurrent} />
                  <p className={`text-xs sm:text-sm font-bold mb-0.5 ${
                    isNext ? 'text-gold-dark' : isCurrent ? 'text-primary' : 'text-base-content'
                  }`}>
                    {p.name}
                  </p>
                  <p className="text-[10px] text-base-content/50 mb-1">{p.nameEn}</p>
                  <p className="font-arabic text-xs sm:text-sm text-primary/70 mb-1.5" dir="rtl">
                    {p.arabic}
                  </p>
                  <p className={`text-sm sm:text-lg font-bold font-mono ${
                    isNext ? 'text-gold-dark' : isCurrent ? 'text-primary' : 'text-base-content'
                  }`}>
                    {p.formatted}
                  </p>
                  {!p.isPrayer && (
                    <p className="text-[8px] sm:text-[9px] text-base-content/40 mt-1 italic">
                      (নামাজ নয়)
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {/* Extra Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 sm:mb-5">
            {/* Sun */}
            <div className="bg-base-200 border border-base-300 rounded-2xl p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-3 flex items-center gap-2">
                <FaSun size={11} className="text-amber-500" />
                সূর্য তথ্য
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-base-content/60">সূর্যোদয়</span>
                  <span className="font-mono font-semibold text-base-content">
                    {prayers.find((p) => p.key === 'Sunrise')?.formatted}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-base-content/60">সূর্যাস্ত</span>
                  <span className="font-mono font-semibold text-base-content">
                    {prayers.find((p) => p.key === 'Sunset')?.formatted}
                  </span>
                </div>
              </div>
            </div>

            {/* Qibla */}
            <div className="bg-base-200 border border-base-300 rounded-2xl p-4">
              <h3 className="text-[10px] font-bold uppercase tracking-widest text-base-content/60 mb-3 flex items-center gap-2">
                <FaCompass size={11} className="text-primary" />
                কিবলা দিক
              </h3>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] text-base-content/60">দিক (ডিগ্রি)</p>
                  <p className="font-mono font-bold text-base-content text-lg">
                    {data?.meta?.qibla || '--'}°
                  </p>
                </div>
                <Link
                  href="/qibla"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-white text-xs font-medium active:scale-95"
                >
                  দেখুন <FaArrowRight size={9} />
                </Link>
              </div>
            </div>
          </div>

          {/* Info Footer */}
          <div className="bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 mb-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <FaInfoCircle size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-sm text-base-content mb-2">
                  ⚡ নির্ভুলতা সম্পর্কে
                </h3>
                <ul className="text-[11px] sm:text-xs text-base-content/70 leading-relaxed space-y-1">
                  <li>
                    • <strong>হিসাব পদ্ধতি:</strong> {selectedMethod?.nameBn || 'Karachi'}
                  </li>
                  <li>
                    • <strong>মাযহাব (আসর):</strong>{' '}
                    {selectedMadhab?.shortBn || selectedMadhab?.nameBn || 'সালাফি / হানাফি'}
                  </li>
                  <li>
                    • <strong>ডেটা সোর্স:</strong> Aladhan API (বিশ্ববিখ্যাত)
                  </li>
                  <li className="break-all">
                    • <strong>কোঅর্ডিনেট:</strong> {city.lat.toFixed(4)}, {city.lng.toFixed(4)}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3">
            <Link
              href="/qibla"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs sm:text-sm font-medium active:scale-[0.98]"
            >
              <FaCompass size={12} />
              কিবলা
            </Link>
            <Link
              href="/tasbih"
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs sm:text-sm font-medium active:scale-[0.98]"
            >
              ✨ তাসবিহ
            </Link>
          </div>

          {/* Home */}
          <div className="mt-4 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium"
            >
              <FaHome size={12} />
              হোম
            </Link>
          </div>
        </>
      ) : null}
    </div>
  );
}
