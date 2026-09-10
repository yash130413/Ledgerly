import type { Metadata } from "next";
import { PreferencesSettingsSection } from "@/components/app/settings/settings-cards";

export const metadata: Metadata = { title: "Preferences · Settings" };

export default function SettingsPreferencesPage() {
  return <PreferencesSettingsSection />;
}
