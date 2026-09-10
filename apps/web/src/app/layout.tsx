import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  title: { default: "Ledgerly — AI Spend Audit", template: "%s | Ledgerly" },
  description:
    "Audit, optimize, and control your AI API spending across all providers. Cut costs without cutting capability.",
  metadataBase: new URL(APP_URL),
  openGraph: {
    title: "Ledgerly — AI Spend Audit",
    description: "Stop overpaying for AI APIs. Ledgerly audits your spend and surfaces savings.",
    type: "website",
    url: APP_URL,
    siteName: "Ledgerly",
    images: [{ url: "/og-default.png", width: 1200, height: 630, alt: "Ledgerly — AI Spend Audit" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ledgerly — AI Spend Audit",
    description: "Stop overpaying for AI APIs. Ledgerly audits your spend and surfaces savings.",
    images: ["/og-default.png"],
  },
  icons: {
    icon: [
      { url: "/logo.svg", type: "image/svg+xml" },
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-background text-foreground overflow-x-hidden">
        {children}
        <Toaster richColors position="top-right" />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
