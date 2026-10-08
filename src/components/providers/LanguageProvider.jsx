'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { getTranslation } from '@/lib/i18n';

const LanguageContext = createContext({
  lang: 'en',
  setLang: () => {},
  t: getTranslation('en'),
});

export function LanguageProvider({ children }) {
  const [lang, setLangState] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('tazkia-lang') || 'en';
    setLangState(stored);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    localStorage.setItem('tazkia-lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang, mounted]);

  const setLang = (newLang) => {
    setLangState(newLang);
  };

  const t = getTranslation(lang);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
