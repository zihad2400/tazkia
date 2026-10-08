'use client';

import { useState } from 'react';
import {
  FaCog, FaTimes, FaFont, FaVolumeUp,
  FaLanguage, FaEye, FaCheckCircle, FaStar,
} from 'react-icons/fa';
import { qaris, translations } from '@/lib/data/qaris';

export default function QuranControls({
  qari, setQari,
  translation, setTranslation,
  fontSize, setFontSize,
  showWordByWord, setShowWordByWord,
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-24 lg:bottom-8 right-3 sm:right-4 lg:right-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-br from-primary to-primary-dark text-white shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
        aria-label="Quran settings"
      >
        <FaCog size={18} />
      </button>

      {open && (
        <div className="fixed inset-0 z-[110] flex items-end lg:items-center justify-end">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full lg:w-96 lg:mr-8 lg:rounded-2xl rounded-t-3xl bg-base-100 shadow-2xl border border-base-300 max-h-[88vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-base-100 flex items-center justify-between p-4 border-b border-base-300">
              <div className="flex items-center gap-2">
                <FaCog className="text-primary" size={16} />
                <h3 className="font-bold text-base-content">Quran Settings</h3>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg hover:bg-primary/10 text-base-content active:scale-95"
              >
                <FaTimes size={16} />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* Qari */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/60 mb-3">
                  <FaVolumeUp size={11} />
                  Reciter ({qaris.length})
                </label>
                <div className="space-y-2">
                  {qaris.map((q) => {
                    const isSelected = qari === q.id;
                    return (
                      <button
                        key={q.id}
                        onClick={() => setQari(q.id)}
                        className={`w-full text-left p-3 rounded-xl border transition-all active:scale-[0.98] ${
                          isSelected
                            ? 'border-primary bg-primary/10 shadow-sm'
                            : 'border-base-300 hover:border-primary/40 bg-base-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <p className={`text-sm font-bold truncate ${isSelected ? 'text-primary' : 'text-base-content'}`}>
                                {q.name}
                              </p>
                              {q.featured && (
                                <span className="inline-flex items-center gap-1 text-[9px] px-1.5 py-0.5 rounded-full bg-gold/20 text-gold-dark font-bold uppercase tracking-wider shrink-0">
                                  <FaStar size={7} />
                                  Popular
                                </span>
                              )}
                              {isSelected && !q.featured && (
                                <FaCheckCircle className="text-primary shrink-0" size={12} />
                              )}
                            </div>
                            <p className="text-[10px] text-base-content/60 mt-0.5">
                              {q.country} · {q.style}
                            </p>
                          </div>
                          <span className="font-arabic text-base text-primary/70 shrink-0">
                            {q.nameAr}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Translation */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/60 mb-3">
                  <FaLanguage size={11} />
                  Translation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {translations.map((tr) => (
                    <button
                      key={tr.id}
                      onClick={() => setTranslation(tr.id)}
                      className={`p-3 rounded-xl border text-sm font-medium transition-all active:scale-95 ${
                        translation === tr.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-base-300 hover:border-primary/40 bg-base-200 text-base-content'
                      }`}
                    >
                      {tr.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div>
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-base-content/60 mb-3">
                  <FaFont size={11} />
                  Arabic Font Size
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFontSize(Math.max(20, fontSize - 2))}
                    className="w-10 h-10 rounded-xl bg-base-200 border border-base-300 text-base-content font-bold hover:border-primary active:scale-95"
                  >
                    A−
                  </button>
                  <div className="flex-1 text-center">
                    <span className="text-2xl font-bold text-primary">{fontSize}</span>
                    <span className="text-xs text-base-content/50 ml-1">px</span>
                  </div>
                  <button
                    onClick={() => setFontSize(Math.min(60, fontSize + 2))}
                    className="w-10 h-10 rounded-xl bg-base-200 border border-base-300 text-base-content font-bold hover:border-primary active:scale-95"
                  >
                    A+
                  </button>
                </div>
              </div>

              {/* Word by Word toggle only */}
              <div className="space-y-2">
                <label className="flex items-center justify-between p-3 rounded-xl bg-base-200 border border-base-300 cursor-pointer">
                  <div className="flex items-center gap-2">
                    <FaEye className="text-primary" size={13} />
                    <span className="text-sm text-base-content">Word by Word</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={showWordByWord}
                    onChange={(e) => setShowWordByWord(e.target.checked)}
                    className="toggle toggle-primary toggle-sm"
                  />
                </label>
              </div>

              {/* Info about tajweed */}
              <div className="p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-[11px] text-base-content/70">
                  🎨 <strong>Tajweed colors</strong> সবসময় চালু আছে। উপরের legend দেখে প্রতিটা রঙের অর্থ জানুন।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
