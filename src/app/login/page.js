'use client';

import { useState, useEffect, Suspense } from 'react';
import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import {
  FaMosque, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaSpinner,
} from 'react-icons/fa';
import toast from 'react-hot-toast';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  // Already logged in → dashboard
  useEffect(() => {
    if (status === 'authenticated') router.push('/dashboard');
  }, [status, router]);

  // URL error param handle
  useEffect(() => {
    const err = searchParams.get('error');
    if (err) {
      const messages = {
        OAuthAccountNotLinked: 'এই ইমেইল অন্য পদ্ধতিতে ব্যবহৃত হয়েছে',
        OAuthSignin: 'Google সাইন ইন ব্যর্থ',
        OAuthCallback: 'Google কলব্যাক সমস্যা',
        CredentialsSignin: 'ইমেইল বা পাসওয়ার্ড ভুল',
        default: 'সাইন ইন ব্যর্থ। আবার চেষ্টা করুন।',
      };
      toast.error(messages[err] || messages.default);
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      const res = await signIn('credentials', {
        email: email.trim(),
        password,
        redirect: false,
      });
      if (res?.error) {
        toast.error(
          res.error === 'CredentialsSignin'
            ? 'ইমেইল বা পাসওয়ার্ড ভুল'
            : res.error
        );
      } else if (res?.ok) {
        toast.success('স্বাগতম! 🎉');
        router.push('/dashboard');
        router.refresh();
      }
    } catch (err) {
      toast.error('লগইন ব্যর্থ');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    if (googleLoading) return;
    setGoogleLoading(true);
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (err) {
      toast.error('Google সাইন ইন ব্যর্থ');
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 islamic-pattern bg-base-100">
      <div className="w-full max-w-md">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xl sm:text-2xl shadow-lg mb-4">
            <FaMosque />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-base-content">
            Welcome Back
          </h1>
          <p className="text-xs sm:text-sm text-base-content/60 mt-1">
            Sign in to continue your journey
          </p>
        </div>

        {/* Card */}
        <div className="bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 md:p-8 shadow-sm">

          {/* ═══ Google Button ═══ */}
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border-2 border-base-300 bg-base-100 hover:bg-base-200 hover:border-base-content/20 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed font-medium text-sm text-base-content"
          >
            {googleLoading ? (
              <>
                <FaSpinner className="animate-spin" size={16} />
                <span>Connecting…</span>
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                <span>Continue with Google</span>
              </>
            )}
          </button>

          {/* ═══ Divider ═══ */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-base-300" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-base-100 text-base-content/50 font-medium uppercase tracking-wider">
                অথবা
              </span>
            </div>
          </div>

          {/* ═══ Credentials Form ═══ */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
                ইমেইল
              </label>
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={12} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-9 pr-3 py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content text-sm transition-all"
                  placeholder="you@example.com"
autoComplete="email"
name="email"
id="login-email"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
                পাসওয়ার্ড
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={12} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full pl-9 pr-10 py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 text-base-content text-sm transition-all"
                  placeholder="••••••••"
autoComplete="current-password"
name="password"
id="login-password"
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
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm shadow-md active:scale-[0.98]"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" size={12} />
                  Signing in…
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <p className="text-center text-xs sm:text-sm text-base-content/60 mt-5">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-xs sm:text-sm text-base-content/60 mt-5 hover:text-primary transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-base-100">
          <FaSpinner className="animate-spin text-primary" size={24} />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
