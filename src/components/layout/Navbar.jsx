'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useLanguage } from '@/components/providers/LanguageProvider';
import NotificationBell from '@/components/ui/NotificationBell';
import NotificationEngine from '@/components/providers/NotificationEngine';
import { useSession, signOut } from 'next-auth/react';
import {
  FaMosque, FaSearch, FaMoon, FaSun, FaBars, FaTimes,
  FaChevronDown, FaBell, FaLanguage, FaUser, FaBookmark,
  FaCog, FaSignOutAlt, FaHome, FaQuran, FaBookOpen,
  FaHands, FaClock, FaCompass, FaStar, FaCalendar,
  FaSignInAlt, FaUserPlus, FaChartLine,
} from 'react-icons/fa';
import SearchModal from '@/components/layout/SearchModal';

const languages = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'bn', label: 'Bengali', native: 'বাংলা' },
  { code: 'ar', label: 'Arabic', native: 'العربية' },
];

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { lang, setLang, t } = useLanguage();
  const { data: session, status } = useSession();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);

  const isLoading = status === 'loading';
  const isAuthenticated = status === 'authenticated' && session?.user;

  const navLinks = [
    { key: 'home', href: '/', icon: FaHome },
    { key: 'quran', href: '/quran', icon: FaQuran },
    { key: 'hadith', href: '/hadith', icon: FaBookOpen },
    { key: 'duas', href: '/duas', icon: FaHands },
    { key: 'prayer', href: '/prayer', icon: FaClock },
    { key: 'knowledge', href: '/articles', icon: FaBookOpen },
  ];

  // Scroll listener
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Global search event
  useEffect(() => {
    const openSearchHandler = () => setSearchOpen(true);
    window.addEventListener('open-search', openSearchHandler);
    return () => window.removeEventListener('open-search', openSearchHandler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === 'Escape') {
        setSearchOpen(false);
        setMobileOpen(false);
        setUserMenuOpen(false);
        setLangOpen(false);
        setNotifOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // Click outside to close user menu
  useEffect(() => {
    const handleClick = (e) => {
      if (userMenuOpen && !e.target.closest('[data-user-menu]')) {
        setUserMenuOpen(false);
      }
    };
    if (userMenuOpen) {
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }
  }, [userMenuOpen]);

  // Lock body scroll when drawer opens
  useEffect(() => {
    if (mobileOpen || searchOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen, searchOpen]);

  const isDark =
    theme === 'dark' ||
    (theme === 'system' &&
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches);
  const toggleTheme = () => setTheme(isDark ? 'light' : 'dark');

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || 'U';
  const userName = session?.user?.name?.split(' ')[0] || 'User';
  const userEmail = session?.user?.email || '';

  return (
    <>
      {/* ═══ Fixed Navbar Wrapper ═══ */}
      <div className="fixed top-0 left-0 right-0 z-[100] pointer-events-none">
        {/* Announcement Bar */}
        <div className="hidden lg:block bg-gradient-to-r from-primary via-primary-dark to-primary text-white text-xs pointer-events-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
            <p className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-white/90">
                🌙 Ramadan Mubarak — Explore the Ramadan Guide
              </span>
            </p>
            <div className="flex items-center gap-4 text-white/80">
              <span>📍 Dhaka, Bangladesh</span>
              <span className="text-gold">•</span>
              <span>14 Rajab 1447 AH</span>
            </div>
          </div>
        </div>

        {/* Main Navbar */}
        <NotificationEngine />
      <header
          className={`w-full backdrop-blur-xl border-b border-base-300 transition-all duration-300 pointer-events-auto ${
            scrolled ? 'bg-base-100/95 shadow-md' : 'bg-base-100/85'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-14 sm:h-16 gap-2">

              {/* ═══ Logo ═══ */}
              <Link
                href="/"
                className="flex items-center gap-2 group shrink-0 active:scale-95 transition-transform"
              >
                <div className="w-9 h-9 sm:w-10 sm:h-10 lg:w-11 lg:h-11 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-all">
                  <FaMosque size={16} className="sm:hidden" />
                  <FaMosque size={18} className="hidden sm:block" />
                </div>
                <div className="hidden xs:block">
                  <span className="font-bold text-base sm:text-lg lg:text-xl text-base-content tracking-tight leading-none block">
                    TAZKIA
                  </span>
                  <span className="text-[9px] sm:text-[10px] text-base-content/50 tracking-widest uppercase hidden lg:block">
                    Islamic Platform
                  </span>
                </div>
              </Link>

              {/* ═══ Desktop Nav ═══ */}
              <nav className="hidden lg:flex items-center gap-0.5 mx-auto">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const active = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group relative px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                        active
                          ? 'text-primary bg-primary/5'
                          : 'text-base-content/80 hover:text-base-content hover:bg-primary/5'
                      }`}
                    >
                      <Icon size={12} className="opacity-70 group-hover:opacity-100" />
                      <span>{t[link.key]}</span>
                      {active && (
                        <span className="absolute -bottom-[11px] left-1/2 -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full" />
                      )}
                    </Link>
                  );
                })}
              </nav>

              {/* ═══ Right Actions ═══ */}
              <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">

                {/* Search */}
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex items-center gap-1.5 p-2 sm:p-2.5 rounded-lg hover:bg-primary/10 text-base-content transition-all active:scale-95"
                  aria-label="Search"
                >
                  <FaSearch size={14} />
                  <span className="hidden xl:inline text-[10px] text-base-content/50 border border-base-300 rounded px-1.5 py-0.5">
                    ⌘K
                  </span>
                </button>

                {/* Language */}
                <div className="hidden md:block relative">
                  <button
                    onClick={() => setLangOpen((v) => !v)}
                    className="flex items-center gap-1.5 px-2.5 py-2 rounded-lg hover:bg-primary/10 text-base-content text-xs font-semibold transition-all active:scale-95"
                  >
                    <FaLanguage size={16} />
                    <span>{lang?.toUpperCase() || 'EN'}</span>
                  </button>
                  {langOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setLangOpen(false)} />
                      <div className="absolute right-0 mt-2 w-44 z-50 bg-base-100 rounded-xl shadow-xl border border-base-300 p-1.5 animate-fadeIn">
                        {languages.map((l) => (
                          <button
                            key={l.code}
                            onClick={() => { setLang(l.code); setLangOpen(false); }}
                            className={`w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-primary/10 flex items-center justify-between ${
                              lang === l.code ? 'bg-primary/10 text-primary font-semibold' : 'text-base-content'
                            }`}
                          >
                            <span>{l.native}</span>
                            {lang === l.code && <span className="text-primary">✓</span>}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* ═══ Notifications — Dynamic ═══ */}
                {isAuthenticated && (
                  <div className="hidden md:block">
                    <NotificationBell />
                  </div>
                )}

                {/* Theme Toggle */}
                <button
                  onClick={toggleTheme}
                  className="p-2 sm:p-2.5 rounded-lg hover:bg-primary/10 text-base-content transition-all hover:rotate-12 active:scale-95"
                  aria-label="Theme"
                >
                  {isDark ? (
                    <FaSun size={14} className="text-gold" />
                  ) : (
                    <FaMoon size={14} className="text-primary" />
                  )}
                </button>

                {/* ═══ USER / SIGN IN ═══ */}
                {isLoading ? (
                  <div className="w-9 h-9 rounded-full bg-base-200 animate-pulse" />
                ) : isAuthenticated ? (
                  // Authenticated — User Avatar with dropdown
                  <div className="relative" data-user-menu>
                    <button
                      onClick={() => setUserMenuOpen((v) => !v)}
                      className="flex items-center gap-1.5 sm:gap-2 pl-0.5 pr-1.5 sm:pr-2.5 py-1 rounded-full hover:bg-primary/10 transition-all active:scale-95 border border-base-300 hover:border-primary/40"
                    >
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name}
                          className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-gold/30"
                        />
                      ) : (
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-gold to-gold-dark text-white flex items-center justify-center font-bold text-xs shadow-sm">
                          {userInitial}
                        </div>
                      )}
                      <span className="hidden lg:inline text-xs font-semibold text-base-content max-w-[80px] truncate">
                        {userName}
                      </span>
                      <FaChevronDown
                        size={9}
                        className={`text-base-content/60 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {/* User Dropdown */}
                    {userMenuOpen && (
                      <div className="absolute right-0 mt-2 w-72 bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden animate-fadeIn">
                        {/* User Header */}
                        <div className="p-4 bg-gradient-to-br from-primary to-primary-dark text-white">
                          <div className="flex items-center gap-3">
                            {session.user.image ? (
                              <img
                                src={session.user.image}
                                alt={session.user.name}
                                className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/40"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gold text-white flex items-center justify-center font-bold text-lg ring-2 ring-white/20">
                                {userInitial}
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-bold text-sm truncate">{session.user.name}</p>
                              <p className="text-[11px] text-white/70 truncate">{userEmail}</p>
                              {session.user.role && session.user.role !== 'user' && (
                                <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-gold/30 text-white font-bold uppercase tracking-wider">
                                  {session.user.role}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="p-2">
                          <Link
                            href="/dashboard"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 text-base-content transition-colors"
                          >
                            <FaChartLine size={13} className="text-primary" />
                            <span className="flex-1">{t.dashboard}</span>
                            <FaChevronDown size={9} className="-rotate-90 opacity-30" />
                          </Link>
                          <Link
                            href="/profile"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 text-base-content transition-colors"
                          >
                            <FaUser size={13} className="text-primary" />
                            <span className="flex-1">{t.profile}</span>
                            <FaChevronDown size={9} className="-rotate-90 opacity-30" />
                          </Link>
                          <Link
                            href="/bookmarks"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 text-base-content transition-colors"
                          >
                            <FaBookmark size={13} className="text-primary" />
                            <span className="flex-1">{t.bookmarks}</span>
                          </Link>
                          <Link
                            href="/settings"
                            onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-primary/10 text-base-content transition-colors"
                          >
                            <FaCog size={13} className="text-primary" />
                            <span className="flex-1">{t.settings}</span>
                          </Link>

                          {['admin', 'super_admin'].includes(session.user.role) && (
                            <>
                              <div className="my-1 border-t border-base-300" />
                              <Link
                                href="/admin"
                                onClick={() => setUserMenuOpen(false)}
                                className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg hover:bg-gold/10 text-gold font-semibold"
                              >
                                <FaCog size={13} />
                                <span className="flex-1">{t.adminPanel}</span>
                              </Link>
                            </>
                          )}

                          <div className="my-1 border-t border-base-300" />
                          <button
                            onClick={() => {
                              setUserMenuOpen(false);
                              signOut({ callbackUrl: '/' });
                            }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            <FaSignOutAlt size={13} />
                            <span className="flex-1 text-left">{t.logout}</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  // Not authenticated — Sign In button
                  <>
                    <Link
                      href="/login"
                      className="hidden md:inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 bg-primary text-white hover:bg-primary-dark text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-all active:scale-95"
                    >
                      <FaSignInAlt size={11} />
                      <span>{t.signIn}</span>
                    </Link>
                    <Link
                      href="/login"
                      className="md:hidden p-2 rounded-lg hover:bg-primary/10 text-primary transition-all active:scale-95"
                      aria-label="Sign In"
                    >
                      <FaSignInAlt size={16} />
                    </Link>
                  </>
                )}

                {/* Mobile Menu Toggle */}
                <button
                  onClick={() => setMobileOpen(true)}
                  className="lg:hidden p-2 sm:p-2.5 rounded-lg hover:bg-primary/10 text-base-content transition-all active:scale-95"
                  aria-label="Menu"
                >
                  <FaBars size={17} />
                </button>
              </div>
            </div>
          </div>
        </header>
      </div>

      {/* Spacer to push content below fixed navbar */}
      <div className="h-14 sm:h-16 lg:h-24" aria-hidden="true" />

      {/* ═══ Mobile Drawer ═══ */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fadeIn"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute top-0 right-0 w-[85vw] max-w-sm h-full bg-base-100 shadow-2xl flex flex-col animate-slideIn">
            <div className="flex items-center justify-between p-4 border-b border-base-300">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 active:scale-95"
              >
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white">
                  <FaMosque size={16} />
                </div>
                <span className="font-bold text-lg text-base-content">TAZKIA</span>
              </Link>
              <button
                onClick={() => setMobileOpen(false)}
                className="p-2 rounded-lg hover:bg-primary/10 text-base-content active:scale-95"
              >
                <FaTimes size={18} />
              </button>
            </div>

            {/* User Card / Sign In */}
            {isAuthenticated ? (
              <div className="p-4 bg-gradient-to-br from-primary/10 to-transparent border-b border-base-300">
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 active:scale-95"
                >
                  {session.user.image ? (
                    <img
                      src={session.user.image}
                      alt={session.user.name}
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-gold/30"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gold to-gold-dark text-white flex items-center justify-center font-bold text-lg">
                      {userInitial}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-base-content truncate">
                      {session.user.name}
                    </p>
                    <p className="text-xs text-base-content/60 truncate">{userEmail}</p>
                  </div>
                  <FaChevronDown size={10} className="-rotate-90 text-base-content/40" />
                </Link>
              </div>
            ) : (
              <div className="p-4 border-b border-base-300 space-y-2">
                <Link
                  href="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white text-center font-semibold rounded-xl hover:bg-primary-dark transition-colors active:scale-[0.98]"
                >
                  <FaSignInAlt size={13} />
                  সাইন ইন
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-3 border-2 border-primary text-primary text-center font-semibold rounded-xl hover:bg-primary/5 transition-colors active:scale-[0.98]"
                >
                  <FaUserPlus size={13} />
                  একাউন্ট খুলুন
                </Link>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-3">
              <p className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-base-content/40">{t.navigate}</p>
              {navLinks.map((link) => {
                const Icon = link.icon;
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium mb-1 transition-all active:scale-[0.98] ${
                      active ? 'bg-primary text-white shadow-sm' : 'text-base-content hover:bg-primary/10'
                    }`}
                  >
                    <Icon size={16} />
                    <span className="flex-1">{t[link.key]}</span>
                  </Link>
                );
              })}

              {isAuthenticated && (
                <>
                  <p className="px-3 py-2 mt-4 text-[10px] font-bold uppercase tracking-widest text-base-content/40">{t.account}</p>
                  <Link
                    href="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-base-content hover:bg-primary/10 mb-1 active:scale-[0.98]"
                  >
                    <FaChartLine size={16} className="text-primary" />
                    ড্যাশবোর্ড
                  </Link>
                  <Link
                    href="/profile"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-base-content hover:bg-primary/10 mb-1 active:scale-[0.98]"
                  >
                    <FaUser size={16} className="text-primary" />
                    প্রোফাইল
                  </Link>
                  <Link
                    href="/bookmarks"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-base-content hover:bg-primary/10 mb-1 active:scale-[0.98]"
                  >
                    <FaBookmark size={16} className="text-primary" />
                    বুকমার্ক
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-base-content hover:bg-primary/10 mb-1 active:scale-[0.98]"
                  >
                    <FaCog size={16} className="text-primary" />
                    সেটিংস
                  </Link>
                </>
              )}
            </div>

            <div className="p-4 border-t border-base-300 space-y-3">
              {/* Language */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-base-content/60 font-medium">{t.language}</span>
                <div className="flex gap-1">
                  {languages.map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                        lang === l.code ? 'bg-primary text-white' : 'bg-base-200 text-base-content hover:bg-primary/10'
                      }`}
                    >
                      {l.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {isAuthenticated && (
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-red-200 text-red-600 rounded-xl font-medium text-sm hover:bg-red-50"
                >
                  <FaSignOutAlt size={14} />
                  লগ আউট
                </button>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* Search Modal */}
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
