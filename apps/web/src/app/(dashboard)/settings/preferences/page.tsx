import type { Metadata } from "next";
import { PreferencesSettingsSection } from "@/components/app/settings/settings-cards";
import { fetchMeServer } from "@/lib/settings/server";

export const metadata: Metadata = { title: "Preferences · Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsPreferencesPage() {
  const me = await fetchMeServer();
  return <PreferencesSettingsSection initial={me?.preferences} />;
}
