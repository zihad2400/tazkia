'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/components/providers/LanguageProvider';
import VerseOfDay from '@/components/home/VerseOfDay';
import {
  FaQuran, FaClock, FaCompass, FaHands,
  FaStar, FaCalendar, FaMosque, FaBookOpen,
  FaChevronRight, FaArrowRight,
} from 'react-icons/fa';

export default function HomePage() {
  const { t } = useLanguage();
  const [time, setTime] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTime(new Date());
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchNext = async () => {
      try {
        const today = new Date();
        const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
        const res = await fetch(
          `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=Dhaka&country=Bangladesh&method=1&school=0`
        );
        const json = await res.json();
        if (json.code === 200) setNextPrayer(getNextPrayerData(json.data.timings));
      } catch (err) {}
    };
    fetchNext();
    const interval = setInterval(fetchNext, 60000);
    return () => clearInterval(interval);
  }, []);

  const getNextPrayerData = (timings) => {
    const now = new Date();
    const currentMin = now.getHours() * 60 + now.getMinutes();
    const prayers = [
      { key: 'Fajr', name: 'ফজর', time: timings.Fajr, icon: '🌅' },
      { key: 'Dhuhr', name: 'যোহর', time: timings.Dhuhr, icon: '🌞' },
      { key: 'Asr', name: 'আসর', time: timings.Asr, icon: '🌤️' },
      { key: 'Maghrib', name: 'মাগরিব', time: timings.Maghrib, icon: '🌆' },
      { key: 'Isha', name: 'ইশা', time: timings.Isha, icon: '🌙' },
    ];
    for (const p of prayers) {
      const [h, m] = p.time.split(' ')[0].split(':').map(Number);
      const pMin = h * 60 + m;
      if (pMin > currentMin) {
        const diff = pMin - currentMin;
        return { ...p, formatted: formatTime(p.time), timeLeft: { hours: Math.floor(diff / 60), minutes: diff % 60 } };
      }
    }
    const fajr = prayers[0];
    const [h, m] = fajr.time.split(' ')[0].split(':').map(Number);
    const diff = 24 * 60 - currentMin + h * 60 + m;
    return { ...fajr, formatted: formatTime(fajr.time), timeLeft: { hours: Math.floor(diff / 60), minutes: diff % 60 } };
  };

  const formatTime = (timeStr) => {
    if (!timeStr) return '--:--';
    const [h, m] = timeStr.split(' ')[0].split(':').map(Number);
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${suffix}`;
  };

  const formatBanglaDate = () => {
    if (!time) return '';
    try {
      return time.toLocaleDateString('bn-BD', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) { return ''; }
  };

  const formatClock = () => {
    if (!time) return '--:--:--';
    const h = time.getHours();
    const m = time.getMinutes();
    const s = time.getSeconds();
    const suffix = h >= 12 ? 'PM' : 'AM';
    const h12 = h % 12 || 12;
    return `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')} ${suffix}`;
  };

  const tools = [
    { icon: FaQuran, name: t.alQuran || 'Al-Quran', href: '/quran', desc: 'পড়ুন ও শুনুন', color: 'from-emerald-500 to-teal-700', featured: true },
    { icon: FaClock, name: t.prayerTimes || 'Prayer Times', href: '/prayer', desc: 'নামাজের সময়সূচি', color: 'from-blue-500 to-indigo-700' },
    { icon: FaCompass, name: t.qibla || 'Qibla', href: '/qibla', desc: 'কিবলা দিক', color: 'from-purple-500 to-violet-700' },
    { icon: FaHands, name: t.dua || "Du'a", href: '/duas', desc: 'দৈনন্দিন দুআ', color: 'from-amber-500 to-orange-700' },
    { icon: FaStar, name: t.tasbih || 'Tasbih', href: '/tasbih', desc: 'ডিজিটাল কাউন্টার', color: 'from-rose-500 to-pink-700' },
    { icon: FaCalendar, name: t.calendar || 'Calendar', href: '/calendar', desc: 'হিজরি তারিখ', color: 'from-cyan-500 to-blue-700' },
    { icon: FaBookOpen, name: t.hadith || 'Hadith', href: '/hadith', desc: 'নবীজির বাণী', color: 'from-indigo-500 to-purple-700' },
    { icon: FaMosque, name: t.knowledge_ || 'Knowledge', href: '/articles', desc: 'ইসলামিক আর্টিকেল', color: 'from-teal-500 to-cyan-700' },
  ];

  const stars = [
    { top: '12%', left: '8%', delay: '0s', size: 3 },
    { top: '20%', left: '25%', delay: '0.5s', size: 2 },
    { top: '30%', left: '85%', delay: '1s', size: 3 },
    { top: '15%', left: '60%', delay: '1.5s', size: 2 },
    { top: '70%', left: '15%', delay: '2s', size: 2 },
    { top: '80%', left: '75%', delay: '0.3s', size: 3 },
    { top: '45%', left: '5%', delay: '1.2s', size: 2 },
    { top: '55%', left: '92%', delay: '0.8s', size: 2 },
    { top: '10%', left: '45%', delay: '2.5s', size: 3 },
    { top: '85%', left: '40%', delay: '1.8s', size: 2 },
  ];

  return (
    <div className="islamic-pattern min-h-screen">
      {/* ═══ ADVANCED HERO ═══ */}
      <section className="relative overflow-hidden hero-gradient text-white min-h-[600px] sm:min-h-[700px] lg:min-h-[750px] flex items-center">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="hero-pattern-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] islamic-geometric-bg" />
        </div>

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-orb-1 absolute top-10 left-10 w-64 h-64 sm:w-96 sm:h-96 rounded-full bg-gold/20 blur-3xl" />
          <div className="hero-orb-2 absolute bottom-10 right-10 w-72 h-72 sm:w-[500px] sm:h-[500px] rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="hero-orb-3 absolute top-1/2 left-1/3 w-48 h-48 sm:w-72 sm:h-72 rounded-full bg-teal-300/15 blur-3xl" />
        </div>

        <div className="absolute inset-0 pointer-events-none">
          {stars.map((star, i) => (
            <span key={i} className="hero-star absolute rounded-full bg-gold"
              style={{ top: star.top, left: star.left, width: `${star.size}px`, height: `${star.size}px`, animationDelay: star.delay, boxShadow: '0 0 10px rgba(201, 162, 39, 0.8)' }} />
          ))}
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="text-center mb-6 sm:mb-8 hero-fade-up">
            <p className="font-arabic text-gold hero-arabic-glow text-3xl sm:text-4xl md:text-5xl lg:text-6xl mb-3">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </p>
            <div className="flex items-center justify-center gap-2 opacity-70">
              <span className="w-8 sm:w-12 h-px bg-gold/60" />
              <span className="text-[10px] sm:text-xs text-gold/90 tracking-widest uppercase">In the Name of Allah</span>
              <span className="w-8 sm:w-12 h-px bg-gold/60" />
            </div>
          </div>

          <div className="text-center mb-6 sm:mb-8 hero-fade-up hero-delay-1">
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-3 sm:mb-4 tracking-tight">
              <span className="hero-gradient-text">Assalamu Alaikum</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto leading-relaxed">
              Connect with the Quran. Live with Sunnah. Grow with Faith.
            </p>
          </div>

          <div className="max-w-2xl mx-auto mb-6 sm:mb-8 hero-fade-up hero-delay-2">
            <div className="hero-glass rounded-2xl p-4 sm:p-5 lg:p-6 shadow-2xl">
              <div className="flex items-center justify-between gap-3 mb-4 pb-4 border-b border-white/15 flex-wrap">
                <div className="min-w-0">
                  <p className="text-[10px] text-gold/90 uppercase tracking-widest font-semibold mb-0.5">🇧🇩 Dhaka, Bangladesh</p>
                  <p className="text-[11px] sm:text-xs text-white/80 truncate min-h-[16px]">
                    {mounted ? formatBanglaDate() : '\u00A0'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-mono text-gold tracking-wide min-w-[180px] sm:min-w-[200px]">
                    {mounted ? formatClock() : '--:--:-- --'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-2xl sm:text-3xl shadow-lg hero-pulse-ring shrink-0">
                    {nextPrayer?.icon || '🕌'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gold/90 uppercase tracking-widest font-semibold mb-0.5">পরবর্তী নামাজ</p>
                    <p className="text-base sm:text-lg font-bold truncate">
                      {nextPrayer ? (
                        <>
                          {nextPrayer.name}
                          <span className="text-sm text-white/70 ml-2">{nextPrayer.formatted}</span>
                        </>
                      ) : (
                        <span className="text-white/50">লোড হচ্ছে...</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className="text-[10px] text-gold/90 uppercase tracking-widest font-semibold mb-0.5">বাকি আছে</p>
                  <p className="text-lg sm:text-2xl font-bold font-mono text-gold">
                    {nextPrayer ? (
                      <>
                        {String(nextPrayer.timeLeft.hours).padStart(2, '0')}:
                        {String(nextPrayer.timeLeft.minutes).padStart(2, '0')}
                      </>
                    ) : ('--:--')}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 hero-fade-up hero-delay-3 px-4">
            <Link href="/quran" className="hero-btn-shine group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-gold to-gold-dark hover:from-gold-dark hover:to-gold text-white font-bold rounded-xl shadow-2xl shadow-gold/30 transition-all hover:scale-[1.03] active:scale-[0.98]">
              <FaQuran size={16} />
              <span>Read Quran</span>
              <FaArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/duas" className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3.5 sm:py-4 bg-white/10 hover:bg-white/20 border-2 border-white/30 hover:border-white/50 text-white font-bold rounded-xl backdrop-blur-sm transition-all hover:scale-[1.03] active:scale-[0.98]">
              <FaHands size={16} />
              <span>Explore Du&apos;as</span>
              <FaChevronRight size={12} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="mt-8 sm:mt-12 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-3xl mx-auto hero-fade-up hero-delay-4">
            {[
              { value: '114', label: 'সূরা', sub: 'Surahs' },
              { value: '৬,২৩৬', label: 'আয়াত', sub: 'Verses' },
              { value: '৩৪,০০০+', label: 'হাদিস', sub: 'Hadiths' },
              { value: '৬', label: 'ক্বারী', sub: 'Qaris' },
            ].map((stat) => (
              <div key={stat.label} className="hero-glass rounded-xl p-3 sm:p-4 text-center">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gold mb-0.5">{stat.value}</p>
                <p className="text-[10px] sm:text-xs text-white font-semibold">{stat.label}</p>
                <p className="text-[9px] text-white/60 uppercase tracking-wider">{stat.sub}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 hero-scroll-indicator">
          <div className="flex flex-col items-center gap-1 text-white/60">
            <span className="text-[10px] tracking-widest uppercase">Scroll</span>
            <div className="w-5 h-8 rounded-full border-2 border-white/40 flex justify-center pt-1.5">
              <span className="w-1 h-1.5 rounded-full bg-gold" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ TOOLS GRID ═══ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3">
            <FaStar size={9} />
            Islamic Tools
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-base-content mb-2 sm:mb-3">
            আপনার ইসলামী সহায়ক
          </h2>
          <p className="text-sm sm:text-base text-base-content/60 max-w-2xl mx-auto">
            দৈনন্দিন ইসলামী জীবনের সবকিছু এক জায়গায়
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {tools.map((tool) => {
            const Icon = tool.icon;
            return (
              <Link key={tool.href} href={tool.href}
                className="group relative overflow-hidden card-elevated bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 lg:p-6 transition-all active:scale-[0.98] hover:border-primary">
                <div className={`absolute inset-0 bg-gradient-to-br ${tool.color} opacity-0 group-hover:opacity-5 transition-opacity`} />
                <div className="relative">
                  {tool.featured && (
                    <span className="absolute -top-1 -right-1 text-[8px] px-1.5 py-0.5 rounded-full bg-gold text-white font-bold uppercase">Popular</span>
                  )}
                  <div className={`w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-xl bg-gradient-to-br ${tool.color} flex items-center justify-center text-white text-lg sm:text-xl lg:text-2xl mb-3 sm:mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <Icon />
                  </div>
                  <h3 className="font-bold text-sm sm:text-base text-base-content mb-1">
                    <span className="truncate">{tool.name}</span>
                  </h3>
                  <p className="text-[10px] sm:text-xs text-base-content/60 line-clamp-1 mb-2">{tool.desc}</p>
                  <div className="flex items-center gap-1 text-[10px] text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    <span>দেখুন</span>
                    <FaChevronRight size={8} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* ═══ VERSE OF THE DAY — NEW PREMIUM COMPONENT ═══ */}
      <VerseOfDay />

    </div>
  );
}
