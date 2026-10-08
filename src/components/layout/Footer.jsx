'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaMosque, FaFacebook, FaTwitter, FaInstagram, FaYoutube,
  FaEnvelope, FaMapMarkerAlt, FaArrowRight,
  FaHeart, FaCheck, FaPaperPlane, FaWhatsapp,
  FaGithub, FaSearch, FaQuran, FaBookOpen,
  FaHands, FaClock, FaCompass, FaStar, FaCalendar,
  FaBookmark, FaInfoCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);

  // ═══ Trigger search modal globally ═══
  const openSearch = (e) => {
    e.preventDefault();
    window.dispatchEvent(new Event('open-search'));
  };

  // ═══ Newsletter ═══
  const handleSubscribe = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('সঠিক ইমেইল দিন');
      return;
    }
    setLoading(true);
    try {
      const subs = JSON.parse(localStorage.getItem('tazkia-newsletter') || '[]');
      if (!subs.includes(email)) {
        subs.push(email);
        localStorage.setItem('tazkia-newsletter', JSON.stringify(subs));
      }
      setTimeout(() => {
        setSubscribed(true);
        toast.success('সাবস্ক্রাইব সফল!', { icon: '📬' });
        setEmail('');
        setLoading(false);
        setTimeout(() => setSubscribed(false), 3000);
      }, 700);
    } catch (e) {
      toast.error('সমস্যা হয়েছে');
      setLoading(false);
    }
  };

  // ═══ Navigation Sections ═══
  const sections = [
    {
      title: 'এক্সপ্লোর',
      titleEn: 'Explore',
      links: [
        { name: 'কুরআন', nameEn: 'Quran', href: '/quran', icon: FaQuran },
        { name: 'হাদিস', nameEn: 'Hadith', href: '/hadith', icon: FaBookOpen },
        { name: 'দুআ', nameEn: "Du'as", href: '/duas', icon: FaHands },
        { name: 'নামাজের সময়', nameEn: 'Prayer', href: '/prayer', icon: FaClock },
        { name: 'ইসলামিক জ্ঞান', nameEn: 'Knowledge', href: '/articles', icon: FaBookOpen },
      ],
    },
    {
      title: 'টুলস',
      titleEn: 'Tools',
      links: [
        { name: 'কিবলা', nameEn: 'Qibla', href: '/qibla', icon: FaCompass },
        { name: 'তাসবিহ', nameEn: 'Tasbih', href: '/tasbih', icon: FaStar },
        { name: 'ক্যালেন্ডার', nameEn: 'Calendar', href: '/calendar', icon: FaCalendar },
        { name: 'বুকমার্ক', nameEn: 'Bookmarks', href: '/bookmarks', icon: FaBookmark },
        { name: 'অনুসন্ধান', nameEn: 'Search', href: '#', icon: FaSearch, onClick: openSearch, isAction: true },
      ],
    },
    {
      title: 'প্রতিষ্ঠান',
      titleEn: 'Company',
      links: [
        { name: 'পরিচিতি', nameEn: 'About', href: '/about', icon: FaInfoCircle },
        { name: 'যোগাযোগ', nameEn: 'Contact', href: '/contact', icon: FaEnvelope },
        { name: 'গোপনীয়তা', nameEn: 'Privacy', href: '/privacy', icon: FaInfoCircle },
        { name: 'শর্তাবলী', nameEn: 'Terms', href: '/terms', icon: FaInfoCircle },
      ],
    },
  ];

  // ═══ Social Links — ALL PLACEHOLDER (#) ═══
  const socialLinks = [
    { icon: FaFacebook, href: '#', color: 'hover:bg-blue-600', label: 'Facebook' },
    { icon: FaTwitter, href: '#', color: 'hover:bg-sky-500', label: 'Twitter' },
    { icon: FaInstagram, href: '#', color: 'hover:bg-pink-600', label: 'Instagram' },
    { icon: FaYoutube, href: '#', color: 'hover:bg-red-600', label: 'YouTube' },
    { icon: FaWhatsapp, href: '#', color: 'hover:bg-green-600', label: 'WhatsApp' },
    { icon: FaGithub, href: '#', color: 'hover:bg-gray-700', label: 'GitHub' },
  ];

  return (
    <footer className="relative overflow-hidden bg-[#071A12] text-white mt-20 pb-20 lg:pb-0">

      {/* Decorative Top Border */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold to-transparent" />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="hero-pattern-rotate absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] islamic-geometric-bg" />
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="hero-orb-1 absolute -top-20 -left-20 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
        <div className="hero-orb-2 absolute -bottom-32 -right-20 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Main Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-16">

        {/* Newsletter CTA */}
        <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary rounded-2xl sm:rounded-3xl p-5 sm:p-8 lg:p-10 mb-10 sm:mb-14 shadow-2xl border border-gold/20">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-gold/10 rounded-full blur-3xl" />

          <div className="relative grid lg:grid-cols-2 gap-5 sm:gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gold/20 border border-gold/30 text-gold text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-3">
                <FaEnvelope size={10} />
                Newsletter
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-4xl font-bold mb-2 sm:mb-3 leading-tight">
                সংযুক্ত থাকুন
              </h3>
              <p className="text-xs sm:text-base text-white/80 leading-relaxed max-w-md">
                সাপ্তাহিক ইসলামিক জ্ঞান, নতুন আর্টিকেল, বিশেষ দুআ — সরাসরি আপনার ইমেইলে।
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="w-full">
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                <div className="relative flex-1">
                  <FaEnvelope className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={13} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="আপনার ইমেইল..."
                    disabled={loading || subscribed}
                    className="w-full pl-11 pr-4 py-3 sm:py-3.5 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder:text-white/50 outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all text-sm disabled:opacity-60"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading || subscribed}
                  className={`group inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-lg whitespace-nowrap ${
                    subscribed
                      ? 'bg-green-500 text-white'
                      : 'bg-gold hover:bg-gold-dark text-white shadow-gold/30 hover:scale-105'
                  } disabled:opacity-80`}
                >
                  {subscribed ? (
                    <>
                      <FaCheck size={12} /> হয়েছে
                    </>
                  ) : loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      ...
                    </>
                  ) : (
                    <>
                      <FaPaperPlane size={12} /> সাবস্ক্রাইব
                      <FaArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </>
                  )}
                </button>
              </div>
              <p className="text-[10px] text-white/50 mt-2.5">
                🔒 যেকোনো সময় unsubscribe করতে পারবেন।
              </p>
            </form>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-6 sm:gap-8 mb-8 sm:mb-10">

          {/* Brand Column */}
          <div className="lg:col-span-3 sm:col-span-2 lg:col-span-3">
            <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group mb-4">
              <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-primary via-primary-dark to-primary flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform border border-gold/20">
                <FaMosque size={20} className="text-gold" />
              </div>
              <div>
                <p className="font-bold text-lg sm:text-2xl tracking-tight">TAZKIA</p>
                <p className="text-[9px] sm:text-[10px] text-gold/80 uppercase tracking-widest">
                  Islamic Platform
                </p>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-white/70 leading-relaxed mb-3 max-w-sm">
              <span className="text-gold font-semibold">
                Connect with the Quran. Live with Sunnah. Grow with Faith.
              </span>
            </p>

            <p className="text-[11px] sm:text-xs text-white/50 leading-relaxed mb-4 max-w-sm">
              A modern Islamic digital platform for your spiritual journey.
            </p>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <a
                href="mailto:hello@tazkia.app"
                className="flex items-center gap-2 text-[11px] sm:text-xs text-white/60 hover:text-gold transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center group-hover:bg-gold/20 transition-colors shrink-0">
                  <FaEnvelope size={10} />
                </div>
                <span className="truncate">hello@tazkia.app</span>
              </a>
              <div className="flex items-center gap-2 text-[11px] sm:text-xs text-white/60">
                <div className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <FaMapMarkerAlt size={10} />
                </div>
                <span>Dhaka, Bangladesh</span>
              </div>
            </div>

            {/* ═══ SOCIAL ICONS — All # Links ═══ */}
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gold mb-2">
                Follow Us
              </p>
              <div className="flex flex-wrap gap-1.5">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href="#"
                      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      aria-label={social.label}
                      className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-white/5 border border-white/10 hover:border-gold/40 flex items-center justify-center text-white/70 hover:text-white transition-all hover:scale-110 active:scale-95 cursor-pointer ${social.color}`}
                    >
                      <Icon size={12} />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {sections.map((section) => (
            <div key={section.title} className="lg:col-span-2">
              <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gold mb-3 sm:mb-4 flex items-center gap-2">
                <span className="w-1 h-3 bg-gold rounded-full" />
                {section.title}
              </h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => {
                  const Icon = link.icon;

                  if (link.isAction) {
                    return (
                      <li key={link.name}>
                        <button
                          onClick={link.onClick}
                          className="group inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-gold transition-colors w-full text-left"
                        >
                          <Icon size={10} className="text-gold/60 group-hover:text-gold shrink-0" />
                          <span className="truncate">{link.name}</span>
                          <span className="text-[9px] text-gold/40 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:inline ml-auto">
                            ⌘K
                          </span>
                        </button>
                      </li>
                    );
                  }

                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="group inline-flex items-center gap-2 text-xs sm:text-sm text-white/60 hover:text-gold transition-colors w-full"
                      >
                        <Icon size={10} className="text-gold/60 group-hover:text-gold shrink-0" />
                        <span className="truncate">{link.name}</span>
                        <FaArrowRight
                          size={8}
                          className="text-gold opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all shrink-0 ml-auto"
                        />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Prayer Times Column */}
          <div className="lg:col-span-3 sm:col-span-1">
            <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-gold mb-3 sm:mb-4 flex items-center gap-2">
              <span className="w-1 h-3 bg-gold rounded-full" />
              আজকের নামাজ
            </h4>
            <div className="space-y-2 text-xs">
              {[
                { name: 'ফজর', time: '04:35', icon: '🌅' },
                { name: 'যোহর', time: '12:03', icon: '🌞' },
                { name: 'আসর', time: '15:21', icon: '🌤️' },
                { name: 'মাগরিব', time: '17:41', icon: '🌆' },
                { name: 'ইশা', time: '19:03', icon: '🌙' },
              ].map((p) => (
                <div
                  key={p.name}
                  className="flex items-center justify-between p-1.5 rounded-lg hover:bg-white/5 transition-colors"
                >
                  <span className="text-white/60 flex items-center gap-1.5">
                    <span className="text-sm">{p.icon}</span>
                    {p.name}
                  </span>
                  <span className="font-mono text-white/80 text-[11px]">{p.time}</span>
                </div>
              ))}
              <Link
                href="/prayer"
                className="mt-2 inline-flex items-center gap-1 text-gold hover:gap-2 transition-all text-[11px] font-semibold"
              >
                সব সময় দেখুন
                <FaArrowRight size={9} />
              </Link>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 py-5 sm:py-6 border-y border-white/10">
          {[
            { icon: '📖', title: '১০০% সহীহ', desc: 'প্রমাণিত সূত্র' },
            { icon: '🔒', title: 'নিরাপদ', desc: 'ডেটা সুরক্ষিত' },
            { icon: '⚡', title: 'দ্রুত', desc: 'লোড টাইম' },
            { icon: '📱', title: 'সব ডিভাইস', desc: 'ফুল রেসপন্সিভ' },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center text-base sm:text-lg shrink-0">
                {badge.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[11px] sm:text-xs font-bold text-white truncate">
                  {badge.title}
                </p>
                <p className="text-[9px] sm:text-[10px] text-white/50 truncate">
                  {badge.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 text-[10px] sm:text-xs text-white/50">
              <span>© {new Date().getFullYear()}</span>
              <span className="font-bold text-gold">TAZKIA</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">All rights reserved</span>
            </div>

            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-white/60">
              <span>Made with</span>
              <FaHeart size={10} className="text-red-500 animate-pulse" />
              <span>for the Ummah</span>
            </div>

            <div className="flex items-center gap-1">
              {[
                { code: 'EN', label: 'English' },
                { code: 'বাং', label: 'বাংলা' },
                { code: 'ع', label: 'العربية' },
              ].map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toast.success(`${lang.label} ভাষা নির্বাচিত`)}
                  className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg bg-white/5 hover:bg-gold/20 border border-white/10 hover:border-gold/40 text-[9px] sm:text-[10px] text-white/70 hover:text-gold font-semibold transition-all active:scale-95"
                >
                  {lang.code}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-white/5 flex flex-wrap items-center justify-center gap-x-3 sm:gap-x-4 gap-y-1.5 text-[9px] sm:text-[10px] text-white/40">
            <Link href="/privacy" className="hover:text-gold transition-colors">
              Privacy
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/terms" className="hover:text-gold transition-colors">
              Terms
            </Link>
            <span className="text-white/20">•</span>
            <Link href="/contact" className="hover:text-gold transition-colors">
              Contact
            </Link>
            <span className="text-white/20">•</span>
            <button
              onClick={openSearch}
              className="hover:text-gold transition-colors inline-flex items-center gap-1"
            >
              <FaSearch size={8} />
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Scroll to Top */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gold hover:bg-gold-dark text-white flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all z-50"
      >
        <FaArrowRight size={14} className="-rotate-90" />
      </button>
    </footer>
  );
}
