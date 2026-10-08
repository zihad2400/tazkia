// ═══════════════════════════════════════════════════════════
// Islamic Calendar API — Aladhan
// Converts between Gregorian & Hijri dates
// ═══════════════════════════════════════════════════════════

const BASE_URL = 'https://api.aladhan.com/v1';

/**
 * Convert Gregorian → Hijri
 * @param {number} day
 * @param {number} month (1-12)
 * @param {number} year
 */
export async function gregorianToHijri(day, month, year) {
  try {
    const dateStr = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    const res = await fetch(`${BASE_URL}/gToH/${dateStr}`);
    const json = await res.json();
    if (json.code === 200) return json.data;
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Convert Hijri → Gregorian
 * @param {number} day
 * @param {number} month
 * @param {number} year
 */
export async function hijriToGregorian(day, month, year) {
  try {
    const dateStr = `${String(day).padStart(2, '0')}-${String(month).padStart(2, '0')}-${year}`;
    const res = await fetch(`${BASE_URL}/hToG/${dateStr}`);
    const json = await res.json();
    if (json.code === 200) return json.data;
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Get Hijri calendar for a Gregorian month
 * @param {number} month (1-12)
 * @param {number} year
 */
export async function getHijriCalendarForMonth(month, year) {
  try {
    const res = await fetch(`${BASE_URL}/gToHCalendar/${month}/${year}`);
    const json = await res.json();
    if (json.code === 200) return json.data;
    return null;
  } catch (err) {
    return null;
  }
}

/**
 * Format Hijri date in Bengali
 */
export function formatHijriBengali(hijriData) {
  if (!hijriData) return '';
  const { day, month, year } = hijriData;
  return `${day} ${month.en} ${year} হিজরি`;
}

/**
 * Get Gregorian day of week in Bengali
 */
export function getBengaliDayName(date) {
  const days = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
  return days[date.getDay()];
}
