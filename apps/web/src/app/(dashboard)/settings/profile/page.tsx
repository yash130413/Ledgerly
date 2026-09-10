import type { Metadata } from "next";
import { ProfileSettingsSection } from "@/components/app/settings/settings-cards";
import { getSessionUser } from "@/lib/auth/session";

export const metadata: Metadata = { title: "Profile · Settings" };
export const dynamic = "force-dynamic";

export default async function SettingsProfilePage() {
  const user = await getSessionUser();
  return (
    <ProfileSettingsSection
      fullName={user?.fullName ?? ""}
      email={user?.email ?? ""}
    />
  );
}
