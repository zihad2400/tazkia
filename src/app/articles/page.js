'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  FaSearch, FaStar, FaClock, FaChevronRight, FaBookOpen,
  FaTimes, FaFire, FaFilter, FaTh, FaList,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import {
  articles, articleCategories, getFeaturedArticles,
} from '@/lib/data/articlesData';

export default function ArticlesPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // grid | list

  const featured = useMemo(() => getFeaturedArticles(), []);

  // ═══ Filter + Search ═══
  const filtered = useMemo(() => {
    let list = articles;

    if (selectedCategory !== 'all') {
      list = list.filter((a) => a.categoryId === selectedCategory);
    }

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((a) => {
        return (
          a.title.toLowerCase().includes(q) ||
          a.excerpt.toLowerCase().includes(q) ||
          a.content.toLowerCase().includes(q) ||
          (a.author || '').toLowerCase().includes(q) ||
          (a.tags || []).some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    return [...list].sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
  }, [search, selectedCategory]);

  const catCounts = useMemo(() => {
    const counts = { all: articles.length };
    articles.forEach((a) => {
      counts[a.categoryId] = (counts[a.categoryId] || 0) + 1;
    });
    return counts;
  }, []);

  const isFiltering = search.trim() || selectedCategory !== 'all';

  return (
    <div className="w-full max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-10 pb-24 lg:pb-10">
      <Breadcrumb items={[{ label: 'Knowledge' }]} showBack={false} />

      {/* ═══ Header ═══ */}
      <div className="text-center mb-6 sm:mb-8 lg:mb-10">
        <div className="w-14 h-14 sm:w-16 sm:h-16 lg:w-20 lg:h-20 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl mb-3 sm:mb-4">
          <FaBookOpen />
        </div>
        <p className="font-arabic text-gold text-xl sm:text-2xl md:text-3xl mb-1.5 sm:mb-2">
          العلم النافع
        </p>
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2 sm:mb-3">
          Islamic Knowledge
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-base-content/60 max-w-2xl mx-auto px-2">
          কুরআন, সুন্নাহ ও ইসলামী জ্ঞান — বিজ্ঞ আলেমদের গবেষণা সহ
        </p>
      </div>

      {/* ═══ Featured (only when not filtering) ═══ */}
      {!isFiltering && featured.length > 0 && (
        <div className="mb-6 sm:mb-8 lg:mb-10">
          <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/50 mb-3 sm:mb-4 flex items-center gap-2">
            <FaFire size={11} className="text-gold" />
            Featured Articles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            {featured.slice(0, 2).map((article) => {
              const cat = articleCategories.find((c) => c.id === article.categoryId);
              return (
                <Link
                  key={article.id}
                  href={`/articles/${article.slug}`}
                  className="group relative overflow-hidden bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-5 lg:p-6 hover:border-primary hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${cat?.color} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />

                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${cat?.color} text-white font-bold`}>
                        <span>{cat?.icon}</span>
                        {cat?.name}
                      </span>
                      <span className="inline-flex items-center gap-1 text-[10px] text-gold font-bold">
                        <FaStar size={8} />
                        Featured
                      </span>
                    </div>

                    <h3 className="font-bold text-base sm:text-lg lg:text-xl text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-base-content/70 line-clamp-2 sm:line-clamp-3 mb-3 sm:mb-4">
                      {article.excerpt}
                    </p>

                    <div className="flex items-center justify-between text-[10px] sm:text-xs text-base-content/50">
                      <span className="flex items-center gap-1.5">
                        <FaClock size={9} />
                        {article.readTime} মিনিট
                      </span>
                      <span className="flex items-center gap-1 text-primary font-medium group-hover:gap-2 transition-all">
                        পড়ুন
                        <FaChevronRight size={8} />
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Second row of featured */}
          {featured.length > 2 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mt-3 sm:mt-4">
              {featured.slice(2, 5).map((article) => {
                const cat = articleCategories.find((c) => c.id === article.categoryId);
                return (
                  <Link
                    key={article.id}
                    href={`/articles/${article.slug}`}
                    className="group bg-base-200 border border-base-300 rounded-2xl p-4 hover:border-primary hover:shadow-lg transition-all active:scale-[0.98]"
                  >
                    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r ${cat?.color} text-white font-bold mb-2`}>
                      <span>{cat?.icon}</span>
                      {cat?.name}
                    </span>
                    <h3 className="font-bold text-sm text-base-content mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-[11px] text-base-content/60 line-clamp-2 mb-2">
                      {article.excerpt}
                    </p>
                    <div className="flex items-center justify-between text-[10px] text-base-content/50 pt-2 border-t border-base-300">
                      <span className="flex items-center gap-1">
                        <FaClock size={8} />
                        {article.readTime} মিনিট
                      </span>
                      <FaChevronRight size={8} className="text-primary group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ═══ Search + View Toggle ═══ */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <FaSearch className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-base-content/40 z-10" size={12} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="আর্টিকেল খুঁজুন..."
            className="w-full pl-9 sm:pl-11 pr-10 py-2.5 sm:py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-base-300 text-base-content/60"
            >
              <FaTimes size={11} />
            </button>
          )}
        </div>

        {/* View toggle (desktop only) */}
        <div className="hidden sm:flex items-center bg-base-200 border border-base-300 rounded-xl p-1 shrink-0">
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'text-base-content/60 hover:bg-base-300'}`}
            aria-label="Grid view"
          >
            <FaTh size={12} />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`p-2 rounded-lg transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'text-base-content/60 hover:bg-base-300'}`}
            aria-label="List view"
          >
            <FaList size={12} />
          </button>
        </div>
      </div>

      {/* ═══ Category Filter ═══ */}
      <div className="mb-4 sm:mb-5 -mx-3 px-3 sm:mx-0 sm:px-0 overflow-x-auto scrollbar-hide">
        <div className="flex items-center gap-1.5 sm:gap-2 pb-1 min-w-max">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedCategory === 'all'
                ? 'bg-primary text-white'
                : 'bg-base-200 border border-base-300 hover:border-primary'
            }`}
          >
            <FaFilter size={9} />
            সব
            <span className="text-[9px] sm:text-[10px] opacity-70">({catCounts.all})</span>
          </button>
          {articleCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-2.5 sm:px-3 py-1.5 rounded-lg text-[11px] sm:text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? `bg-gradient-to-r ${cat.color} text-white`
                  : 'bg-base-200 border border-base-300 hover:border-primary'
              }`}
            >
              <span>{cat.icon}</span>
              {cat.name}
              <span className="text-[9px] sm:text-[10px] opacity-70">
                ({catCounts[cat.id] || 0})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══ Result Count ═══ */}
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        <p className="text-[11px] sm:text-xs text-base-content/50">
          {filtered.length} টি আর্টিকেল
          {isFiltering && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('all'); }}
              className="ml-2 text-primary hover:underline"
            >
              Clear
            </button>
          )}
        </p>
      </div>

      {/* ═══ Articles Grid / List ═══ */}
      {filtered.length > 0 ? (
        <div
          className={
            viewMode === 'list'
              ? 'space-y-3'
              : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4'
          }
        >
          {filtered.map((article) => {
            const cat = articleCategories.find((c) => c.id === article.categoryId);
            return (
              <Link
                key={article.id}
                href={`/articles/${article.slug}`}
                className={`
                  group bg-base-200 border border-base-300 rounded-2xl hover:border-primary hover:shadow-lg transition-all active:scale-[0.98]
                  ${viewMode === 'list' ? 'p-4 flex items-start gap-4' : 'p-4 flex flex-col'}
                `}
              >
                {viewMode === 'list' && (
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat?.color} flex items-center justify-center text-white text-2xl shrink-0 shadow-md`}>
                    {cat?.icon}
                  </div>
                )}

                <div className={viewMode === 'list' ? 'flex-1 min-w-0' : ''}>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className={`inline-flex items-center gap-1 text-[9px] sm:text-[10px] px-2 py-0.5 rounded-full bg-gradient-to-r ${cat?.color} text-white font-bold`}>
                      <span>{cat?.icon}</span>
                      <span className="truncate">{cat?.name}</span>
                    </span>
                  </div>

                  <h3 className="font-bold text-sm sm:text-base text-base-content mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  <p className={`text-xs text-base-content/60 mb-3 ${viewMode === 'list' ? 'line-clamp-2' : 'line-clamp-3 flex-1'}`}>
                    {article.excerpt}
                  </p>

                  <div className="flex items-center justify-between pt-3 border-t border-base-300 text-[10px] text-base-content/50">
                    <span className="flex items-center gap-1.5">
                      <FaClock size={9} />
                      {article.readTime} মিনিট
                    </span>
                    <span className="flex items-center gap-1 text-primary font-medium">
                      পড়ুন
                      <FaChevronRight size={8} className="group-hover:translate-x-0.5 transition-transform" />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 sm:py-20">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-2xl bg-base-200 flex items-center justify-center mb-4">
            <FaSearch className="text-base-content/30 text-xl sm:text-2xl" />
          </div>
          <p className="text-sm text-base-content/60 mb-4">
            কোনো আর্টিকেল পাওয়া যায়নি
          </p>
          <button
            onClick={() => { setSearch(''); setSelectedCategory('all'); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm font-medium"
          >
            <FaTimes size={11} />
            Filter clear করুন
          </button>
        </div>
      )}
    </div>
  );
}
