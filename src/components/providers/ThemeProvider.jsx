'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('dark');
  const [mounted, setMounted] = useState(false);

  // ═══ Initial load — always default to 'dark' if nothing stored ═══
  useEffect(() => {
    let stored = null;
    try {
      stored = localStorage.getItem('tazkia-theme');
    } catch (e) {}
    // Default to dark if no preference stored
    setTheme(stored || 'dark');
    setMounted(true);
  }, []);

  // ═══ Apply theme to document ═══
  useEffect(() => {
    if (!mounted) return;

    try {
      localStorage.setItem('tazkia-theme', theme);
    } catch (e) {}

    const root = document.documentElement;
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.setAttribute('data-theme', isDark ? 'tazkiaDark' : 'tazkia');
    root.style.colorScheme = isDark ? 'dark' : 'light';
  }, [theme, mounted]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
