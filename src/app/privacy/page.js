'use client';

import Link from 'next/link';
import {
  FaShieldAlt, FaHome, FaLock, FaEye, FaDatabase,
  FaUserShield, FaCookie, FaEnvelope, FaCheckCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function PrivacyPage() {
  const lastUpdated = '৯ অক্টোবর ২০২৬';

  const sections = [
    {
      icon: FaDatabase,
      title: '১. আমরা কী কী ডেটা সংগ্রহ করি',
      items: [
        {
          subtitle: 'অ্যাকাউন্ট তথ্য (ঐচ্ছিক)',
          text: 'যদি আপনি অ্যাকাউন্ট তৈরি করেন — আপনার নাম, ইমেইল এবং password (encrypted আকারে)।',
        },
        {
          subtitle: 'ব্রাউজিং ডেটা (আপনার ব্রাউজারে সংরক্ষিত)',
          text: 'Bookmark, Reading Progress, Settings, Preferences — সব আপনার browser-এর localStorage-এ থাকে, আমাদের সার্ভারে নয়।',
        },
        {
          subtitle: 'নামাজের অবস্থান (ঐচ্ছিক)',
          text: 'শুধুমাত্র সঠিক নামাজের সময় দেখানোর জন্য আপনার GPS coordinates ব্যবহার করি — যা আমরা সংরক্ষণ করি না।',
        },
      ],
    },
    {
      icon: FaCheckCircle,
      title: '২. আমরা কী করি না',
      items: [
        { text: 'আমরা আপনার ব্যক্তিগত তথ্য বিক্রি করি না।' },
        { text: 'আমরা কোনো third-party advertising trackers ব্যবহার করি না।' },
        { text: 'আমরা আপনার নামাজের location সংরক্ষণ করি না।' },
        { text: 'আমরা আপনার reading progress বা bookmark কারও সাথে share করি না।' },
        { text: 'আমরা কোনো ধরনের behavioral profiling করি না।' },
      ],
    },
    {
      icon: FaLock,
      title: '৩. ডেটা সুরক্ষা',
      items: [
        { text: 'Password bcrypt algorithm দিয়ে encrypt করা হয় (12 rounds)।' },
        { text: 'সমস্ত যোগাযোগ HTTPS/TLS এর মাধ্যমে সুরক্ষিত।' },
        { text: 'আমরা industry-standard security practices অনুসরণ করি।' },
        { text: 'Regular security audits পরিচালনা করি।' },
      ],
    },
    {
      icon: FaEye,
      title: '৪. Third-Party Services',
      items: [
        { subtitle: 'Al-Quran Cloud API', text: 'কুরআনের টেক্সট, অনুবাদ ও অডিওর জন্য।' },
        { subtitle: 'Fawazahmed0 Hadith API', text: 'হাদিসের টেক্সট ও reference এর জন্য।' },
        { subtitle: 'Aladhan API', text: 'নামাজের সময় ও হিজরি তারিখের জন্য।' },
        { subtitle: 'EveryAyah CDN', text: 'Quran audio file serving এর জন্য।' },
      ],
      note: 'এই সব services শুধু public Islamic content serve করে, personal data collect করে না।',
    },
    {
      icon: FaUserShield,
      title: '৫. আপনার অধিকার',
      items: [
        { text: '✅ আপনার অ্যাকাউন্ট ডেটা যেকোনো সময় দেখতে পারেন।' },
        { text: '✅ আপনার অ্যাকাউন্ট ডিলিট করতে পারেন।' },
        { text: '✅ localStorage ডেটা clear করতে পারেন browser থেকে।' },
        { text: '✅ Newsletter থেকে unsubscribe করতে পারেন।' },
      ],
    },
    {
      icon: FaCookie,
      title: '৬. Cookie ও Local Storage',
      items: [
        { text: 'আমরা শুধু functional localStorage ব্যবহার করি — যেমন bookmark, settings, reading progress।' },
        { text: 'কোনো advertising cookies নেই।' },
        { text: 'কোনো cross-site tracking নেই।' },
        { text: 'আপনি browser settings থেকে সব ডেটা delete করতে পারেন।' },
      ],
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Privacy Policy' }]} showBack={false} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 shadow-xl text-center">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gold flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl mb-4">
            <FaShieldAlt />
          </div>
          <p className="font-arabic text-gold text-xl sm:text-2xl mb-2">سياسة الخصوصية</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">গোপনীয়তা নীতি</h1>
          <p className="text-sm sm:text-base text-white/85">
            আপনার privacy আমাদের অগ্রাধিকার
          </p>
          <p className="text-[10px] sm:text-xs text-gold/80 mt-3">
            সর্বশেষ আপডেট: {lastUpdated}
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800 rounded-2xl p-4 sm:p-5 mb-6">
        <div className="flex items-start gap-3">
          <FaExclamationTriangle className="text-amber-600 shrink-0 mt-0.5" size={14} />
          <div className="flex-1 min-w-0">
            <p className="text-sm text-amber-800 dark:text-amber-300 leading-relaxed">
              TAZKIA ব্যবহার করে আপনি এই গোপনীয়তা নীতির সাথে সম্মত হচ্ছেন। আমরা আপনার ব্যক্তিগত তথ্যের সুরক্ষায় প্রতিশ্রুতিবদ্ধ।
            </p>
          </div>
        </div>
      </div>

      {/* Sections */}
      <div className="space-y-4">
        {sections.map((section, i) => {
          const Icon = section.icon;
          return (
            <div key={i} className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Icon size={14} />
                </div>
                <h2 className="text-base sm:text-lg font-bold text-base-content leading-tight">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-3">
                {section.items.map((item, j) => (
                  <div key={j} className="flex items-start gap-2">
                    <span className="text-gold shrink-0 mt-1.5 text-xs">◆</span>
                    <div className="min-w-0 flex-1">
                      {item.subtitle && (
                        <p className="text-sm font-semibold text-base-content mb-0.5">
                          {item.subtitle}
                        </p>
                      )}
                      {item.text && (
                        <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                          {item.text}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {section.note && (
                <div className="mt-4 p-3 bg-base-100 rounded-lg border border-base-300">
                  <p className="text-[11px] text-base-content/60 italic">
                    💡 {section.note}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Contact */}
      <div className="mt-6 bg-gradient-to-br from-gold to-gold-dark text-white rounded-2xl p-5 sm:p-6 text-center shadow-lg">
        <FaEnvelope className="mx-auto text-2xl mb-3" />
        <h3 className="text-base sm:text-lg font-bold mb-2">প্রশ্ন আছে?</h3>
        <p className="text-xs sm:text-sm text-white/90 mb-4">
          গোপনীয়তা নীতি সম্পর্কে কোনো প্রশ্ন থাকলে যোগাযোগ করুন।
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gold-dark font-semibold text-sm hover:scale-105 active:scale-95 transition-all"
        >
          <FaEnvelope size={12} />
          যোগাযোগ করুন
        </Link>
      </div>

      {/* Home */}
      <div className="text-center mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium active:scale-[0.98]"
        >
          <FaHome size={12} />
          হোম
        </Link>
      </div>
    </div>
  );
}
