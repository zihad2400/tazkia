'use client';

import { useState, useEffect } from 'react';
import { FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import {
  playIslamicBell, playPing, playAdhanStyle, getSoundPrefs, setSoundPrefs,
} from '@/lib/utils/notificationSound';
import { useLanguage } from '@/components/providers/LanguageProvider';
import toast from 'react-hot-toast';

const STYLES = [
  { id: 'bell', label: 'Soft Bell', bn: 'মৃদু ঘণ্টা', ar: 'جرس ناعم', play: playIslamicBell },
  { id: 'ping', label: 'Quick Ping', bn: 'দ্রুত পিং', ar: 'رنة سريعة', play: playPing },
  { id: 'adhan', label: 'Adhan Style', bn: 'আজান স্টাইল', ar: 'نمط الأذان', play: playAdhanStyle },
  { id: 'none', label: 'Silent', bn: 'নীরব', ar: 'صامت', play: null },
];

export default function NotificationSoundPicker() {
  const { lang, t } = useLanguage();
  const [prefs, setPrefs] = useState({ enabled: true, volume: 0.3, style: 'bell' });

  useEffect(() => {
    setPrefs(getSoundPrefs());
  }, []);

  const update = (patch) => {
    const next = { ...prefs, ...patch };
    setPrefs(next);
    setSoundPrefs(next);
  };

  const testSound = (styleId) => {
    if (styleId === 'none') return;
    const s = STYLES.find((x) => x.id === styleId);
    if (s?.play) {
      try { s.play(prefs.volume); } catch (e) {}
    }
  };

  const label = (s) => lang === 'bn' ? s.bn : lang === 'ar' ? s.ar : s.label;

  return (
    <div className="space-y-4">
      {/* Toggle on/off */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => update({ enabled: !prefs.enabled })}
          className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${
            prefs.enabled ? 'bg-primary' : 'bg-base-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-md transition-transform ${
              prefs.enabled ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-base-content flex items-center gap-2">
            {prefs.enabled ? <FaVolumeUp size={12} /> : <FaVolumeMute size={12} />}
            {lang === 'bn' ? 'নোটিফিকেশন সাউন্ড' : lang === 'ar' ? 'صوت الإشعارات' : 'Notification Sound'}
          </p>
          <p className="text-[11px] text-base-content/60 mt-0.5">
            {lang === 'bn' ? 'নতুন notification এলে শব্দ হবে' : lang === 'ar' ? 'تشغيل صوت عند وصول إشعار' : 'Play sound on new notifications'}
          </p>
        </div>
      </div>

      {prefs.enabled && (
        <>
          {/* Style picker */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
              {lang === 'bn' ? 'সাউন্ড স্টাইল' : lang === 'ar' ? 'نمط الصوت' : 'Sound Style'}
            </label>
            <div className="grid grid-cols-2 gap-2">
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => { update({ style: s.id }); testSound(s.id); }}
                  className={`flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl border-2 transition-all active:scale-95 text-left ${
                    prefs.style === s.id
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                  }`}
                >
                  <span className="text-xs font-semibold truncate">{label(s)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Volume slider */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
              {lang === 'bn' ? 'ভলিউম' : lang === 'ar' ? 'مستوى الصوت' : 'Volume'} — {Math.round(prefs.volume * 100)}%
            </label>
            <input
              type="range"
              min="0.05"
              max="1"
              step="0.05"
              value={prefs.volume}
              onChange={(e) => update({ volume: parseFloat(e.target.value) })}
              onMouseUp={() => testSound(prefs.style)}
              onTouchEnd={() => testSound(prefs.style)}
              className="w-full accent-primary"
            />
          </div>
        </>
      )}
    </div>
  );
}
