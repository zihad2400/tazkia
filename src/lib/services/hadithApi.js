// ═══════════════════════════════════════════════════════════
// Hadith API Service — Cached + Optimized
// Features: In-memory cache, LocalStorage cache, CDN race
// ═══════════════════════════════════════════════════════════

const CACHE_VERSION = 'v2';
const MEMORY_CACHE = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

// ═══ CDN mirrors — race them ═══
const CDN_MIRRORS = [
  (path) => `https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/${path}`,
  (path) => `https://cdn.statically.io/gh/fawazahmed0/hadith-api/1/${path}`,
  (path) => `https://raw.githack.com/fawazahmed0/hadith-api/1/${path}`,
  (path) => `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/${path}`,
];

// ═══ Collections Metadata ═══
export const collections = [
  { id: 'bukhari', name: 'Sahih al-Bukhari', nameAr: 'صحيح البخاري', nameBn: 'সহীহ বুখারী', author: 'ইমাম মুহাম্মদ ইবনে ইসমাইল আল-বুখারী', deathYear: '২৫৬ হিজরি', totalHadith: 7563, description: 'সর্বাধিক বিশুদ্ধ হাদিস গ্রন্থ', color: 'from-emerald-600 to-emerald-800', icon: '📗', hasBengali: true },
  { id: 'muslim', name: 'Sahih Muslim', nameAr: 'صحيح مسلم', nameBn: 'সহীহ মুসলিম', author: 'ইমাম মুসলিম ইবনে আল-হাজ্জাজ', deathYear: '২৬১ হিজরি', totalHadith: 7500, description: 'দ্বিতীয় সর্বাধিক বিশুদ্ধ সংকলন', color: 'from-blue-600 to-blue-800', icon: '📘', hasBengali: true },
  { id: 'abudawud', name: 'Sunan Abu Dawud', nameAr: 'سنن أبي داود', nameBn: 'সুনান আবু দাউদ', author: 'ইমাম আবু দাউদ সুলাইমান', deathYear: '২৭৫ হিজরি', totalHadith: 5274, description: 'ফিকহ ও আমলের সংকলন', color: 'from-purple-600 to-purple-800', icon: '📕', hasBengali: true },
  { id: 'tirmidhi', name: 'Jami at-Tirmidhi', nameAr: 'جامع الترمذي', nameBn: 'জামে তিরমিজি', author: 'ইমাম আবু ঈসা মুহাম্মদ আত-তিরমিজি', deathYear: '২৭৯ হিজরি', totalHadith: 3956, description: 'হাদিসের মান নির্দেশক', color: 'from-amber-600 to-amber-800', icon: '📙', hasBengali: true },
  { id: 'nasai', name: "Sunan an-Nasa'i", nameAr: 'سنن النسائي', nameBn: 'সুনান নাসাঈ', author: 'ইমাম আহমদ ইবনে শুয়াইব আন-নাসাঈ', deathYear: '৩০৩ হিজরি', totalHadith: 5758, description: 'রিজাল যাচাইয়ে সতর্ক', color: 'from-rose-600 to-rose-800', icon: '📓', hasBengali: true },
  { id: 'ibnmajah', name: 'Sunan Ibn Majah', nameAr: 'سنن ابن ماجه', nameBn: 'সুনান ইবনে মাজাহ', author: 'ইমাম মুহাম্মদ ইবনে ইয়াযীদ ইবনে মাজাহ', deathYear: '২৭৩ হিজরি', totalHadith: 4341, description: 'ফিকহী বিষয়ে সংকলন', color: 'from-cyan-600 to-cyan-800', icon: '📔', hasBengali: true },
  { id: 'malik', name: 'Muwatta Malik', nameAr: 'موطأ مالك', nameBn: 'মুয়াত্তা মালিক', author: 'ইমাম মালিক ইবনে আনাস', deathYear: '১৭৯ হিজরি', totalHadith: 1858, description: 'প্রথম হাদিস সংকলন', color: 'from-indigo-600 to-indigo-800', icon: '📚', hasBengali: true },
];

// ═══════════════════════════════════════════════════════════
// Cache Utilities
// ═══════════════════════════════════════════════════════════

function getCacheKey(edition) {
  return `hadith-cache-${CACHE_VERSION}-${edition}`;
}

function getFromMemory(edition) {
  const entry = MEMORY_CACHE.get(edition);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    MEMORY_CACHE.delete(edition);
    return null;
  }
  return entry.data;
}

function saveToMemory(edition, data) {
  try {
    MEMORY_CACHE.set(edition, { data, timestamp: Date.now() });
  } catch (err) {}
}

function getFromStorage(edition) {
  if (typeof window === 'undefined') return null;
  try {
    const key = getCacheKey(edition);
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const entry = JSON.parse(raw);
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      localStorage.removeItem(key);
      return null;
    }
    return entry.data;
  } catch (err) {
    return null;
  }
}

function saveToStorage(edition, data) {
  if (typeof window === 'undefined') return;
  try {
    const key = getCacheKey(edition);
    // Only cache smaller collections (< 3MB)
    const size = JSON.stringify(data).length;
    if (size < 3 * 1024 * 1024) {
      localStorage.setItem(key, JSON.stringify({ data, timestamp: Date.now() }));
    }
  } catch (err) {
    // Quota exceeded — try to clear old caches
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('hadith-cache-'));
      keys.forEach((k) => localStorage.removeItem(k));
    } catch (e) {}
  }
}

// ═══════════════════════════════════════════════════════════
// Fast Fetch — Race CDN mirrors
// ═══════════════════════════════════════════════════════════

async function fetchFromCDN(edition) {
  // Check caches first
  const fromMem = getFromMemory(edition);
  if (fromMem) {
    console.log(`⚡ Memory cache hit: ${edition}`);
    return fromMem;
  }

  const fromStore = getFromStorage(edition);
  if (fromStore) {
    console.log(`💾 Storage cache hit: ${edition}`);
    saveToMemory(edition, fromStore);
    return fromStore;
  }

  console.log(`🌐 Fetching: ${edition}`);

  // Race all CDNs — fastest wins
  const attempts = CDN_MIRRORS.map((mirrorFn) =>
    fetch(mirrorFn(`editions/${edition}.min.json`))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => ({ data, ok: true }))
      .catch((err) => ({ error: err, ok: false }))
  );

  // Wait for first successful response
  try {
    const result = await Promise.race(attempts.filter((p) => p.then));
    // Actually, we need Promise.any but it's not always available
    // So use a fallback approach
  } catch (e) {}

  // Better approach — try each in parallel, return first success
  const results = await Promise.allSettled(attempts);

  for (const r of results) {
    if (r.status === 'fulfilled' && r.value.ok) {
      const data = r.value.data;
      console.log(`✅ Success: ${edition} (${data.hadiths?.length || 0} items)`);
      saveToMemory(edition, data);
      saveToStorage(edition, data);
      return data;
    }
  }

  console.error(`❌ All CDNs failed for: ${edition}`);
  return null;
}

// ═══════════════════════════════════════════════════════════
// Public API
// ═══════════════════════════════════════════════════════════

/**
 * Fetch collection with language fallback
 */
export async function fetchCollection(collectionId, lang = 'ben') {
  let data = await fetchFromCDN(`${lang}-${collectionId}`);
  let fallbackUsed = false;
  let actualLang = lang;

  if (!data && lang === 'ben') {
    console.log(`Bengali not found, trying English for ${collectionId}`);
    data = await fetchFromCDN(`eng-${collectionId}`);
    if (data) {
      fallbackUsed = true;
      actualLang = 'eng';
    }
  }

  if (!data) return null;

  return {
    ...data,
    actualLang,
    requestedLang: lang,
    fallbackUsed,
  };
}

/**
 * Fetch single hadith with full data
 */
export async function fetchHadithComplete(collectionId, hadithNumber) {
  const numStr = String(hadithNumber);
  const numInt = parseInt(hadithNumber);

  const findH = (arr) => {
    if (!arr || !Array.isArray(arr)) return null;
    return arr.find(
      (h) =>
        h.hadithnumber === numInt ||
        h.hadithnumber === numStr ||
        String(h.hadithnumber) === numStr
    );
  };

  // Parallel fetch: Bengali, Arabic
  const [bnData, arData] = await Promise.all([
    fetchFromCDN(`ben-${collectionId}`).catch(() => null),
    fetchFromCDN(`ara-${collectionId}`).catch(() => null),
  ]);

  let translationData = bnData;
  let usedLang = 'ben';
  let hadith = findH(bnData?.hadiths);

  // Fallback to English
  if (!hadith) {
    console.log('Bengali hadith not found, trying English...');
    translationData = await fetchFromCDN(`eng-${collectionId}`);
    usedLang = 'eng';
    hadith = findH(translationData?.hadiths);
  }

  if (!hadith) return null;

  const arabicHadith = findH(arData?.hadiths);

  let sectionName = null;
  if (hadith.sections && Array.isArray(hadith.sections) && hadith.sections.length > 0) {
    const sectionNum = hadith.sections[0];
    sectionName = translationData?.metadata?.sections?.[sectionNum] || null;
  }

  return {
    hadith,
    arabicHadith,
    metadata: translationData?.metadata || {},
    usedLang,
    sectionName,
    totalHadiths: translationData?.hadiths?.length || 0,
  };
}

/**
 * Legacy fetchHadith alias
 */
export async function fetchHadith(collectionId, hadithNumber) {
  const result = await fetchHadithComplete(collectionId, hadithNumber);
  return result?.hadith || null;
}

/**
 * Legacy fetchArabic
 */
export async function fetchArabic(collectionId, hadithNumber) {
  const arData = await fetchFromCDN(`ara-${collectionId}`);
  if (!arData?.hadiths) return null;
  const numStr = String(hadithNumber);
  const numInt = parseInt(hadithNumber);
  return arData.hadiths.find(
    (h) =>
      h.hadithnumber === numInt ||
      h.hadithnumber === numStr ||
      String(h.hadithnumber) === numStr
  );
}

/**
 * Preload a collection (call in background)
 */
export function preloadCollection(collectionId, lang = 'ben') {
  console.log(`🔥 Preloading: ${lang}-${collectionId}`);
  fetchFromCDN(`${lang}-${collectionId}`).catch(() => {});
}

/**
 * Clear all cache
 */
export function clearCache() {
  MEMORY_CACHE.clear();
  if (typeof window !== 'undefined') {
    try {
      const keys = Object.keys(localStorage).filter((k) => k.startsWith('hadith-cache-'));
      keys.forEach((k) => localStorage.removeItem(k));
    } catch (err) {}
  }
}
