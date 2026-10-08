'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  FaEnvelope, FaMapMarkerAlt, FaPhone, FaPaperPlane,
  FaCheck, FaHome, FaClock, FaFacebook, FaTwitter,
  FaInstagram, FaYoutube, FaGithub, FaWhatsapp,
  FaSpinner,
} from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      toast.error('সব প্রয়োজনীয় ঘর পূরণ করুন');
      return;
    }

    if (!form.email.includes('@')) {
      toast.error('সঠিক ইমেইল দিন');
      return;
    }

    setLoading(true);

    // Save to localStorage (for demo)
    try {
      const messages = JSON.parse(localStorage.getItem('tazkia-contact-messages') || '[]');
      messages.push({
        ...form,
        id: Date.now(),
        sentAt: new Date().toISOString(),
      });
      localStorage.setItem('tazkia-contact-messages', JSON.stringify(messages));
    } catch (e) {}

    setTimeout(() => {
      setLoading(false);
      setSent(true);
      toast.success('বার্তা পাঠানো হয়েছে!', { icon: '✉️' });
      setForm({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setSent(false), 5000);
    }, 800);
  };

  const contactMethods = [
    { icon: FaEnvelope, label: 'ইমেইল', value: 'hello@tazkia.app', href: 'mailto:hello@tazkia.app', color: 'from-blue-500 to-indigo-700' },
    { icon: FaMapMarkerAlt, label: 'অবস্থান', value: 'Dhaka, Bangladesh', href: null, color: 'from-emerald-500 to-teal-700' },
    { icon: FaClock, label: 'প্রতিক্রিয়া সময়', value: '২৪ ঘণ্টার মধ্যে', href: null, color: 'from-amber-500 to-orange-700' },
  ];

  const socialLinks = [
    { icon: FaFacebook, label: 'Facebook', href: 'https://facebook.com', color: 'hover:bg-blue-600' },
    { icon: FaTwitter, label: 'Twitter', href: 'https://twitter.com', color: 'hover:bg-sky-500' },
    { icon: FaInstagram, label: 'Instagram', href: 'https://instagram.com', color: 'hover:bg-pink-600' },
    { icon: FaYoutube, label: 'YouTube', href: 'https://youtube.com', color: 'hover:bg-red-600' },
    { icon: FaWhatsapp, label: 'WhatsApp', href: 'https://whatsapp.com', color: 'hover:bg-green-600' },
    { icon: FaGithub, label: 'GitHub', href: 'https://github.com', color: 'hover:bg-gray-700' },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Contact' }]} showBack={false} />

      {/* ═══ Hero ═══ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 mb-6 shadow-xl text-center">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="relative">
          <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-gold flex items-center justify-center text-white text-2xl sm:text-3xl shadow-xl mb-4">
            <FaEnvelope />
          </div>
          <p className="font-arabic text-gold text-xl sm:text-2xl mb-2">تواصل معنا</p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3">যোগাযোগ করুন</h1>
          <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto">
            কোনো প্রশ্ন, পরামর্শ, বা সমস্যা থাকলে আমাদের সাথে যোগাযোগ করুন — আমরা ২৪ ঘণ্টার মধ্যে উত্তর দেব।
          </p>
        </div>
      </div>

      {/* ═══ Contact Methods ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {contactMethods.map((m, i) => {
          const Icon = m.icon;
          const Wrapper = m.href ? 'a' : 'div';
          return (
            <Wrapper
              key={i}
              {...(m.href ? { href: m.href } : {})}
              className="flex flex-col items-center text-center p-5 bg-base-200 border border-base-300 rounded-2xl hover:border-primary/40 transition-all"
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${m.color} flex items-center justify-center text-white mb-3 shadow-md`}>
                <Icon size={16} />
              </div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-base-content/50 mb-1">
                {m.label}
              </p>
              <p className="text-sm font-semibold text-base-content break-all">{m.value}</p>
            </Wrapper>
          );
        })}
      </div>

      {/* ═══ Form ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-7 mb-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FaPaperPlane size={14} />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-base-content">বার্তা পাঠান</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-base-content/70 mb-2">
                আপনার নাম *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="আপনার নাম"
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-base-content/70 mb-2">
                ইমেইল *
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/70 mb-2">
              বিষয়
            </label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              placeholder="বার্তার বিষয়"
              className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-base-content/70 mb-2">
              বার্তা *
            </label>
            <textarea
              name="message"
              value={form.message}
              onChange={handleChange}
              required
              rows={5}
              placeholder="আপনার বার্তা বিস্তারিত লিখুন..."
              className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading || sent}
            className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm transition-all active:scale-[0.98] shadow-md ${
              sent
                ? 'bg-green-500 text-white'
                : 'bg-primary hover:bg-primary-dark text-white'
            } disabled:opacity-70`}
          >
            {sent ? (
              <>
                <FaCheck size={13} />
                বার্তা পাঠানো হয়েছে!
              </>
            ) : loading ? (
              <>
                <FaSpinner className="animate-spin" size={13} />
                পাঠানো হচ্ছে...
              </>
            ) : (
              <>
                <FaPaperPlane size={13} />
                বার্তা পাঠান
              </>
            )}
          </button>

          <p className="text-[10px] text-base-content/50 text-center">
            * চিহ্নিত ঘরগুলো অবশ্যই পূরণ করুন। আমরা আপনার তথ্য সুরক্ষিত রাখব।
          </p>
        </form>
      </div>

      {/* ═══ Social ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-6 mb-6 text-center">
        <h3 className="text-sm font-bold text-base-content mb-3">আমাদের অনুসরণ করুন</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {socialLinks.map((s, i) => {
            const Icon = s.icon;
            return (
              <a
                key={i}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className={`w-11 h-11 rounded-xl bg-base-100 border border-base-300 flex items-center justify-center text-base-content/70 hover:text-white transition-all hover:scale-110 active:scale-95 ${s.color}`}
              >
                <Icon size={15} />
              </a>
            );
          })}
        </div>
      </div>

      {/* ═══ FAQ ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-7 mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-base-content mb-4">
          ❓ সচরাচর জিজ্ঞাসা
        </h2>
        <div className="space-y-4">
          {[
            { q: 'TAZKIA কি ফ্রি?', a: 'হ্যাঁ, TAZKIA সম্পূর্ণ ফ্রি। কোনো subscription, ads, অথবা hidden fees নেই।' },
            { q: 'ডেটা কোথা থেকে আসে?', a: 'কুরআন Al-Quran Cloud API থেকে, হাদিস Fawazahmed0\'s Hadith API থেকে, দুআ হিসনুল মুসলিম থেকে, এবং নামাজের সময় Aladhan API থেকে।' },
            { q: 'আমার data কি নিরাপদ?', a: 'হ্যাঁ। আমরা কোনো personal data collect করি না। সব bookmark ও settings আপনার browser-এ (localStorage) save থাকে।' },
            { q: 'কোন ভাষায় পাওয়া যায়?', a: 'বর্তমানে বাংলা, English, এবং العربية ভাষায় ব্যবহার করা যায়।' },
            { q: 'আরো feature চাইলে?', a: 'আমাদের contact form-এ বার্তা পাঠান। আপনার suggestion আমাদের জন্য মূল্যবান।' },
          ].map((item, i) => (
            <details key={i} className="group bg-base-100 rounded-xl border border-base-300 p-3">
              <summary className="cursor-pointer flex items-center justify-between text-sm font-semibold text-base-content">
                {item.q}
                <span className="text-primary group-open:rotate-180 transition-transform">▾</span>
              </summary>
              <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed mt-2 pt-2 border-t border-base-300">
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* ═══ Home ═══ */}
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
