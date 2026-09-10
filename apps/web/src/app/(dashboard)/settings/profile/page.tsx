import type { Metadata } from "next";
import { ProfileSettingsSection } from "@/components/app/settings/settings-cards";
import { fetchMeServer } from "@/lib/settings/server";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profile · Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsProfilePage() {
  const me = await fetchMeServer();
  const session = await getSessionUser();
  return (
    <ProfileSettingsSection
      fullName={me?.fullName ?? session?.fullName ?? ""}
      email={me?.email ?? session?.email ?? ""}
      companyName={me?.companyName ?? ""}
    />
  );
}
