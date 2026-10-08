// ═══════════════════════════════════════════════════════════
// Server-side Hadith Cache
// In-memory + file-based — persists across requests
// ═══════════════════════════════════════════════════════════

import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), '.hadith-cache');
const MEMORY = new Map();
const CACHE_TTL = 1000 * 60 * 60 * 24 * 7; // 7 days

// Ensure cache directory exists
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (err) {
  console.warn('Cache dir creation failed:', err.message);
}

const CDN_URLS = [
  (edition) => `https://raw.githubusercontent.com/fawazahmed0/hadith-api/1/editions/${edition}.min.json`,
  (edition) => `https://cdn.statically.io/gh/fawazahmed0/hadith-api/1/editions/${edition}.min.json`,
  (edition) => `https://raw.githack.com/fawazahmed0/hadith-api/1/editions/${edition}.min.json`,
  (edition) => `https://cdn.jsdelivr.net/gh/fawazahmed0/hadith-api@1/editions/${edition}.min.json`,
];

function getFilePath(edition) {
  return path.join(CACHE_DIR, `${edition}.json`);
}

function getMetaPath(edition) {
  return path.join(CACHE_DIR, `${edition}.meta.json`);
}

// ═══ Memory cache ═══
function getFromMemory(edition) {
  const entry = MEMORY.get(edition);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL) {
    MEMORY.delete(edition);
    return null;
  }
  return entry.data;
}

function saveToMemory(edition, data) {
  try {
    MEMORY.set(edition, { data, timestamp: Date.now() });
  } catch (err) {}
}

// ═══ File cache ═══
function getFromFile(edition) {
  try {
    const filePath = getFilePath(edition);
    const metaPath = getMetaPath(edition);

    if (!fs.existsSync(filePath) || !fs.existsSync(metaPath)) return null;

    const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
    if (Date.now() - meta.timestamp > CACHE_TTL) {
      fs.unlinkSync(filePath);
      fs.unlinkSync(metaPath);
      return null;
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    console.log(`💾 File cache hit: ${edition}`);
    return data;
  } catch (err) {
    console.error('File cache read error:', err.message);
    return null;
  }
}

function saveToFile(edition, data) {
  try {
    const filePath = getFilePath(edition);
    const metaPath = getMetaPath(edition);

    fs.writeFileSync(filePath, JSON.stringify(data));
    fs.writeFileSync(metaPath, JSON.stringify({ timestamp: Date.now() }));
    console.log(`💾 Saved to file: ${edition}`);
  } catch (err) {
    console.error('File cache write error:', err.message);
  }
}

// ═══ Fetch from CDN ═══
async function fetchFromCDN(edition) {
  for (const urlFn of CDN_URLS) {
    try {
      const url = urlFn(edition);
      console.log(`🌐 Server fetching: ${edition}`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ Server fetched: ${edition} (${data.hadiths?.length || 0} items)`);
        return data;
      }
    } catch (err) {
      console.warn(`CDN failed: ${err.message}`);
    }
  }
  return null;
}

// ═══ Main export ═══
export async function getCollection(edition) {
  // 1. Memory
  const fromMem = getFromMemory(edition);
  if (fromMem) {
    console.log(`⚡ Memory cache: ${edition}`);
    return fromMem;
  }

  // 2. File
  const fromFile = getFromFile(edition);
  if (fromFile) {
    saveToMemory(edition, fromFile);
    return fromFile;
  }

  // 3. CDN
  const data = await fetchFromCDN(edition);
  if (data) {
    saveToMemory(edition, data);
    saveToFile(edition, data);
  }
  return data;
}

// ═══ Clear cache ═══
export function clearCache() {
  MEMORY.clear();
  try {
    if (fs.existsSync(CACHE_DIR)) {
      const files = fs.readdirSync(CACHE_DIR);
      files.forEach((f) => fs.unlinkSync(path.join(CACHE_DIR, f)));
    }
  } catch (err) {}
}

// ═══ Cache status ═══
export function getCacheStatus() {
  const files = fs.existsSync(CACHE_DIR) ? fs.readdirSync(CACHE_DIR) : [];
  return {
    memory: Array.from(MEMORY.keys()),
    files: files.filter((f) => !f.endsWith('.meta.json')),
    dir: CACHE_DIR,
  };
}
