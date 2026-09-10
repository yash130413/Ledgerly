"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/security", label: "Security" },
  { href: "/settings/preferences", label: "Preferences" },
];

export function SettingsSubNav() {
  const pathname = usePathname();

  return (
    <nav
      className="flex items-center gap-1 border-b border-gray-100 pb-px"
      aria-label="Settings sections"
    >
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-t-lg border-b-2 -mb-px transition-colors",
              active
                ? "border-green-600 text-green-700"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
