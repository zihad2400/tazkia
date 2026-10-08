'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FaMosque, FaUser, FaEnvelope, FaLock,
  FaEye, FaEyeSlash, FaSpinner, FaCheckCircle,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    // Clear error on input
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.name.trim() || form.name.trim().length < 2) {
      newErrors.name = 'নাম কমপক্ষে ২ অক্ষরের হতে হবে';
    }

    if (!form.email || !form.email.includes('@')) {
      newErrors.email = 'সঠিক ইমেইল দিন';
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      toast.error('ফর্মে ভুল আছে');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'রেজিস্ট্রেশন ব্যর্থ');
        setLoading(false);
        return;
      }

      toast.success('একাউন্ট তৈরি হয়েছে! সাইন ইন করা হচ্ছে...');

      // Auto sign-in
      const loginRes = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (loginRes?.error) {
        toast.error('সাইন ইন ব্যর্থ। ম্যানুয়ালি লগইন করুন।');
        router.push('/login');
      } else {
        toast.success('স্বাগতম! 🎉');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      console.error(err);
      toast.error('সার্ভারে সমস্যা হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 islamic-pattern bg-base-100">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-2xl shadow-xl mb-4">
            <FaMosque />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content mb-1">
            একাউন্ট খুলুন
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60">
            TAZKIA-তে যোগ দিন · আপনার ইসলামিক যাত্রা শুরু করুন
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="bg-base-200 border border-base-300 rounded-2xl p-5 sm:p-6 shadow-sm"
        >
          {/* Name */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
              নাম
            </label>
            <div className="relative">
              <FaUser className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={12} />
              <input
                type="text"
                name="name"
autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="আপনার পূর্ণ নাম"
                className={`w-full pl-9 pr-3 py-3 rounded-xl border bg-base-100 outline-none transition-all text-sm ${
                  errors.name
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                ⚠️ {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
              ইমেইল
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={12} />
              <input
                type="email"
                name="email"
autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={`w-full pl-9 pr-3 py-3 rounded-xl border bg-base-100 outline-none transition-all text-sm ${
                  errors.email
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                ⚠️ {errors.email}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="mb-5">
            <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
              পাসওয়ার্ড
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={12} />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
autoComplete="new-password"
                value={form.password}
                onChange={handleChange}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className={`w-full pl-9 pr-10 py-3 rounded-xl border bg-base-100 outline-none transition-all text-sm ${
                  errors.password
                    ? 'border-red-400 focus:border-red-500 focus:ring-2 focus:ring-red-200'
                    : 'border-base-300 focus:border-primary focus:ring-2 focus:ring-primary/20'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-base-300 text-base-content/50 transition-colors"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 mt-1.5 flex items-center gap-1">
                ⚠️ {errors.password}
              </p>
            )}
          </div>

          {/* Password strength */}
          {form.password && (
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-1">
                <div className="flex-1 h-1 bg-base-300 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      form.password.length >= 8
                        ? 'bg-green-500 w-full'
                        : form.password.length >= 6
                        ? 'bg-amber-500 w-2/3'
                        : 'bg-red-500 w-1/3'
                    }`}
                  />
                </div>
                <span className="text-[10px] font-semibold">
                  {form.password.length >= 8
                    ? 'শক্তিশালী'
                    : form.password.length >= 6
                    ? 'মাঝারি'
                    : 'দুর্বল'}
                </span>
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm transition-all active:scale-[0.98] disabled:opacity-60 shadow-md"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" size={12} />
                একাউন্ট তৈরি হচ্ছে...
              </>
            ) : (
              <>
                <FaCheckCircle size={12} />
                একাউন্ট খুলুন
              </>
            )}
          </button>

          {/* Sign In Link */}
          <p className="text-center text-xs text-base-content/60 mt-5">
            ইতিমধ্যে একাউন্ট আছে?{' '}
            <Link
              href="/login"
              className="text-primary font-semibold hover:underline"
            >
              সাইন ইন করুন
            </Link>
          </p>
        </form>

        {/* Terms */}
        <p className="text-[10px] text-base-content/50 text-center mt-4 px-4">
          একাউন্ট খুললে আপনি আমাদের{' '}
          <Link href="/terms" className="text-primary hover:underline">
            শর্তাবলী
          </Link>{' '}
          এবং{' '}
          <Link href="/privacy" className="text-primary hover:underline">
            গোপনীয়তা নীতি
          </Link>{' '}
          মেনে নিচ্ছেন।
        </p>

        {/* Back to Home */}
        <Link
          href="/"
          className="block text-center text-xs text-base-content/60 mt-5 hover:text-primary transition-colors"
        >
          ← হোমে ফিরুন
        </Link>
      </div>
    </div>
  );
}
