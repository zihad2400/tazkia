'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import {
  FaCompass, FaMapMarkerAlt, FaSearch, FaTimes,
  FaCheckCircle, FaExclamationTriangle, FaInfoCircle,
  FaHome, FaRedo, FaCrosshairs, FaLock, FaChevronDown,
  FaChevronUp, FaMobileAlt,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';
import { bangladeshCities, searchCities } from '@/lib/data/bdCities';
import {
  calculateQiblaDirection,
  calculateDistanceToKaaba,
  normalizeDegrees,
  formatDegrees,
  getDirectionName,
  formatDistance,
} from '@/lib/utils/qibla';

export default function QiblaPage() {
  const [state, setState] = useState({
    status: 'loading',
    location: null,
    error: null,
  });

  const [deviceHeading, setDeviceHeading] = useState(0);
  const [hasCompassSupport, setHasCompassSupport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [calibrationNeeded, setCalibrationNeeded] = useState(false);
  const [manualCity, setManualCity] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const searchRef = useRef(null);

  // ═══ Compute ═══
  const qiblaDirection = state.location
    ? calculateQiblaDirection(state.location.lat, state.location.lng)
    : 0;
  const distance = state.location
    ? calculateDistanceToKaaba(state.location.lat, state.location.lng)
    : 0;
  const qiblaRotation = qiblaDirection - deviceHeading;
  const normalizedRotation = normalizeDegrees(qiblaRotation);

  // ═══ Request location ═══
  const requestLocation = useCallback(() => {
    setState({ status: 'loading', location: null, error: null });

    if (!navigator.geolocation) {
      setState({
        status: 'error',
        location: null,
        error: 'আপনার ব্রাউজার location সমর্থন করে না',
      });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          status: 'ready',
          location: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          },
          error: null,
        });
        toast.success('লোকেশন পাওয়া গেছে', { icon: '📍' });
      },
      (err) => {
        let message = 'লোকেশন পাওয়া যায়নি';
        if (err.code === 1) message = 'লোকেশন permission প্রয়োজন';
        else if (err.code === 2) message = 'GPS signal পাওয়া যায়নি';
        else if (err.code === 3) message = 'লোকেশন request timeout';
        setState({ status: 'error', location: null, error: message });
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  }, []);

  // ═══ Device orientation ═══
  useEffect(() => {
    if (typeof window === 'undefined') return;
    let hasSupport = false;

    if ('DeviceOrientationEvent' in window) {
      hasSupport = true;
      if (typeof DeviceOrientationEvent.requestPermission === 'function') {
        setCalibrationNeeded(true);
      }
    }
    setHasCompassSupport(hasSupport);

    const handleOrientation = (event) => {
      let heading = null;
      if (event.webkitCompassHeading !== undefined) {
        heading = event.webkitCompassHeading;
      } else if (event.alpha !== null && event.alpha !== undefined) {
        heading = 360 - event.alpha;
      }
      if (heading !== null && !isNaN(heading)) {
        setDeviceHeading(normalizeDegrees(heading));
      }
    };

    window.addEventListener('deviceorientationabsolute', handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);

    return () => {
      window.removeEventListener('deviceorientationabsolute', handleOrientation);
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestCompassPermission = async () => {
    try {
      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof DeviceOrientationEvent.requestPermission === 'function'
      ) {
        const permission = await DeviceOrientationEvent.requestPermission();
        if (permission === 'granted') {
          setCalibrationNeeded(false);
          toast.success('কম্পাস চালু হয়েছে', { icon: '🧭' });
        } else {
          toast.error('কম্পাস permission প্রয়োজন');
        }
      }
    } catch (err) {
      toast.error('কম্পাস চালু করা যায়নি');
    }
  };

  // ═══ Click outside ═══
  useEffect(() => {
    const handler = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ═══ Auto-request location ═══
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const selectCity = (city) => {
    setManualCity(city);
    setState({
      status: 'ready',
      location: { lat: city.lat, lng: city.lng, accuracy: null, isManual: true },
      error: null,
    });
    setSearchQuery('');
    setShowDropdown(false);
    setShowCityPicker(false);
    toast.success(`${city.nameBn} সেট হয়েছে`, { icon: '📍' });
  };

  const filteredCities = searchQuery
    ? searchCities(searchQuery)
    : bangladeshCities.slice(0, 20);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6 py-3 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Qibla' }]} showBack={false} />

      {/* ═══ Header ═══ */}
      <div className="text-center mb-4 sm:mb-6">
        <div className="w-12 h-12 sm:w-14 sm:h-14 mx-auto rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg mb-2">
          🧭
        </div>
        <p className="font-arabic text-gold text-lg sm:text-xl mb-1">اتجاه القبلة</p>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary mb-1">
          Qibla Direction
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 px-4">
          কাবা শরীফের দিক নির্ণয়
        </p>
      </div>

      {/* ═══ LOADING ═══ */}
      {state.status === 'loading' && (
        <div className="text-center py-14 sm:py-20">
          <div className="relative w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
            <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin" />
            <FaCompass className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-primary text-2xl sm:text-3xl" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-base-content mb-1.5">
            লোকেশন খোঁজা হচ্ছে...
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 px-4">
            Location permission অনুমতি দিন
          </p>
        </div>
      )}

      {/* ═══ ERROR ═══ */}
      {state.status === 'error' && (
        <div className="text-center py-12 sm:py-16">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-3">
            <FaExclamationTriangle className="text-red-500 text-xl sm:text-2xl" />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-base-content mb-1.5">
            লোকেশন পাওয়া যায়নি
          </h2>
          <p className="text-xs sm:text-sm text-base-content/60 mb-5 px-4">
            {state.error}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-sm mx-auto px-4">
            <button
              onClick={requestLocation}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs sm:text-sm font-medium active:scale-95"
            >
              <FaRedo size={11} />
              আবার চেষ্টা করুন
            </button>
            <button
              onClick={() => setShowCityPicker(true)}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-base-200 border border-base-300 text-xs sm:text-sm font-medium active:scale-95"
            >
              <FaMapMarkerAlt size={11} />
              শহর বেছে নিন
            </button>
          </div>
        </div>
      )}

      {/* ═══ READY ═══ */}
      {state.status === 'ready' && state.location && (
        <>
          {/* Location bar */}
          <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                state.location.isManual ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600' : 'bg-green-100 dark:bg-green-900/30 text-green-600'
              }`}>
                {state.location.isManual ? <FaMapMarkerAlt size={11} /> : <FaCrosshairs size={11} />}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-base-content truncate">
                  {state.location.isManual
                    ? manualCity?.nameBn
                    : 'আপনার অবস্থান'}
                </p>
                <p className="text-[9px] sm:text-[10px] text-base-content/60 font-mono">
                  {state.location.lat.toFixed(3)}°, {state.location.lng.toFixed(3)}°
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <button
                onClick={requestLocation}
                className="p-1.5 rounded-lg bg-base-200 border border-base-300 hover:border-primary text-base-content/60 active:scale-95"
              >
                <FaRedo size={10} />
              </button>
              <button
                onClick={() => setShowCityPicker((v) => !v)}
                className="px-2.5 py-1.5 rounded-lg bg-base-200 border border-base-300 hover:border-primary text-[10px] font-medium active:scale-95"
              >
                <FaMapMarkerAlt size={9} className="inline mr-1" />
                শহর
              </button>
            </div>
          </div>

          {/* City picker */}
          {showCityPicker && (
            <div className="mb-3 p-3 rounded-2xl bg-base-200 border border-base-300">
              <div className="relative" ref={searchRef}>
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={10} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => { setSearchQuery(e.target.value); setShowDropdown(true); }}
                  onFocus={() => setShowDropdown(true)}
                  placeholder="শহর খুঁজুন..."
                  className="w-full pl-8 pr-8 py-2 rounded-lg border border-base-300 bg-base-100 outline-none focus:border-primary text-xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-base-300"
                  >
                    <FaTimes size={9} />
                  </button>
                )}
                {showDropdown && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-base-100 rounded-lg shadow-xl border border-base-300 max-h-52 overflow-y-auto z-30">
                    {filteredCities.length > 0 ? filteredCities.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => selectCity(c)}
                        className="w-full text-left px-3 py-2 hover:bg-primary/10 transition-colors flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0">
                          <p className="font-medium text-base-content truncate">{c.nameBn}</p>
                          <p className="text-[9px] text-base-content/50">{c.name}</p>
                        </div>
                        {manualCity?.name === c.name && (
                          <FaCheckCircle size={10} className="text-primary shrink-0" />
                        )}
                      </button>
                    )) : (
                      <div className="p-3 text-center text-[10px] text-base-content/60">
                        কিছু পাওয়া যায়নি
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* iOS Compass permission */}
          {calibrationNeeded && (
            <div className="mb-3 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 flex items-start gap-2.5">
              <FaLock className="text-blue-600 shrink-0 mt-0.5" size={11} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] font-semibold text-blue-800 dark:text-blue-300 mb-1">
                  কম্পাস permission প্রয়োজন
                </p>
                <button
                  onClick={requestCompassPermission}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-[10px] font-medium active:scale-95"
                >
                  অনুমতি দিন
                </button>
              </div>
            </div>
          )}

          {/* ═══ COMPASS CONTAINER ═══ */}
          <div className="relative bg-gradient-to-br from-primary via-primary-dark to-primary rounded-2xl sm:rounded-3xl p-3 sm:p-6 lg:p-8 mb-4 shadow-2xl overflow-hidden">

            {/* Background orbs */}
            <div className="absolute -top-20 -right-20 w-48 sm:w-64 h-48 sm:h-64 bg-gold/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -left-20 w-48 sm:w-64 h-48 sm:h-64 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
              {/* Mode indicator */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${hasCompassSupport && !calibrationNeeded ? 'bg-green-400 animate-pulse' : 'bg-amber-400'}`} />
                  <span className="text-[9px] sm:text-[10px] text-white/80 uppercase tracking-widest font-semibold">
                    {hasCompassSupport && !calibrationNeeded ? 'Live Compass' : 'Manual Mode'}
                  </span>
                </div>
                <button
                  onClick={requestLocation}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 text-white text-[10px] font-medium active:scale-95"
                >
                  <FaRedo size={9} />
                  Calibrate
                </button>
              </div>

              {/* Direction display */}
              <div className="text-center mb-3">
                <p className="text-[10px] text-gold/80 uppercase tracking-widest font-semibold mb-0.5">
                  কিবলার দিক
                </p>
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gold">
                  {formatDegrees(qiblaDirection)}
                  <span className="text-sm sm:text-base text-white/70 ml-2">
                    {getDirectionName(qiblaDirection)}
                  </span>
                </p>
              </div>

              {/* ═══ COMPASS — Fully Responsive ═══ */}
              <div className="relative w-full max-w-[280px] sm:max-w-[340px] md:max-w-[380px] mx-auto aspect-square my-3">
                {/* Outer glow */}
                <div className="absolute inset-0 rounded-full bg-gold/20 blur-2xl" />

                {/* Outer ring */}
                <div className="absolute inset-0 rounded-full border-2 sm:border-4 border-gold/30" />
                <div className="absolute inset-[3%] rounded-full border border-gold/20" />

                {/* Rotating dial */}
                <div
                  className="absolute inset-[6%] rounded-full bg-white/5 backdrop-blur-sm border border-white/20 shadow-2xl transition-transform duration-100"
                  style={{ transform: `rotate(${-deviceHeading}deg)` }}
                >
                  {/* Cardinal directions */}
                  {[
                    { label: 'N', deg: 0, color: 'text-red-400', size: 'text-base sm:text-lg' },
                    { label: 'E', deg: 90, color: 'text-white/90', size: 'text-sm sm:text-base' },
                    { label: 'S', deg: 180, color: 'text-white/90', size: 'text-sm sm:text-base' },
                    { label: 'W', deg: 270, color: 'text-white/90', size: 'text-sm sm:text-base' },
                  ].map((dir) => (
                    <div
                      key={dir.label}
                      className="absolute top-0 left-1/2 origin-bottom"
                      style={{
                        height: '50%',
                        transform: `translateX(-50%) rotate(${dir.deg}deg)`,
                      }}
                    >
                      <div className="flex flex-col items-center pt-1 sm:pt-2">
                        <span className={`${dir.size} ${dir.color} font-bold leading-none`}>
                          {dir.label}
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Degree ticks */}
                  {Array.from({ length: 36 }).map((_, i) => {
                    const angle = i * 10;
                    const isMajor = i % 9 === 0;
                    const isMedium = i % 3 === 0;
                    return (
                      <div
                        key={i}
                        className="absolute top-0 left-1/2 origin-bottom"
                        style={{
                          height: '50%',
                          transform: `translateX(-50%) rotate(${angle}deg)`,
                        }}
                      >
                        <div
                          className={`${
                            isMajor
                              ? 'w-0.5 sm:w-1 h-3 sm:h-4 bg-gold'
                              : isMedium
                              ? 'w-0.5 h-2 sm:h-3 bg-white/60'
                              : 'w-px h-1 sm:h-1.5 bg-white/30'
                          } rounded-full`}
                        />
                      </div>
                    );
                  })}
                </div>

                {/* Qibla pointer */}
                <div
                  className="absolute inset-0 transition-transform duration-300 ease-out"
                  style={{ transform: `rotate(${qiblaRotation}deg)` }}
                >
                  <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2">
                    <div className="relative flex flex-col items-center">
                      <div className="text-lg sm:text-2xl drop-shadow-lg mb-0.5">🕋</div>
                      <div className="w-0 h-0 border-l-[10px] sm:border-l-[12px] border-l-transparent border-r-[10px] sm:border-r-[12px] border-r-transparent border-b-[16px] sm:border-b-[20px] border-b-gold drop-shadow-lg" />
                      <div className="absolute top-[22px] sm:top-[28px] left-1/2 -translate-x-1/2 w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-gold shadow-lg animate-pulse" />
                    </div>
                  </div>
                </div>

                {/* Center label */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                  <p className="text-[9px] sm:text-[10px] text-white/60 uppercase tracking-widest font-semibold">
                    QIBLA
                  </p>
                  <p className="text-base sm:text-xl font-bold text-gold font-mono">
                    {formatDegrees(qiblaDirection)}
                  </p>
                </div>

                {/* Device needle */}
                <div
                  className="absolute inset-[15%] rounded-full pointer-events-none transition-transform duration-100"
                  style={{ transform: `rotate(${deviceHeading}deg)` }}
                >
                  <div className="absolute -top-0.5 sm:-top-1 left-1/2 -translate-x-1/2 w-1 sm:w-1.5 h-4 sm:h-5 bg-red-500 rounded-full shadow-lg" />
                </div>
              </div>

              {/* Stats grid — 3 columns */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 mt-3">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 border border-white/15 text-center">
                  <p className="text-[8px] sm:text-[9px] text-white/60 uppercase tracking-wider mb-0.5">
                    ডিভাইস
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white font-mono">
                    {hasCompassSupport && !calibrationNeeded ? formatDegrees(deviceHeading) : 'N/A'}
                  </p>
                </div>
                <div className="bg-gold/20 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 border border-gold/30 text-center">
                  <p className="text-[8px] sm:text-[9px] text-gold uppercase tracking-wider mb-0.5">
                    কিবলা
                  </p>
                  <p className="text-sm sm:text-base font-bold text-gold font-mono">
                    {formatDegrees(qiblaDirection)}
                  </p>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-2 sm:p-2.5 border border-white/15 text-center">
                  <p className="text-[8px] sm:text-[9px] text-white/60 uppercase tracking-wider mb-0.5">
                    ঘুরুন
                  </p>
                  <p className="text-sm sm:text-base font-bold text-white font-mono">
                    {hasCompassSupport && !calibrationNeeded ? formatDegrees(normalizedRotation) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Alignment status */}
              {hasCompassSupport && !calibrationNeeded && (
                <div className={`mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-semibold mx-auto w-full justify-center transition-all ${
                  normalizedRotation < 10 || normalizedRotation > 350
                    ? 'bg-green-500/30 border border-green-400/40 text-green-200'
                    : normalizedRotation < 30 || normalizedRotation > 330
                    ? 'bg-amber-500/30 border border-amber-400/40 text-amber-200'
                    : 'bg-white/10 border border-white/20 text-white/80'
                }`}>
                  {normalizedRotation < 10 || normalizedRotation > 350 ? (
                    <>
                      <FaCheckCircle size={10} />
                      কিবলার দিকে মুখ করে আছেন
                    </>
                  ) : normalizedRotation < 30 || normalizedRotation > 330 ? (
                    <>
                      <FaInfoCircle size={10} />
                      প্রায় কাছাকাছি
                    </>
                  ) : (
                    <>
                      <FaCompass size={10} />
                      ফোন ঘুরিয়ে আনুন
                    </>
                  )}
                </div>
              )}

              {/* Mobile / No-compass hint */}
              {(!hasCompassSupport || calibrationNeeded) && (
                <div className="mt-3 flex items-start gap-2 p-2.5 rounded-lg bg-amber-500/15 border border-amber-500/30">
                  <FaMobileAlt size={11} className="text-amber-300 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-amber-100 leading-relaxed">
                    <strong>মোবাইলে কম্পাস চালু করুন</strong> — Device sensors ব্যবহার করে সঠিক দিক পাবেন। এখন Manual mode এ আছেন।
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* ═══ Distance & Accuracy Grid ═══ */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-base-200 border border-base-300 rounded-2xl p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-base-content/50 mb-1.5">
                📍 কাবার দূরত্ব
              </p>
              <p className="text-base sm:text-lg font-bold text-primary font-mono">
                {formatDistance(distance)}
              </p>
            </div>

            <div className="bg-base-200 border border-base-300 rounded-2xl p-3">
              <p className="text-[9px] font-bold uppercase tracking-widest text-base-content/50 mb-1.5">
                🎯 GPS নির্ভুলতা
              </p>
              <p className="text-base sm:text-lg font-bold text-primary font-mono">
                {state.location.accuracy ? `${Math.round(state.location.accuracy)} m` : 'Manual'}
              </p>
            </div>
          </div>

          {/* ═══ Instructions (collapsible) ═══ */}
          <div className="bg-base-200 border border-base-300 rounded-2xl overflow-hidden mb-3">
            <button
              onClick={() => setShowInstructions((v) => !v)}
              className="w-full flex items-center justify-between p-3.5 hover:bg-base-300/30 transition-colors"
            >
              <div className="flex items-center gap-2">
                <FaCompass size={12} className="text-primary" />
                <span className="font-bold text-sm text-base-content">কীভাবে ব্যবহার করবেন</span>
              </div>
              {showInstructions ? <FaChevronUp size={11} /> : <FaChevronDown size={11} />}
            </button>

            {showInstructions && (
              <div className="p-3.5 pt-0 border-t border-base-300">
                <ol className="text-xs text-base-content/70 leading-relaxed space-y-2 mt-3">
                  {[
                    'ফোনটি সমতল করে হাতের তালুতে ধরুন',
                    'ধীরে ধীরে ঘুরান যতক্ষণ সোনালী তীর ১২টার দিকে আসে',
                    'যখন "✅ ঠিক আছে" দেখাবে, আপনি কিবলার দিকে আছেন',
                    'কম্পাস ভুল দেখালে 8-আকৃতিতে ফোন ঘুরান',
                  ].map((step, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="font-bold text-primary shrink-0">{i + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>

          {/* ═══ Tips ═══ */}
          <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-3 mb-4">
            <div className="flex items-start gap-2">
              <FaInfoCircle className="text-amber-600 shrink-0 mt-0.5" size={11} />
              <div className="flex-1 min-w-0">
                <p className="text-[11px] sm:text-xs font-semibold text-amber-800 dark:text-amber-300 mb-1.5">
                  নোট
                </p>
                <ul className="text-[10px] sm:text-xs text-amber-700 dark:text-amber-400 leading-relaxed space-y-1">
                  <li>• ধাতব বস্তু কম্পাসে প্রভাব ফেলে</li>
                  <li>• চুম্বকের কাছে থাকলে সঠিক দেখাবে না</li>
                  <li>• Desktop এ কম্পাস কাজ করে না</li>
                  <li>• iOS এ permission দিতে হবে</li>
                </ul>
              </div>
            </div>
          </div>

          {/* ═══ Actions ═══ */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <button
              onClick={requestLocation}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-primary text-white text-xs font-medium active:scale-95"
            >
              <FaRedo size={10} />
              আবার চেক
            </button>
            <button
              onClick={() => setShowCityPicker((v) => !v)}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs font-medium active:scale-95"
            >
              <FaMapMarkerAlt size={10} />
              শহর পরিবর্তন
            </button>
          </div>

          {/* ═══ Home ═══ */}
          <div className="text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-xs font-medium"
            >
              <FaHome size={11} />
              হোম
            </Link>
          </div>
        </>
      )}
    </div>
  );
}
