export type {
  AuditProvider,
  AuditPriority,
  AuditRecommendation,
  WorkspaceMetrics,
  AuditEngineResult,
} from "@ledgerly/audit-engine";

export type Provider =
  | "openai"
  | "anthropic"
  | "gemini"
  | "cohere"
  | "mistral"
  | "custom";

export interface AIProvider {
  id: string;
  name: string;
  provider: Provider;
  apiKeyMasked: string;
  isActive: boolean;
  connectedAt: string;
}

export interface DashboardStats {
  totalSpend: number;
  spendChange: number;
  totalTokens: number;
  tokensChange: number;
  activeProviders: number;
  auditsRun: number;
  estimatedSavings: number;
}

export interface SpendChartData {
  date: string;
  openai: number;
  anthropic: number;
  gemini: number;
  other: number;
}
