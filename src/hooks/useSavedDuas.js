'use client';

import { useState, useEffect } from 'react';

const STORAGE_KEY = 'tazkia-saved-duas';

// Custom event to sync across components
const SYNC_EVENT = 'tazkia-saved-duas-change';

export function useSavedDuas() {
  const [saved, setSaved] = useState([]);
  const [mounted, setMounted] = useState(false);

  // Load from localStorage
  useEffect(() => {
    const load = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        setSaved(stored ? JSON.parse(stored) : []);
      } catch (err) {
        setSaved([]);
      }
    };
    load();
    setMounted(true);

    // Listen for changes from other components
    const handleChange = () => load();
    window.addEventListener(SYNC_EVENT, handleChange);
    window.addEventListener('storage', handleChange);

    return () => {
      window.removeEventListener(SYNC_EVENT, handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  const save = (dua) => {
    const newItem = {
      id: dua.id,
      categoryId: dua.categoryId,
      title: dua.title,
      arabic: dua.arabic,
      transliteration: dua.transliteration,
      translation: dua.translation,
      reference: dua.reference,
      count: dua.count,
      savedAt: Date.now(),
    };

    setSaved((prev) => {
      const filtered = prev.filter((d) => d.id !== dua.id);
      const updated = [newItem, ...filtered];
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(SYNC_EVENT));
      } catch (err) {}
      return updated;
    });
  };

  const remove = (id) => {
    setSaved((prev) => {
      const updated = prev.filter((d) => d.id !== id);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        window.dispatchEvent(new Event(SYNC_EVENT));
      } catch (err) {}
      return updated;
    });
  };

  const toggle = (dua) => {
    const isSaved = saved.some((d) => d.id === dua.id);
    if (isSaved) remove(dua.id);
    else save(dua);
    return !isSaved;
  };

  const isSaved = (id) => saved.some((d) => d.id === id);
  const clearAll = () => {
    setSaved([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
      window.dispatchEvent(new Event(SYNC_EVENT));
    } catch (err) {}
  };

  return {
    saved,
    save,
    remove,
    toggle,
    isSaved,
    clearAll,
    count: saved.length,
    mounted,
  };
}
