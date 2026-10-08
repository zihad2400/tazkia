// ═══════════════════════════════════════════════════════════
// Islamic Events — Hijri Calendar
// Recurring yearly on same Hijri date
// ═══════════════════════════════════════════════════════════

export const islamicEvents = [
  {
    id: 'muharram-new-year',
    hijriMonth: 1,
    hijriDay: 1,
    title: 'হিজরি নববর্ষ',
    titleEn: 'Islamic New Year',
    titleAr: 'رأس السنة الهجرية',
    description: 'হিজরি সনের প্রথম দিন — হিজরতের স্মৃতি',
    icon: '🌙',
    type: 'observance',
    color: 'from-emerald-500 to-teal-700',
  },
  {
    id: 'ashura',
    hijriMonth: 1,
    hijriDay: 10,
    title: 'আশুরা',
    titleEn: 'Day of Ashura',
    titleAr: 'يوم عاشوراء',
    description: 'মুসা (আ.) এর মুক্তির দিন — রোযা রাখা সুন্নাহ',
    icon: '✨',
    type: 'fasting',
    color: 'from-blue-500 to-indigo-700',
  },
  {
    id: 'mawlid',
    hijriMonth: 3,
    hijriDay: 12,
    title: 'মিলাদুন্নবী ﷺ',
    titleEn: 'Mawlid an-Nabi',
    titleAr: 'المولد النبوي',
    description: 'রাসূলুল্লাহ ﷺ এর জন্মদিবস',
    icon: '🕌',
    type: 'observance',
    color: 'from-purple-500 to-violet-700',
  },
  {
    id: 'isra-miraj',
    hijriMonth: 7,
    hijriDay: 27,
    title: 'শবে মিরাজ',
    titleEn: "Isra & Mi'raj",
    titleAr: 'الإسراء والمعراج',
    description: 'মিরাজের রাত — পাঁচ ওয়াক্ত নামাজ ফরজ হয়',
    icon: '⭐',
    type: 'observance',
    color: 'from-amber-500 to-orange-700',
  },
  {
    id: 'shaban-mid',
    hijriMonth: 8,
    hijriDay: 15,
    title: 'শবে বরাত',
    titleEn: 'Mid-Sha\'ban',
    titleAr: 'ليلة النصف من شعبان',
    description: 'শাবান মাসের ১৫তম রাত',
    icon: '🌕',
    type: 'observance',
    color: 'from-cyan-500 to-blue-700',
  },
  {
    id: 'ramadan-start',
    hijriMonth: 9,
    hijriDay: 1,
    title: 'রমজান শুরু',
    titleEn: 'Ramadan Begins',
    titleAr: 'بداية رمضان',
    description: 'পবিত্র রমজান মাসের প্রথম দিন — রোযা ফরজ',
    icon: '🌙',
    type: 'fasting',
    color: 'from-emerald-600 to-green-800',
  },
  {
    id: 'laylatul-qadr',
    hijriMonth: 9,
    hijriDay: 27,
    title: 'লাইলাতুল কদর',
    titleEn: 'Laylat al-Qadr',
    titleAr: 'ليلة القدر',
    description: 'হাজার মাসের চেয়ে উত্তম রাত',
    icon: '✨',
    type: 'night',
    color: 'from-violet-600 to-purple-800',
  },
  {
    id: 'eid-fitr',
    hijriMonth: 10,
    hijriDay: 1,
    title: 'ঈদুল ফিতর',
    titleEn: 'Eid al-Fitr',
    titleAr: 'عيد الفطر',
    description: 'রোযার পর আনন্দের দিন',
    icon: '🎉',
    type: 'eid',
    color: 'from-amber-500 to-yellow-700',
  },
  {
    id: 'arafah',
    hijriMonth: 12,
    hijriDay: 9,
    title: 'আরাফার দিন',
    titleEn: 'Day of Arafah',
    titleAr: 'يوم عرفة',
    description: 'হজের মূল দিন — রোযা রাখা কাফফারা',
    icon: '🏔️',
    type: 'fasting',
    color: 'from-teal-500 to-cyan-700',
  },
  {
    id: 'eid-adha',
    hijriMonth: 12,
    hijriDay: 10,
    title: 'ঈদুল আজহা',
    titleEn: 'Eid al-Adha',
    titleAr: 'عيد الأضحى',
    description: 'কুরবানির ঈদ — ইব্রাহীম (আ.) এর কুরবানির স্মৃতি',
    icon: '🐏',
    type: 'eid',
    color: 'from-rose-500 to-red-700',
  },
];

export const hijriMonths = [
  { num: 1, name: 'মুহাররম', nameEn: 'Muharram', nameAr: 'مُحَرَّم', meaning: 'নিষিদ্ধ মাস' },
  { num: 2, name: 'সফর', nameEn: 'Safar', nameAr: 'صَفَر', meaning: 'শূন্য/খালি' },
  { num: 3, name: 'রবিউল আউয়াল', nameEn: 'Rabi al-Awwal', nameAr: 'رَبِيع الأَوَّل', meaning: 'প্রথম বসন্ত' },
  { num: 4, name: 'রবিউস সানি', nameEn: 'Rabi al-Thani', nameAr: 'رَبِيع الثَّانِي', meaning: 'দ্বিতীয় বসন্ত' },
  { num: 5, name: 'জুমাদাল উলা', nameEn: 'Jumada al-Awwal', nameAr: 'جُمَادَى الأُولَى', meaning: 'প্রথম শুষ্ক' },
  { num: 6, name: 'জুমাদাস সানি', nameEn: 'Jumada al-Thani', nameAr: 'جُمَادَى الآخِرَة', meaning: 'দ্বিতীয় শুষ্ক' },
  { num: 7, name: 'রজব', nameEn: 'Rajab', nameAr: 'رَجَب', meaning: 'সম্মানিত' },
  { num: 8, name: 'শাবান', nameEn: "Sha'ban", nameAr: 'شَعْبَان', meaning: 'শাখা-প্রশাখা' },
  { num: 9, name: 'রমজান', nameEn: 'Ramadan', nameAr: 'رَمَضَان', meaning: 'জ্বলন্ত তাপ' },
  { num: 10, name: 'শাওয়াল', nameEn: 'Shawwal', nameAr: 'شَوَّال', meaning: 'উঠান/উন্নয়ন' },
  { num: 11, name: 'জিলকদ', nameEn: "Dhu al-Qi'dah", nameAr: 'ذُو القَعْدَة', meaning: 'বসার মাস' },
  { num: 12, name: 'জিলহজ', nameEn: 'Dhu al-Hijjah', nameAr: 'ذُو الحِجَّة', meaning: 'হজের মাস' },
];

export const bengaliMonths = [
  'জানুয়ারি', 'ফেব্রুয়ারি', 'মার্চ', 'এপ্রিল', 'মে', 'জুন',
  'জুলাই', 'আগস্ট', 'সেপ্টেম্বর', 'অক্টোবর', 'নভেম্বর', 'ডিসেম্বর',
];

export function getEventsForHijriMonth(hijriMonth) {
  return islamicEvents.filter((e) => e.hijriMonth === hijriMonth);
}

export function getEventById(id) {
  return islamicEvents.find((e) => e.id === id);
}
