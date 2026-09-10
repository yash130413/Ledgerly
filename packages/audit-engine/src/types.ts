export type AuditProvider = "ChatGPT" | "Claude" | "Cursor" | "Copilot" | "Gemini";

export type AuditPriority = "Low" | "Medium" | "High" | "Critical";

export interface AuditRecommendation {
  id: string;
  provider: AuditProvider;
  title: string;
  recommendation: string;
  reason: string;
  confidenceScore: number; // 0–100
  priority: AuditPriority;
  monthlySavings: number;
  annualSavings: number;
  affectedUsers?: number;
  currentCost?: number;
  optimizedCost?: number;
  ruleId: string;
}

export interface WorkspaceMetrics {
  provider: AuditProvider;
  totalSeats: number;
  activeSeats30d: number;
  inactiveSeats30d: number;
  avgPromptsPerUser: number;
  avgSessionsPerUser: number;
  monthlySpend: number;
  apiSpend: number;
  subscriptionSpend: number;
  powerUsers: number;
  casualUsers: number;
  duplicateTools: AuditProvider[];
  utilizationRate: number; // activeSeats30d / totalSeats
  annualCommitment: boolean;
}

export interface AuditEngineResult {
  recommendations: AuditRecommendation[];
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  totalCurrentSpend: number;
  criticalCount: number;
  highCount: number;
  providersScanned: AuditProvider[];
  optimizationScore: number; // 0–100, higher = more waste found
  generatedAt: string;
}
