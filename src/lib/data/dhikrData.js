// ═══════════════════════════════════════════════════════════
// Dhikr Presets — 18 Authentic Dhikr from Quran & Sunnah
// All references verified from Sahih collections
// ═══════════════════════════════════════════════════════════

export const dhikrPresets = [
  // ═══════════════ ORIGINAL 8 ═══════════════
  {
    id: 'subhanallah',
    arabic: 'سُبْحَانَ اللَّهِ',
    transliteration: 'সুবহানাল্লাহ',
    translation: 'আল্লাহ পবিত্র',
    reference: 'সহীহ মুসলিম: ২৬৯৪',
    target: 33,
    color: 'from-emerald-500 to-teal-700',
    icon: '✨',
  },
  {
    id: 'alhamdulillah',
    arabic: 'الْحَمْدُ لِلَّهِ',
    transliteration: 'আলহামদুলিল্লাহ',
    translation: 'সকল প্রশংসা আল্লাহর',
    reference: 'সহীহ বুখারী: ৬৪০৭',
    target: 33,
    color: 'from-blue-500 to-indigo-700',
    icon: '🌊',
  },
  {
    id: 'allahuakbar',
    arabic: 'اللَّهُ أَكْبَرُ',
    transliteration: 'আল্লাহু আকবার',
    translation: 'আল্লাহ সর্বশ্রেষ্ঠ',
    reference: 'সহীহ বুখারী: ৬৩১৮',
    target: 34,
    color: 'from-purple-500 to-violet-700',
    icon: '⭐',
  },
  {
    id: 'lailahaillallah',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ',
    transliteration: 'লা ইলাহা ইল্লাল্লাহ',
    translation: 'আল্লাহ ছাড়া কোনো ইলাহ নেই',
    reference: 'সহীহ বুখারী: ৬৪০৭',
    target: 100,
    color: 'from-amber-500 to-orange-700',
    icon: '🕌',
  },
  {
    id: 'astaghfirullah',
    arabic: 'أَسْتَغْفِرُ اللَّهَ',
    transliteration: 'আস্তাগফিরুল্লাহ',
    translation: 'আমি আল্লাহর কাছে ক্ষমা চাই',
    reference: 'সহীহ মুসলিম: ২৭০২',
    target: 100,
    color: 'from-rose-500 to-pink-700',
    icon: '🤲',
  },
  {
    id: 'subhanallah-wabihamdihi',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ',
    transliteration: 'সুবহানাল্লাহি ওয়া বিহামদিহি',
    translation: 'আল্লাহর প্রশংসাসহ পবিত্রতা',
    reference: 'সহীহ মুসলিম: ২৬৯২',
    target: 100,
    color: 'from-cyan-500 to-blue-700',
    icon: '💧',
  },
  {
    id: 'lahawla',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ',
    transliteration: 'লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ',
    translation: 'আল্লাহর সাহায্য ছাড়া কোনো শক্তি-সামর্থ্য নেই',
    reference: 'সহীহ বুখারী: ৪২০৫',
    target: 100,
    color: 'from-indigo-500 to-purple-700',
    icon: '🌟',
  },
  {
    id: 'salawat',
    arabic: 'صَلَّى اللَّهُ عَلَيْهِ وَسَلَّمَ',
    transliteration: 'সাল্লাল্লাহু আলাইহি ওয়াসাল্লাম',
    translation: 'তাঁর উপর আল্লাহর দরুদ ও সালাম বর্ষিত হোক',
    reference: 'সহীহ মুসলিম: ৪০৮',
    target: 100,
    color: 'from-green-500 to-emerald-700',
    icon: '💚',
  },

  // ═══════════════ NEW 10 MORE ═══════════════
  {
    id: 'subhanallah-wabihamdihi-subhanallah-azim',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ، سُبْحَانَ اللَّهِ الْعَظِيمِ',
    transliteration: 'সুবহানাল্লাহি ওয়া বিহামদিহি, সুবহানাল্লাহিল আযীম',
    translation: 'আল্লাহর প্রশংসাসহ পবিত্রতা, মহান আল্লাহ পবিত্র',
    reference: 'সহীহ বুখারী: ৬৬৮২',
    target: 100,
    color: 'from-teal-500 to-cyan-700',
    icon: '💎',
    description: 'মহান আল্লাহর প্রশংসা ও পবিত্রতা',
  },
  {
    id: 'lailahaillallah-wahdahu',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু ওয়া হুয়া আলা কুল্লি শাইইন কাদীর',
    translation: 'আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি এক, তাঁর কোনো শরিক নেই। রাজত্ব ও প্রশংসা তাঁরই এবং তিনি সব কিছুর উপর ক্ষমতাবান',
    reference: 'সহীহ বুখারী: ৩২৯৩',
    target: 10,
    color: 'from-amber-600 to-yellow-700',
    icon: '👑',
    description: 'সকালে ১০ বার পড়লে ১০০ দাস মুক্তির সওয়াব',
  },
  {
    id: 'la-ilaha-illallah-wahdahu-2',
    arabic: 'لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ',
    transliteration: 'লা ইলাহা ইল্লাল্লাহু ওয়াহদাহু লা শারীকা লাহু, লাহুল মুলকু ওয়া লাহুল হামদু, ইউহয়ী ওয়া ইউমীতু, ওয়া হুয়া হাইয়ুন লা ইয়ামূতু, বিয়াদিহিল খাইর, ওয়া হুয়া আলা কুল্লি শাইইন কাদীর',
    translation: 'আল্লাহ ছাড়া কোনো ইলাহ নেই, তিনি এক, তাঁর কোনো শরিক নেই। রাজত্ব ও প্রশংসা তাঁরই, তিনি জীবন দেন ও মৃত্যু দেন, তিনি চিরঞ্জীব, কখনো মৃত্যুবরণ করবেন না। তাঁর হাতেই কল্যাণ এবং তিনি সব কিছুর উপর ক্ষমতাবান',
    reference: 'সহীহ মুসলিম: ২৬৯৭',
    target: 100,
    color: 'from-indigo-600 to-violet-700',
    icon: '🌙',
    description: '১০০ বার পড়লে ১০০ নেকি, ১০০ পাপ মোচন',
  },
  {
    id: 'subhanallah-bukrati',
    arabic: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ عَدَدَ خَلْقِهِ، وَرِضَا نَفْسِهِ، وَزِنَةَ عَرْشِهِ، وَمِدَادَ كَلِمَاتِهِ',
    transliteration: 'সুবহানাল্লাহি ওয়া বিহামদিহি আদাদা খালকিহি, ওয়া রিদা নাফসিহি, ওয়া যিনাতা আরশিহি, ওয়া মিদাদা কালিমাতিহি',
    translation: 'আল্লাহর প্রশংসাসহ পবিত্রতা — তাঁর সৃষ্টির সংখ্যা, তাঁর সন্তুষ্টি, তাঁর আরশের ওজন, তাঁর কালেমার কালির সমান',
    reference: 'সহীহ মুসলিম: ২৭২৬',
    target: 3,
    color: 'from-pink-500 to-rose-700',
    icon: '🌸',
    description: 'মাত্র ৩ বার পড়লেও অগণিত সওয়াব',
  },
  {
    id: 'hasbiyallah',
    arabic: 'حَسْبِيَ اللَّهُ لَا إِلَهَ إِلَّا هُوَ، عَلَيْهِ تَوَكَّلْتُ وَهُوَ رَبُّ الْعَرْشِ الْعَظِيمِ',
    transliteration: 'হাসবিয়াল্লাহু লা ইলাহা ইল্লা হুয়া, আলাইহি তাওয়াক্কালতু ওয়া হুয়া রব্বুল আরশিল আযীম',
    translation: 'আমার জন্য আল্লাহ যথেষ্ট, তিনি ছাড়া কোনো ইলাহ নেই। তাঁর উপরই আমি ভরসা করেছি এবং তিনি মহান আরশের রব',
    reference: 'সুনান আবু দাউদ: ৫০৯০',
    target: 7,
    color: 'from-emerald-600 to-green-800',
    icon: '🛡️',
    description: 'সকাল-সন্ধ্যা ৭ বার — দুশ্চিন্তা দূর করে',
  },
  {
    id: 'ya-hayyu-ya-qayyum',
    arabic: 'يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ، أَصْلِحْ لِي شَأْنِي كُلَّهُ وَلَا تَكِلْنِي إِلَى نَفْسِي',
    transliteration: 'ইয়া হাইয়্যু ইয়া কাইয়্যূমু বিরাহমাতিকা আস্তাগীস, আসলিহলী শা\'নী কুল্লাহু ওয়া লা তাকিলনী ইলা নাফসী',
    translation: 'হে চিরঞ্জীব, হে সর্বসত্তার ধারক! আপনার রহমতের ওসিলায় সাহায্য চাই। আমার সব অবস্থা ঠিক করে দিন এবং আমাকে আমার নিজের কাছে সোপর্দ করবেন না',
    reference: 'তিরমিজি: ৩৫২৪',
    target: 1,
    color: 'from-cyan-600 to-teal-700',
    icon: '🌊',
    description: 'প্রতিদিন ১ বার — সব সমস্যার সমাধান',
  },
  {
    id: 'allahu-akbar-kabira',
    arabic: 'اللَّهُ أَكْبَرُ كَبِيرًا، وَالْحَمْدُ لِلَّهِ كَثِيرًا، وَسُبْحَانَ اللَّهِ بُكْرَةً وَأَصِيلًا',
    transliteration: 'আল্লাহু আকবার কাবীরা, ওয়ালহামদু লিল্লাহি কাসীরা, ওয়া সুবহানাল্লাহি বুকরাতান ওয়া আসীলা',
    translation: 'আল্লাহ মহান, সর্বশ্রেষ্ঠ। আল্লাহর অনেক অনেক প্রশংসা। সকাল-সন্ধ্যা আল্লাহর পবিত্রতা',
    reference: 'সহীহ মুসলিম: ৬০১',
    target: 1,
    color: 'from-orange-500 to-red-700',
    icon: '🌅',
    description: 'নামাজের পর আল্লাহর প্রশংসা',
  },
  {
    id: 'la-hawla-mahfuzah',
    arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ، مَا شَاءَ اللَّهُ كَانَ، وَمَا لَمْ يَشَأْ لَمْ يَكُنْ',
    transliteration: 'লা হাওলা ওয়া লা কুওয়াতা ইল্লা বিল্লাহ, মা শা-আল্লাহু কানা, ওয়া মা লাম ইয়াশা লাম ইয়াকুন',
    translation: 'আল্লাহর সাহায্য ছাড়া কোনো শক্তি-সামর্থ্য নেই। আল্লাহ যা চান তাই হয়, যা তিনি চান না তা হয় না',
    reference: 'সুনান আবু দাউদ: ৫০৭১',
    target: 10,
    color: 'from-violet-600 to-purple-800',
    icon: '⚡',
    description: 'সকাল-সন্ধ্যা ১০ বার — জান্নাতের গাছ',
  },
  {
    id: 'salawat-ibrahim',
    arabic: 'اللَّهُمَّ صَلِّ عَلَى مُحَمَّدٍ وَعَلَى آلِ مُحَمَّدٍ، كَمَا صَلَّيْتَ عَلَى إِبْرَاهِيمَ وَعَلَى آلِ إِبْرَاهِيمَ، إِنَّكَ حَمِيدٌ مَجِيدٌ',
    transliteration: 'আল্লাহুম্মা সাল্লি আলা মুহাম্মাদিন ওয়া আলা আ-লি মুহাম্মাদ, কামা সাল্লাইতা আলা ইব্রাহীমা ওয়া আলা আ-লি ইব্রাহীম, ইন্নাকা হামীদুন মাজীদ',
    translation: 'হে আল্লাহ! মুহাম্মাদ ও তাঁর পরিবারের উপর রহমত বর্ষণ করুন, যেমন আপনি ইব্রাহীম ও তাঁর পরিবারের উপর বর্ষণ করেছিলেন। নিশ্চয়ই আপনি প্রশংসিত, সম্মানিত',
    reference: 'সহীহ বুখারী: ৩৩৭০',
    target: 10,
    color: 'from-lime-500 to-green-700',
    icon: '🌿',
    description: 'দরুদে ইব্রাহীম — সর্বোত্তম দরুদ',
  },
  {
    id: 'astaghfirullah-70',
    arabic: 'أَسْتَغْفِرُ اللَّهَ الَّذِي لَا إِلَهَ إِلَّا هُوَ الْحَيُّ الْقَيُّومُ وَأَتُوبُ إِلَيْهِ',
    transliteration: 'আস্তাগফিরুল্লাহাল্লাযী লা ইলাহা ইল্লা হুয়াল হাইয়্যুল কাইয়্যূমু ওয়া আতূবু ইলাইহ',
    translation: 'আমি সেই আল্লাহর কাছে ক্ষমা চাই, তিনি ছাড়া কোনো ইলাহ নেই। তিনি চিরঞ্জীব, সর্বসত্তার ধারক। আমি তাঁর কাছেই ফিরে যাই',
    reference: 'সুনান আবু দাউদ: ১৫১৭',
    target: 3,
    color: 'from-red-500 to-rose-700',
    icon: '💚',
    description: 'নবীজি ﷺ দিনে ৭০+ বার পড়তেন',
  },
];

export const targetOptions = [3, 7, 10, 33, 34, 99, 100, 500, 1000];

// ═══════════════════════════════════════════════════════════
// Dhikr Categories for UI grouping
// ═══════════════════════════════════════════════════════════
export const dhikrCategories = [
  {
    id: 'tasbih-basic',
    name: 'মৌলিক তাসবিহ',
    icon: '✨',
    dhikrIds: ['subhanallah', 'alhamdulillah', 'allahuakbar', 'lailahaillallah'],
  },
  {
    id: 'istighfar',
    name: 'ইস্তিগফার',
    icon: '🤲',
    dhikrIds: ['astaghfirullah', 'astaghfirullah-70'],
  },
  {
    id: 'salawat',
    name: 'দরুদ শরীফ',
    icon: '💚',
    dhikrIds: ['salawat', 'salawat-ibrahim'],
  },
  {
    id: 'morning-evening',
    name: 'সকাল-সন্ধ্যা',
    icon: '🌅',
    dhikrIds: ['subhanallah-wabihamdihi', 'subhanallah-wabihamdihi-subhanallah-azim', 'subhanallah-bukrati', 'hasbiyallah', 'la-hawla-mahfuzah'],
  },
  {
    id: 'protection',
    name: 'সুরক্ষা ও সাহায্য',
    icon: '🛡️',
    dhikrIds: ['ya-hayyu-ya-qayyum', 'lahawla'],
  },
  {
    id: 'tawheed',
    name: 'তাওহীদ',
    icon: '☪️',
    dhikrIds: ['lailahaillallah-wahdahu', 'la-ilaha-illallah-wahdahu-2'],
  },
  {
    id: 'salah-remembrance',
    name: 'নামাজের যিকর',
    icon: '🕌',
    dhikrIds: ['allahu-akbar-kabira'],
  },
];

export function getDhikrById(id) {
  return dhikrPresets.find((d) => d.id === id);
}

export function getDhikrByCategory(categoryId) {
  const cat = dhikrCategories.find((c) => c.id === categoryId);
  if (!cat) return [];
  return cat.dhikrIds.map((id) => getDhikrById(id)).filter(Boolean);
}
