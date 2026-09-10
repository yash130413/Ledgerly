import type { Metadata } from "next";
import { IntegrationsList } from "@/components/app/integrations/integrations-list";
import { IntegrationsHero } from "@/components/app/integrations/integrations-hero";
import { fetchIntegrations } from "@/lib/integrations/fetch";
import { fetchLatestAudit } from "@/lib/audits/latest";

export const metadata: Metadata = { title: "Integrations" };
export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const [{ connected, available }, latest] = await Promise.all([
    fetchIntegrations(),
    fetchLatestAudit(),
  ]);

  const connectedCount = connected.length;
  const activeCount = connected.filter((p) => p.isActive).length;
  // Spend is only "monitored" when at least one provider is connected
  const monthlySpend =
    connectedCount > 0 ? (latest?.result.totalCurrentSpend ?? 0) : 0;

  return (
    <div className="flex flex-col gap-8">
      <IntegrationsHero
        stats={{
          connectedCount,
          availableCount: available.length,
          activeCount,
          monthlySpend,
        }}
      />
      <IntegrationsList connected={connected} available={available} />
    </div>
  );
}
