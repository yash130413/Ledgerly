import { callApiJson } from "@/lib/api-backend";
import { getAccessToken } from "@/lib/auth/session";
import type {
  AuditEngineResult,
  WorkspaceMetrics,
} from "@ledgerly/audit-engine";
import type { DashboardStats, SpendChartData } from "@/types";

export type AuditDetailPayload = {
  audit: {
    id: string;
    title: string;
    shareId: string;
    isPublic: boolean;
    createdAt: string;
    aiSummary: string | null;
    optimizationScore?: number;
    estimatedMonthlySavings?: number;
    totalMonthlySpend?: number;
  };
  workspaces: WorkspaceMetrics[];
  result: AuditEngineResult;
};

/** @deprecated use AuditDetailPayload */
export type LatestAuditPayload = AuditDetailPayload;

export type AuditListItem = {
  id: string;
  title: string;
  provider: string;
  created_at: string;
  optimization_score: number;
  estimated_monthly_savings: number;
  total_monthly_spend: number;
  is_public: boolean;
  share_id: string;
};

async function withToken() {
  const token = await getAccessToken();
  return token;
}

export async function fetchLatestAudit(): Promise<AuditDetailPayload | null> {
  const token = await withToken();
  if (!token) return null;

  const { ok, data } = await callApiJson("/api/audits/me/latest", {
    method: "GET",
    token,
  });

  if (!ok || !data) return null;
  return data as AuditDetailPayload;
}

export async function fetchMyAudits(): Promise<AuditListItem[]> {
  const token = await withToken();
  if (!token) return [];

  const { ok, data } = await callApiJson("/api/audits/me", {
    method: "GET",
    token,
  });

  if (!ok || !Array.isArray(data)) return [];
  return data as AuditListItem[];
}

export async function fetchAuditById(
  id: string
): Promise<AuditDetailPayload | null> {
  const token = await withToken();
  if (!token) return null;

  const { ok, status, data } = await callApiJson(`/api/audits/me/${id}`, {
    method: "GET",
    token,
  });

  if (!ok || status === 404 || !data) return null;
  return data as AuditDetailPayload;
}

export function statsFromAudit(
  payload: AuditDetailPayload,
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
