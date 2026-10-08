import { qaris } from '@/lib/data/qaris';

const BASE_URL = 'https://api.alquran.cloud/v1';

// ═══════════════════════════════════════════════════════════
// EveryAyah CDN — Per-ayah audio for all Qaris
// URL: https://everyayah.com/data/{folder}/{surah:03d}{ayah:03d}.mp3
// ═══════════════════════════════════════════════════════════

/**
 * Build audio URL for a specific ayah
 * @param {string} qariId — Qari identifier (e.g. "Alafasy")
 * @param {number} surahNumber — Surah number (1-114)
 * @param {number} ayahNumber — Ayah number in surah
 * @returns {string|null}
 */
export function getEveryAyahUrl(qariId, surahNumber, ayahNumber) {
  const qari = qaris.find((q) => q.id === qariId);
  if (!qari || !surahNumber || !ayahNumber) return null;

  const s = String(surahNumber).padStart(3, '0');
  const a = String(ayahNumber).padStart(3, '0');
  return `https://everyayah.com/data/${qari.folder}/${s}${a}.mp3`;
}

/**
 * Legacy function name — for backward compatibility with AyahCard
 * Returns URL for a specific ayah based on Qari
 * @param {string} qariId — Qari identifier (e.g. "Alafasy")
 * @param {number} ayahNumber — Absolute ayah number (used as fallback)
 * @param {number} surahNumber — Optional surah number
 * @returns {string|null}
 */
export function getAyahAudioUrl(qariId, ayahNumber, surahNumber = null) {
  // If surah provided, build accurate URL
  if (surahNumber) {
    return getEveryAyahUrl(qariId, surahNumber, ayahNumber);
  }

  // Fallback: try with default surah 1 — may not be accurate
  const qari = qaris.find((q) => q.id === qariId);
  if (!qari) return null;

  // This shouldn't normally be called without surahNumber
  // Return null to force callers to provide surahNumber
  console.warn('getAyahAudioUrl called without surahNumber — may be inaccurate');
  return null;
}

// ═══════════════════════════════════════════════════════════
// Quran Text & Translation API
// ═══════════════════════════════════════════════════════════

/**
 * Get all 114 surahs metadata
 */
export async function getAllSurahs() {
  const res = await fetch(`${BASE_URL}/surah`);
  const json = await res.json();
  return json.data || [];
}

/**
 * Get surah text (Arabic + Tajweed + Translation)
 */
export async function getSurahText(surahNumber, translationId) {
  const [arabic, tajweed, translation] = await Promise.allSettled([
    fetch(`${BASE_URL}/surah/${surahNumber}/quran-uthmani`).then((r) => r.json()),
    fetch(`${BASE_URL}/surah/${surahNumber}/quran-tajweed`).then((r) => r.json()),
    fetch(`${BASE_URL}/surah/${surahNumber}/${translationId}`).then((r) => r.json()),
  ]);

  return {
    arabic: arabic.status === 'fulfilled' ? arabic.value.data : null,
    tajweed: tajweed.status === 'fulfilled' ? tajweed.value.data : null,
    translation: translation.status === 'fulfilled' ? translation.value.data : null,
  };
}

/**
 * Get single surah with specific edition
 */
export async function getSurah(number, edition = 'quran-uthmani') {
  const res = await fetch(`${BASE_URL}/surah/${number}/${edition}`);
  const json = await res.json();
  return json.data;
}

/**
 * Get single ayah
 */
export async function getAyah(surahNumber, ayahNumber, edition = 'quran-uthmani') {
  try {
    const res = await fetch(
      `${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${edition}`
    );
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}

/**
 * Word-by-word data from Quran.com API
 */
export async function getWordByWord(surahNumber, ayahNumber) {
  try {
    const res = await fetch(
      `https://api.quran.com/api/v4/verses/by_key/${surahNumber}:${ayahNumber}?words=true&word_fields=text_uthmani,translation&word_translation_language=bn`
    );
    const json = await res.json();
    return json.verse?.words || [];
  } catch (err) {
    return [];
  }
}

/**
 * Multi-language surah info
 */
export async function getSurahInfo(surahNumber) {
  try {
    const res = await fetch(`${BASE_URL}/surah/${surahNumber}`);
    const json = await res.json();
    return json.data;
  } catch (err) {
    return null;
  }
}
