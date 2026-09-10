import type { Metadata } from "next";
import { SettingsHero } from "@/components/app/settings/settings-hero";
import { SettingsCards } from "@/components/app/settings/settings-cards";
import { SecurityTrustSection } from "@/components/app/settings/security-trust-section";

export const metadata: Metadata = { title: "Settings" };

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-12">
      <SettingsHero />
      <SettingsCards />
      <SecurityTrustSection />
    </div>
  );
}
