import type { Metadata } from "next";
import { SecuritySettingsSection } from "@/components/app/settings/settings-cards";
import { SecurityTrustSection } from "@/components/app/settings/security-trust-section";

export const metadata: Metadata = { title: "Security · Settings" };

export default function SettingsSecurityPage() {
  return (
    <div className="flex flex-col gap-10">
      <SecuritySettingsSection />
      <SecurityTrustSection />
    </div>
  );
}
