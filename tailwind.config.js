/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,jsx}',
    './src/components/**/*.{js,jsx}',
    './src/app/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0E5F4C',
          dark: '#0A4938',
          light: '#167A5E',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#D4B44A',
          dark: '#A8861F',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Manrope', 'sans-serif'],
        bangla: ['"Noto Sans Bengali"', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', 'Amiri', 'serif'],
      },
    },
  },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        tazkia: {
          'primary': '#0E5F4C',
          'primary-content': '#FFFFFF',
          'secondary': '#A8861F',
          'secondary-content': '#FFFFFF',
          'accent': '#A8861F',
          'accent-content': '#FFFFFF',
          'neutral': '#1A1613',
          'neutral-content': '#E5DFD3',

          'base-100': '#E5DFD3',       /* 🏜 Warm Sandstone — main bg */
          'base-200': '#F0EBE0',       /* 🤍 Soft Parchment — cards */
          'base-300': '#C9C0AD',       /* 🪶 Clay — borders */
          'base-content': '#1A1613',   /* 🖋 Espresso — text */

          'info': '#0EA5E9',
          'success': '#16A34A',
          'warning': '#D97706',
          'error': '#DC2626',

          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--btn-text-case': 'none',
        },
      },
      {
        tazkiaDark: {
          'primary': '#1A8B6E',
          'primary-content': '#FFFFFF',
          'secondary': '#D4B44A',
          'secondary-content': '#0D1B2A',
          'accent': '#D4B44A',
          'accent-content': '#0D1B2A',
          'neutral': '#14263A',
          'neutral-content': '#E8EBEF',

          'base-100': '#0D1B2A',       /* 🌌 Deep Sapphire */
          'base-200': '#14263A',       /* 🌊 Midnight Blue */
          'base-300': '#1E3A5F',       /* 💙 Steel Blue */
          'base-content': '#E8EBEF',   /* ⚪ Frost White */

          'info': '#38BDF8',
          'success': '#22C55E',
          'warning': '#FACC15',
          'error': '#F87171',

          '--rounded-box': '1rem',
          '--rounded-btn': '0.75rem',
          '--rounded-badge': '1.9rem',
          '--btn-text-case': 'none',
        },
      },
    ],
    darkTheme: 'tazkiaDark',
    logs: false,
  },
};
