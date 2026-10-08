// ═══════════════════════════════════════════════════════════
// TOP 6 QARI — Mishary Alafasy is #1 (Verified on EveryAyah CDN)
// ═══════════════════════════════════════════════════════════

export const qaris = [
  // ⭐ #1 — Shaikh Mishary Rashid Alafasy (Most Popular Worldwide)
  {
    id: 'Alafasy',
    folder: 'Alafasy_128kbps',
    name: 'Mishary Rashid Alafasy',
    nameAr: 'مشاري راشد العفاسي',
    country: 'Kuwait 🇰🇼',
    style: 'Murattal · Emotional',
    description: 'বিশ্বের সর্বাধিক জনপ্রিয় ও হৃদয়স্পর্শী তিলাওয়াত',
    featured: true,
  },
  // #2 — Shaikh Abdurrahman As-Sudais
  {
    id: 'Sudais',
    folder: 'Abdurrahmaan_As-Sudais_192kbps',
    name: 'Abdul Rahman Al-Sudais',
    nameAr: 'عبدالرحمن السديس',
    country: 'Saudi Arabia 🇸🇦',
    style: 'Haram · Powerful',
    description: 'শক্তিশালী, গভীর ও বিশ্ববিখ্যাত হারামের কণ্ঠ',
  },
  // #3 — Shaikh Maher Al-Muaiqly
  {
    id: 'Muaiqly',
    folder: 'Maher_AlMuaiqly_64kbps',
    name: 'Maher Al-Muaiqly',
    nameAr: 'ماهر المعيقلي',
    country: 'Saudi Arabia 🇸🇦',
    style: 'Haram · Melodic',
    description: 'শান্ত, melodic ও সুন্দর তিলাওয়াত',
  },
  // #4 — Shaikh Yasser Al-Dosari
  {
    id: 'YasserAlDosari',
    folder: 'Yasser_Ad-Dussary_128kbps',
    name: 'Yasser Al-Dosari',
    nameAr: 'ياسر الدوسري',
    country: 'Saudi Arabia 🇸🇦',
    style: 'Haram · Emotional',
    description: 'Emotional ও powerful কণ্ঠ',
  },
  // #5 — Shaikh Saud Al-Shuraim
  {
    id: 'Shuraim',
    folder: 'Saood_ash-Shuraym_128kbps',
    name: 'Saud Al-Shuraim',
    nameAr: 'سعود الشريم',
    country: 'Saudi Arabia 🇸🇦',
    style: 'Haram · Deep',
    description: 'গভীর ও powerful কণ্ঠ',
  },
  // #6 — Shaikh Saad Al-Ghamdi
  {
    id: 'Ghamdi',
    folder: 'Ghamadi_40kbps',
    name: 'Saad Al-Ghamdi',
    nameAr: 'سعد الغامدي',
    country: 'Saudi Arabia 🇸🇦',
    style: 'Smooth · Measured',
    description: 'Smooth, measured ও memorization-friendly',
  },
];

export const translations = [
  { id: 'bn.bengali', name: 'বাংলা', lang: 'bn', code: 'BN' },
  { id: 'en.sahih', name: 'English (Sahih)', lang: 'en', code: 'EN' },
  { id: 'en.yusufali', name: 'English (Yusuf Ali)', lang: 'en', code: 'EN-YA' },
  { id: 'ur.jalandhry', name: 'اردو', lang: 'ur', code: 'UR' },
  { id: 'id.indonesian', name: 'Indonesia', lang: 'id', code: 'ID' },
];

// ⭐ Default Qari — Alafasy
export const defaultQari = 'Alafasy';
export const defaultTranslation = 'bn.bengali';

// Featured qari getter
export const getFeaturedQari = () => qaris.find((q) => q.featured) || qaris[0];
