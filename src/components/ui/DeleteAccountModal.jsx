'use client';

import { useState } from 'react';
import { signOut } from 'next-auth/react';
import {
  FaExclamationTriangle, FaTimes, FaSpinner, FaTrash,
  FaLock, FaEye, FaEyeSlash,
} from 'react-icons/fa';
import { useLanguage } from '@/components/providers/LanguageProvider';
import toast from 'react-hot-toast';

export default function DeleteAccountModal({ open, onClose, requiresPassword }) {
  const { lang, t } = useLanguage();
  const [step, setStep] = useState(1);
  const [confirmText, setConfirmText] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const reset = () => {
    setStep(1);
    setConfirmText('');
    setPassword('');
    setShowPassword(false);
    setLoading(false);
  };

  const handleClose = () => {
    if (loading) return;
    reset();
    onClose();
  };

  const handleDelete = async () => {
    // Validation
    if (confirmText !== 'DELETE') {
      toast.error(lang === 'bn' ? '"DELETE" টাইপ করুন' : lang === 'ar' ? 'اكتب "DELETE"' : 'Type "DELETE" to confirm');
      return;
    }

    if (requiresPassword && !password) {
      toast.error(lang === 'bn' ? 'পাসওয়ার্ড দিন' : lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/user/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirmText, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || 'Deletion failed');
        setLoading(false);
        return;
      }

      toast.success(
        lang === 'bn' ? 'একাউন্ট মুছে ফেলা হয়েছে' :
        lang === 'ar' ? 'تم حذف الحساب' :
        'Account deleted'
      );

      // Wait 1.5s then sign out
      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error('Server error');
      setLoading(false);
    }
  };

  const L = {
    title: lang === 'bn' ? 'একাউন্ট মুছুন' : lang === 'ar' ? 'حذف الحساب' : 'Delete Account',
    warning: lang === 'bn' ? 'এই কাজটি অপরিবর্তনীয়!' : lang === 'ar' ? 'هذا الإجراء لا رجعة فيه!' : 'This action is irreversible!',
    desc: lang === 'bn'
      ? 'আপনার সব ডাটা — প্রোফাইল, বুকমার্ক, নোটিফিকেশন — স্থায়ীভাবে মুছে যাবে।'
      : lang === 'ar'
      ? 'سيتم حذف جميع بياناتك - الملف الشخصي والمفضلة والإشعارات - نهائياً.'
      : 'All your data — profile, bookmarks, notifications — will be permanently deleted.',
    typeDelete: lang === 'bn' ? 'নিশ্চিত করতে "DELETE" টাইপ করুন' : lang === 'ar' ? 'اكتب "DELETE" للتأكيد' : 'Type "DELETE" to confirm',
    password: lang === 'bn' ? 'আপনার পাসওয়ার্ড দিন' : lang === 'ar' ? 'أدخل كلمة المرور' : 'Enter your password',
    cancel: lang === 'bn' ? 'বাতিল' : lang === 'ar' ? 'إلغاء' : 'Cancel',
    confirmDelete: lang === 'bn' ? 'স্থায়ীভাবে মুছুন' : lang === 'ar' ? 'حذف نهائي' : 'Delete Forever',
    deleting: lang === 'bn' ? 'মুছে ফেলা হচ্ছে...' : lang === 'ar' ? 'جارٍ الحذف...' : 'Deleting...',
  };

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-base-100 rounded-2xl shadow-2xl border border-base-300 overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-base-300 bg-red-500/5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-red-500/15 flex items-center justify-center text-red-600 shrink-0">
              <FaExclamationTriangle size={16} />
            </div>
            <h2 className="font-bold text-sm sm:text-base text-base-content truncate">
              {L.title}
            </h2>
          </div>
          <button
            onClick={handleClose}
            disabled={loading}
            className="p-1.5 rounded-lg hover:bg-base-300 text-base-content/60 transition-colors disabled:opacity-40"
            aria-label="Close"
          >
            <FaTimes size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-5 space-y-4">

          {/* Warning */}
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-300/40">
            <p className="text-xs sm:text-sm font-bold text-red-700 dark:text-red-400">
              ⚠️ {L.warning}
            </p>
            <p className="text-[11px] sm:text-xs text-red-600/80 mt-1 leading-relaxed">
              {L.desc}
            </p>
          </div>

          {/* Confirm text input */}
          <div>
            <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
              {L.typeDelete}
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="DELETE"
              disabled={loading}
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck="false"
              className="w-full px-3 py-2.5 sm:py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm font-mono text-base-content transition-all disabled:opacity-60 uppercase"
            />
          </div>

          {/* Password (if credentials) */}
          {requiresPassword && (
            <div>
              <label className="block text-xs font-bold text-base-content/70 mb-2 uppercase tracking-wider">
                {L.password}
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40" size={12} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="w-full pl-9 pr-10 py-2.5 sm:py-3 rounded-xl border border-base-300 bg-base-200 outline-none focus:border-red-500 focus:ring-2 focus:ring-red-200 text-sm text-base-content transition-all disabled:opacity-60"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg hover:bg-base-300 text-base-content/50"
                >
                  {showPassword ? <FaEyeSlash size={12} /> : <FaEye size={12} />}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer — Actions */}
        <div className="flex flex-col sm:flex-row gap-2 p-4 sm:p-5 border-t border-base-300 bg-base-200/50">
          <button
            onClick={handleClose}
            disabled={loading}
            className="flex-1 py-2.5 rounded-xl border-2 border-base-300 bg-base-100 hover:bg-base-200 text-base-content font-semibold text-xs sm:text-sm transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {L.cancel}
          </button>
          <button
            onClick={handleDelete}
            disabled={loading || confirmText !== 'DELETE' || (requiresPassword && !password)}
            className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md"
          >
            {loading ? (
              <>
                <FaSpinner className="animate-spin" size={12} />
                {L.deleting}
              </>
            ) : (
              <>
                <FaTrash size={11} />
                {L.confirmDelete}
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
