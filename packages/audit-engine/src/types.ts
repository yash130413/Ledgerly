export type AuditProvider = "ChatGPT" | "Claude" | "Cursor" | "Copilot" | "Gemini";

export type AuditPriority = "Low" | "Medium" | "High" | "Critical";

export type AuditUseCase =
  | "Coding"
  | "Writing"
  | "Data Analysis"
  | "Research"
  | "Mixed";

export type ActivitySource = "reported" | "estimated";

// ── 4-Tier User Segmentation ────────────────────────────────────────────────
export type UserSegmentTier = "zombie" | "casual" | "regular" | "power";

export interface UserSegmentation {
  /** Users with zero activity in 60+ days — immediate license reclaim */
  zombieUsers: number;
  /** Users with <5 prompts/week — downgrade candidates */
  casualUsers: number;
  /** Users with 5–30 prompts/week — healthy usage, keep current plan */
  regularUsers: number;
  /** Users with 30+ prompts/week — ensure premium access */
  powerUsers: number;
}

// ── Effort vs Impact Scoring ─────────────────────────────────────────────────
export type EffortLevel = "Trivial" | "Low" | "Medium" | "High";

export interface EffortImpact {
  /** Estimated implementation effort */
  effort: EffortLevel;
  /** Human-readable time estimate (e.g. "5 min", "30 min", "2 hrs") */
  estimatedTime: string;
  /** Who needs to act (e.g. "IT Admin", "Finance", "Team Lead") */
  owner: string;
  /** ROI ratio: annualSavings / estimated effort hours (higher = do first) */
  roiScore: number;
}

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
  /** Effort vs impact scoring for prioritization */
  effortImpact?: EffortImpact;
}

export interface WorkspaceMetrics {
  provider: AuditProvider;
  /** Subscription plan label from the form (Plus, Team, Pro, …) */
  plan?: string;
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
  /** Org engineering/team headcount (shared context) */
  teamSize?: number;
  useCase?: AuditUseCase | string;
  /** Whether active/inactive seats came from user report or heuristics */
  activitySource?: ActivitySource;
  /** 4-tier user segmentation breakdown */
  segmentation?: UserSegmentation;
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

export interface AuditFormToolInput {
  provider: string;
  plan: string;
  monthlySpend: number;
  seats: number;
  /** Optional real active seats in last 30d — preferred over estimates */
  activeSeats?: number;
}

export interface AuditFormContext {
  teamSize?: number;
  useCase?: string;
}
