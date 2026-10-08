// ═══════════════════════════════════════════════════════════
// Du'a API Service — Hisnul Muslim Data
// Sources: AhmedBaset/hisn-elmuslim-json (multi-CDN)
// ═══════════════════════════════════════════════════════════

const CDN_MIRRORS = [
  (path) => `https://raw.githubusercontent.com/${path}`,
  (path) => `https://cdn.statically.io/gh/${path}`,
  (path) => `https://raw.githack.com/${path}`,
  (path) => `https://cdn.jsdelivr.net/gh/${path}`,
];

// Data sources (in priority order)
const DATA_SOURCES = [
  {
    name: 'AhmedBaset/hisn',
    path: 'AhmedBaset/hisn-elmuslim-json/main/hisn.json',
  },
  {
    name: 'rn0x/dua-dhikr',
    path: 'rn0x/dua-dhikr/main/data/dua.json',
  },
];

// ═══════ Categories (Du'a types) ═══════
export const duaCategories = [
  {
    id: 'morning-evening',
    name: 'সকাল ও সন্ধ্যা',
    nameAr: 'الصباح والمساء',
    nameEn: 'Morning & Evening',
    icon: '🌅',
    color: 'from-amber-500 to-orange-600',
    description: 'সকাল ও সন্ধ্যার যিকর ও দুআ',
  },
  {
    id: 'sleep',
    name: 'ঘুম',
    nameAr: 'النوم',
    nameEn: 'Sleep & Wake',
    icon: '🌙',
    color: 'from-indigo-500 to-blue-700',
    description: 'ঘুমানোর আগে ও পরে',
  },
  {
    id: 'prayer',
    name: 'নামাজ',
    nameAr: 'الصلاة',
    nameEn: 'Prayer',
    icon: '🕌',
    color: 'from-emerald-500 to-teal-700',
    description: 'নামাজের দুআ',
  },
  {
    id: 'food',
    name: 'খাবার',
    nameAr: 'الطعام',
    nameEn: 'Food & Drink',
    icon: '🍽️',
    color: 'from-rose-500 to-pink-700',
    description: 'খাওয়ার আগে ও পরে',
  },
  {
    id: 'travel',
    name: 'ভ্রমণ',
    nameAr: 'السفر',
    nameEn: 'Travel',
    icon: '✈️',
    color: 'from-cyan-500 to-blue-600',
    description: 'সফরের দুআ',
  },
  {
    id: 'home',
    name: 'ঘর',
    nameAr: 'المنزل',
    nameEn: 'Home',
    icon: '🏠',
    color: 'from-amber-600 to-yellow-700',
    description: 'ঘরে প্রবেশ ও বাহিরে যাওয়ার দুআ',
  },
  {
    id: 'protection',
    name: 'সুরক্ষা',
    nameAr: 'الحماية',
    nameEn: 'Protection',
    icon: '🛡️',
    color: 'from-red-500 to-rose-700',
    description: 'বিপদ ও শত্রু থেকে সুরক্ষা',
  },
  {
    id: 'forgiveness',
    name: 'ক্ষমা',
    nameAr: 'الاستغفار',
    nameEn: 'Forgiveness',
    icon: '🤲',
    color: 'from-purple-500 to-violet-700',
    description: 'আল্লাহর কাছে ক্ষমা প্রার্থনা',
  },
  {
    id: 'hajj-umrah',
    name: 'হজ ও উমরা',
    nameAr: 'الحج والعمرة',
    nameEn: 'Hajj & Umrah',
    icon: '🕋',
    color: 'from-emerald-600 to-green-800',
    description: 'হজ ও উমরার দুআ',
  },
  {
    id: 'ramadan',
    name: 'রমজান',
    nameAr: 'رمضان',
    nameEn: 'Ramadan',
    icon: '🌙',
    color: 'from-indigo-600 to-purple-700',
    description: 'রমজানের বিশেষ দুআ',
  },
  {
    id: 'praise',
    name: 'আল্লাহর প্রশংসা',
    nameAr: 'الثناء',
    nameEn: 'Praise',
    icon: '✨',
    color: 'from-yellow-500 to-amber-700',
    description: 'আল্লাহর প্রশংসার দুআ',
  },
  {
    id: 'quranic',
    name: 'কুরআনিক দুআ',
    nameAr: 'أدعية قرآنية',
    nameEn: 'Quranic Du\'as',
    icon: '📖',
    color: 'from-blue-500 to-indigo-700',
    description: 'কুরআনে বর্ণিত দুআ',
  },
];

// ═══════ Fetch from CDN with fallback ═══════
async function fetchMirrors(path) {
  for (const mirror of CDN_MIRRORS) {
    try {
      const res = await fetch(mirror(path));
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (err) {}
  }
  return null;
}

// ═══════ Normalize Du'a Item ═══════
function normalizeDua(item, index) {
  return {
    id: item.id || index + 1,
    category: item.category || item.category_name || 'General',
    categoryId: item.category_id || null,
    title: item.title || item.name || '',
    arabic: item.arabic || item.arab || '',
    translation: item.translation || item.bangla || item.bn || '',
    transliteration: item.transliteration || item.latin || item.pronunciation || '',
    reference: item.reference || item.source || item.hadith || '',
    count: item.count || item.repeat || 1,
    benefits: item.benefits || item.virtue || '',
  };
}

// ═══════ Fetch all Du'as ═══════
export async function fetchAllDuas() {
  for (const source of DATA_SOURCES) {
    console.log('📖 Trying:', source.name);
    const data = await fetchMirrors(source.path);

    if (data) {
      console.log(`✅ Loaded ${source.name}`);

      // Handle different formats
      let duas = [];

      if (Array.isArray(data)) {
        duas = data.map((d, i) => normalizeDua(d, i));
      } else if (data.duas && Array.isArray(data.duas)) {
        duas = data.duas.map((d, i) => normalizeDua(d, i));
      } else if (data.categories) {
        // Grouped by category
        const all = [];
        Object.entries(data.categories).forEach(([catId, cat]) => {
          const catDuas = cat.duas || cat.items || [];
          catDuas.forEach((d) => {
            all.push(
              normalizeDua({ ...d, category: cat.title || cat.name || catId, categoryId: catId }, all.length)
            );
          });
        });
        duas = all;
      }

      if (duas.length > 0) {
        return duas;
      }
    }
  }
  return null;
}

// ═══════ Fetch by Category ═══════
export async function fetchDuasByCategory(categoryId) {
  const all = await fetchAllDuas();
  if (!all) return [];

  // If categoryId matches a real category name
  return all.filter(
    (d) =>
      d.categoryId === categoryId ||
      d.category?.toLowerCase().includes(categoryId.toLowerCase())
  );
}
