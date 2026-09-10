import type { Metadata } from 'next';

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://credex-app-six.vercel.app';

export const siteMetadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'Credex - AI Spend Audit & Optimization Platform',
    template: '%s | Credex',
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
    title: 'Credex - AI Spend Audit & Optimization',
    description: 'Free AI software spend audit. Identify wasted spend, inactive seats, and duplicate tools.',
    siteName: 'Credex',
    images: [
      {
        url: `${APP_URL}/og-default.png`,
        width: 1200,
        height: 630,
        alt: 'Credex AI Spend Audit',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credex - AI Spend Audit & Optimization',
    description: 'Free AI software spend audit. No signup required.',
    images: [`${APP_URL}/og-default.png`],
    creator: '@credexai',
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
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};
