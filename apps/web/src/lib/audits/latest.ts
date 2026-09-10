import { callApiJson } from "@/lib/api-backend";
import { getAccessToken } from "@/lib/auth/session";
import type {
  AuditEngineResult,
  WorkspaceMetrics,
} from "@ledgerly/audit-engine";
import type { DashboardStats, SpendChartData } from "@/types";

export type LatestAuditPayload = {
  audit: {
    id: string;
    title: string;
    shareId: string;
    isPublic: boolean;
    createdAt: string;
    aiSummary: string | null;
  };
  workspaces: WorkspaceMetrics[];
  result: AuditEngineResult;
};

export async function fetchLatestAudit(): Promise<LatestAuditPayload | null> {
  const token = await getAccessToken();
  if (!token) return null;

  const { ok, data } = await callApiJson("/api/audits/me/latest", {
    method: "GET",
    token,
  });

  if (!ok || !data) return null;
  return data as LatestAuditPayload;
}

export function statsFromAudit(
  payload: LatestAuditPayload,
  auditsRun: number
): DashboardStats {
  const { result, workspaces } = payload;
  return {
    totalSpend: result.totalCurrentSpend,
    spendChange: 0,
    totalTokens: workspaces.reduce(
      (s, w) => s + w.avgPromptsPerUser * w.activeSeats30d * 30,
      0
    ),
    tokensChange: 0,
    activeProviders: result.providersScanned.length,
    auditsRun,
    estimatedSavings: result.totalMonthlySavings,
  };
}

/** Build a simple current-month spend chart from workspace providers (no fake history). */
export function spendChartFromWorkspaces(
  workspaces: WorkspaceMetrics[]
): SpendChartData[] {
  const by = { openai: 0, anthropic: 0, gemini: 0, other: 0 };
  for (const w of workspaces) {
    if (w.provider === "ChatGPT") by.openai += w.monthlySpend;
    else if (w.provider === "Claude") by.anthropic += w.monthlySpend;
    else if (w.provider === "Gemini") by.gemini += w.monthlySpend;
    else by.other += w.monthlySpend;
  }
  return [{ date: "Current", ...by }];
}
