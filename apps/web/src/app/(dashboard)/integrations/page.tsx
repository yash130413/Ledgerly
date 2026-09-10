import type { Metadata } from "next";
import { IntegrationsList } from "@/components/app/integrations/integrations-list";
import { IntegrationsHero } from "@/components/app/integrations/integrations-hero";
import { fetchIntegrations } from "@/lib/integrations/fetch";

export const metadata: Metadata = { title: "Integrations" };
export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
  const { connected, available } = await fetchIntegrations();

  return (
    <div className="flex flex-col gap-8">
      <IntegrationsHero />
      <IntegrationsList connected={connected} available={available} />
    </div>
  );
}
