import { callApiJson } from "@/lib/api-backend";
import { getAccessToken } from "@/lib/auth/session";
import type { AIProvider, Provider } from "@/types";

export type AvailableIntegration = {
  id: string;
  name: string;
  provider: Provider | string;
  description: string;
};

export type IntegrationsPayload = {
  connected: AIProvider[];
  available: AvailableIntegration[];
};

export async function fetchIntegrations(): Promise<IntegrationsPayload> {
  const token = await getAccessToken();
  if (!token) return { connected: [], available: [] };

  const { ok, data } = await callApiJson("/api/integrations", {
    method: "GET",
    token,
  });

  if (!ok || !data || typeof data !== "object") {
    return { connected: [], available: [] };
  }

  const payload = data as Partial<IntegrationsPayload>;
  return {
    connected: Array.isArray(payload.connected) ? payload.connected : [],
    available: Array.isArray(payload.available) ? payload.available : [],
  };
}
