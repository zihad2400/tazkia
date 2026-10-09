'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaAward, FaBookmark, FaCalendar, FaCamera, FaChartLine, FaCheck, FaChevronRight, FaClock, FaCopy, FaEdit, FaEnvelope, FaFire, FaGlobe, FaHome, FaMapMarkerAlt, FaMoon, FaQuran, FaSave, FaSignOutAlt, FaSpinner, FaStar, FaTrash, FaTrophy, FaUser } from 'react-icons/fa';
import Breadcrumb from '@/components/layout/Breadcrumb';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [stats, setStats] = useState({ bookmarks: 0, quranReads: 0, dhikr: 0, sessions: 0 });
  const [activity, setActivity] = useState(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    country: '',
    city: '',
    language: 'bn',
    timezone: 'Asia/Dhaka',
  });

  // ═══ Avatar Upload State ═══
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const avatarInputRef = useRef(null);

  const handleAvatarClick = () => {
    if (!uploadingAvatar) avatarInputRef.current?.click();
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('ছবি সর্বোচ্চ ৫ MB হতে পারবে');
      return;
    }
    if (!file.type.startsWith('image/')) {
      toast.error('শুধু ছবি আপলোড করা যাবে');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setImagePreview(reader.result);
    reader.readAsDataURL(file);

    setUploadingAvatar(true);
    try {
      const fd = new FormData();
      fd.append('file', file);

      const res = await fetch('/api/user/avatar', {
        method: 'POST',
        body: fd,
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'ছবি আপলোড ব্যর্থ');
        setImagePreview(null);
      } else {
        toast.success('ছবি সফলভাবে আপডেট হয়েছে ✅');
        try { if (typeof update === 'function') await update(); } catch (e) {}
        setTimeout(() => window.location.reload(), 700);
      }
    } catch (err) {
      console.error(err);
      toast.error('সার্ভারে সমস্যা হয়েছে');
      setImagePreview(null);
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const handleAvatarDelete = async (e) => {
    e.stopPropagation();
    if (!confirm('ছবি মুছে ফেলতে চান?')) return;
    setUploadingAvatar(true);
    try {
      const res = await fetch('/api/user/avatar', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || 'ছবি মুছতে ব্যর্থ');
      } else {
        toast.success('ছবি মুছে ফেলা হয়েছে');
        setImagePreview(null);
        setTimeout(() => window.location.reload(), 600);
      }
    } catch (err) {
      toast.error('সার্ভারে সমস্যা');
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
  }, [status, router]);

  // Load user + stats
  useEffect(() => {
    if (status !== 'authenticated') return;

    const loadData = async () => {
      try {
        // Try to fetch profile (works if DB configured)
        try {
          const res = await fetch('/api/user/profile');
          if (res.ok) {
            const data = await res.json();
            const u = data.user;
            setForm({
              name: u.name || '',
              email: u.email || '',
              country: u.country || '',
              city: u.city || '',
              language: u.language || 'bn',
              timezone: u.timezone || 'Asia/Dhaka',
            });
          } else {
            // Fallback: use session
            setForm({
              name: session.user.name || '',
              email: session.user.email || '',
              country: '',
              city: '',
              language: 'bn',
              timezone: 'Asia/Dhaka',
            });
          }
        } catch (e) {
          setForm({
            name: session.user.name || '',
            email: session.user.email || '',
            country: '',
            city: '',
            language: 'bn',
            timezone: 'Asia/Dhaka',
          });
        }

        // Try activity API
        try {
          const activityRes = await fetch('/api/user/activity');
          if (activityRes.ok) {
            const data = await activityRes.json();
            setActivity(data.activity);
          }
        } catch (e) {}

        // Local stats
        const bookmarks = JSON.parse(localStorage.getItem('tazkia-bookmarks') || '[]');
        const tasbih = JSON.parse(localStorage.getItem('tazkia-tasbih-state') || '{}');
        const quranProgress = JSON.parse(localStorage.getItem('quran-bookmarks') || '[]');
        const sessions = JSON.parse(localStorage.getItem('tazkia-tasbih-sessions') || '[]');

        setStats({
          bookmarks: Array.isArray(bookmarks) ? bookmarks.length : 0,
          quranReads: Array.isArray(quranProgress) ? quranProgress.length : 0,
          dhikr: tasbih.totalToday || 0,
          sessions: Array.isArray(sessions) ? sessions.length : 0,
        });
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    loadData();
  }, [status, session]);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success('প্রোফাইল সংরক্ষণ করা হয়েছে', { icon: '✅' });
        setEditing(false);
        try { await update(); } catch (e) {}
      } else {
        // Fallback: save to localStorage
        localStorage.setItem('tazkia-user-profile', JSON.stringify(form));
        toast.success('প্রোফাইল সংরক্ষণ করা হয়েছে', { icon: '✅' });
        setEditing(false);
      }
    } catch (err) {
      localStorage.setItem('tazkia-user-profile', JSON.stringify(form));
      toast.success('প্রোফাইল সংরক্ষণ করা হয়েছে', { icon: '✅' });
      setEditing(false);
    }
    setSaving(false);
  };

  const formatDate = (date) => {
    if (!date) return '--';
    try {
      return new Date(date).toLocaleDateString('bn-BD', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return '--';
    }
  };

  const formatTimeAgo = (date) => {
    if (!date) return '--';
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    if (mins < 1) return 'এখন';
    if (mins < 60) return `${mins} মিনিট আগে`;
    if (hours < 24) return `${hours} ঘণ্টা আগে`;
    return `${days} দিন আগে`;
  };

  const handleCopyEmail = () => {
    if (session?.user?.email) {
      navigator.clipboard.writeText(session.user.email);
      toast.success('ইমেইল কপি হয়েছে', { icon: '📋' });
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-10">
        <div className="h-40 bg-base-200 rounded-2xl animate-pulse mb-4" />
        <div className="h-96 bg-base-200 rounded-2xl animate-pulse" />
      </div>
    );
  }

  if (!session?.user) return null;

  const user = session.user;
  const initials = user.name
    ? user.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const statCards = [
    { icon: FaBookmark, value: stats.bookmarks, label: 'বুকমার্ক', color: 'from-gold to-gold-dark' },
    { icon: FaQuran, value: stats.quranReads, label: 'কুরআন', color: 'from-emerald-500 to-teal-700' },
    { icon: FaStar, value: stats.dhikr, label: 'জিকির', color: 'from-rose-500 to-pink-700' },
    { icon: FaFire, value: stats.sessions, label: 'সেশন', color: 'from-amber-500 to-orange-700' },
  ];

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 overflow-x-hidden">
      <Breadcrumb items={[{ label: 'Profile' }]} showBack={false} />

      {/* ═══ Profile Hero ═══ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-primary text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-4 sm:mb-5 shadow-xl">
        <div className="absolute inset-0 opacity-15 pointer-events-none">
          <div className="hero-orb-1 absolute -top-10 -right-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
          <div className="hero-orb-2 absolute -bottom-10 -left-10 w-40 h-40 bg-gold rounded-full blur-3xl" />
        </div>

        <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-5">
          {/* ═══ Avatar with upload ═══ */}
          <div className="relative group shrink-0">
            <div
              onClick={handleAvatarClick}
              className="cursor-pointer relative"
              title="ছবি পরিবর্তন করতে ক্লিক করুন"
            >
              {(imagePreview || user.image) ? (
                <img
                  src={imagePreview || user.image}
                  alt={user.name}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl object-cover ring-4 ring-gold/30 shadow-2xl"
                />
              ) : (
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-gold flex items-center justify-center text-3xl sm:text-4xl font-bold shadow-2xl ring-4 ring-white/20">
                  {initials}
                </div>
              )}

              {/* Hover overlay */}
              {!uploadingAvatar && (
                <div className="absolute inset-0 rounded-3xl bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                  <FaCamera size={20} className="text-white drop-shadow-lg" />
                </div>
              )}

              {/* Loading spinner */}
              {uploadingAvatar && (
                <div className="absolute inset-0 rounded-3xl bg-black/60 flex items-center justify-center pointer-events-none">
                  <FaSpinner size={20} className="text-white animate-spin" />
                </div>
              )}

              {/* Always-visible camera badge */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-gold text-white flex items-center justify-center shadow-lg ring-2 ring-primary pointer-events-none">
                <FaCamera size={10} />
              </div>
            </div>

            {/* Delete button (only if image) */}
            {(imagePreview || user.image) && !uploadingAvatar && (
              <button
                onClick={handleAvatarDelete}
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg ring-2 ring-primary transition-colors z-10"
                title="ছবি মুছুন"
              >
                <FaTrash size={9} />
              </button>
            )}

            {/* Hidden file input */}
            <input
              ref={avatarInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="flex-1 min-w-0 w-full text-center sm:text-left">
            <h1 className="text-lg sm:text-2xl font-bold break-words leading-tight text-center sm:text-left">{user.name}</h1>
            <button
              onClick={handleCopyEmail}
              className="flex items-center justify-center sm:justify-start gap-1.5 text-[11px] sm:text-sm text-white/70 hover:text-gold transition-colors mt-1 group max-w-full"
            >
              <span className="break-all">{user.email}</span>
              <FaCopy size={9} className="opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
            </button>
            {user.role && user.role !== 'user' && (
              <span className="inline-block mt-2 text-[10px] px-2.5 py-1 rounded-full bg-gold text-white font-bold uppercase tracking-wider">
                {user.role}
              </span>
            )}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 sm:gap-3 mt-2.5 text-[10px] sm:text-xs text-white/70">
              {activity?.joinedAt && (
                <span className="flex items-center gap-1">
                  <FaCalendar size={9} />
                  যোগদান: {formatDate(activity.joinedAt)}
                </span>
              )}
              {activity?.lastActive && (
                <span className="flex items-center gap-1">
                  <FaClock size={9} />
                  {formatTimeAgo(activity.lastActive)}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => setEditing((v) => !v)}
            className={`w-full sm:w-auto px-3 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 shrink-0 flex items-center justify-center gap-1.5 ${
              editing
                ? 'bg-red-500 hover:bg-red-600 text-white'
                : 'bg-white/10 hover:bg-white/20 border border-white/20 text-white'
            }`}
          >
            <FaEdit size={10} />
            {editing ? 'বাতিল' : 'এডিট'}
          </button>
        </div>
      </div>

      {/* ═══ Stats Grid ═══ */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 mb-4 sm:mb-5">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="bg-base-200 border border-base-300 rounded-xl p-2.5 text-center"
            >
              <div className={`w-9 h-9 sm:w-8 sm:h-8 mx-auto rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center text-white mb-1.5 shadow-sm`}>
                <Icon size={14} />
              </div>
              <p className="text-base sm:text-lg font-bold text-base-content leading-none">{stat.value}</p>
              <p className="text-[10px] sm:text-[9px] text-base-content/60 uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          );
        })}
      </div>

      {/* ═══ Account Badges ═══ */}
      <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4 sm:mb-5">
        {activity?.emailVerified && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-[10px] sm:text-xs font-semibold">
            <FaCheck size={9} />
            ইমেইল ভেরিফাইড
          </span>
        )}
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] sm:text-xs font-semibold">
          <FaAward size={9} />
          {activity?.accountAgeDays || 0} দিন
        </span>
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 text-gold-dark text-[10px] sm:text-xs font-semibold">
          <FaUser size={9} />
          {activity?.status === 'active' ? 'সক্রিয়' : 'অ্যাক্টিভ'}
        </span>
      </div>

      {/* ═══ Profile Form ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-6 mb-5">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
            <FaUser size={14} />
          </div>
          <h2 className="text-base sm:text-lg font-bold text-base-content">প্রোফাইল তথ্য</h2>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-base-content/70 mb-1.5 uppercase tracking-wider">
              নাম
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              disabled={!editing}
              className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-base-content/70 mb-1.5 uppercase tracking-wider">
              ইমেইল
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={form.email}
                disabled
                className="w-full px-3 py-2.5 pr-10 rounded-xl border border-base-300 bg-base-100/50 outline-none text-sm opacity-60 cursor-not-allowed"
              />
              <button
                onClick={handleCopyEmail}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg hover:bg-primary/10 text-base-content/50 hover:text-primary transition-colors"
                title="Copy email"
              >
                <FaCopy size={11} />
              </button>
            </div>
            <p className="text-[10px] text-base-content/50 mt-1.5">
              🔒 ইমেইল পরিবর্তন করা যায় না
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-base-content/70 mb-1.5 uppercase tracking-wider">
                দেশ
              </label>
              <input
                type="text"
                name="country"
                value={form.country}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Bangladesh"
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-base-content/70 mb-1.5 uppercase tracking-wider">
                শহর
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                disabled={!editing}
                placeholder="Dhaka"
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-base-content/70 mb-1.5 uppercase tracking-wider">
                ভাষা
              </label>
              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="bn">বাংলা</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
            <div>
              <label className="block text-[11px] font-bold text-base-content/70 mb-1.5 uppercase tracking-wider">
                টাইমজোন
              </label>
              <select
                name="timezone"
                value={form.timezone}
                onChange={handleChange}
                disabled={!editing}
                className="w-full px-3 py-2.5 rounded-xl border border-base-300 bg-base-100 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <option value="Asia/Dhaka">Asia/Dhaka (GMT+6)</option>
                <option value="Asia/Kolkata">Asia/Kolkata (GMT+5:30)</option>
                <option value="Asia/Karachi">Asia/Karachi (GMT+5)</option>
                <option value="Asia/Riyadh">Asia/Riyadh (GMT+3)</option>
                <option value="Asia/Dubai">Asia/Dubai (GMT+4)</option>
                <option value="Europe/London">Europe/London (GMT+0)</option>
                <option value="America/New_York">America/New_York (GMT-5)</option>
              </select>
            </div>
          </div>

          {editing && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 mt-4"
            >
              {saving ? (
                <>
                  <FaSpinner className="animate-spin" size={12} />
                  সংরক্ষণ হচ্ছে...
                </>
              ) : (
                <>
                  <FaSave size={12} />
                  সংরক্ষণ করুন
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ═══ Quick Links ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-5">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white shadow-sm shrink-0">
            <FaChartLine size={14} />
          </div>
          <div className="flex-1 min-w-0 w-full text-center sm:text-left">
            <p className="text-sm font-semibold text-base-content">ড্যাশবোর্ড</p>
            <p className="text-[10px] text-base-content/50">সব অ্যাক্টিভিটি দেখুন</p>
          </div>
          <FaChevronRight size={10} className="text-base-content/30 shrink-0" />
        </Link>

        <Link
          href="/bookmarks"
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-base-200 border border-base-300 hover:border-primary active:scale-[0.98] transition-all"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold to-gold-dark flex items-center justify-center text-white shadow-sm shrink-0">
            <FaBookmark size={14} />
          </div>
          <div className="flex-1 min-w-0 w-full text-center sm:text-left">
            <p className="text-sm font-semibold text-base-content">বুকমার্ক</p>
            <p className="text-[10px] text-base-content/50">{stats.bookmarks}টি সেভ করা</p>
          </div>
          <FaChevronRight size={10} className="text-base-content/30 shrink-0" />
        </Link>
      </div>

      {/* ═══ Danger Zone — Logout ═══ */}
      <div className="bg-base-200 border border-base-300 rounded-2xl p-5">
        <h3 className="text-sm font-bold text-red-600 mb-3 flex items-center gap-2">
          <FaSignOutAlt size={12} />
          লগ আউট
        </h3>
        <p className="text-xs text-base-content/60 mb-4">
          আপনার অ্যাকাউন্ট থেকে লগ আউট করুন। আপনার সব bookmark ও data সংরক্ষিত থাকবে।
        </p>
        <button
          onClick={() => {
            toast.success('লগ আউট হচ্ছে...', { icon: '👋' });
            signOut({ callbackUrl: '/' });
          }}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-all active:scale-[0.98]"
        >
          <FaSignOutAlt size={12} />
          লগ আউট করুন
        </button>
      </div>

      {/* ═══ Home Button ═══ */}
      <div className="text-center mt-5">
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
