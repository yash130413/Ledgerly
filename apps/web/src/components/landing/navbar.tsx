"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { href: "#features", label: "Features" },
  { href: "#how-it-works", label: "How it works" },
  { href: "#testimonials", label: "Testimonials" },
  { href: "#faq", label: "FAQ" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 flex justify-center pt-4 px-4">
      <motion.nav
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
        className={cn(
          "w-full max-w-5xl flex items-center justify-between gap-4 px-4 h-14 rounded-2xl border transition-all duration-300",
          scrolled
            ? "bg-white/90 backdrop-blur-xl border-gray-200/80 shadow-lg shadow-black/[0.06]"
            : "bg-white/70 backdrop-blur-md border-gray-200/60 shadow-md shadow-black/[0.04]"
        )}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <span className="w-7 h-7 rounded-xl bg-green-600 flex items-center justify-center shadow-sm">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h4M8 7h4M7 2v4M7 8v4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </span>
          <span className="font-semibold text-[15px] tracking-tight text-gray-900">Credex</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-0.5">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-3 py-1.5 text-sm text-gray-500 hover:text-gray-900 transition-colors rounded-lg hover:bg-gray-100/80"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/login">
            <Button variant="ghost" size="sm" className="text-gray-500 hover:text-gray-900 rounded-xl">
              Log in
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white rounded-xl font-medium shadow-sm">
              Get started free
            </Button>
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          className="md:hidden p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="absolute top-20 left-4 right-4 max-w-5xl mx-auto bg-white/95 backdrop-blur-xl rounded-2xl border border-gray-200 shadow-xl shadow-black/[0.08] overflow-hidden"
          >
            <div className="p-3 flex flex-col gap-1">
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2.5 text-sm text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  {l.label}
                </Link>
              ))}
              <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-gray-100">
                <Link href="/login" onClick={() => setOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full rounded-xl">Log in</Button>
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}>
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white rounded-xl">Get started free</Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
