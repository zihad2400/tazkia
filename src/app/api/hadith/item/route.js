import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/server/hadithCache';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('c');
    const hadithNumber = searchParams.get('n');

    if (!collectionId || !hadithNumber) {
      return NextResponse.json(
        { error: 'Collection and hadith number required' },
        { status: 400 }
      );
    }

    const numStr = String(hadithNumber);
    const numInt = parseInt(hadithNumber);

    const findH = (arr) => {
      if (!arr) return null;
      return arr.find(
        (h) =>
          h.hadithnumber === numInt ||
          h.hadithnumber === numStr ||
          String(h.hadithnumber) === numStr
      );
    };

    // Fetch Bengali + Arabic in parallel
    const [bnData, arData] = await Promise.all([
      getCollection(`ben-${collectionId}`).catch(() => null),
      getCollection(`ara-${collectionId}`).catch(() => null),
    ]);

    let translationData = bnData;
    let usedLang = 'ben';
    let hadith = findH(bnData?.hadiths);

    // Fallback to English
    if (!hadith) {
      translationData = await getCollection(`eng-${collectionId}`);
      usedLang = 'eng';
      hadith = findH(translationData?.hadiths);
    }

    if (!hadith) {
      return NextResponse.json(
        { error: 'Hadith not found' },
        { status: 404 }
      );
    }

    const arabicHadith = findH(arData?.hadiths);

    let sectionName = null;
    if (hadith.sections && Array.isArray(hadith.sections) && hadith.sections.length > 0) {
      const sectionNum = hadith.sections[0];
      sectionName = translationData?.metadata?.sections?.[sectionNum] || null;
    }

    return NextResponse.json({
      hadith,
      arabicHadith,
      metadata: translationData?.metadata || {},
      usedLang,
      sectionName,
      totalHadiths: translationData?.hadiths?.length || 0,
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}
