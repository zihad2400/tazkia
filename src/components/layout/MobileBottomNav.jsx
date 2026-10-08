'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaHome, FaQuran, FaClock, FaHands, FaEllipsisH } from 'react-icons/fa';

const items = [
  { name: 'Home', href: '/', icon: FaHome },
  { name: 'Quran', href: '/quran', icon: FaQuran },
  { name: 'Prayer', href: '/prayer', icon: FaClock },
  { name: "Du'a", href: '/duas', icon: FaHands },
  { name: 'More', href: '/more', icon: FaEllipsisH },
];

export default function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-base-100/95 backdrop-blur-xl border-t border-base-300 pb-[env(safe-area-inset-bottom)]">
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {items.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center gap-1 group"
            >
              <div
                className={`flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-200 ${
                  active ? 'bg-primary/15' : 'group-hover:bg-primary/5'
                }`}
              >
                <Icon
                  size={17}
                  className={`transition-colors ${
                    active ? 'text-primary' : 'text-base-content/60'
                  }`}
                />
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? 'text-primary' : 'text-base-content/60'
                }`}
              >
                {item.name}
              </span>
              {active && (
                <span className="absolute bottom-0.5 w-6 h-0.5 bg-primary rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
