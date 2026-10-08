'use client';

import Link from 'next/link';
import { FaHome, FaChevronRight, FaArrowLeft } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

/**
 * Responsive Breadcrumb — mobile-friendly horizontal scroll
 */
export default function Breadcrumb({ items = [], showBack = true, showHome = true }) {
  const router = useRouter();

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 min-w-0">
        {/* Back button */}
        {showBack && (
          <button
            onClick={() => router.back()}
            className="shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-base-200 border border-base-300 hover:border-primary hover:bg-primary/5 flex items-center justify-center text-base-content hover:text-primary transition-all active:scale-95"
            aria-label="Go back"
          >
            <FaArrowLeft size={11} />
          </button>
        )}

        {/* Breadcrumbs — horizontally scrollable on mobile */}
        <nav className="flex items-center gap-1 text-xs sm:text-sm min-w-0 overflow-x-auto scrollbar-hide py-1">
          {showHome && (
            <>
              <Link
                href="/"
                className="shrink-0 flex items-center gap-1 text-base-content/60 hover:text-primary transition-colors px-1.5 sm:px-2 py-1 rounded-lg hover:bg-primary/5"
              >
                <FaHome size={10} />
                <span>Home</span>
              </Link>
              {items.length > 0 && (
                <FaChevronRight size={7} className="text-base-content/30 shrink-0" />
              )}
            </>
          )}

          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            return (
              <div key={i} className="flex items-center gap-1 shrink-0">
                {item.href && !isLast ? (
                  <Link
                    href={item.href}
                    className="text-base-content/60 hover:text-primary transition-colors px-1.5 sm:px-2 py-1 rounded-lg hover:bg-primary/5 whitespace-nowrap"
                  >
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-base-content font-semibold px-1.5 sm:px-2 py-1 whitespace-nowrap">
                    {item.label}
                  </span>
                )}
                {!isLast && (
                  <FaChevronRight size={7} className="text-base-content/30 shrink-0" />
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
