import { createClient } from "@/infra/supabase/server";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const email = user.email ?? "";
  const fullName = (user.user_metadata?.full_name as string | undefined) ?? "";

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <Sidebar email={email} fullName={fullName} />
      <main className="flex-1 overflow-y-auto">
        <div className="md:hidden h-14 shrink-0" />
        <div className="p-6 max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
