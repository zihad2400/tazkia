'use client';

import React, { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaUser, FaBell, FaPalette, FaMobileAlt, FaLock, FaTrash,
  FaSave, FaSpinner, FaCheck, FaSignOutAlt, FaEye, FaEyeSlash,
  FaSun, FaMoon, FaDesktop, FaGlobe, FaFont, FaVolumeUp,
  FaMobile, FaPlay, FaMagic, FaEnvelope, FaQuran, FaBookOpen,
  FaClock, FaExclamationTriangle, FaChevronLeft, FaTimes,
  FaHome, FaChartLine,
} from 'react-icons/fa';
import { useLanguage } from '@/components/providers/LanguageProvider';
import { useTheme } from '@/components/providers/ThemeProvider';
import toast from 'react-hot-toast';
import NotificationSoundPicker from '@/components/ui/NotificationSoundPicker';

const SECTIONS = [
  { id: 'account', label: 'Account', bn: 'একাউন্ট', ar: 'الحساب', icon: FaUser },
  { id: 'appearance', label: 'Appearance', bn: 'অ্যাপিয়ারেন্স', ar: 'المظهر', icon: FaPalette },
  { id: 'notifications', label: 'Notifications', bn: 'নোটিফিকেশন', ar: 'الإشعارات', icon: FaBell },
  { id: 'app', label: 'App', bn: 'অ্যাপ', ar: 'التطبيق', icon: FaMobileAlt },
  { id: 'security', label: 'Security', bn: 'নিরাপত্তা', ar: 'الأمان', icon: FaLock },
  { id: 'danger', label: 'Danger Zone', bn: 'বিপদ অঞ্চল', ar: 'منطقة الخطر', icon: FaTrash },
];

// ═══════════════════════════════════════════════
// 🎯 Reusable Components — OUTER SCOPE (no focus loss)
// ═══════════════════════════════════════════════

const Toggle = React.memo(function Toggle({ value, onChange }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 sm:w-11 sm:h-6 rounded-full transition-colors shrink-0 ${
        value ? 'bg-primary' : 'bg-base-300'
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 sm:w-5 sm:h-5 rounded-full bg-white shadow-md transition-transform ${
          value ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
});

const SectionCard = React.memo(function SectionCard({ children, title, desc }) {
  return (
    <div className="bg-base-200 border border-base-300 rounded-xl sm:rounded-2xl p-4 sm:p-5 md:p-6">
      {title && (
        <div className="mb-4 sm:mb-5">
          <h2 className="text-base sm:text-lg font-bold text-base-content">{title}</h2>
          {desc && <p className="text-xs sm:text-sm text-base-content/60 mt-0.5">{desc}</p>}
        </div>
      )}
      {children}
    </div>
  );
});

const Input = React.memo(function Input({ label, ...props }) {
  return (
    <div>
      <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
        {label}
      </label>
      <input
        {...props}
        className="w-full px-3 py-2.5 sm:py-3 rounded-lg sm:rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-base-content transition-all"
      />
    </div>
  );
});

const Row = React.memo(function Row({ icon: Icon, label, desc, right }) {
  return (
    <div className="flex items-center gap-2.5 sm:gap-3 py-3 sm:py-4 border-b border-base-300 last:border-0">
      {Icon && (
        <div className="w-8 h-8 sm:w-9 sm:h-9 md:w-10 md:h-10 rounded-lg sm:rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
          <Icon size={12} className="sm:hidden" />
          <Icon size={14} className="hidden sm:block" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-xs sm:text-sm font-semibold text-base-content leading-tight">{label}</p>
        {desc && <p className="text-[10px] sm:text-xs text-base-content/60 mt-0.5 leading-snug">{desc}</p>}
      </div>
      <div className="shrink-0 ml-1">{right}</div>
    </div>
  );
});

export default function SettingsPage() {
  const router = useRouter();
  const { data: session, status, update } = useSession();
  const { lang, setLang, t } = useLanguage();
  const { theme, setTheme } = useTheme();

  const [active, setActive] = useState('account');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [prefs, setPrefs] = useState({
    prayerNotifications: true,
    quranNotifications: true,
    hadithNotifications: false,
    emailNewsletter: false,
    soundEnabled: true,
    vibrationEnabled: true,
    autoPlayEnabled: false,
    animationsEnabled: true,
  });
  const [form, setForm] = useState({ name: '', country: '', city: '', timezone: 'Asia/Dhaka' });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [showPasswords, setShowPasswords] = useState({ current: false, new: false, confirm: false });
  const [changingPass, setChangingPass] = useState(false);

  // Auth guard
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Load profile
  useEffect(() => {
    if (status !== 'authenticated') return;
    const load = async () => {
      try {
        const res = await fetch('/api/user/profile');
        if (res.ok) {
          const data = await res.json();
          const u = data.user;
          setForm({
            name: u.name || '',
            country: u.country || '',
            city: u.city || '',
            timezone: u.timezone || 'Asia/Dhaka',
          });
          if (u.preferences) {
            setPrefs((p) => ({ ...p, ...u.preferences }));
          }
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    load();
  }, [status]);

  const tSection = (s) => lang === 'bn' ? s.bn : lang === 'ar' ? s.ar : s.label;

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success('প্রোফাইল সেভ হয়েছে ✅');
        try { await update(); } catch (e) {}
      } else {
        const d = await res.json();
        toast.error(d.error || 'সেভ ব্যর্থ');
      }
    } catch (e) { toast.error('সার্ভার সমস্যা'); }
    finally { setSaving(false); }
  };

  const handleSavePrefs = async (newPrefs) => {
    setPrefs(newPrefs);
    try {
      await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrefs),
      });
    } catch (e) { console.error(e); }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('নতুন পাসওয়ার্ড দুটো মিলছে না');
      return;
    }
    setChangingPass(true);
    try {
      const res = await fetch('/api/user/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
        }),
      });
      const d = await res.json();
      if (res.ok) {
        toast.success('পাসওয়ার্ড পরিবর্তিত ✅');
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(d.error || 'ব্যর্থ');
      }
    } catch (e) { toast.error('সার্ভার সমস্যা'); }
    finally { setChangingPass(false); }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <FaSpinner className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 lg:py-10">

      {/* ═══ Header ═══ */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-base-content">
          {t.settings}
        </h1>
        <p className="text-xs sm:text-sm text-base-content/60 mt-1">
          {lang === 'bn' ? 'আপনার একাউন্ট ও অ্যাপ সেটিংস পরিচালনা করুন' :
           lang === 'ar' ? 'إدارة إعدادات حسابك والتطبيق' :
           'Manage your account and app preferences'}
        </p>
      </div>

      {/* ═══ Mobile: Section Tabs ═══ */}
      <div className="lg:hidden mb-4 -mx-3 sm:-mx-4 px-3 sm:px-4 overflow-x-auto scrollbar-hide">
        <div className="flex gap-2 pb-2 min-w-max scroll-smooth">
          {SECTIONS.map((s) => {
            const Icon = s.icon;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all active:scale-95 ${
                  active === s.id
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-base-200 text-base-content/70 border border-base-300'
                }`}
              >
                <Icon size={12} />
                {tSection(s)}
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ Layout: Sidebar + Content ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block">
          <div className="bg-base-200 border border-base-300 rounded-2xl p-2 sticky top-24">
            {SECTIONS.map((s) => {
              const Icon = s.icon;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left mb-0.5 ${
                    active === s.id
                      ? 'bg-primary text-white shadow-sm'
                      : 'text-base-content hover:bg-primary/10'
                  }`}
                >
                  <Icon size={14} />
                  <span className="flex-1">{tSection(s)}</span>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-4 sm:space-y-6">

          {/* ═══ ACCOUNT ═══ */}
          {active === 'account' && (
            <SectionCard
              title={lang === 'bn' ? 'একাউন্ট তথ্য' : lang === 'ar' ? 'معلومات الحساب' : 'Account Information'}
              desc={lang === 'bn' ? 'আপনার ব্যক্তিগত তথ্য আপডেট করুন' : lang === 'ar' ? 'تحديث معلوماتك الشخصية' : 'Update your personal information'}
            >
              <div className="space-y-4">
                <Input
                  label={lang === 'bn' ? 'নাম' : lang === 'ar' ? 'الاسم' : 'Name'}
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
                    {t.email}
                  </label>
                  <input
                    type="email"
                    value={session?.user?.email || ''}
                    disabled
                    className="w-full px-3 py-3 rounded-xl border border-base-300 bg-base-300/40 outline-none text-sm text-base-content/50 cursor-not-allowed"
                  />
                  <p className="text-[10px] text-base-content/40 mt-1.5 flex items-center gap-1">
                    <FaLock size={8} /> {t.emailCannotChange}
                  </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label={t.country}
                    type="text"
                    value={form.country}
                    onChange={(e) => setForm({ ...form, country: e.target.value })}
                    placeholder="Bangladesh"
                  />
                  <Input
                    label={t.city}
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    placeholder="Dhaka"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
                    {t.timezone}
                  </label>
                  <select
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    className="w-full px-3 py-3 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-base-content"
                  >
                    <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                    <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                    <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
                    <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                    <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="America/New_York">America/New_York (GMT-5)</option>
                  </select>
                </div>
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60 shadow-md"
                >
                  {saving ? <><FaSpinner className="animate-spin" size={12} /> {t.saving}</> : <><FaSave size={12} /> {t.saveChanges}</>}
                </button>
              </div>
            </SectionCard>
          )}

          {/* ═══ APPEARANCE ═══ */}
          {active === 'appearance' && (
            <>
              <SectionCard
                title={lang === 'bn' ? 'থিম' : lang === 'ar' ? 'المظهر' : 'Theme'}
                desc={lang === 'bn' ? 'আপনার পছন্দের থিম নির্বাচন করুন' : lang === 'ar' ? 'اختر المظهر المفضل' : 'Choose your preferred theme'}
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: 'light', icon: FaSun, label: t.lightMode },
                    { id: 'dark', icon: FaMoon, label: t.darkMode },
                    { id: 'system', icon: FaDesktop, label: t.systemMode },
                  ].map((opt) => {
                    const Icon = opt.icon;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setTheme(opt.id)}
                        className={`flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl border-2 transition-all active:scale-95 ${
                          theme === opt.id
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                        }`}
                      >
                        <Icon size={18} />
                        <span className="text-[10px] sm:text-xs font-semibold">{opt.label}</span>
                        {theme === opt.id && <FaCheck size={10} className="text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard
                title={t.selectLanguage}
                desc={lang === 'bn' ? 'অ্যাপের ভাষা পরিবর্তন করুন' : lang === 'ar' ? 'تغيير لغة التطبيق' : 'Change the app language'}
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { code: 'en', label: 'English', sub: 'EN' },
                    { code: 'bn', label: 'বাংলা', sub: 'বাং' },
                    { code: 'ar', label: 'العربية', sub: 'ع' },
                  ].map((l) => (
                    <button
                      key={l.code}
                      onClick={() => setLang(l.code)}
                      className={`flex flex-col items-center gap-1 p-3 sm:p-4 rounded-xl border-2 transition-all active:scale-95 ${
                        lang === l.code
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                      }`}
                    >
                      <span className="text-sm sm:text-base font-bold">{l.label}</span>
                      <span className="text-[10px] opacity-60">{l.sub}</span>
                      {lang === l.code && <FaCheck size={10} className="text-primary" />}
                    </button>
                  ))}
                </div>
              </SectionCard>

              <SectionCard
                title={t.fontSize}
                desc={lang === 'bn' ? 'পাঠ্যের আকার নির্বাচন করুন' : lang === 'ar' ? 'اختر حجم النص' : 'Choose text size'}
              >
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  {[
                    { id: 'small', label: t.small, size: 'text-xs' },
                    { id: 'medium', label: t.medium, size: 'text-sm' },
                    { id: 'large', label: t.large, size: 'text-base' },
                  ].map((f) => (
                    <button
                      key={f.id}
                      onClick={() => {
                        if (typeof document !== 'undefined') {
                          document.documentElement.setAttribute('data-font-size', f.id);
                          localStorage.setItem('tazkia-font-size', f.id);
                        }
                        toast.success(`${f.label} font selected`);
                      }}
                      className={`p-3 sm:p-4 rounded-xl border-2 transition-all active:scale-95 text-center ${
                        typeof document !== 'undefined' && document.documentElement.getAttribute('data-font-size') === f.id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-base-300 bg-base-100 text-base-content/70 hover:border-primary/40'
                      }`}
                    >
                      <span className={`${f.size} font-bold block`}>Aa</span>
                      <span className="text-[10px] mt-1 block">{f.label}</span>
                    </button>
                  ))}
                </div>
              </SectionCard>
            </>
          )}

          {/* ═══ NOTIFICATIONS ═══ */}
          {active === 'notifications' && (
            <SectionCard
              title={t.notifications}
              desc={lang === 'bn' ? 'আপনি কী কী নোটিফিকেশন পেতে চান তা নির্বাচন করুন' : lang === 'ar' ? 'اختر الإشعارات التي تريد تلقيها' : 'Choose which notifications you want to receive'}
            >
              <Row
                icon={FaClock}
                label={t.prayerTimes}
                desc={lang === 'bn' ? 'নামাজের সময় হলে জানান' : lang === 'ar' ? 'تنبيه عند وقت الصلاة' : 'Get notified at prayer times'}
                right={<Toggle value={prefs.prayerNotifications} onChange={(v) => handleSavePrefs({ ...prefs, prayerNotifications: v })} />}
              />
              <Row
                icon={FaQuran}
                label={t.quran}
                desc={lang === 'bn' ? 'দৈনিক কুরআন রিমাইন্ডার' : lang === 'ar' ? 'تذكير يومي بالقرآن' : 'Daily Quran reminders'}
                right={<Toggle value={prefs.quranNotifications} onChange={(v) => handleSavePrefs({ ...prefs, quranNotifications: v })} />}
              />
              <Row
                icon={FaBookOpen}
                label={t.hadith}
                desc={lang === 'bn' ? 'নতুন হাদিস পাবেন' : lang === 'ar' ? 'أحاديث جديدة' : 'New hadith available'}
                right={<Toggle value={prefs.hadithNotifications} onChange={(v) => handleSavePrefs({ ...prefs, hadithNotifications: v })} />}
              />
              <Row
                icon={FaEnvelope}
                label={t.newsletter}
                desc={lang === 'bn' ? 'সাপ্তাহিক ইসলামিক ইনসাইট' : lang === 'ar' ? 'رؤى إسلامية أسبوعية' : 'Weekly Islamic insights'}
                right={<Toggle value={prefs.emailNewsletter} onChange={(v) => handleSavePrefs({ ...prefs, emailNewsletter: v })} />}
              />
            </SectionCard>
          )}

          {/* ═══ APP ═══ */}
          {active === 'app' && (
            <SectionCard
              title={lang === 'bn' ? 'অ্যাপ সেটিংস' : lang === 'ar' ? 'إعدادات التطبيق' : 'App Settings'}
              desc={lang === 'bn' ? 'অ্যাপের আচরণ নিয়ন্ত্রণ করুন' : lang === 'ar' ? 'التحكم في سلوك التطبيق' : 'Control app behavior'}
            >
              <Row
                icon={FaVolumeUp}
                label={t.soundToggle}
                desc={lang === 'bn' ? 'সাউন্ড ইফেক্ট চালু' : lang === 'ar' ? 'تفعيل المؤثرات الصوتية' : 'Enable sound effects'}
                right={<Toggle value={prefs.soundEnabled} onChange={(v) => handleSavePrefs({ ...prefs, soundEnabled: v })} />}
              />
              <Row
                icon={FaMobile}
                label={t.vibrationToggle}
                desc={lang === 'bn' ? 'কম্পন চালু' : lang === 'ar' ? 'تفعيل الاهتزاز' : 'Enable vibration'}
                right={<Toggle value={prefs.vibrationEnabled} onChange={(v) => handleSavePrefs({ ...prefs, vibrationEnabled: v })} />}
              />
              <Row
                icon={FaPlay}
                label={lang === 'bn' ? 'Auto-play' : lang === 'ar' ? 'التشغيل التلقائي' : 'Auto-play'}
                desc={lang === 'bn' ? 'কুরআন অটো-প্লে করুন' : lang === 'ar' ? 'تشغيل القرآن تلقائياً' : 'Auto-play Quran recitations'}
                right={<Toggle value={prefs.autoPlayEnabled} onChange={(v) => handleSavePrefs({ ...prefs, autoPlayEnabled: v })} />}
              />
              <Row
                icon={FaMagic}
                label={lang === 'bn' ? 'অ্যানিমেশন' : lang === 'ar' ? 'الرسوم المتحركة' : 'Animations'}
                desc={lang === 'bn' ? 'UI অ্যানিমেশন দেখান' : lang === 'ar' ? 'عرض رسوم متحركة' : 'Show UI animations'}
                right={<Toggle value={prefs.animationsEnabled} onChange={(v) => handleSavePrefs({ ...prefs, animationsEnabled: v })} />}
              />

              <div className="pt-4 border-t border-base-300">
                <NotificationSoundPicker />
              </div>
            </SectionCard>
          )}

          {/* ═══ SECURITY ═══ */}
          {active === 'security' && (
            <>
              <SectionCard
                title={lang === 'bn' ? 'পাসওয়ার্ড পরিবর্তন' : lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                desc={lang === 'bn' ? 'নিয়মিত পাসওয়ার্ড পরিবর্তন করুন' : lang === 'ar' ? 'قم بتغيير كلمة المرور بانتظام' : 'Change your password regularly'}
              >
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    { key: 'current', name: 'currentPassword', label: lang === 'bn' ? 'বর্তমান পাসওয়ার্ড' : 'Current Password' },
                    { key: 'new', name: 'newPassword', label: lang === 'bn' ? 'নতুন পাসওয়ার্ড' : 'New Password' },
                    { key: 'confirm', name: 'confirmPassword', label: lang === 'bn' ? 'নতুন পাসওয়ার্ড নিশ্চিত' : 'Confirm New Password' },
                  ].map((f) => (
                    <div key={f.key}>
                      <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
                        {f.label}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={12} />
                        <input
                          type={showPasswords[f.key] ? 'text' : 'password'}
                          autoComplete={
                            f.key === 'current' ? 'current-password' :
                            f.key === 'new' ? 'new-password' :
                            'new-password'
                          }
                          name={f.name}
                          value={passwordForm[f.name]}
                          onChange={(e) => setPasswordForm({ ...passwordForm, [f.name]: e.target.value })}
                          className="w-full pl-9 pr-10 py-3 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm text-base-content"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords({ ...showPasswords, [f.key]: !showPasswords[f.key] })}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-base-300 text-base-content/50"
                        >
                          {showPasswords[f.key] ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                        </button>
                      </div>
                    </div>
                  ))}
                  <button
                    type="submit"
                    disabled={changingPass}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all active:scale-[0.98] disabled:opacity-60"
                  >
                    {changingPass ? <><FaSpinner className="animate-spin" size={12} /> {t.saving}</> : <><FaLock size={12} /> {t.saveChanges}</>}
                  </button>
                </form>
              </SectionCard>

              <SectionCard
                title={lang === 'bn' ? 'সেশন' : lang === 'ar' ? 'الجلسة' : 'Session'}
              >
                <Row
                  icon={FaSignOutAlt}
                  label={t.logout}
                  desc={lang === 'bn' ? 'এই ডিভাইস থেকে লগ আউট করুন' : lang === 'ar' ? 'تسجيل الخروج من هذا الجهاز' : 'Sign out from this device'}
                  right={
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="px-4 py-2 text-xs font-semibold text-red-600 border border-red-300 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors active:scale-95"
                    >
                      {t.logout}
                    </button>
                  }
                />
              </SectionCard>
            </>
          )}

          {/* ═══ DANGER ZONE ═══ */}
          {active === 'danger' && (
            <SectionCard
              title={lang === 'bn' ? 'বিপদ অঞ্চল' : lang === 'ar' ? 'منطقة الخطر' : 'Danger Zone'}
              desc={lang === 'bn' ? 'এই কাজগুলো অপরিবর্তনীয়' : lang === 'ar' ? 'هذه الإجراءات لا رجعة فيها' : 'These actions are irreversible'}
            >
              <div className="p-4 rounded-xl border-2 border-red-300 dark:border-red-900/40 bg-red-50 dark:bg-red-950/20">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 shrink-0">
                    <FaExclamationTriangle size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-red-700 dark:text-red-400">
                      {t.deleteAccount}
                    </p>
                    <p className="text-[11px] sm:text-xs text-red-600/80 mt-1">
                      {t.deleteAccountDesc}
                    </p>
                    <button
                      onClick={() => toast.error('এই ফিচারটি এখনো রেডি নয়')}
                      className="mt-3 px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-all active:scale-95"
                    >
                      {t.deleteAccount}
                    </button>
                  </div>
                </div>
              </div>
            </SectionCard>
          )}

        </div>

        {/* ═══ Bottom Actions ═══ */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 sm:pt-4">
          <Link
            href="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-base-200 hover:bg-base-300 border border-base-300 text-base-content font-semibold rounded-xl transition-all active:scale-[0.98] text-sm"
          >
            <FaHome size={13} />
            {t.backHome}
          </Link>
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 bg-primary/10 hover:bg-primary/20 border border-primary/30 text-primary font-semibold rounded-xl transition-all active:scale-[0.98] text-sm"
          >
            <FaChartLine size={13} />
            {t.dashboard}
          </Link>
        </div>
      </div>
    </div>
  );
}
