'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useLanguage } from '@/components/providers/LanguageProvider';

const PAGE_TITLES = {
  '/': { en: 'TAZKIA', bn: 'তাযকিয়া', ar: 'تزكية' },
  '/quran': { en: 'Al-Quran', bn: 'আল-কুরআন', ar: 'القرآن' },
  '/hadith': { en: 'Hadith', bn: 'হাদিস', ar: 'الحديث' },
  '/duas': { en: "Du'a", bn: 'দুআ', ar: 'الأدعية' },
  '/prayer': { en: 'Prayer Times', bn: 'নামাজের সময়', ar: 'أوقات الصلاة' },
  '/qibla': { en: 'Qibla', bn: 'কিবলা', ar: 'القبلة' },
  '/tasbih': { en: 'Tasbih', bn: 'তাসবিহ', ar: 'التسبيح' },
  '/calendar': { en: 'Calendar', bn: 'ক্যালেন্ডার', ar: 'التقويم' },
  '/login': { en: 'Sign In', bn: 'সাইন ইন', ar: 'تسجيل الدخول' },
  '/register': { en: 'Create Account', bn: 'একাউন্ট খুলুন', ar: 'إنشاء حساب' },
  '/profile': { en: 'Profile', bn: 'প্রোফাইল', ar: 'الملف الشخصي' },
  '/settings': { en: 'Settings', bn: 'সেটিংস', ar: 'الإعدادات' },
  '/notifications': { en: 'Notifications', bn: 'নোটিফিকেশন', ar: 'الإشعارات' },
  '/dashboard': { en: 'Dashboard', bn: 'ড্যাশবোর্ড', ar: 'لوحة التحكم' },
  '/bookmarks': { en: 'Bookmarks', bn: 'বুকমার্ক', ar: 'المفضلة' },
  '/articles': { en: 'Articles', bn: 'আর্টিকেল', ar: 'المقالات' },
  '/about': { en: 'About', bn: 'সম্পর্কে', ar: 'حول' },
  '/contact': { en: 'Contact', bn: 'যোগাযোগ', ar: 'اتصل' },
  '/privacy': { en: 'Privacy', bn: 'গোপনীয়তা', ar: 'الخصوصية' },
  '/terms': { en: 'Terms', bn: 'শর্তাবলী', ar: 'الشروط' },
};

// No emoji — clean text only
const ATTENTION_TITLE = {
  en: 'Come back to TAZKIA',
  bn: 'TAZKIA-তে ফিরে আসুন',
  ar: 'عد إلى تزكية',
};

export default function DynamicTitle() {
  const pathname = usePathname();
  const { lang } = useLanguage();

  // Update title based on route + language
  useEffect(() => {
    const basePath = '/' + (pathname.split('/')[1] || '');
    const titles = PAGE_TITLES[basePath] || PAGE_TITLES['/'];
    const pageTitle = titles[lang] || titles.en;
    const suffix = lang === 'bn' ? 'তাযকিয়া' : lang === 'ar' ? 'تزكية' : 'TAZKIA';

    document.title = basePath === '/'
      ? pageTitle
      : `${pageTitle} | ${suffix}`;
  }, [pathname, lang]);

  // Change title when tab is not visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = ATTENTION_TITLE[lang] || ATTENTION_TITLE.en;
      } else {
        // Restore original title
        const basePath = '/' + (pathname.split('/')[1] || '');
        const titles = PAGE_TITLES[basePath] || PAGE_TITLES['/'];
        const pageTitle = titles[lang] || titles.en;
        const suffix = lang === 'bn' ? 'তাযকিয়া' : lang === 'ar' ? 'تزكية' : 'TAZKIA';
        document.title = basePath === '/'
          ? pageTitle
          : `${pageTitle} | ${suffix}`;
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [pathname, lang]);

  return null;
}
