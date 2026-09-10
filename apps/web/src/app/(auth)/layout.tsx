"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { LedgerlyLogo } from "@/components/brand/ledgerly-logo";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 hero-grid">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(22,163,74,0.05) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE }}
        className="relative z-10 mb-8"
      >
        <Link href="/">
          <LedgerlyLogo
            markClassName="size-8"
            wordmarkClassName="font-bold text-xl"
          />
        </Link>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: EASE, delay: 0.08 }}
        className="relative z-10 w-full max-w-sm"
      >
        {children}
      </motion.div>
    </div>
  );
}
