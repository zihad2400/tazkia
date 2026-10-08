'use client';

import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'tazkia-bookmarks';
const SYNC_EVENT = 'tazkia-bookmarks-sync';

export default function BookmarkButton({
  bookmark,
  size = 'md',
  variant = 'icon',
  showLabel = false,
}) {
  const [bookmarked, setBookmarked] = useState(false);
  const [pulse, setPulse] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Check on mount
  useEffect(() => {
    setMounted(true);

    const check = () => {
      if (!bookmark?.id) {
        setBookmarked(false);
        return;
      }
      try {
        const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        setBookmarked(list.some((b) => b.id === bookmark.id));
      } catch (e) {
        setBookmarked(false);
      }
    };

    check();
    window.addEventListener(SYNC_EVENT, check);
    window.addEventListener('storage', check);

    return () => {
      window.removeEventListener(SYNC_EVENT, check);
      window.removeEventListener('storage', check);
    };
  }, [bookmark?.id]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!bookmark?.id) {
      toast.error('বুকমার্ক তথ্য নেই');
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const list = raw ? JSON.parse(raw) : [];
      const safeList = Array.isArray(list) ? list : [];
      const exists = safeList.some((b) => b.id === bookmark.id);

      let updated;

      if (exists) {
        updated = safeList.filter((b) => b.id !== bookmark.id);
        setBookmarked(false);
        toast.success('বুকমার্ক সরানো হয়েছে', { icon: '🗑️', duration: 2000 });
      } else {
        const newBookmark = {
          id: bookmark.id,
          type: bookmark.type || 'quran',
          title: bookmark.title || '',
          subtitle: bookmark.subtitle || '',
          arabic: bookmark.arabic || '',
          text: bookmark.text || '',
          translation: bookmark.translation || '',
          reference: bookmark.reference || '',
          surahNumber: bookmark.surahNumber,
          ayahNumber: bookmark.ayahNumber,
          collectionId: bookmark.collectionId,
          hadithNumber: bookmark.hadithNumber,
          categoryId: bookmark.categoryId,
          slug: bookmark.slug,
          addedAt: new Date().toISOString(),
        };
        updated = [newBookmark, ...safeList];
        setBookmarked(true);
        toast.success('বুকমার্কে সেভ হয়েছে', { icon: '🔖', duration: 2000 });
      }

      // Save
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      // Notify
      window.dispatchEvent(new Event(SYNC_EVENT));

      setPulse(true);
      setTimeout(() => setPulse(false), 300);
    } catch (err) {
      console.error('Bookmark error:', err);
      toast.error('বুকমার্ক করা যায়নি');
    }
  };

  const sizes = {
    sm: { icon: 11, pad: 'p-1.5', text: 'text-[10px]', gap: 'gap-1' },
    md: { icon: 13, pad: 'p-2', text: 'text-xs', gap: 'gap-1.5' },
    lg: { icon: 15, pad: 'p-2.5', text: 'text-sm', gap: 'gap-2' },
  };

  const s = sizes[size] || sizes.md;

  if (!mounted) return null;

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={`${s.pad} rounded-lg transition-all active:scale-95 ${
          bookmarked
            ? 'text-gold bg-gold/15 hover:bg-gold/25'
            : 'text-base-content/60 hover:text-gold hover:bg-gold/10'
        } ${pulse ? 'scale-110' : ''}`}
        title={bookmarked ? 'বুকমার্ক সরান' : 'বুকমার্ক করুন'}
        aria-label={bookmarked ? 'Remove bookmark' : 'Add bookmark'}
      >
        {bookmarked ? <FaBookmark size={s.icon} /> : <FaRegBookmark size={s.icon} />}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`inline-flex items-center justify-center ${s.gap} ${s.pad} ${
        variant === 'button' ? 'px-3 w-full' : ''
      } rounded-lg font-medium transition-all active:scale-95 ${
        bookmarked
          ? 'bg-gold/15 text-gold border border-gold/40 hover:bg-gold/25'
          : 'bg-base-200 border border-base-300 hover:border-gold text-base-content'
      } ${s.text} ${pulse ? 'scale-105' : ''}`}
    >
      {bookmarked ? <FaBookmark size={s.icon} /> : <FaRegBookmark size={s.icon} />}
      {(showLabel || variant === 'button') && (
        <span>{bookmarked ? 'সেভ করা' : 'বুকমার্ক'}</span>
      )}
    </button>
  );
}
