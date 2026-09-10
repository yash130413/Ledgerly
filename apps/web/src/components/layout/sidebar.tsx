"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Zap, Lightbulb, Plug, Settings, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AnimateList, AnimateItem } from "@/components/shared/motion";
import { LedgerlyLogo } from "@/components/brand/ledgerly-logo";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: BarChart3 },
  { href: "/audits", label: "Audits", icon: Zap },
  { href: "/recommendations", label: "Recommendations", icon: Lightbulb },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/settings", label: "Settings", icon: Settings },
];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

interface SidebarProps {
  email: string;
  fullName: string;
}

function initials(name: string, email: string): string {
  if (name.trim()) {
    const parts = name.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase();
}

function SidebarContent({ email, fullName, onNav }: SidebarProps & { onNav?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <>
      {/* Logo */}
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="px-4 py-5 border-b border-gray-100"
      >
        <Link href="/" className="flex items-center gap-2">
          <LedgerlyLogo wordmarkClassName="font-bold" />
        </Link>
      </motion.div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5" aria-label="Main navigation">
        <AnimateList className="flex flex-col gap-0.5" stagger={0.06}>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname === href || pathname.startsWith(href + "/");
            return (
              <AnimateItem key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={onNav}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-150",
                    active
                      ? "bg-green-50 text-green-700 shadow-sm"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                  {label}
                  {active && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="ml-auto w-1.5 h-1.5 rounded-full bg-green-600"
                      transition={{ duration: 0.25, ease: EASE }}
                    />
                  )}
                </Link>
              </AnimateItem>
            );
          })}
        </AnimateList>
      </nav>

      {/* User */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.35, ease: EASE }}
        className="px-3 py-4 border-t border-gray-100 flex items-center gap-3"
      >
        <Avatar className="w-8 h-8">
          <AvatarFallback className="text-xs bg-green-100 text-green-700 font-bold">
            {initials(fullName, email)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          {fullName && <p className="text-xs font-semibold text-gray-900 truncate">{fullName}</p>}
          <p className="text-[11px] text-gray-400 truncate">{email}</p>
        </div>
        <button
          onClick={handleSignOut}
          aria-label="Sign out"
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" aria-hidden="true" />
        </button>
      </motion.div>
    </>
  );
}

export function Sidebar({ email, fullName }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const reduce = useReducedMotion();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-56 border-r border-gray-100 flex-col bg-white shrink-0 shadow-sm">
        <SidebarContent email={email} fullName={fullName} />
      </aside>

      {/* Mobile: top bar + drawer */}
      <div className="md:hidden">
        <div className="fixed top-0 inset-x-0 z-40 h-14 flex items-center justify-between px-4 border-b border-gray-100 bg-white/95 backdrop-blur-xl shadow-sm">
          <Link href="/" className="flex items-center gap-2">
            <LedgerlyLogo
              markClassName="size-6"
              wordmarkClassName="font-bold text-sm"
            />
          </Link>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <AnimatePresence mode="wait" initial={false}>
              {mobileOpen ? (
                <motion.span key="close" initial={{ rotate: -45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 45, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <X className="w-5 h-5" />
                </motion.span>
              ) : (
                <motion.span key="menu" initial={{ rotate: 45, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -45, opacity: 0 }} transition={{ duration: 0.15 }}>
                  <Menu className="w-5 h-5" />
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="fixed inset-0 z-30 bg-black/20"
                onClick={() => setMobileOpen(false)}
                aria-hidden="true"
              />
              <motion.aside
                key="drawer"
                initial={{ x: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: reduce ? 0 : "-100%", opacity: reduce ? 0 : 1 }}
                transition={{ duration: 0.28, ease: EASE }}
                className="fixed top-0 left-0 z-40 h-full w-64 bg-white border-r border-gray-100 flex flex-col shadow-xl"
                aria-label="Mobile navigation"
              >
                <SidebarContent email={email} fullName={fullName} onNav={() => setMobileOpen(false)} />
              </motion.aside>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
