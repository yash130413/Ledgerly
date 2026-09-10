import type { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const siteMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Ledgerly - AI Spend Audit & Optimization Platform',
    template: '%s | Ledgerly',
  },
  description: 'Identify wasted AI software spend across ChatGPT, Claude, Cursor, GitHub Copilot, and Gemini. Free audit, no signup required.',
  keywords: [
    'AI spend optimization',
    'SaaS cost management',
    'ChatGPT audit',
    'Claude optimization',
    'GitHub Copilot savings',
    'AI software audit',
    'seat utilization',
    'software spend analysis',
  ],
  authors: [{ name: 'Yash Rohilla' }],
  creator: 'Yash Rohilla',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: APP_URL,
    title: 'Ledgerly - AI Spend Audit & Optimization',
    description: 'Free AI software spend audit. Identify wasted spend, inactive seats, and duplicate tools.',
    siteName: 'Ledgerly',
    images: [
      {
        url: `${APP_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'Ledgerly AI Spend Audit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ledgerly - AI Spend Audit & Optimization',
    description: 'Free AI software spend audit. No signup required.',
    images: [`${APP_URL}/og-default.png`],
    creator: '@ledgerlyai',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/logo.svg', type: 'image/svg+xml' },
      { url: '/icon.png', type: 'image/png' },
    ],
    shortcut: '/logo.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
