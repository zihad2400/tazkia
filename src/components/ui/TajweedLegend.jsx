'use client';

import { useState } from 'react';
import { FaPalette, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const tajweedLegend = [
  { rule: 'Madda Normal', color: '#537FFF', desc: '2 vowels prolongation', className: 'tajweed-n' },
  { rule: 'Madda Necessary', color: '#000EBC', desc: '6 vowels prolongation', className: 'tajweed-m' },
  { rule: 'Qalqalah', color: '#DD0008', desc: 'Echoing sound', className: 'tajweed-q' },
  { rule: 'Ikhfa', color: '#9400A8', desc: 'Hidden nasalization', className: 'tajweed-f' },
  { rule: 'Idgham', color: '#169200', desc: 'Merging', className: 'tajweed-a' },
  { rule: 'Iqlab', color: '#26BFFD', desc: 'Conversion to Meem', className: 'tajweed-b' },
  { rule: 'Ghunnah', color: '#FF7E1E', desc: 'Nasalization', className: 'tajweed-g' },
  { rule: 'Silent', color: '#AAAAAA', desc: 'Not pronounced', className: 'tajweed-h' },
];

export default function TajweedLegend({ collapsible = true, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  if (!collapsible) {
    return (
      <div className="bg-base-200 border border-base-300 rounded-2xl p-4 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <FaPalette className="text-primary" size={12} />
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/60">
            Tajweed Color Legend
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {tajweedLegend.map((item, i) => (
            <div key={i} className="tajweed-legend-item">
              <span className="tajweed-legend-dot" style={{ background: item.color }} />
              <span className="font-medium text-base-content">{item.rule}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-base-200 border border-base-300 rounded-2xl mb-4 overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between p-3 sm:p-4 hover:bg-base-300/30 transition-colors"
      >
        <div className="flex items-center gap-2">
          <FaPalette className="text-primary" size={12} />
          <p className="text-xs font-bold uppercase tracking-widest text-base-content/70">
            🎨 Tajweed Color Legend
          </p>
        </div>
        {open ? (
          <FaChevronUp className="text-base-content/50" size={11} />
        ) : (
          <FaChevronDown className="text-base-content/50" size={11} />
        )}
      </button>

      {open && (
        <div className="p-3 sm:p-4 pt-0 border-t border-base-300">
          <div className="flex flex-wrap gap-2 mt-3">
            {tajweedLegend.map((item, i) => (
              <div key={i} className="tajweed-legend-item">
                <span className="tajweed-legend-dot" style={{ background: item.color }} />
                <span className="font-medium text-base-content">{item.rule}</span>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-base-content/50 mt-3 italic">
            Color গুলো hover করলে বিস্তারিত দেখতে পাবেন।
          </p>
        </div>
      )}
    </div>
  );
}
