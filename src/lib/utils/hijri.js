// ═══════════════════════════════════════════════════════
// 🕌 Hijri Calendar Utilities
// ═══════════════════════════════════════════════════════

let HijriDate = null;

// Lazy load library
function getHijriLib() {
  if (typeof window === 'undefined') return null;
  if (HijriDate) return HijriDate;
  try {
    HijriDate = require('hijri-date').default || require('hijri-date');
    return HijriDate;
  } catch (e) {
    console.warn('hijri-date not installed');
    return null;
  }
}

// ═══ Hijri Month Names ═══
export const HIJRI_MONTHS = {
  en: [
    'Muharram', 'Safar', 'Rabi al-Awwal', 'Rabi al-Thani',
    'Jumada al-Awwal', 'Jumada al-Thani', 'Rajab', 'Sha\'ban',
    'Ramadan', 'Shawwal', 'Dhul Qa\'dah', 'Dhul Hijjah',
  ],
  bn: [
    'মুহাররম', 'সফর', 'রবিউল আউয়াল', 'রবিউস সানি',
    'জুমাদাল উলা', 'জুমাদাস সানি', 'রজব', 'শাবান',
    'রমজান', 'শাওয়াল', 'জিলকদ', 'জিলহজ',
  ],
  ar: [
    'محرم', 'صفر', 'ربيع الأول', 'ربيع الثاني',
    'جمادى الأولى', 'جمادى الثانية', 'رجب', 'شعبان',
    'رمضان', 'شوال', 'ذو القعدة', 'ذو الحجة',
  ],
};

// ═══ Get Hijri Date ═══
export function getHijriDate(date = new Date()) {
  const Hijri = getHijriLib();
  if (!Hijri) {
    // Fallback — approximate calculation
    return approximateHijri(date);
  }
  try {
    const h = new Hijri(date);
    return {
      year: h.getFullYear(),
      month: h.getMonth() + 1, // 1-12
      day: h.getDate(),
    };
  } catch (e) {
    return approximateHijri(date);
  }
}

// Fallback approximate calculation
function approximateHijri(date) {
  const gregorianDays = Math.floor((date - new Date(622, 6, 16)) / 86400000);
  const hijriDays = Math.floor(gregorianDays * 33 / 32);
  const year = Math.floor(hijriDays / 354.367) + 1;
  const daysInYear = hijriDays % 354;
  const month = Math.floor(daysInYear / 29.53) + 1;
  const day = Math.floor(daysInYear % 29.53) + 1;
  return { year, month: Math.min(month, 12), day: Math.max(day, 1) };
}

// ═══ Format Hijri Date ═══
export function formatHijri(date = new Date(), lang = 'en') {
  const { year, month, day } = getHijriDate(date);
  const monthNames = HIJRI_MONTHS[lang] || HIJRI_MONTHS.en;
  const monthName = monthNames[month - 1] || '';

  // Convert numerals for Arabic
  const toArabicNumerals = (n) => String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[d]);
  const toBanglaNumerals = (n) => String(n).replace(/\d/g, (d) => '০১২৩৪৫৬৭৮৯'[d]);

  if (lang === 'ar') {
    return `${toArabicNumerals(day)} ${monthName} ${toArabicNumerals(year)} هـ`;
  }
  if (lang === 'bn') {
    return `${toBanglaNumerals(day)} ${monthName} ${toBanglaNumerals(year)} হিজরি`;
  }
  return `${day} ${monthName} ${year} AH`;
}

// ═══ Islamic Events Calendar ═══
export const ISLAMIC_EVENTS = [
  { month: 1, day: 1, key: 'muharram', name: { en: 'Islamic New Year', bn: 'হিজরি নববর্ষ', ar: 'رأس السنة الهجرية' } },
  { month: 1, day: 10, key: 'ashura', name: { en: 'Day of Ashura', bn: 'আশুরা', ar: 'يوم عاشوراء' } },
  { month: 3, day: 12, key: 'mawlid', name: { en: 'Mawlid an-Nabi', bn: 'মিলাদুন্নবী', ar: 'المولد النبوي' } },
  { month: 7, day: 27, key: 'isra', name: { en: 'Isra & Mi\'raj', bn: 'শবে মেরাজ', ar: 'الإسراء والمعراج' } },
  { month: 8, day: 15, key: 'baraah', name: { en: 'Laylat al-Bara\'ah', bn: 'শবে বরাত', ar: 'ليلة البراءة' } },
  { month: 9, day: 1, key: 'ramadan_start', name: { en: 'Ramadan begins', bn: 'রমজান শুরু', ar: 'بداية رمضان' } },
  { month: 9, day: 27, key: 'laylatul_qadr', name: { en: 'Laylat al-Qadr', bn: 'শবে কদর', ar: 'ليلة القدر' } },
  { month: 10, day: 1, key: 'eid_fitr', name: { en: 'Eid al-Fitr', bn: 'ঈদুল ফিতর', ar: 'عيد الفطر' } },
  { month: 12, day: 9, key: 'arafah', name: { en: 'Day of Arafah', bn: 'আরাফার দিন', ar: 'يوم عرفة' } },
  { month: 12, day: 10, key: 'eid_adha', name: { en: 'Eid al-Adha', bn: 'ঈদুল আজহা', ar: 'عيد الأضحى' } },
];

// ═══ Get next upcoming event ═══
export function getNextIslamicEvent(date = new Date()) {
  const { year, month, day } = getHijriDate(date);
  const currentValue = month * 100 + day;

  // Check remaining events this year
  const remaining = ISLAMIC_EVENTS
    .map((e) => ({ ...e, value: e.month * 100 + e.day }))
    .filter((e) => e.value >= currentValue)
    .sort((a, b) => a.value - b.value);

  if (remaining.length > 0) {
    const next = remaining[0];
    const daysAway = estimateDaysAway(date, next.month, next.day);
    return { ...next, daysAway, hijriYear: year };
  }

  // Next year's first event
  const next = ISLAMIC_EVENTS[0];
  return {
    ...next,
    daysAway: estimateDaysAway(date, next.month, next.day) + 354,
    hijriYear: year + 1,
  };
}

// Approximate days away calculation
function estimateDaysAway(fromDate, targetMonth, targetDay) {
  const { month, day } = getHijriDate(fromDate);
  const currentValue = month * 30 + day;
  const targetValue = targetMonth * 30 + targetDay;
  let diff = targetValue - currentValue;
  if (diff < 0) diff += 354;
  return Math.max(0, Math.round(diff));
}

// ═══ Check if currently Ramadan ═══
export function isRamadan(date = new Date()) {
  const { month } = getHijriDate(date);
  return month === 9;
}

// ═══ Ramadan day number ═══
export function getRamadanDay(date = new Date()) {
  const { month, day } = getHijriDate(date);
  return month === 9 ? day : 0;
}

// ═══ User location from timezone ═══
export function getUserLocation() {
  if (typeof window === 'undefined') return { city: 'Dhaka', country: 'Bangladesh' };

  // Try timezone → city mapping
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const tzMap = {
    'Asia/Dhaka': { city: 'Dhaka', country: 'Bangladesh', cityBn: 'ঢাকা', cityAr: 'دكا' },
    'Asia/Kolkata': { city: 'Kolkata', country: 'India', cityBn: 'কলকাতা', cityAr: 'كلكتا' },
    'Asia/Karachi': { city: 'Karachi', country: 'Pakistan', cityBn: 'করাচি', cityAr: 'كراتشي' },
    'Asia/Dubai': { city: 'Dubai', country: 'UAE', cityBn: 'দুবাই', cityAr: 'دبي' },
    'Asia/Riyadh': { city: 'Riyadh', country: 'Saudi Arabia', cityBn: 'রিয়াদ', cityAr: 'الرياض' },
    'Asia/Mecca': { city: 'Makkah', country: 'Saudi Arabia', cityBn: 'মক্কা', cityAr: 'مكة المكرمة' },
    'Asia/Jakarta': { city: 'Jakarta', country: 'Indonesia', cityBn: 'জাকার্তা', cityAr: 'جاكرتا' },
    'Asia/Kuala_Lumpur': { city: 'Kuala Lumpur', country: 'Malaysia', cityBn: 'কুয়ালালামপুর', cityAr: 'كوالالمبور' },
    'Europe/London': { city: 'London', country: 'UK', cityBn: 'লন্ডন', cityAr: 'لندن' },
    'America/New_York': { city: 'New York', country: 'USA', cityBn: 'নিউ ইয়র্ক', cityAr: 'نيويورك' },
  };

  return tzMap[tz] || { city: 'Dhaka', country: 'Bangladesh', cityBn: 'ঢাকা', cityAr: 'دكا' };
}
