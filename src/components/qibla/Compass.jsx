'use client';

import { useMemo } from 'react';
import { FaKaaba } from 'react-icons/fa';

export default function Compass({ heading, qiblaDirection, size = 'default' }) {
  // heading: device direction (0=North)
  // qiblaDirection: absolute degrees of Qibla from North

  // Calculate rotation: we want the compass to rotate with device
  // And the Qibla marker to be at the correct angle
  const rotation = heading || 0;
  const qiblaRotation = qiblaDirection || 0;
  const relativeQibla = (qiblaRotation - rotation + 360) % 360;

  // Tick marks (every 15°)
  const ticks = useMemo(() => {
    const arr = [];
    for (let i = 0; i < 72; i++) {
      const angle = i * 5;
      const isMajor = angle % 45 === 0;
      const isMedium = angle % 15 === 0;
      arr.push({ angle, isMajor, isMedium });
    }
    return arr;
  }, []);

  const sizeClasses = {
    sm: 'w-64 h-64 sm:w-72 sm:h-72',
    default: 'w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96',
    lg: 'w-80 h-80 sm:w-96 sm:h-96',
  };

  return (
    <div className={`relative ${sizeClasses[size]} mx-auto`}>
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold/30 via-primary/20 to-gold/30 blur-2xl" />

      {/* Compass bezel */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-gold via-gold-dark to-gold p-[3px] shadow-2xl">
        <div className="w-full h-full rounded-full bg-gradient-to-br from-primary via-primary-dark to-primary relative overflow-hidden">

          {/* Rotating compass face */}
          <div
            className="absolute inset-0 transition-transform duration-200 ease-out"
            style={{ transform: `rotate(${-rotation}deg)` }}
          >
            {/* Tick marks */}
            {ticks.map(({ angle, isMajor, isMedium }, i) => (
              <div
                key={i}
                className="absolute top-0 left-1/2 origin-bottom"
                style={{
                  height: '50%',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                }}
              >
                <div
                  className={`rounded-full ${
                    isMajor
                      ? 'w-0.5 h-4 sm:h-5 bg-gold'
                      : isMedium
                      ? 'w-px h-3 bg-gold/60'
                      : 'w-px h-1.5 bg-gold/30'
                  }`}
                />
              </div>
            ))}

            {/* Cardinal directions */}
            {[
              { label: 'N', angle: 0, color: 'text-red-400' },
              { label: 'E', angle: 90, color: 'text-white' },
              { label: 'S', angle: 180, color: 'text-white' },
              { label: 'W', angle: 270, color: 'text-white' },
            ].map(({ label, angle, color }) => (
              <div
                key={label}
                className="absolute top-0 left-1/2 origin-bottom"
                style={{
                  height: '50%',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                }}
              >
                <div className={`-mt-1 text-xs sm:text-sm font-bold ${color} select-none`}>
                  {label}
                </div>
              </div>
            ))}

            {/* Intermediate directions */}
            {[
              { label: 'NE', angle: 45 },
              { label: 'SE', angle: 135 },
              { label: 'SW', angle: 225 },
              { label: 'NW', angle: 315 },
            ].map(({ label, angle }) => (
              <div
                key={label}
                className="absolute top-0 left-1/2 origin-bottom"
                style={{
                  height: '50%',
                  transform: `translateX(-50%) rotate(${angle}deg)`,
                }}
              >
                <div className="-mt-1 text-[9px] sm:text-[10px] font-semibold text-white/60 select-none">
                  {label}
                </div>
              </div>
            ))}

            {/* Qibla Marker (fixed on compass face relative to North) */}
            <div
              className="absolute top-0 left-1/2 origin-bottom"
              style={{
                height: '50%',
                transform: `translateX(-50%) rotate(${qiblaRotation}deg)`,
              }}
            >
              {/* Kaaba icon above the marker line */}
              <div className="-mt-8 sm:-mt-10 flex flex-col items-center">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center shadow-lg ring-2 ring-white/30">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="currentColor">
                    <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm0 2.2L18 7v2.3l-6 3-6-3V7l6-2.8zM6 11l6 3 6-3v6.8l-6 3-6-3V11z"/>
                  </svg>
                </div>
              </div>

              {/* Marker line */}
              <div className="w-0.5 h-6 sm:h-8 mx-auto bg-gradient-to-b from-gold to-transparent" />
            </div>
          </div>

          {/* Static center dot with needle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            {/* North needle */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28">
              {/* Fixed indicator - top of compass (device direction) */}
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 transition-transform duration-200"
                style={{ transform: `translateX(-50%) rotate(${relativeQibla}deg)`, transformOrigin: 'center bottom', bottom: '50%', height: '50%' }}
              >
                <div className="w-1.5 h-10 sm:h-12 bg-gradient-to-b from-gold via-gold-dark to-transparent rounded-t-full shadow-lg" />
                <div className="w-3 h-3 bg-gold rounded-full -mt-1 mx-auto shadow-lg" />
              </div>

              {/* Center cap */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-gradient-to-br from-gold to-gold-dark border-2 border-white shadow-xl" />
            </div>
          </div>

          {/* Center info text */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
            <div className="mt-16 sm:mt-20 text-center">
              <p className="text-[10px] text-white/50 uppercase tracking-widest">Qibla</p>
              <p className="text-lg sm:text-2xl font-bold text-gold font-mono">
                {Math.round(qiblaDirection || 0)}°
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Top indicator (device direction) */}
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <div className="w-0 h-0 border-l-[10px] border-l-transparent border-r-[10px] border-r-transparent border-t-[14px] border-t-gold drop-shadow-lg" />
      </div>
    </div>
  );
}
