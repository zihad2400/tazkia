'use client';

import { Toaster } from 'react-hot-toast';
import {
  FaCheckCircle, FaExclamationCircle, FaInfoCircle,
  FaExclamationTriangle, FaTimes,
} from 'react-icons/fa';

/**
 * TAZKIA Custom Toast Design
 */
export default function TazkiaToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={12}
      containerStyle={{
        top: 80,
        left: 20,
        right: 20,
        bottom: 20,
      }}
      toastOptions={{
        duration: 3500,
        style: {
          background: 'var(--toast-bg, #FFFFFF)',
          color: 'var(--toast-color, #1F2B24)',
          borderRadius: '16px',
          padding: '14px 18px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.06)',
          border: '1px solid rgba(15, 81, 50, 0.12)',
          maxWidth: '450px',
          backdropFilter: 'blur(12px)',
          fontFamily: 'Inter, Manrope, sans-serif',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#0F5132',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'linear-gradient(135deg, #F0FAF5 0%, #E8F5EF 100%)',
            color: '#083B24',
            borderColor: 'rgba(15, 81, 50, 0.2)',
          },
        },
        error: {
          duration: 4000,
          iconTheme: {
            primary: '#DC2626',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'linear-gradient(135deg, #FEF2F2 0%, #FEE2E2 100%)',
            color: '#7F1D1D',
            borderColor: 'rgba(220, 38, 38, 0.2)',
          },
        },
        loading: {
          iconTheme: {
            primary: '#C9A227',
            secondary: '#FFFFFF',
          },
          style: {
            background: 'linear-gradient(135deg, #FFFBEB 0%, #FEF3C7 100%)',
            color: '#78350F',
            borderColor: 'rgba(201, 162, 39, 0.3)',
          },
        },
        blank: {
          style: {
            background: 'var(--toast-bg, #FFFFFF)',
            color: 'var(--toast-color, #1F2B24)',
          },
        },
      }}
    />
  );
}
