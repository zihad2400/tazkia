// ═══════════════════════════════════════════════════════════
// Prayer Times API — Aladhan (world's most accurate)
// ═══════════════════════════════════════════════════════════

const BASE_URL = 'https://api.aladhan.com/v1';

// ═══ Calculation Methods ═══
export const calculationMethods = [
  { id: 1, name: 'University of Islamic Sciences, Karachi', nameBn: 'কারাচি বিশ্ববিদ্যালয় (পাকিস্তান, ভারত, বাংলাদেশ)' },
  { id: 2, name: 'Islamic Society of North America (ISNA)', nameBn: 'উত্তর আমেরিকার ইসলামিক সোসাইটি' },
  { id: 3, name: 'Muslim World League', nameBn: 'মুসলিম ওয়ার্ল্ড লিগ' },
  { id: 4, name: 'Umm Al-Qura University, Makkah', nameBn: 'উম্মুল কুরা বিশ্ববিদ্যালয়, মক্কা' },
  { id: 5, name: 'Egyptian General Authority of Survey', nameBn: 'মিসরীয় সাধারণ জরিপ কর্তৃপক্ষ' },
  { id: 7, name: 'Institute of Geophysics, University of Tehran', nameBn: 'তেহরান বিশ্ববিদ্যালয়' },
  { id: 8, name: 'Gulf Region', nameBn: 'উপসাগরীয় অঞ্চল' },
  { id: 9, name: 'Kuwait', nameBn: 'কুয়েত' },
  { id: 10, name: 'Qatar', nameBn: 'কাতার' },
  { id: 11, name: 'Majlis Ugama Islam Singapura, Singapore', nameBn: 'সিঙ্গাপুর' },
  { id: 12, name: 'Union Organization islamic de France', nameBn: 'ফ্রান্স' },
  { id: 13, name: 'Diyanet İşleri Başkanlığı, Turkey', nameBn: 'তুরস্ক' },
  { id: 14, name: 'Spiritual Administration of Muslims of Russia', nameBn: 'রাশিয়া' },
];

// Default: Karachi method (widely used in Bangladesh)
export const DEFAULT_METHOD = 1;

// ═══ Madhab (Asr time calculation) ═══
// For the Asr prayer time, the school affects the shadow ratio:
// - Shafi/Maliki/Hanbali/Salafi: shadow length = object length (ratio 1)
// - Hanafi: shadow length = 2× object length (ratio 2)
export const madhabs = [
  {
    id: 0,
    name: 'Shafi / Maliki / Hanbali / Salafi',
    nameBn: 'শাফি / মালিকি / হাম্বলি / সালাফি',
    shortBn: 'সালাফি',
    description: 'আসর: ছায়া বস্তুর সমান হলে (Salafi/Shafi predominant)',
  },
  {
    id: 1,
    name: 'Hanafi',
    nameBn: 'হানাফি',
    shortBn: 'হানাফি',
    description: 'আসর: ছায়া বস্তুর দ্বিগুণ হলে',
  },
];

// Default: Salafi/Shafi (id: 0) for Bangladesh — most common for Asr
export const DEFAULT_MADHAB = 0;

// ═══════════════════════════════════════════════════════════
// Get Prayer Times by City
// ═══════════════════════════════════════════════════════════
export async function getPrayerTimesByCity(city, country = 'Bangladesh', options = {}) {
  const {
    method = DEFAULT_METHOD,
    school = DEFAULT_MADHAB,
    date = null,
  } = options;

  const d = date ? new Date(date) : new Date();
  const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

  const url = `${BASE_URL}/timingsByCity/${dateStr}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.code !== 200) {
    throw new Error(json.status || 'Failed to fetch prayer times');
  }

  return json.data;
}

// ═══════════════════════════════════════════════════════════
// Get Prayer Times by Coordinates (more accurate)
// ═══════════════════════════════════════════════════════════
export async function getPrayerTimesByCoords(lat, lng, options = {}) {
  const {
    method = DEFAULT_METHOD,
    school = DEFAULT_MADHAB,
    date = null,
  } = options;

  const d = date ? new Date(date) : new Date();
  const dateStr = `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;

  const url = `${BASE_URL}/timings/${dateStr}?latitude=${lat}&longitude=${lng}&method=${method}&school=${school}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.code !== 200) {
    throw new Error(json.status || 'Failed to fetch prayer times');
  }

  return json.data;
}

// ═══════════════════════════════════════════════════════════
// Get Monthly Prayer Times
// ═══════════════════════════════════════════════════════════
export async function getMonthlyPrayerTimes(city, country = 'Bangladesh', options = {}) {
  const {
    method = DEFAULT_METHOD,
    school = DEFAULT_MADHAB,
    month = new Date().getMonth() + 1,
    year = new Date().getFullYear(),
  } = options;

  const url = `${BASE_URL}/calendarByCity/${year}/${month}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}&school=${school}`;

  const res = await fetch(url);
  const json = await res.json();

  if (json.code !== 200) {
    throw new Error(json.status || 'Failed to fetch monthly times');
  }

  return json.data;
}

// ═══════════════════════════════════════════════════════════
// Get Qibla Direction
// ═══════════════════════════════════════════════════════════
export async function getQiblaDirection(lat, lng) {
  const url = `${BASE_URL}/qibla/${lat}/${lng}`;
  const res = await fetch(url);
  const json = await res.json();

  if (json.code !== 200) {
    throw new Error('Failed to fetch qibla direction');
  }

  return json.data;
}

// ═══════════════════════════════════════════════════════════
// Format time
// ═══════════════════════════════════════════════════════════
export function formatTime(timeStr, use24Hour = false) {
  if (!timeStr) return '--:--';
  const time = timeStr.split(' ')[0];
  const [hourStr, minStr] = time.split(':');
  let hour = parseInt(hourStr);
  const min = minStr;

  if (use24Hour) {
    return `${String(hour).padStart(2, '0')}:${min}`;
  }

  const suffix = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${String(hour).padStart(2, '0')}:${min} ${suffix}`;
}

// ═══════════════════════════════════════════════════════════
// Get prayers list
// ═══════════════════════════════════════════════════════════
export function getPrayersList(timings, use24Hour = false) {
  return [
    { key: 'Fajr', name: 'ফজর', nameEn: 'Fajr', arabic: 'الفجر', time: timings.Fajr, icon: '🌅', isPrayer: true },
    { key: 'Sunrise', name: 'সূর্যোদয়', nameEn: 'Sunrise', arabic: 'الشروق', time: timings.Sunrise, icon: '☀️', isPrayer: false },
    { key: 'Dhuhr', name: 'যোহর', nameEn: 'Dhuhr', arabic: 'الظهر', time: timings.Dhuhr, icon: '🌞', isPrayer: true },
    { key: 'Asr', name: 'আসর', nameEn: 'Asr', arabic: 'العصر', time: timings.Asr, icon: '🌤️', isPrayer: true },
    { key: 'Sunset', name: 'সূর্যাস্ত', nameEn: 'Sunset', arabic: 'الغروب', time: timings.Sunset, icon: '🌇', isPrayer: false },
    { key: 'Maghrib', name: 'মাগরিব', nameEn: 'Maghrib', arabic: 'المغرب', time: timings.Maghrib, icon: '🌆', isPrayer: true },
    { key: 'Isha', name: 'ইশা', nameEn: 'Isha', arabic: 'العشاء', time: timings.Isha, icon: '🌙', isPrayer: true },
  ].map((p) => ({
    ...p,
    formatted: formatTime(p.time, use24Hour),
  }));
}

// ═══════════════════════════════════════════════════════════
// Get next prayer
// ═══════════════════════════════════════════════════════════
export function getNextPrayer(timings) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const prayers = [
    { key: 'Fajr', name: 'ফজর', nameEn: 'Fajr', arabic: 'الفجر', time: timings.Fajr, icon: '🌅' },
    { key: 'Dhuhr', name: 'যোহর', nameEn: 'Dhuhr', arabic: 'الظهر', time: timings.Dhuhr, icon: '🌞' },
    { key: 'Asr', name: 'আসর', nameEn: 'Asr', arabic: 'العصر', time: timings.Asr, icon: '🌤️' },
    { key: 'Maghrib', name: 'মাগরিব', nameEn: 'Maghrib', arabic: 'المغرب', time: timings.Maghrib, icon: '🌆' },
    { key: 'Isha', name: 'ইশা', nameEn: 'Isha', arabic: 'العشاء', time: timings.Isha, icon: '🌙' },
  ];

  for (const p of prayers) {
    const [h, m] = p.time.split(' ')[0].split(':').map(Number);
    const prayerMinutes = h * 60 + m;
    if (prayerMinutes > currentMinutes) {
      const diff = prayerMinutes - currentMinutes;
      return { ...p, minutesLeft: diff, hoursLeft: Math.floor(diff / 60), minsLeft: diff % 60 };
    }
  }

  const fajr = prayers[0];
  const [h, m] = fajr.time.split(' ')[0].split(':').map(Number);
  const diff = 24 * 60 - currentMinutes + h * 60 + m;
  return { ...fajr, minutesLeft: diff, hoursLeft: Math.floor(diff / 60), minsLeft: diff % 60, isNext: true };
}

// ═══════════════════════════════════════════════════════════
// Get current prayer
// ═══════════════════════════════════════════════════════════
export function getCurrentPrayer(timings) {
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const prayers = [
    { key: 'Fajr', name: 'ফজর', time: timings.Fajr, icon: '🌅' },
    { key: 'Dhuhr', name: 'যোহর', time: timings.Dhuhr, icon: '🌞' },
    { key: 'Asr', name: 'আসর', time: timings.Asr, icon: '🌤️' },
    { key: 'Maghrib', name: 'মাগরিব', time: timings.Maghrib, icon: '🌆' },
    { key: 'Isha', name: 'ইশা', time: timings.Isha, icon: '🌙' },
  ];

  let current = null;
  for (const p of prayers) {
    const [h, m] = p.time.split(' ')[0].split(':').map(Number);
    if (h * 60 + m <= currentMinutes) current = p;
    else break;
  }
  return current || prayers[prayers.length - 1];
}
