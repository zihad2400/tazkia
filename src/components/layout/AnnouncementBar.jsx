'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaMoon, FaCalendarAlt, FaChevronRight } from 'react-icons/fa';
import { useLanguage } from '@/components/providers/LanguageProvider';
import {
  formatHijri,
  getNextIslamicEvent,
  isRamadan,
  getRamadanDay,
  getUserLocation,
} from '@/lib/utils/hijri';

export default function AnnouncementBar() {
  const { lang } = useLanguage();
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState(new Date());
  
  // Mounted check (avoid SSR mismatch)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Auto update every minute
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(iv);
  }, []);

  // Compute dynamic data (only on client)
  const data = useMemo(() => {
    if (!mounted) {
      return {
        hijriDate: '',
        ramadan: false,
        ramadanDay: 0,
        location: { city: 'Dhaka', cityBn: 'ঢাকা', cityAr: 'دكا' },
        nextEvent: null,
      };
    }
    return {
      hijriDate: formatHijri(now, lang),
      ramadan: isRamadan(now),
      ramadanDay: getRamadanDay(now),
      location: getUserLocation(),
      nextEvent: getNextIslamicEvent(now),
    };
  }, [mounted, now, lang]);

    const getCityName = () => {
    if (lang === 'bn') return data.location.cityBn || data.location.city;
    if (lang === 'ar') return data.location.cityAr || data.location.city;
    return data.location.city;
  };

  // ═══ Determine what to show ═══
  const getBannerContent = () => {
    // Priority 1: Ramadan
    if (data.ramadan) {
      return {
        icon: <FaMoon size={10} className="text-gold" />,
        text: lang === 'bn'
          ? `রমজান মুবারক — ${data.ramadanDay}তম দিন — রমজান গাইড দেখুন`
          : lang === 'ar'
          ? `رمضان مبارك — اليوم ${data.ramadanDay} — استكشف دليل رمضان`
          : `Ramadan Mubarak — Day ${data.ramadanDay} — Explore the Ramadan Guide`,
        link: '/ramadan',
      };
    }

    // Priority 2: Next event within 7 days
    if (data.nextEvent && data.nextEvent.daysAway <= 7) {
      const name = data.nextEvent.name[lang] || data.nextEvent.name.en;
      return {
        icon: <FaCalendarAlt size={10} className="text-gold" />,
        text: lang === 'bn'
          ? `${name} ${data.nextEvent.daysAway} দিন পরে — প্রস্তুতি নিন`
          : lang === 'ar'
          ? `${name} خلال ${data.nextEvent.daysAway} أيام — استعد`
          : `${name} in ${data.nextEvent.daysAway} days — Prepare`,
        link: '/calendar',
      };
    }

    // Priority 3: Next event within 30 days
    if (data.nextEvent && data.nextEvent.daysAway <= 30) {
      const name = data.nextEvent.name[lang] || data.nextEvent.name.en;
      return {
        icon: <FaCalendarAlt size={10} className="text-gold" />,
        text: lang === 'bn'
          ? `${name} — ${data.nextEvent.daysAway} দিন বাকি`
          : lang === 'ar'
          ? `${name} — ${data.nextEvent.daysAway} يوماً`
          : `${name} — ${data.nextEvent.daysAway} days away`,
        link: '/calendar',
      };
    }

    // Priority 4: Generic welcome / event banner
    const name = data.nextEvent?.name[lang] || data.nextEvent?.name.en || '';
    return {
      icon: <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />,
      text: lang === 'bn'
        ? `${name} — ক্যালেন্ডার দেখুন`
        : lang === 'ar'
        ? `${name} — عرض التقويم`
        : `${name} — View Calendar`,
      link: '/calendar',
    };
  };

  if (!mounted) return null;

  const banner = getBannerContent();

  return (
    <div className="bg-gradient-to-r from-primary via-primary-dark to-primary text-white pointer-events-auto relative">

      {/* Desktop view */}
      <div className="hidden lg:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-4 text-xs">

          {/* Left — Dynamic event */}
          <Link
            href={banner.link}
            className="flex items-center gap-2 hover:text-gold transition-colors group min-w-0"
          >
            {banner.icon}
            <span className="text-white/90 truncate">{banner.text}</span>
            <FaChevronRight
              size={8}
              className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
            />
          </Link>

          {/* Right — Location + Hijri date */}
          <div className="flex items-center gap-4 text-white/80 shrink-0">
            <span className="flex items-center gap-1.5">
              <FaMapMarkerAlt size={10} />
              {getCityName()}
            </span>
            <span className="text-gold">•</span>
            <span className="flex items-center gap-1.5">
              <FaMoon size={9} />
              {data.hijriDate}
            </span>
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className="lg:hidden">
        <div className="px-3 py-2 flex items-center justify-between gap-2 text-[11px]">
          <Link
            href={banner.link}
            className="flex items-center gap-1.5 hover:text-gold transition-colors min-w-0 flex-1"
          >
            {banner.icon}
            <span className="text-white/90 truncate">{banner.text}</span>
          </Link>

          <div className="flex items-center gap-2 text-white/70 shrink-0">
            <span>{getCityName()}</span>
            <span className="text-gold">•</span>
            <span className="truncate max-w-[80px]">{data.hijriDate}</span>
          </div>
        </div>
      </div>

          </div>
  );
}
