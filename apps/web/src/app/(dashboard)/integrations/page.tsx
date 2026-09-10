import type { Metadata } from "next";
import { IntegrationsList } from "@/components/app/integrations/integrations-list";
import { IntegrationsHero } from "@/components/app/integrations/integrations-hero";
import { mockProviders } from "@/modules/integrations/mock-data";

export const metadata: Metadata = { title: "Integrations" };

export default function IntegrationsPage() {
  return (
    <div className="flex flex-col gap-8">
      <IntegrationsHero />
      <IntegrationsList providers={mockProviders} />
    </div>
  );
}
