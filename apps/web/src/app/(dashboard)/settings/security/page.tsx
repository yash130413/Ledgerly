import type { Metadata } from "next";
import { SecuritySettingsSection } from "@/components/app/settings/settings-cards";
import { SecurityTrustSection } from "@/components/app/settings/security-trust-section";
import { fetchMeServer } from "@/lib/settings/server";

export const metadata: Metadata = { title: "Security · Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsSecurityPage() {
  const me = await fetchMeServer();
  return (
    <div className="flex flex-col gap-10">
      <SecuritySettingsSection initial={me?.preferences} />
      <SecurityTrustSection />
    </div>
  );
}
