'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  FaChevronLeft, FaChevronRight, FaCalendarAlt, FaStar,
  FaMoon, FaMapMarkerAlt, FaClock, FaHome,
  FaSpinner, FaInfoCircle, FaBell,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import { gregorianToHijri } from '@/lib/services/calendarApi';
import {
  hijriMonths, bengaliMonths, islamicEvents,
} from '@/lib/data/islamicEvents';

export default function CalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [hijriData, setHijriData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(null);

  const today = useMemo(() => new Date(), []);

  // ═══ Fetch today's Hijri date ═══
  useEffect(() => {
    const fetchToday = async () => {
      const data = await gregorianToHijri(
        today.getDate(),
        today.getMonth() + 1,
        today.getFullYear()
      );
      if (data) setHijriData(data);
      setLoading(false);
    };
    fetchToday();
  }, [today]);

  const prevMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(null);
  };

  // ═══ Build calendar grid (correct 7-day alignment) ═══
  const calendarGrid = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();

    const grid = [];

    for (let i = 0; i < startDayOfWeek; i++) {
      grid.push({ empty: true, key: `empty-${i}` });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      grid.push({
        empty: false,
        day,
        date,
        isToday:
          day === today.getDate() &&
          month === today.getMonth() &&
          year === today.getFullYear(),
        key: `day-${day}`,
      });
    }

    // Pad to complete last week
    while (grid.length % 7 !== 0) {
      grid.push({ empty: true, key: `empty-end-${grid.length}` });
    }

    return grid;
  }, [currentDate, today]);

  const weekDays = ['রবি', 'সোম', 'মঙ্গল', 'বুধ', 'বৃহঃ', 'শুক্র', 'শনি'];

  const formatGregorianDate = (date) => {
    return `${date.getDate()} ${bengaliMonths[date.getMonth()]} ${date.getFullYear()}`;
  };

  const selectedEvents = useMemo(() => {
    if (!selectedDate?.hijri) return [];
    const h = selectedDate.hijri;
    return islamicEvents.filter(
      (e) => e.hijriMonth === h.month.number && e.hijriDay === parseInt(h.day)
    );
  }, [selectedDate]);

  const handleDayClick = async (dayData) => {
    if (dayData.empty) return;
    setSelectedDate({ ...dayData, hijri: null, loading: true });

    const data = await gregorianToHijri(
      dayData.day,
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    );

    setSelectedDate({ ...dayData, hijri: data?.hijri || null, loading: false });
  };

  const currentHijriMonth = hijriData
    ? hijriMonths.find((m) => m.num === hijriData.hijri.month.number)
    : null;

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Calendar' }]} showBack={false} />

      {/* Header */}
      <div className="text-center mb-4 sm:mb-5">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl sm:text-2xl shadow-xl mb-2">
          📅
        </div>
        <p className="font-arabic text-gold text-lg sm:text-xl mb-0.5">
          التقويم الإسلامي
        </p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
          Islamic Calendar
        </h1>
        <p className="text-xs text-base-content/60">
          হিজরি ও খ্রিস্টীয় ক্যালেন্ডার
        </p>
      </div>

      {/* Today's Hijri Card */}
      {loading ? (
        <div className="h-40 bg-base-200 rounded-2xl animate-pulse mb-4" />
      ) : hijriData ? (
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl p-4 sm:p-5 mb-4 shadow-xl">
          <div className="absolute inset-0 opacity-15 pointer-events-none">
            <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
            <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          </div>

          <div className="relative">
            <div className="flex items-center gap-1.5 mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <p className="text-[10px] text-gold/90 uppercase tracking-widest font-semibold">
                আজকের তারিখ
              </p>
            </div>

            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="min-w-0">
                <p className="font-arabic text-2xl sm:text-3xl text-gold mb-1.5">
                  {hijriData.hijri.day} {hijriData.hijri.month.ar} {hijriData.hijri.year}
                </p>
                <p className="text-sm sm:text-base font-bold mb-0.5">
                  {hijriData.hijri.day} {currentHijriMonth?.name} {hijriData.hijri.year} হিজরি
                </p>
                <p className="text-[11px] sm:text-xs text-white/70">
                  {hijriData.hijri.weekday.en} · {formatGregorianDate(today)}
                </p>
              </div>
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl bg-gold flex items-center justify-center text-xl sm:text-2xl shadow-lg shrink-0">
                🌙
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* ═══ Month Navigation ═══ */}
      <div className="flex items-center justify-between gap-2 mb-3 bg-base-200 border border-base-300 rounded-2xl p-2 sm:p-2.5">
        <button
          onClick={prevMonth}
          className="w-9 h-9 rounded-lg hover:bg-primary/10 flex items-center justify-center text-base-content/70 hover:text-primary transition-colors active:scale-95 shrink-0"
          aria-label="Previous month"
        >
          <FaChevronLeft size={12} />
        </button>

        <div className="text-center flex-1 min-w-0 px-2">
          <p className="text-sm sm:text-base font-bold text-base-content truncate">
            {bengaliMonths[currentDate.getMonth()]} {currentDate.getFullYear()}
          </p>
          <p className="text-[10px] text-base-content/50 truncate">
            {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </p>
        </div>

        <button
          onClick={nextMonth}
          className="w-9 h-9 rounded-lg hover:bg-primary/10 flex items-center justify-center text-base-content/70 hover:text-primary transition-colors active:scale-95 shrink-0"
          aria-label="Next month"
        >
          <FaChevronRight size={12} />
        </button>
      </div>

      {/* Today button */}
      <div className="mb-3 flex justify-center">
        <button
          onClick={goToToday}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary text-[11px] sm:text-xs font-semibold transition-colors active:scale-95"
        >
          <FaCalendarAlt size={10} />
          আজকের তারিখে যান
        </button>
      </div>

      {/* ═══ Calendar Grid — RESPONSIVE FIX ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-2 sm:p-4 mb-4 overflow-hidden">
        {/* Weekday labels */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1 mb-1.5 sm:mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-[9px] sm:text-xs font-bold text-base-content/50 uppercase py-1 truncate"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days grid — fixed 7 columns, consistent cell size */}
        <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
          {calendarGrid.map((cell) => {
            if (cell.empty) {
              return (
                <div
                  key={cell.key}
                  className="aspect-square rounded-md sm:rounded-lg"
                  aria-hidden="true"
                />
              );
            }

            const isSelected = selectedDate?.day === cell.day;

            return (
              <button
                key={cell.key}
                onClick={() => handleDayClick(cell)}
                className={`
                  aspect-square rounded-md sm:rounded-lg
                  flex flex-col items-center justify-center
                  text-[11px] sm:text-sm font-medium
                  transition-all active:scale-95
                  w-full min-w-0
                  ${cell.isToday
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white shadow-md ring-2 ring-gold ring-offset-1 ring-offset-base-200 font-bold'
                    : isSelected
                    ? 'bg-primary/20 text-primary border border-primary font-bold'
                    : 'bg-base-100 hover:bg-primary/10 text-base-content'
                  }
                `}
                aria-label={`${cell.day} ${bengaliMonths[currentDate.getMonth()]}`}
              >
                <span className="leading-none">{cell.day}</span>
                {cell.isToday && (
                  <span className="text-[7px] sm:text-[8px] text-gold/90 leading-none mt-0.5 font-semibold">
                    আজ
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Selected Date Info ═══ */}
      {selectedDate && !selectedDate.empty && (
        <div className="bg-base-200 border border-base-300 rounded-2xl p-4 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
              {selectedDate.loading ? (
                <FaSpinner className="animate-spin" size={14} />
              ) : (
                <FaCalendarAlt size={14} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-base-content mb-1">
                {formatGregorianDate(selectedDate.date)}
              </p>
              {selectedDate.loading ? (
                <p className="text-xs text-base-content/50">হিজরি তারিখ লোড হচ্ছে...</p>
              ) : selectedDate.hijri ? (
                <>
                  <p className="text-xs text-primary font-semibold">
                    {selectedDate.hijri.day}{' '}
                    {hijriMonths.find((m) => m.num === selectedDate.hijri.month.number)?.name}{' '}
                    {selectedDate.hijri.year} হিজরি
                  </p>
                  <p className="text-[10px] text-base-content/50 mt-0.5">
                    {selectedDate.hijri.weekday.en}
                  </p>
                </>
              ) : null}

              {selectedEvents.length > 0 && (
                <div className="mt-2 space-y-1.5">
                  {selectedEvents.map((evt) => (
                    <div
                      key={evt.id}
                      className={`flex items-center gap-2 p-2 rounded-lg bg-gradient-to-r ${evt.color} text-white text-[11px]`}
                    >
                      <span className="text-base shrink-0">{evt.icon}</span>
                      <span className="font-semibold truncate">{evt.title}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ Islamic Events List ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-3 sm:p-4 mb-4">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/60 mb-3 flex items-center gap-2">
          <FaBell size={10} className="text-gold" />
          ইসলামী দিবস ({islamicEvents.length})
        </h2>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {islamicEvents.map((evt) => {
            const month = hijriMonths.find((m) => m.num === evt.hijriMonth);
            return (
              <div
                key={evt.id}
                className="flex items-center gap-2.5 p-2.5 rounded-xl bg-base-100 border border-base-300 hover:border-primary/40 transition-colors"
              >
                <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br ${evt.color} flex items-center justify-center text-white text-base sm:text-lg shrink-0 shadow-sm`}>
                  {evt.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                    <p className="text-xs sm:text-sm font-bold text-base-content truncate">
                      {evt.title}
                    </p>
                    <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold-dark font-semibold shrink-0">
                      {evt.hijriDay} {month?.name}
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-base-content/60 line-clamp-1">
                    {evt.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Hijri Months Grid ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-3 sm:p-4 mb-4">
        <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/60 mb-3 flex items-center gap-2">
          <FaMoon size={10} className="text-primary" />
          হিজরি মাসসমূহ
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {hijriMonths.map((m) => {
            const isCurrent = hijriData?.hijri.month.number === m.num;
            return (
              <div
                key={m.num}
                className={`p-2 sm:p-2.5 rounded-xl border text-center transition-all ${
                  isCurrent
                    ? 'bg-gradient-to-br from-primary to-primary-dark text-white border-transparent shadow-md'
                    : 'bg-base-100 border-base-300'
                }`}
              >
                <p className={`font-arabic text-sm sm:text-base mb-0.5 ${isCurrent ? 'text-gold' : 'text-primary'}`}>
                  {m.nameAr}
                </p>
                <p className={`text-[11px] sm:text-xs font-bold ${isCurrent ? 'text-white' : 'text-base-content'} truncate`}>
                  {m.name}
                </p>
                <p className={`text-[9px] ${isCurrent ? 'text-white/70' : 'text-base-content/50'} truncate`}>
                  {m.nameEn}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* ═══ Info Box ═══ */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 sm:p-4 mb-4">
        <div className="flex items-start gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 shrink-0">
            <FaInfoCircle size={13} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-xs sm:text-sm text-amber-800 dark:text-amber-300 mb-1.5">
              হিজরি ক্যালেন্ডার সম্পর্কে
            </h3>
            <ul className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 leading-relaxed space-y-1">
              <li>• হিজরি সন শুরু হয় রাসূল ﷺ এর হিজরতের বছর থেকে</li>
              <li>• হিজরি মাসের দৈর্ঘ্য ২৯ বা ৩০ দিন — চাঁদ দেখার উপর নির্ভরশীল</li>
              <li>• প্রতি বছর হিজরি সন গ্রেগরিয়ান থেকে ১১ দিন এগিয়ে যায়</li>
            </ul>
          </div>
        </div>
      </div>

      {/* ═══ Quick Actions ═══ */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <Link
          href="/prayer"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-[11px] sm:text-xs font-medium active:scale-95 transition-all"
        >
          <FaClock size={11} />
          নামাজের সময়
        </Link>
        <Link
          href="/qibla"
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-[11px] sm:text-xs font-medium active:scale-95 transition-all"
        >
          <FaMapMarkerAlt size={11} />
          কিবলা
        </Link>
      </div>

      {/* ═══ Home ═══ */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs font-medium active:scale-[0.98]"
        >
          <FaHome size={11} />
          হোম
        </Link>
      </div>
    </div>
  );
}
