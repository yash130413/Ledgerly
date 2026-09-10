import { SettingsSubNav } from "@/components/app/settings/settings-sub-nav";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your account, security, and workspace preferences
        </p>
      </div>
      <SettingsSubNav />
      {children}
    </div>
  );
}
