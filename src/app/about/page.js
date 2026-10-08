'use client';

import Link from 'next/link';
import {
  FaMosque, FaHeart, FaQuran, FaBookOpen, FaHands,
  FaClock, FaCompass, FaStar, FaCalendar, FaUsers,
  FaRocket, FaShieldAlt, FaMobileAlt, FaGlobe,
  FaCheckCircle, FaArrowRight, FaHome, FaEnvelope,
  FaBullseye, FaEye, FaCode,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';

export default function AboutPage() {
  const features = [
    { icon: FaQuran, title: 'কুরআন', desc: '১১৪ সূরা, ৬+ ক্বারী, বাংলা অনুবাদ, তাজবীদ', color: 'from-emerald-500 to-teal-700' },
    { icon: FaBookOpen, title: 'হাদিস', desc: '৭টি সহীহ সংকলন, ৩৪,০০০+ হাদিস, বাংলা অনুবাদ', color: 'from-blue-500 to-indigo-700' },
    { icon: FaHands, title: 'দুআ', desc: 'হিসনুল মুসলিম থেকে ১২ ক্যাটাগরি, সেভ সুবিধা', color: 'from-amber-500 to-orange-700' },
    { icon: FaClock, title: 'নামাজের সময়', desc: '৬৪ জেলা, সালাফি ও হানাফি মাযহাব, লাইভ ক্লক', color: 'from-cyan-500 to-blue-700' },
    { icon: FaCompass, title: 'কিবলা', desc: 'লাইভ কম্পাস, GPS, ৬০+ শহর', color: 'from-purple-500 to-violet-700' },
    { icon: FaStar, title: 'তাসবিহ', desc: '১৮টি সহীহ জিকির, সেশন ট্র্যাকিং', color: 'from-rose-500 to-pink-700' },
    { icon: FaCalendar, title: 'ক্যালেন্ডার', desc: 'হিজরি ও গ্রেগরিয়ান, ইসলামী দিবস', color: 'from-teal-500 to-cyan-700' },
    { icon: FaBookOpen, title: 'ইসলামিক জ্ঞান', desc: '২০+ আর্টিকেল, ১২ ক্যাটাগরি', color: 'from-indigo-500 to-purple-700' },
  ];

  const values = [
    { icon: FaBullseye, title: 'লক্ষ্য', desc: 'প্রতিটি মুসলিমের দৈনন্দিন জীবনে ইসলামিক শিক্ষাকে সহজলভ্য ও সুলভ করা।', color: 'from-primary to-primary-dark' },
    { icon: FaEye, title: 'ভিশন', desc: 'ডিজিটাল যুগে ইসলামের সৌন্দর্য, জ্ঞান ও নির্দেশনা সঠিকভাবে ছড়িয়ে দেওয়া।', color: 'from-gold to-gold-dark' },
    { icon: FaHeart, title: 'মূল্যবোধ', desc: 'সহীহতা, নিরাপত্তা, নির্ভরযোগ্যতা ও উম্মাহর সেবা।', color: 'from-rose-500 to-red-700' },
  ];

  const stats = [
    { value: '৩৪,০০০+', label: 'হাদিস', sub: 'Hadith' },
    { value: '১১৪', label: 'সূরা', sub: 'Surah' },
    { value: '১৮', label: 'জিকির', sub: 'Dhikr' },
    { value: '৬৪', label: 'শহর', sub: 'Cities' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'About' }]} showBack={false} />

      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 shadow-xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="relative text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gold flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl mb-4">
            <FaMosque />
          </div>
          <p className="font-arabic text-gold text-xl sm:text-2xl mb-2">بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-3">
            TAZKIA সম্পর্কে
          </h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed max-w-2xl mx-auto">
            একটি আধুনিক ইসলামিক ডিজিটাল প্ল্যাটফর্ম — যেখানে কুরআন, হাদিস, দুআ, নামাজের সময়, কিবলা, তাসবিহ এবং ইসলামিক জ্ঞান এক জায়গায়।
          </p>
        </div>
      </div>

      {/* Mission Tagline */}
      <div className="bg-gradient-to-br from-gold/10 to-gold/5 border-2 border-gold/30 rounded-2xl p-5 sm:p-6 mb-6 text-center">
        <p className="text-base sm:text-lg md:text-xl font-bold text-primary leading-relaxed">
          &ldquo;Connect with the Quran.<br className="sm:hidden" /> Live with Sunnah. Grow with Faith.&rdquo;
        </p>
        <p className="text-xs sm:text-sm text-base-content/60 mt-2">
          কুরআনের সাথে যুক্ত হোন · সুন্নাহ অনুযায়ী জীবন গড়ুন · ঈমানে বেড়ে উঠুন
        </p>
      </div>

      {/* Story */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-7 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FaHeart size={16} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-base-content">আমাদের গল্প</h2>
        </div>

        <div className="space-y-4 text-sm sm:text-base text-base-content/80 leading-relaxed">
          <p>
            <span className="font-bold text-primary">TAZKIA</span> শব্দের অর্থ <span className="font-semibold">&ldquo;আত্মশুদ্ধি&rdquo;</span> — হৃদয়কে পবিত্র করা, আত্মাকে উন্নত করা, এবং ঈমানে পরিপূর্ণ হওয়া।
          </p>
          <p>
            আমরা লক্ষ্য করেছি যে অনেক ইসলামিক ওয়েবসাইট হয় অত্যন্ত জটিল, হয় বিজ্ঞাপনে ভরা, অথবা সহীহ ডেটা থাকে না। তাই আমরা আধুনিক, দ্রুত, নিরাপদ এবং সহজ একটি ইসলামিক প্ল্যাটফর্ম তৈরি করার সিদ্ধান্ত নিয়েছি।
          </p>
          <p>
            TAZKIA-তে প্রতিটি ডেটা <span className="font-semibold text-primary">প্রমাণিত ইসলামিক সূত্র</span> থেকে সংগৃহীত — কুরআন, সহীহ হাদিস, এবং স্বীকৃত ইসলামিক APIs থেকে।
          </p>
        </div>
      </div>

      {/* Features Grid */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-base-content mb-4 text-center">
          🎯 কী কী আছে TAZKIA-তে?
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div key={i} className="flex items-start gap-3 p-4 bg-base-200 border border-base-300 rounded-2xl hover:border-primary/40 transition-all">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center text-white shrink-0 shadow-sm`}>
                  <Icon size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-bold text-sm sm:text-base text-base-content mb-1">{f.title}</p>
                  <p className="text-xs text-base-content/70 leading-relaxed">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-6">
        {stats.map((s, i) => (
          <div key={i} className="bg-gradient-to-br from-primary to-primary-dark text-white rounded-2xl p-4 text-center shadow-lg">
            <p className="text-xl sm:text-2xl font-bold text-gold mb-0.5">{s.value}</p>
            <p className="text-[11px] sm:text-xs font-semibold">{s.label}</p>
            <p className="text-[9px] text-white/60 uppercase tracking-wider">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Values */}
      <div className="mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-base-content mb-4 text-center">
          💎 আমাদের মূল্যবোধ
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {values.map((v, i) => {
            const Icon = v.icon;
            return (
              <div key={i} className="p-5 bg-base-200 border border-base-300 rounded-2xl text-center">
                <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br ${v.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                  <Icon size={18} />
                </div>
                <h3 className="font-bold text-sm sm:text-base text-base-content mb-2">{v.title}</h3>
                <p className="text-xs text-base-content/70 leading-relaxed">{v.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Why TAZKIA */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-7 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-base-content mb-4">
          ✅ কেন TAZKIA?
        </h2>
        <div className="space-y-3">
          {[
            { icon: FaCheckCircle, text: '১০০% সহীহ ডেটা — শুধু প্রমাণিত ইসলামিক সূত্র থেকে' },
            { icon: FaRocket, text: 'দ্রুত লোডিং — instant response, offline cache' },
            { icon: FaMobileAlt, text: 'সম্পূর্ণ মোবাইল responsive — সব ডিভাইসে কাজ করে' },
            { icon: FaShieldAlt, text: 'নিরাপদ — কোনো trackers, ads, অথবা data collection নেই' },
            { icon: FaHeart, text: 'সম্পূর্ণ ফ্রি — কোনো subscription বা hidden fees নেই' },
            { icon: FaGlobe, text: 'বহুভাষিক — বাংলা, English, العربية' },
            { icon: FaCode, text: 'ওপেন আর্কিটেকচার — আধুনিক web technology' },
            { icon: FaUsers, text: 'উম্মাহর জন্য তৈরি — ইসলামিক মূল্যবোধ অনুসরণ করে' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3">
                <Icon className="text-green-600 shrink-0 mt-0.5" size={14} />
                <p className="text-sm text-base-content/80 leading-relaxed">{item.text}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact CTA */}
      <div className="bg-gradient-to-br from-gold to-gold-dark text-white rounded-2xl p-5 sm:p-7 mb-6 text-center shadow-lg">
        <FaEnvelope className="mx-auto text-3xl mb-3" />
        <h2 className="text-lg sm:text-xl font-bold mb-2">যোগাযোগ করুন</h2>
        <p className="text-sm text-white/90 mb-4 max-w-lg mx-auto">
          কোনো প্রশ্ন, পরামর্শ, বা সমস্যা থাকলে আমাদের সাথে যোগাযোগ করুন।
        </p>
        <div className="flex flex-col sm:flex-row gap-2 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-gold-dark font-semibold text-sm hover:scale-105 active:scale-95 transition-all"
          >
            <FaEnvelope size={12} />
            যোগাযোগ করুন
          </Link>
          <a
            href="mailto:hello@tazkia.app"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 text-white font-semibold text-sm hover:bg-white/30 active:scale-95 transition-all"
          >
            hello@tazkia.app
          </a>
        </div>
      </div>

      {/* Home */}
      <div className="text-center">
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
