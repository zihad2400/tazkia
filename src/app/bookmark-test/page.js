'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BookmarkTestPage() {
  const [storage, setStorage] = useState('');
  const [status, setStatus] = useState('');

  const readStorage = () => {
    try {
      const raw = localStorage.getItem('tazkia-bookmarks');
      setStorage(raw || '(empty)');
    } catch (e) {
      setStorage('ERROR: ' + e.message);
    }
  };

  useEffect(() => {
    readStorage();
  }, []);

  const testAdd = () => {
    try {
      const test = {
        id: `test-${Date.now()}`,
        type: 'quran',
        title: 'Test Bookmark #' + Date.now(),
        text: 'This is a test bookmark',
        reference: 'Test 1:1',
        addedAt: new Date().toISOString(),
      };

      const current = JSON.parse(localStorage.getItem('tazkia-bookmarks') || '[]');
      const updated = [test, ...current];
      localStorage.setItem('tazkia-bookmarks', JSON.stringify(updated));

      window.dispatchEvent(new Event('tazkia-bookmarks-sync'));

      setStatus(`✅ Added! Total: ${updated.length}`);
      readStorage();
    } catch (e) {
      setStatus('❌ Error: ' + e.message);
    }
  };

  const testClear = () => {
    try {
      localStorage.setItem('tazkia-bookmarks', '[]');
      window.dispatchEvent(new Event('tazkia-bookmarks-sync'));
      setStatus('🗑️ Cleared');
      readStorage();
    } catch (e) {
      setStatus('❌ Error: ' + e.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Bookmark Test Page</h1>

      <div className="space-y-4">
        <div className="bg-base-200 p-4 rounded-2xl border border-base-300">
          <h2 className="font-bold mb-2">Status:</h2>
          <p className="text-sm font-mono">{status || '(no action yet)'}</p>
        </div>

        <div className="bg-base-200 p-4 rounded-2xl border border-base-300">
          <h2 className="font-bold mb-2">Current localStorage:</h2>
          <pre className="text-xs bg-base-100 p-3 rounded-lg overflow-auto max-h-60 break-all whitespace-pre-wrap">
            {storage}
          </pre>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={testAdd}
            className="px-4 py-2 bg-primary text-white rounded-lg font-medium active:scale-95"
          >
            ➕ Test Add Bookmark
          </button>
          <button
            onClick={testClear}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium active:scale-95"
          >
            🗑️ Clear All
          </button>
          <button
            onClick={readStorage}
            className="px-4 py-2 bg-base-200 border border-base-300 rounded-lg font-medium active:scale-95"
          >
            🔄 Refresh
          </button>
        </div>

        <div className="pt-4">
          <Link
            href="/bookmarks"
            className="inline-block px-4 py-2 bg-gold text-white rounded-lg font-medium"
          >
            → Go to /bookmarks
          </Link>
        </div>
      </div>
    </div>
  );
}
