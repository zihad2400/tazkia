import { NextResponse } from 'next/server';
import { getCollection } from '@/lib/server/hadithCache';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const collectionId = searchParams.get('c');
    const lang = searchParams.get('lang') || 'ben';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('q') || '';

    if (!collectionId) {
      return NextResponse.json(
        { error: 'Collection ID required' },
        { status: 400 }
      );
    }

    // Try requested language, fallback to English
    let data = await getCollection(`${lang}-${collectionId}`);
    let actualLang = lang;
    let fallbackUsed = false;

    if (!data && lang === 'ben') {
      data = await getCollection(`eng-${collectionId}`);
      actualLang = 'eng';
      fallbackUsed = true;
    }

    if (!data || !data.hadiths) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    // Search filter
    let filtered = data.hadiths;
    if (search) {
      const q = search.toLowerCase();
      filtered = data.hadiths.filter(
        (h) =>
          (h.text || '').toLowerCase().includes(q) ||
          String(h.hadithnumber).includes(search) ||
          (h.hadithnumber && String(h.hadithnumber) === search)
      );
    }

    // Paginate
    const total = filtered.length;
    const startIdx = (page - 1) * limit;
    const paginated = filtered.slice(startIdx, startIdx + limit);

    // Lightweight response — only send what's needed
    const hadiths = paginated.map((h) => ({
      hadithnumber: h.hadithnumber,
      arabicnumber: h.arabicnumber,
      text: h.text,
      grades: h.grades,
      reference: h.reference,
      sections: h.sections,
    }));

    return NextResponse.json({
      hadiths,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
      actualLang,
      requestedLang: lang,
      fallbackUsed,
      metadata: {
        name: data.metadata?.name,
        sections: data.metadata?.sections,
      },
    });
  } catch (err) {
    console.error('API error:', err);
    return NextResponse.json(
      { error: 'Server error', details: err.message },
      { status: 500 }
    );
  }
}
