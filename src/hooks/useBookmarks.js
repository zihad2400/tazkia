'use client';

import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'tazkia-bookmarks';
const SYNC_EVENT = 'tazkia-bookmarks-sync';

function readBookmarks() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeBookmarks(list) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    window.dispatchEvent(new Event(SYNC_EVENT));
  } catch (e) {}
}

export function useBookmarks(type = null) {
  const [list, setList] = useState([]);
  const [mounted, setMounted] = useState(false);

  const refresh = useCallback(() => {
    setList(readBookmarks());
  }, []);

  useEffect(() => {
    refresh();
    setMounted(true);

    const handler = () => refresh();
    window.addEventListener(SYNC_EVENT, handler);
    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener(SYNC_EVENT, handler);
      window.removeEventListener('storage', handler);
    };
  }, [refresh]);

  const bookmarks = type ? list.filter((b) => b.type === type) : list;

  const isBookmarked = useCallback((id) => {
    return readBookmarks().some((b) => b.id === id);
  }, []);

  const add = useCallback((bookmark) => {
    const current = readBookmarks();
    const id = bookmark.id || `${bookmark.type}-${Date.now()}`;
    if (current.some((b) => b.id === id)) return false;

    const newBookmark = { ...bookmark, id, addedAt: new Date().toISOString() };
    const updated = [newBookmark, ...current];
    writeBookmarks(updated);
    setList(updated);
    return true;
  }, []);

  const remove = useCallback((id) => {
    const current = readBookmarks();
    const updated = current.filter((b) => b.id !== id);
    writeBookmarks(updated);
    setList(updated);
  }, []);

  const toggle = useCallback((bookmark) => {
    const current = readBookmarks();
    const id = bookmark.id || `${bookmark.type}-${Date.now()}`;
    const exists = current.some((b) => b.id === id);

    if (exists) {
      const updated = current.filter((b) => b.id !== id);
      writeBookmarks(updated);
      setList(updated);
      return false;
    } else {
      const newBookmark = { ...bookmark, id, addedAt: new Date().toISOString() };
      const updated = [newBookmark, ...current];
      writeBookmarks(updated);
      setList(updated);
      return true;
    }
  }, []);

  const clearType = useCallback((t) => {
    const current = readBookmarks();
    const updated = current.filter((b) => b.type !== t);
    writeBookmarks(updated);
    setList(updated);
  }, []);

  const clearAll = useCallback(() => {
    writeBookmarks([]);
    setList([]);
  }, []);

  const counts = {
    all: list.length,
    quran: list.filter((b) => b.type === 'quran').length,
    hadith: list.filter((b) => b.type === 'hadith').length,
    dua: list.filter((b) => b.type === 'dua').length,
    verse: list.filter((b) => b.type === 'verse').length,
    article: list.filter((b) => b.type === 'article').length,
  };

  return {
    bookmarks, allBookmarks: list, counts, mounted,
    add, remove, toggle, isBookmarked, clearType, clearAll, refresh,
  };
}
