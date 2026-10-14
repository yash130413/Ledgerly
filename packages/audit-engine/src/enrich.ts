import type {
  ActivitySource,
  AuditFormContext,
  AuditFormToolInput,
  AuditProvider,
  AuditUseCase,
  UserSegmentation,
  WorkspaceMetrics,
} from "./types";
import { mapProviderId } from "./mappers";

/** Published list prices used when spend/seat math needs a fallback */
export const PLAN_PRICE_PER_SEAT: Record<
  AuditProvider,
  Record<string, number>
> = {
  ChatGPT: { Plus: 20, Team: 30, Enterprise: 60, API: 0 },
  Claude: { Free: 0, Pro: 20, Team: 30, Enterprise: 50, API: 0 },
  Cursor: { Hobby: 0, Pro: 20, Business: 40, Enterprise: 40 },
  Copilot: { Individual: 10, Business: 19, Enterprise: 39 },
  Gemini: { Pro: 20, Ultra: 30, API: 0 },
};

const ENTERPRISE_PLANS = new Set([
  "enterprise",
  "business",
  "team",
  "ultra",
]);

/** How well each provider fits a primary use case (0–1) */
const USE_CASE_FIT: Record<string, Partial<Record<AuditProvider, number>>> = {
  Coding: { Cursor: 0.9, Copilot: 0.88, ChatGPT: 0.55, Claude: 0.6, Gemini: 0.5 },
  Writing: { ChatGPT: 0.88, Claude: 0.9, Gemini: 0.7, Cursor: 0.35, Copilot: 0.3 },
  "Data Analysis": {
    ChatGPT: 0.75,
    Claude: 0.8,
    Gemini: 0.78,
    Cursor: 0.45,
    Copilot: 0.4,
  },
  Research: { Claude: 0.85, ChatGPT: 0.8, Gemini: 0.82, Cursor: 0.4, Copilot: 0.35 },
  Mixed: { ChatGPT: 0.7, Claude: 0.7, Gemini: 0.65, Cursor: 0.65, Copilot: 0.65 },
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export function pricePerSeat(provider: AuditProvider, plan?: string): number {
  if (!plan) return PLAN_PRICE_PER_SEAT[provider].Pro ?? 20;
  const table = PLAN_PRICE_PER_SEAT[provider];
  const exact = table[plan];
  if (typeof exact === "number") return exact;
  const lower = plan.toLowerCase();
  const hit = Object.entries(table).find(([k]) => k.toLowerCase() === lower);
  return hit?.[1] ?? 20;
}

export function isAnnualCommitmentPlan(plan?: string): boolean {
  if (!plan) return false;
  return ENTERPRISE_PLANS.has(plan.toLowerCase());
}

function useCaseFit(useCase: string | undefined, provider: AuditProvider): number {
  const key = (useCase || "Mixed") as AuditUseCase;
  return USE_CASE_FIT[key]?.[provider] ?? USE_CASE_FIT.Mixed![provider] ?? 0.65;
}

/**
 * Estimate active seats when the user did not report real activity.
 * Uses team size, plan tier, and use-case fit — not a fixed 70/30 split.
 */
export function estimateActiveSeats(input: {
  seats: number;
  provider: AuditProvider;
  plan?: string;
  teamSize?: number;
  useCase?: string;
}): { active: number; inactive: number; source: ActivitySource } {
  const seats = Math.max(1, input.seats);
  const fit = useCaseFit(input.useCase, input.provider);

  // Cap useful seats by team size when known (can't use more seats than people)
  const usefulCap =
    input.teamSize && input.teamSize > 0
      ? Math.min(seats, input.teamSize)
      : seats;

  // Enterprise/Team plans assume slightly higher stickiness; free/hobby lower
  const planBoost = isAnnualCommitmentPlan(input.plan) ? 0.08 : 0;
  const hobbyPenalty =
    input.plan && ["free", "hobby"].includes(input.plan.toLowerCase())
      ? -0.1
      : 0;

  const utilization = clamp(fit + planBoost + hobbyPenalty, 0.35, 0.92);
  const active = Math.max(1, Math.round(usefulCap * utilization));
  const inactive = Math.max(0, seats - active);
  return { active, inactive, source: "estimated" };
}

function usageIntensity(
  provider: AuditProvider,
  useCase?: string
): { prompts: number; sessions: number } {
  const fit = useCaseFit(useCase, provider);
  return {
    prompts: Math.round(8 + fit * 40),
    sessions: Math.round(2 + fit * 10),
  };
}

/**
 * Segment all seats into 4 usage tiers:
 *  - zombie:  0 activity in 60+ days (subset of inactive — the worst offenders)
 *  - casual:  <5 prompts/week estimated (~low occasional use)
 *  - regular: 5–30 prompts/week (healthy, standard usage)
 *  - power:   30+ prompts/week (heavy, justify premium tiers)
 *
 * When real activity data isn't available, we estimate tier distribution
 * from utilization rate, use-case fit, and plan tier.
 */
export function segmentUsers(input: {
  totalSeats: number;
  activeSeats: number;
  inactiveSeats: number;
  provider: AuditProvider;
  plan?: string;
  useCase?: string;
}): UserSegmentation {
  const { totalSeats, activeSeats, inactiveSeats, provider, plan, useCase } = input;
  if (totalSeats <= 0) return { zombieUsers: 0, casualUsers: 0, regularUsers: 0, powerUsers: 0 };

  // Zombie = ~60% of inactive seats (the truly abandoned ones)
  const zombieUsers = Math.round(inactiveSeats * 0.6);
  // Remaining inactive are "casual-inactive" — they opened it once or twice
  const semiInactive = inactiveSeats - zombieUsers;

  // Among active seats, split by use-case fit:
  //   High fit → more power users, fewer casual
  //   Low fit  → more casual, fewer power
  const fit = useCaseFit(useCase, provider);
  const planBoost = isAnnualCommitmentPlan(plan) ? 0.05 : 0;
  const powerRatio = clamp(0.15 + fit * 0.3 + planBoost, 0.1, 0.5);
  const casualRatio = clamp(0.4 - fit * 0.2, 0.1, 0.45);
  // regularRatio is the remainder

  const powerUsers = Math.max(activeSeats > 0 ? 1 : 0, Math.round(activeSeats * powerRatio));
  const casualFromActive = Math.round(activeSeats * casualRatio);
  const regularUsers = Math.max(0, activeSeats - powerUsers - casualFromActive);
  const casualUsers = casualFromActive + semiInactive;

  // Sanity: ensure total matches
  const sum = zombieUsers + casualUsers + regularUsers + powerUsers;
  const diff = totalSeats - sum;
  // Absorb rounding error into casual tier
  return {
    zombieUsers,
    casualUsers: Math.max(0, casualUsers + diff),
    regularUsers,
    powerUsers,
  };
}

/**
 * Build engine-ready workspaces from free-audit form tools.
 * - Prefers reported activeSeats when provided (step 1: real-ish usage)
 * - Else estimates from team size / plan / use case (not blind 70/30)
 * - Marks cross-tool duplicates for consolidation rules
 */
export function buildAuditWorkspaces(
  tools: AuditFormToolInput[],
  ctx: AuditFormContext = {}
): WorkspaceMetrics[] {
  const mapped = tools
    .map((t): WorkspaceMetrics | null => {
      const provider = mapProviderId(t.provider);
      if (!provider) return null;
      const seats = Math.max(1, Math.floor(t.seats) || 1);
      const spend = Math.max(0, Number(t.monthlySpend) || 0);

      let active: number;
      let inactive: number;
      let activitySource: ActivitySource;

      if (
        typeof t.activeSeats === "number" &&
        !Number.isNaN(t.activeSeats) &&
        t.activeSeats >= 0
      ) {
        active = clamp(Math.floor(t.activeSeats), 0, seats);
        inactive = seats - active;
        activitySource = "reported";
      } else {
        const est = estimateActiveSeats({
          seats,
          provider,
          plan: t.plan,
          teamSize: ctx.teamSize,
          useCase: ctx.useCase,
        });
        active = est.active;
        inactive = est.inactive;
        activitySource = est.source;
      }

      const { prompts, sessions } = usageIntensity(provider, ctx.useCase);

      // 4-tier segmentation
      const seg = segmentUsers({
        totalSeats: seats,
        activeSeats: active,
        inactiveSeats: inactive,
        provider,
        plan: t.plan,
        useCase: ctx.useCase,
      });

      return {
        provider,
        plan: t.plan,
        totalSeats: seats,
        activeSeats30d: active,
        inactiveSeats30d: inactive,
        avgPromptsPerUser: prompts,
        avgSessionsPerUser: sessions,
        monthlySpend: spend,
        subscriptionSpend: spend,
        apiSpend: t.plan?.toLowerCase() === "api" ? spend : 0,
        powerUsers: seg.powerUsers,
        casualUsers: seg.casualUsers,
        duplicateTools: [],
        utilizationRate: seats > 0 ? active / seats : 0,
        annualCommitment: isAnnualCommitmentPlan(t.plan),
        teamSize: ctx.teamSize,
        useCase: ctx.useCase,
        activitySource,
        segmentation: seg,
      };
    })
    .filter((w): w is WorkspaceMetrics => w != null);

  const allProviders = [...new Set(mapped.map((w) => w.provider))];
  return mapped.map((w) => ({
    ...w,
    duplicateTools: allProviders.filter((p) => p !== w.provider),
  }));
}
