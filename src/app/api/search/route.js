import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/server/hadithCache';
import { duasData, duaCategories } from '@/lib/data/duasData';

export const dynamic = 'force-dynamic';

// ═══ Surah metadata (cached) ═══
let surahCache = null;

async function getSurahs() {
  if (surahCache) return surahCache;
  try {
    const res = await fetch('https://api.alquran.cloud/v1/surah');
    const json = await res.json();
    surahCache = json.data || [];
    return surahCache;
  } catch (err) {
    return [];
  }
}

// ═══ Arabic text detection ═══
function isArabic(text) {
  return /[\u0600-\u06FF]/.test(text);
}

// ═══ Normalize text for search ═══
function normalize(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u0980-\u09FF]/g, (c) => c) // Keep Bengali
    .trim();
}

export async function GET(request) {
  const startTime = Date.now();

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const q = normalize(query);
    const limit = parseInt(searchParams.get('limit') || '20');

    if (!q || q.length < 2) {
      return NextResponse.json({
        query,
        total: 0,
        results: {
          quran: [],
          hadith: [],
          duas: [],
          categories: [],
        },
      });
    }

    // ═══ Parallel searches ═══
    const [surahs, ...hadithResults] = await Promise.all([
      getSurahs().catch(() => []),

      // Search in all hadith collections (parallel)
      ...['bukhari', 'muslim', 'malik'].map(async (col) => {
        try {
          const data = await getCollection(`ben-${col}`);
          if (!data?.hadiths) return { collection: col, items: [] };

          const matches = data.hadiths
            .filter((h) => {
              const text = normalize(h.text || '');
              const num = String(h.hadithnumber);
              return text.includes(q) || num === q || num.includes(q);
            })
            .slice(0, limit)
            .map((h) => ({
              id: `${col}-${h.hadithnumber}`,
              collectionId: col,
              hadithNumber: h.hadithnumber,
              text: h.text,
              reference: h.reference,
              arabicnumber: h.arabicnumber,
            }));

          return { collection: col, items: matches };
        } catch (err) {
          return { collection: col, items: [] };
        }
      }),
    ]);

    // ═══ Search Quran surahs ═══
    const quranMatches = surahs
      .filter((s) => {
        const name = normalize(s.englishName);
        const translation = normalize(s.englishNameTranslation);
        const num = String(s.number);
        const arabicName = s.name || '';

        return (
          name.includes(q) ||
          translation.includes(q) ||
          num === q ||
          arabicName.includes(query)
        );
      })
      .slice(0, limit)
      .map((s) => ({
        id: `quran-${s.number}`,
        number: s.number,
        name: s.englishName,
        nameAr: s.name,
        translation: s.englishNameTranslation,
        numberOfAyahs: s.numberOfAyahs,
        revelationType: s.revelationType,
      }));

    // ═══ Search Du'as ═══
    const duaMatches = duasData
      .filter((d) => {
        const title = normalize(d.title || '');
        const translation = normalize(d.translation || '');
        const translit = normalize(d.transliteration || '');
        const reference = normalize(d.reference || '');
        const arabic = d.arabic || '';

        return (
          title.includes(q) ||
          translation.includes(q) ||
          translit.includes(q) ||
          reference.includes(q) ||
          arabic.includes(query)
        );
      })
      .slice(0, limit)
      .map((d) => ({
        id: `dua-${d.id}`,
        duaId: d.id,
        categoryId: d.categoryId,
        title: d.title,
        arabic: d.arabic,
        translation: d.translation,
        reference: d.reference,
        count: d.count,
      }));

    // ═══ Search Du'a categories ═══
    const categoryMatches = duaCategories
      .filter((c) => {
        const name = normalize(c.name);
        const nameEn = normalize(c.nameEn);
        const desc = normalize(c.description);
        const nameAr = c.nameAr || '';

        return (
          name.includes(q) ||
          nameEn.includes(q) ||
          desc.includes(q) ||
          nameAr.includes(query)
        );
      })
      .map((c) => ({
        id: `cat-${c.id}`,
        categoryId: c.id,
        name: c.name,
        nameEn: c.nameEn,
        nameAr: c.nameAr,
        icon: c.icon,
        description: c.description,
      }));

    // ═══ Flatten hadith results ═══
    const hadithMatches = hadithResults.flatMap((r) => r.items);

    // ═══ Calculate totals ═══
    const total =
      quranMatches.length +
      hadithMatches.length +
      duaMatches.length +
      categoryMatches.length;

    const elapsed = Date.now() - startTime;
    console.log(`🔍 Search "${query}" → ${total} results in ${elapsed}ms`);

    return NextResponse.json({
      query,
      total,
      elapsed,
      results: {
        quran: quranMatches,
        hadith: hadithMatches,
        duas: duaMatches,
        categories: categoryMatches,
      },
    });
  } catch (err) {
    console.error('Search error:', err);
    return NextResponse.json(
      { error: 'Search failed', details: err.message },
      { status: 500 }
    );
  }
}
