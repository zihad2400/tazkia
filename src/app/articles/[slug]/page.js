'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaArrowLeft, FaClock, FaUser, FaCalendar, FaCopy, FaShare,
  FaCheck, FaBookOpen, FaList, FaHome, FaQuoteLeft, FaChevronRight,
  FaStar,
} from 'react-icons/fa';
import { useState } from 'react';
import Breadcrumb from '@/components/layout/Breadcrumb';
import BookmarkButton from '@/components/ui/BookmarkButton';
import toast from 'react-hot-toast';
import { getArticleBySlug, getArticlesByCategory, articleCategories } from '@/lib/data/articlesData';

function parseInline(text) {
  if (!text) return text;
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-bold text-base-content">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ArticleDetailPage() {
  const params = useParams();
  const slug = params.slug;
  const article = getArticleBySlug(slug);
  const [copied, setCopied] = useState(false);

  if (!article) {
    return (
      <div className="max-w-3xl mx-auto px-3 sm:px-4 py-20 text-center">
        <p className="text-base-content/60 mb-4">আর্টিকেল পাওয়া যায়নি</p>
        <Link href="/articles" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-white text-sm">
          <FaArrowLeft size={12} /> সব আর্টিকেল
        </Link>
      </div>
    );
  }

  const category = articleCategories.find((c) => c.id === article.categoryId);
  const related = getArticlesByCategory(article.categoryId).filter((a) => a.id !== article.id).slice(0, 3);

  const copyArticle = () => {
    const text = `${article.title}\n\n${article.content.replace(/\*\*/g, '')}\n\n— TAZKIA Knowledge`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    toast.success('কপি হয়েছে', { icon: '📋' });
    setTimeout(() => setCopied(false), 2000);
  };

  const shareArticle = async () => {
    const text = `${article.title}\n\n${article.excerpt}\n\n— TAZKIA`;
    if (navigator.share) {
      try { await navigator.share({ title: article.title, text }); } catch (e) {}
    } else {
      copyArticle();
    }
  };

  const renderContent = () => {
    const lines = article.content.split('\n');
    return lines.map((line, i) => {
      if (!line.trim()) return <div key={i} className="h-2 sm:h-3" />;

      // Whole-line bold (heading)
      if (line.startsWith('**') && line.endsWith('**') && line.split('**').length === 3) {
        return (
          <h3 key={i} className="text-sm sm:text-base md:text-lg font-bold text-primary mt-5 sm:mt-6 mb-2 sm:mb-3 flex items-start gap-2">
            <span className="text-gold shrink-0">◆</span>
            <span>{line.replace(/\*\*/g, '')}</span>
          </h3>
        );
      }

      // Numbered list
      if (/^[১২৩৪৫৬৭৮৯০1-9]+\.\s/.test(line)) {
        const num = line.match(/^([১২৩৪৫৬৭৮৯০1-9]+\.)/)[0];
        const rest = line.replace(/^[১২৩৪৫৬৭৮৯০1-9]+\.\s*/, '');
        return (
          <p key={i} className="text-xs sm:text-sm md:text-base text-base-content/90 leading-relaxed pl-3 sm:pl-4 mb-1.5">
            <span className="font-semibold text-primary mr-1">{num}</span>
            {parseInline(rest)}
          </p>
        );
      }

      // Bullet list
      if (line.startsWith('- ') || line.startsWith('• ')) {
        return (
          <p key={i} className="text-xs sm:text-sm md:text-base text-base-content/90 leading-relaxed pl-3 sm:pl-4 mb-1.5 flex items-start gap-2">
            <span className="text-gold shrink-0 mt-1.5">▪</span>
            <span className="flex-1">{parseInline(line.substring(2))}</span>
          </p>
        );
      }

      // Quote
      if (line.startsWith('"') || line.startsWith('"')) {
        return (
          <blockquote key={i} className="border-l-4 border-gold bg-gold/5 p-2.5 sm:p-3 my-2.5 sm:my-3 rounded-r-lg">
            <div className="flex gap-2">
              <FaQuoteLeft className="text-gold/60 shrink-0 mt-1" size={10} />
              <p className="text-xs sm:text-sm md:text-base italic text-base-content/90">
                {parseInline(line.replace(/[""]/g, ''))}
              </p>
            </div>
          </blockquote>
        );
      }

      return (
        <p key={i} className="text-xs sm:text-sm md:text-base text-base-content/90 leading-relaxed sm:leading-loose mb-2">
          {parseInline(line)}
        </p>
      );
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-10 pb-24 lg:pb-10">
      <Breadcrumb
        items={[
          { label: 'Knowledge', href: '/articles' },
          { label: category?.name || 'Article' },
        ]}
      />

      {/* ═══ Header Card ═══ */}
      <div className={`relative overflow-hidden bg-gradient-to-br ${category?.color} text-white rounded-2xl p-4 sm:p-6 lg:p-8 mb-4 sm:mb-5 shadow-xl`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-white rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-2 sm:mb-3 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/20 backdrop-blur-sm font-bold">
              <span>{category?.icon}</span>
              {category?.name}
            </span>
            {article.featured && (
              <span className="inline-flex items-center gap-1 text-[10px] sm:text-xs px-2 py-0.5 sm:py-1 rounded-full bg-gold/30 border border-gold/40 font-bold">
                <FaStar size={8} />
                Featured
              </span>
            )}
          </div>

          <h1 className="text-lg sm:text-2xl md:text-3xl font-bold mb-2 sm:mb-3 leading-tight">
            {article.title}
          </h1>

          <p className="text-xs sm:text-sm md:text-base text-white/85 mb-3 sm:mb-4 leading-relaxed">
            {article.excerpt}
          </p>

          <div className="flex items-center gap-3 sm:gap-4 text-[10px] sm:text-xs text-white/80 flex-wrap">
            <span className="flex items-center gap-1.5">
              <FaUser size={9} />
              {article.author}
            </span>
            <span className="flex items-center gap-1.5">
              <FaCalendar size={9} />
              {new Date(article.publishDate).toLocaleDateString('bn-BD', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <FaClock size={9} />
              {article.readTime} মিনিট
            </span>
          </div>
        </div>
      </div>

      {/* ═══ Actions ═══ */}
      <div className="grid grid-cols-2 gap-2 mb-4 sm:mb-5">
        <button
          onClick={copyArticle}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium bg-base-200 border border-base-300 hover:border-primary active:scale-95 transition-all"
        >
          {copied ? (
            <>
              <FaCheck size={11} className="text-green-600" />
              <span className="text-green-700">কপি হয়েছে</span>
            </>
          ) : (
            <>
              <FaCopy size={11} />
              <span>কপি করুন</span>
            </>
          )}
        </button>
        <button
          onClick={shareArticle}
          className="flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium bg-base-200 border border-base-300 hover:border-primary active:scale-95 transition-all"
        >
          <FaShare size={11} />
          <span>শেয়ার</span>
        </button>
      </div>

      {/* ═══ Content ═══ */}
      <article className="bg-base-200 border border-base-300 rounded-2xl p-4 sm:p-6 lg:p-7 mb-4 sm:mb-5">
        <div className="max-w-none">{renderContent()}</div>

        {article.tags?.length > 0 && (
          <div className="mt-5 sm:mt-6 pt-4 sm:pt-5 border-t border-base-300">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2">
              🏷️ ট্যাগ
            </p>
            <div className="flex flex-wrap gap-1.5">
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {article.references?.length > 0 && (
          <div className="mt-4 sm:mt-5 pt-4 sm:pt-5 border-t border-base-300">
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/50 mb-2 sm:mb-3">
              📚 রেফারেন্স
            </p>
            <ul className="space-y-1.5">
              {article.references.map((ref, i) => (
                <li key={i} className="text-[11px] sm:text-xs text-base-content/70 flex items-start gap-2">
                  <span className="text-gold shrink-0 mt-0.5">◆</span>
                  <span>{ref}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </article>

      {/* ═══ Related ═══ */}
      {related.length > 0 && (
        <div className="mb-4 sm:mb-5">
          <h2 className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-base-content/50 mb-3 flex items-center gap-2">
            <FaBookOpen size={11} />
            সম্পর্কিত আর্টিকেল
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
            {related.map((rel) => {
              const relCat = articleCategories.find((c) => c.id === rel.categoryId);
              return (
                <Link
                  key={rel.id}
                  href={`/articles/${rel.slug}`}
                  className="group bg-base-200 border border-base-300 rounded-2xl p-3.5 sm:p-4 hover:border-primary hover:shadow-lg transition-all active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r ${relCat?.color} text-white font-bold`}>
                      <span>{relCat?.icon}</span>
                      <span className="truncate">{relCat?.name}</span>
                    </span>
                  </div>
                  <h3 className="font-bold text-xs sm:text-sm text-base-content mb-1.5 line-clamp-2 group-hover:text-primary transition-colors">
                    {rel.title}
                  </h3>
                  <p className="text-[10px] sm:text-[11px] text-base-content/60 line-clamp-2 mb-2">
                    {rel.excerpt}
                  </p>
                  <span className="flex items-center gap-1 text-[10px] text-primary font-medium">
                    পড়ুন
                    <FaChevronRight size={7} className="group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══ Bottom Nav ═══ */}
      <div className="flex flex-col sm:flex-row gap-2 justify-center">
        <Link
          href="/articles"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium active:scale-[0.98]"
        >
          <FaList size={12} />
          সব আর্টিকেল
        </Link>
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium active:scale-[0.98]"
        >
          <FaHome size={12} />
          হোম
        </Link>
      </div>
    </div>
  );
}
