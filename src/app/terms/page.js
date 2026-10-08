'use client';

import Link from 'next/link';
import {
  FaFileContract, FaHome, FaCheckCircle, FaTimesCircle,
  FaEnvelope, FaBalanceScale, FaUserCheck, FaBan,
  FaExclamationTriangle, FaGavel, FaHandshake,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function TermsPage() {
  const lastUpdated = '৯ অক্টোবর ২০২৬';

  const sections = [
    {
      icon: FaUserCheck,
      title: '১. সেবার শর্তাবলীর গ্রহণ',
      items: [
        { text: 'TAZKIA ব্যবহার করার মাধ্যমে আপনি এই শর্তাবলীর সাথে সম্পূর্ণভাবে সম্মত হচ্ছেন।' },
        { text: 'আপনি যদি এই শর্তাবলীতে সম্মত না হন, তবে দয়া করে TAZKIA ব্যবহার করবেন না।' },
        { text: 'আমরা যেকোনো সময় এই শর্তাবলী পরিবর্তন করার অধিকার সংরক্ষণ করি।' },
      ],
    },
    {
      icon: FaCheckCircle,
      title: '২. আপনি কী করতে পারেন',
      items: [
        { text: '✅ ব্যক্তিগত ইবাদতের জন্য ব্যবহার করতে পারেন।' },
        { text: '✅ ইসলামিক জ্ঞান শিখতে ও শেয়ার করতে পারেন।' },
        { text: '✅ Bookmark, Reading Progress সংরক্ষণ করতে পারেন।' },
        { text: '✅ Content copy করে অন্যদের সাথে শেয়ার করতে পারেন (proper reference সহ)।' },
        { text: '✅ নিজের ইসলামিক education এ সাহায্য হিসেবে ব্যবহার করতে পারেন।' },
      ],
    },
    {
      icon: FaBan,
      title: '৩. আপনি কী করতে পারবেন না',
      items: [
        { text: '❌ Content পরিবর্তন বা বিকৃতি করা।' },
        { text: '❌ Automated scraping, bot, বা abuse করা।' },
        { text: '❌ Service-কে reverse engineer করা।' },
        { text: '❌ Fake account বা impersonation করা।' },
        { text: '❌ Service-কে কমmercial purpose এ resell করা।' },
        { text: '❌ Islamic content এর সঠিকতা প্রশ্নবিদ্ধ করা।' },
        { text: '❌ অন্য ব্যবহারকারীদের ক্ষতি করা।' },
      ],
    },
    {
      icon: FaBalanceScale,
      title: '৪. Islamic Content এর সঠিকতা',
      items: [
        { subtitle: 'সূত্র ও যাচাই', text: 'সব কুরআন, হাদিস, ও দুআ স্বীকৃত ইসলামিক সূত্র থেকে সংগৃহীত।' },
        { subtitle: 'ভুল পেলে', text: 'যদি কোনো ভুল পান, দয়া করে contact form-এ জানান — আমরা সংশোধন করব।' },
        { subtitle: 'ফতোয়া নয়', text: 'TAZKIA কোনো ইসলামিক ফতোয়া বা ফিকহি সিদ্ধান্ত দেয় না। বাস্তব বিষয়ে যোগ্য আলেমের সাথে পরামর্শ করুন।' },
      ],
    },
    {
      icon: FaHandshake,
      title: '৫. Intellectual Property',
      items: [
        { text: 'TAZKIA-র ডিজাইন, কোড, এবং ব্র্যান্ড আপনার অনুমতি ছাড়া ব্যবহার করা যাবে না।' },
        { text: 'কুরআন, হাদিস, দুআ — যা সর্বসাধারণের সম্পত্তি (public domain)।' },
        { text: 'Translation ও APIs তাদের নিজ নিজ owner-দের সম্পত্তি।' },
      ],
    },
    {
      icon: FaTimesCircle,
      title: '৬. Service এর সীমাবদ্ধতা',
      items: [
        { text: 'TAZKIA "as is" এবং "as available" base এ প্রদান করা হয়।' },
        { text: 'আমরা ১০০% uptime এর guarantee দিই না।' },
        { text: 'Technical issues, downtime, বা data loss এর জন্য আমরা দায়ী নই।' },
        { text: 'আমরা service suspend, modify, বা discontinue করার অধিকার সংরক্ষণ করি।' },
      ],
    },
    {
      icon: FaGavel,
      title: '৭. আচরণের নিয়ম',
      items: [
        { text: 'সম্মানজনক ভাষা ব্যবহার করুন।' },
        { text: 'অন্য মুসলিমদের সাথে ভ্রাতৃত্ব বজায় রাখুন।' },
        { text: 'Fatwa বা বিভেদ সৃষ্টি করে এমন discussion এড়িয়ে চলুন।' },
        { text: 'সব ইসলামিক मतभेदের প্রতি শ্রদ্ধা দেখান।' },
      ],
    },
    {
      icon: FaExclamationTriangle,
      title: '৮. Termination',
      items: [
        { text: 'আমরা যেকোনো সময়, যেকোনো কারণ ছাড়াই, যেকোনো account terminate করার অধিকার সংরক্ষণ করি।' },
        { text: 'আপনি যেকোনো সময় আপনার account delete করতে পারেন।' },
        { text: 'Termination এর পরও কিছু obligation বলবৎ থাকবে।' },
      ],
    },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Terms of Service' }]} showBack={false} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 shadow-xl text-center">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gold flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl mb-4">
            <FaFileContract />
          </div>
          <p className="font-arabic text-gold text-xl sm:text-2xl mb-2">شروط الاستخدام</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">সেবার শর্তাবলী</h1>
          <p className="text-sm sm:text-base text-white/85">
            TAZKIA ব্যবহারের নিয়ম ও শর্তাবলী
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
              দয়া করে এই শর্তাবলী মনোযোগ দিয়ে পড়ুন। TAZKIA ব্যবহার করে আপনি এই শর্তাবলীতে সম্মত হচ্ছেন।
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
            </div>
          );
        })}
      </div>

      {/* Agreement */}
      <div className="mt-6 bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-5 sm:p-6 text-center shadow-lg">
        <FaCheckCircle className="mx-auto text-3xl mb-3 text-gold" />
        <h3 className="text-base sm:text-lg font-bold mb-2">সম্মতি</h3>
        <p className="text-xs sm:text-sm text-white/90 mb-4">
          এই শর্তাবলী মেনে নিয়ে আপনি TAZKIA ব্যবহার চালিয়ে যাচ্ছেন।
        </p>
        <p className="text-[10px] text-gold/80">
          প্রশ্ন থাকলে আমাদের সাথে যোগাযোগ করুন।
        </p>
      </div>

      {/* Contact */}
      <div className="mt-4 text-center">
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 border border-base-300 hover:border-primary text-sm font-medium active:scale-[0.98]"
        >
          <FaEnvelope size={12} />
          যোগাযোগ করুন
        </Link>
      </div>

      {/* Home */}
      <div className="text-center mt-3">
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
