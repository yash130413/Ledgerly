"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "credex_lead_captured";
const DISMISS_KEY = "credex_lead_dismissed";
const SCROLL_THRESHOLD = 0.60; // 60% scroll depth = value delivered
const DISMISS_COOLDOWN_MS = 3 * 24 * 60 * 60 * 1000; // re-show after 3 days if dismissed

export function useLeadCapture() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    // Never show if already captured
    if (localStorage.getItem(STORAGE_KEY)) return;

    // Don't show if dismissed recently
    const dismissedAt = localStorage.getItem(DISMISS_KEY);
    if (dismissedAt && Date.now() - Number(dismissedAt) < DISMISS_COOLDOWN_MS) return;

    const handleScroll = () => {
      const scrolled = window.scrollY + window.innerHeight;
      const total = document.documentElement.scrollHeight;
      if (scrolled / total >= SCROLL_THRESHOLD) {
        setOpen(true);
        window.removeEventListener("scroll", handleScroll);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const onSubmitted = () => {
    localStorage.setItem(STORAGE_KEY, "1");
    setSubmitted(true);
  };

  const onDismiss = () => {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
    setOpen(false);
  };

  return { open, setOpen, submitted, onSubmitted, onDismiss };
}
