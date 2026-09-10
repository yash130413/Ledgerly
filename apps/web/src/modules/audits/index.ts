import type {
  AuditEngineResult,
  AuditPriority,
  AuditProvider,
  AuditRecommendation,
  WorkspaceMetrics,
} from "@ledgerly/audit-engine";

export type {
  AuditEngineResult,
  AuditPriority,
  AuditProvider,
  AuditRecommendation,
  WorkspaceMetrics,
};

export { runAuditEngine, mapProviderId, mapWorkspacesToEngine } from "@ledgerly/audit-engine";

const API_BASE =
  process.env.API_INTERNAL_URL?.replace(/\/$/, "") ?? "http://localhost:3001";

import type { PublicAuditSafe } from "@/types/database";

/** SSR helper — public report via Nest API */
export async function getPublicAuditById(shareId: string): Promise<PublicAuditSafe> {
  const res = await fetch(`${API_BASE}/api/audits/public/${shareId}`, {
    cache: "no-store",
  });
  if (!res.ok) throw new Error("Audit not found");
  return res.json() as Promise<PublicAuditSafe>;
}

export async function getPublicAudit(shareId: string): Promise<PublicAuditSafe> {
  return getPublicAuditById(shareId);
}
