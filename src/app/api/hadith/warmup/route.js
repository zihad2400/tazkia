import { NextResponse } from 'next/server';
import { getCollection, getCacheStatus } from '@/lib/server/hadithCache';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const collectionId = searchParams.get('c');

  if (collectionId) {
    // Warm up single collection
    const data = await getCollection(`ben-${collectionId}`);
    return NextResponse.json({
      status: data ? 'ok' : 'failed',
      collection: collectionId,
      hadiths: data?.hadiths?.length || 0,
    });
  }

  // Return cache status
  return NextResponse.json(getCacheStatus());
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { collections = [] } = body;

    const results = {};
    for (const col of collections) {
      const data = await getCollection(`ben-${col}`);
      results[col] = data?.hadiths?.length || 0;
    }

    return NextResponse.json({ warmed: results });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
