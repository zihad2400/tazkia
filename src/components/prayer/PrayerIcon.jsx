'use client';

import { WiSunrise, WiSunset, WiDaySunny, WiNightClear } from 'react-icons/wi';
import { FaCloudSun } from 'react-icons/fa';

const ICON_CONFIG = {
  Fajr: {
    Icon: WiSunrise,
    gradient: 'from-blue-500 via-indigo-500 to-purple-600',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    animation: 'sunrise',
  },
  Sunrise: {
    Icon: WiSunrise,
    gradient: 'from-amber-400 via-orange-500 to-red-500',
    glowColor: 'rgba(251, 191, 36, 0.4)',
    animation: 'sunrise',
  },
  Dhuhr: {
    Icon: WiDaySunny,
    gradient: 'from-yellow-400 via-amber-500 to-orange-500',
    glowColor: 'rgba(251, 191, 36, 0.5)',
    animation: 'pulse',
  },
  Asr: {
    Icon: FaCloudSun,
    gradient: 'from-orange-400 via-amber-600 to-yellow-600',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    animation: 'drift',
  },
  Sunset: {
    Icon: WiSunset,
    gradient: 'from-orange-500 via-red-500 to-pink-600',
    glowColor: 'rgba(239, 68, 68, 0.4)',
    animation: 'sunset',
  },
  Maghrib: {
    Icon: WiSunset,
    gradient: 'from-rose-500 via-orange-600 to-red-700',
    glowColor: 'rgba(244, 63, 94, 0.5)',
    animation: 'sunset',
  },
  Isha: {
    Icon: WiNightClear,
    gradient: 'from-indigo-600 via-purple-700 to-slate-900',
    glowColor: 'rgba(79, 70, 229, 0.5)',
    animation: 'twinkle',
  },
};

export default function PrayerIcon({ prayerKey, size = 'md', isNext = false, isCurrent = false }) {
  const config = ICON_CONFIG[prayerKey] || ICON_CONFIG.Dhuhr;
  const Icon = config.Icon;

  const sizeClasses = {
    sm: 'w-10 h-10 sm:w-11 sm:h-11',
    md: 'w-12 h-12 sm:w-14 sm:h-14',
    lg: 'w-14 h-14 sm:w-16 sm:h-16',
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28,
  };

  return (
    <div className={`relative ${sizeClasses[size]}`}>
      {(isNext || isCurrent) && (
        <div
          className="absolute inset-0 rounded-xl animate-pulse"
          style={{
            background: config.glowColor,
            filter: 'blur(12px)',
            transform: 'scale(1.15)',
          }}
        />
      )}

      <div
        className={`
          relative w-full h-full rounded-xl
          bg-gradient-to-br ${config.gradient}
          flex items-center justify-center
          text-white shadow-lg
          transition-all duration-500
          ${isNext ? 'prayer-icon-active' : ''}
          ${isCurrent ? 'prayer-icon-current' : ''}
          ${config.animation === 'pulse' ? 'prayer-icon-pulse' : ''}
          ${config.animation === 'sunrise' ? 'prayer-icon-sunrise' : ''}
          ${config.animation === 'sunset' ? 'prayer-icon-sunset' : ''}
          ${config.animation === 'twinkle' ? 'prayer-icon-twinkle' : ''}
          ${config.animation === 'drift' ? 'prayer-icon-drift' : ''}
        `}
      >
        <Icon size={iconSizes[size]} className="drop-shadow-md" />

        {prayerKey === 'Isha' && (
          <>
            <span className="absolute top-1.5 right-1.5 w-1 h-1 bg-white rounded-full animate-ping" />
            <span
              className="absolute bottom-2 left-1.5 w-0.5 h-0.5 bg-white rounded-full animate-ping"
              style={{ animationDelay: '0.5s' }}
            />
          </>
        )}

        {prayerKey === 'Dhuhr' && (
          <span className="absolute inset-0 rounded-xl animate-ping opacity-20 bg-amber-400" />
        )}
      </div>
    </div>
  );
}
