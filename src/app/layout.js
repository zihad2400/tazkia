import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { LanguageProvider } from '@/components/providers/LanguageProvider';
import TazkiaToaster from '@/components/ui/Toast';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  metadataBase: new URL('https://tazkia.app'),

  title: {
    default: 'TAZKIA — Connect with the Quran. Live with Sunnah. Grow with Faith.',
    template: '%s | TAZKIA',
  },

  description:
    "TAZKIA is a modern Islamic digital platform for Quran, Hadith, Du'a, Prayer Times, Qibla, Tasbih and Islamic knowledge.",

  keywords: [
    'TAZKIA',
    'Quran',
    'Hadith',
    'Islamic',
    'Prayer Times',
    "Du'a",
    'Qibla',
    'Tasbih',
    'Bangla Quran',
    'Islamic Platform',
    'Namaz Times',
    'Islamic Calendar',
  ],

  authors: [{ name: 'TAZKIA', url: 'https://tazkia.app' }],
  creator: 'TAZKIA',
  publisher: 'TAZKIA',

  applicationName: 'TAZKIA',

  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'mask-icon', url: '/icon.svg', color: '#0F5132' },
    ],
  },

  manifest: '/site.webmanifest',

  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F5132' },
    { media: '(prefers-color-scheme: dark)', color: '#071A12' },
  ],

  openGraph: {
    type: 'website',
    locale: 'bn_BD',
    alternateLocale: ['en_US'],
    url: 'https://tazkia.app',
    title: 'TAZKIA — Islamic Platform',
    description: 'Connect with the Quran. Live with Sunnah. Grow with Faith.',
    siteName: 'TAZKIA',
    images: [
      {
        url: '/apple-touch-icon.png',
        width: 180,
        height: 180,
        alt: 'TAZKIA — Islamic Platform',
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'TAZKIA — Islamic Platform',
    description: 'Connect with the Quran. Live with Sunnah. Grow with Faith.',
    images: ['/apple-touch-icon.png'],
    creator: '@tazkia',
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  verification: {
    // google: 'your-google-site-verification-code',
    // yandex: 'your-yandex-verification-code',
  },

  category: 'religion',
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#0F5132' },
    { media: '(prefers-color-scheme: dark)', color: '#071A12' },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="tazkia" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('tazkia-theme') || 'light';
                  var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  document.documentElement.setAttribute('data-theme', isDark ? 'tazkiaDark' : 'tazkia');
                  var lang = localStorage.getItem('tazkia-lang') || 'en';
                  document.documentElement.lang = lang;
                  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={inter.variable} suppressHydrationWarning>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {children}
              <TazkiaToaster />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
