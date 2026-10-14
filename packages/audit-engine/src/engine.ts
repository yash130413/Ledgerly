import type {
  AuditRecommendation,
  AuditEngineResult,
  AuditPriority,
  AuditProvider,
  EffortImpact,
  EffortLevel,
  WorkspaceMetrics,
} from "./types";
import { pricePerSeat } from "./enrich";

// ── Deterministic confidence formula ────────────────────────────────────────
function calculateConfidence(
  utilizationRate: number,
  sampleSize: number,
  spendingConsistency: number,
  activityReported = false
): number {
  let score = 50;
  if (utilizationRate < 0.4) score += 20;
  if (sampleSize > 20) score += 10;
  if (spendingConsistency > 0.8) score += 15;
  if (activityReported) score += 8;
  return Math.min(score, 95);
}

// ── Priority from annual savings ─────────────────────────────────────────────
function derivePriority(annualSavings: number): AuditPriority {
  if (annualSavings >= 10_000) return "Critical";
  if (annualSavings >= 5_000) return "High";
  if (annualSavings >= 1_500) return "Medium";
  return "Low";
}

// ── ID counter (deterministic per run) ───────────────────────────────────────
let _seq = 0;
function nextId() {
  return `rec_${String(++_seq).padStart(4, "0")}`;
}

function seatPrice(m: WorkspaceMetrics): number {
  if (m.totalSeats > 0 && m.monthlySpend > 0) {
    return Math.round(m.monthlySpend / m.totalSeats);
  }
  return pricePerSeat(m.provider, m.plan);
}

function activityNote(m: WorkspaceMetrics): string {
  return m.activitySource === "reported"
    ? "based on reported active seats"
    : "based on estimated activity from team size, plan, and use case";
}

// ── Effort vs Impact scoring ────────────────────────────────────────────────
// Maps ruleId patterns to effort metadata. The engine assigns effort/impact
// to every recommendation so frontends can show "5 min → $3,600/yr" badges.
const EFFORT_MAP: Record<string, { effort: EffortLevel; time: string; owner: string }> = {
  // Seat removal / reclaim rules — trivial IT admin tasks
  INACTIVE_SEATS:       { effort: "Trivial", time: "5 min",  owner: "IT Admin" },
  ZOMBIE_SEATS:         { effort: "Trivial", time: "5 min",  owner: "IT Admin" },
  LOW_UTILIZATION:      { effort: "Trivial", time: "5 min",  owner: "IT Admin" },
  SEATS_EXCEED_TEAM:    { effort: "Trivial", time: "5 min",  owner: "IT Admin" },
  LOW_ACTIVITY:         { effort: "Trivial", time: "5 min",  owner: "IT Admin" },
  // Downgrade / plan change rules — need team review
  CASUAL_DOWNGRADE:     { effort: "Low",     time: "15 min", owner: "Team Lead" },
  TEAM_PLAN:            { effort: "Low",     time: "15 min", owner: "Finance" },
  POWER_USER:           { effort: "Low",     time: "15 min", owner: "Team Lead" },
  WORKSPACE_UNDERUTIL:  { effort: "Low",     time: "15 min", owner: "IT Admin" },
  // Consolidation / vendor negotiation — medium effort
  VENDOR_CONSOLIDATION: { effort: "Medium",  time: "1 hr",   owner: "Finance" },
  REDUNDANCY:           { effort: "Medium",  time: "1 hr",   owner: "Engineering Lead" },
  API_SUB_OVERLAP:      { effort: "Medium",  time: "1 hr",   owner: "Engineering Lead" },
  PLATFORM_OVERLAP:     { effort: "Medium",  time: "1 hr",   owner: "Finance" },
  CROSS_TOOL_STACK:     { effort: "Medium",  time: "2 hrs",  owner: "CTO / VP Eng" },
  // Contract renegotiation / strategic decisions
  ANNUAL_CONTRACT:      { effort: "High",    time: "2 hrs",  owner: "Finance" },
  PLAN_USECASE_MISFIT:  { effort: "High",    time: "2 hrs",  owner: "CTO / VP Eng" },
};

/** Effort hours for ROI calculation */
const EFFORT_HOURS: Record<EffortLevel, number> = {
  Trivial: 0.1,
  Low: 0.25,
  Medium: 1,
  High: 2,
};

function deriveEffortImpact(ruleId: string, annualSavings: number): EffortImpact {
  // Find matching effort entry by checking if ruleId contains the key
  const matchKey = Object.keys(EFFORT_MAP).find((key) =>
    ruleId.toUpperCase().includes(key)
  );
  const meta = matchKey
    ? EFFORT_MAP[matchKey]
    : { effort: "Medium" as EffortLevel, time: "30 min", owner: "Team Lead" };

  const hours = EFFORT_HOURS[meta.effort];
  const roiScore = hours > 0 ? Math.round(annualSavings / hours) : annualSavings;

  return {
    effort: meta.effort,
    estimatedTime: meta.time,
    owner: meta.owner,
    roiScore,
  };
}

// ── Helper: build a recommendation ──────────────────────────────────────────
function rec(
  partial: Omit<AuditRecommendation, "id" | "priority" | "annualSavings" | "effortImpact"> & {
    monthlySavings: number;
  }
): AuditRecommendation {
  const annualSavings = partial.monthlySavings * 12;
  return {
    ...partial,
    id: nextId(),
    annualSavings,
    priority: derivePriority(annualSavings),
    effortImpact: deriveEffortImpact(partial.ruleId, annualSavings),
  };
}

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

function fitFor(m: WorkspaceMetrics): number {
  const key = m.useCase || "Mixed";
  return USE_CASE_FIT[key]?.[m.provider] ?? 0.65;
}

// ── ChatGPT rules ────────────────────────────────────────────────────────────
function runChatGPTRules(m: WorkspaceMetrics): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];
  const pps = seatPrice(m);

  // Rule 1 — Inactive team seats
  if (m.inactiveSeats30d >= 3) {
    const monthlySavings = m.inactiveSeats30d * pps;
    results.push(
      rec({
        provider: "ChatGPT",
        ruleId: "CHATGPT_INACTIVE_SEATS_001",
        title: "Inactive ChatGPT Seats",
        recommendation: "Remove or downgrade inactive ChatGPT seats",
        reason: `${m.inactiveSeats30d} licensed users showed no activity in the last 30 days (${activityNote(m)}), indicating underutilized ${m.plan || "Team"} subscriptions.`,
        confidenceScore: calculateConfidence(
          m.utilizationRate,
          m.totalSeats,
          0.85,
          m.activitySource === "reported"
        ),
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.subscriptionSpend,
        optimizedCost: m.subscriptionSpend - monthlySavings,
      })
    );
  }

  // Rule 2 — Team plan not needed (plan-aware)
  const plan = (m.plan || "").toLowerCase();
  if (
    (plan === "team" || plan === "enterprise" || !m.plan) &&
    m.totalSeats <= 5 &&
    m.avgSessionsPerUser < 3
  ) {
    const teamPrice = pricePerSeat("ChatGPT", m.plan || "Team");
    const plusPrice = pricePerSeat("ChatGPT", "Plus");
    const monthlySavings = m.totalSeats * Math.max(0, teamPrice - plusPrice);
    if (monthlySavings > 0) {
      results.push(
        rec({
          provider: "ChatGPT",
          ruleId: "CHATGPT_TEAM_PLAN_002",
          title: "Team Plan Overhead for Small Group",
          recommendation:
            "Consider switching from ChatGPT Team to individual Plus subscriptions",
          reason: `Current collaboration usage (avg ${m.avgSessionsPerUser.toFixed(1)} sessions/user) appears low relative to ${m.plan || "Team"} plan pricing.`,
          confidenceScore: 84,
          monthlySavings,
          affectedUsers: m.totalSeats,
          currentCost: m.totalSeats * teamPrice,
          optimizedCost: m.totalSeats * plusPrice,
        })
      );
    }
  }

  // Rule 3 — API + subscription duplication
  if (m.apiSpend > 500 && m.subscriptionSpend > 1_000) {
    const monthlySavings = Math.round(m.subscriptionSpend * 0.15);
    results.push(
      rec({
        provider: "ChatGPT",
        ruleId: "CHATGPT_API_SUB_OVERLAP_003",
        title: "API and Subscription Spend Overlap",
        recommendation: "Review overlap between ChatGPT subscriptions and API usage",
        reason: `The organization is simultaneously maintaining $${m.apiSpend.toLocaleString()} in API spend and $${m.subscriptionSpend.toLocaleString()} in seat-based subscriptions, which may indicate duplicated usage patterns.`,
        confidenceScore: 78,
        monthlySavings,
        currentCost: m.apiSpend + m.subscriptionSpend,
        optimizedCost: m.apiSpend + m.subscriptionSpend - monthlySavings,
      })
    );
  }

  return results;
}

// ── Claude rules ─────────────────────────────────────────────────────────────
function runClaudeRules(
  m: WorkspaceMetrics,
  allMetrics: WorkspaceMetrics[]
): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];
  const pps = seatPrice(m);

  // Rule 1 — Premium usage without heavy activity
  if (m.avgPromptsPerUser < 20 && m.utilizationRate < 0.5) {
    const monthlySavings = m.inactiveSeats30d * pps;
    results.push(
      rec({
        provider: "Claude",
        ruleId: "CLAUDE_LOW_ACTIVITY_001",
        title: "Claude Seats Without Heavy Usage",
        recommendation: "Reduce unused Claude premium seats",
        reason: `Current Claude usage (avg ${m.avgPromptsPerUser} prompts/user) and ${Math.round(m.utilizationRate * 100)}% seat utilization do not justify the number of ${m.plan || "Pro"} licenses (${activityNote(m)}).`,
        confidenceScore: 90,
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.totalSeats * pps,
        optimizedCost: m.activeSeats30d * pps,
      })
    );
  }

  // Rule 2 — Mixed vendor consolidation (fixed: check ChatGPT in duplicates only)
  const chatgptMetrics = allMetrics.find((x) => x.provider === "ChatGPT");
  if (m.duplicateTools.includes("ChatGPT") && chatgptMetrics) {
    const chatgptSpend = chatgptMetrics.monthlySpend;
    const claudeSpend = m.monthlySpend;
    const monthlySavings = Math.round(Math.min(chatgptSpend, claudeSpend) * 0.25);
    results.push(
      rec({
        provider: "Claude",
        ruleId: "CLAUDE_VENDOR_CONSOLIDATION_002",
        title: "Overlapping ChatGPT and Claude Subscriptions",
        recommendation: "Evaluate consolidating overlapping AI assistant vendors",
        reason: `Both ChatGPT ($${chatgptSpend.toLocaleString()}/mo) and Claude ($${claudeSpend.toLocaleString()}/mo) are being used for general-purpose conversational workflows, which may create redundant licensing costs.`,
        confidenceScore: 72,
        monthlySavings,
        currentCost: chatgptSpend + claudeSpend,
        optimizedCost: chatgptSpend + claudeSpend - monthlySavings,
      })
    );
  }

  return results;
}

// ── Cursor rules ─────────────────────────────────────────────────────────────
function runCursorRules(
  m: WorkspaceMetrics,
  allMetrics: WorkspaceMetrics[]
): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];
  const pps = seatPrice(m);

  // Rule 1 — Casual users on Cursor Pro
  if (m.avgPromptsPerUser < 10 && m.avgSessionsPerUser < 5) {
    const monthlySavings = m.casualUsers * pps;
    results.push(
      rec({
        provider: "Cursor",
        ruleId: "CURSOR_LOW_UTILIZATION_001",
        title: "Low Utilization of Cursor Seats",
        recommendation: "Downgrade low-usage Cursor users",
        reason: `${m.casualUsers} licensed users showed fewer than 5 active coding sessions during the last 30 days (${activityNote(m)}), reducing ROI on ${m.plan || "Pro"} coding assistant licenses.`,
        confidenceScore: 88,
        monthlySavings,
        affectedUsers: m.casualUsers,
        currentCost: m.totalSeats * pps,
        optimizedCost: (m.totalSeats - m.casualUsers) * pps,
      })
    );
  }

  // Rule 2 — Copilot + Cursor redundancy (fixed duplicate check)
  const copilotMetrics = allMetrics.find((x) => x.provider === "Copilot");
  if (m.duplicateTools.includes("Copilot") && copilotMetrics) {
    const cursorSpend = m.monthlySpend;
    const copilotSpend = copilotMetrics.monthlySpend;
    const monthlySavings = Math.round(Math.min(cursorSpend, copilotSpend) * 0.3);
    results.push(
      rec({
        provider: "Cursor",
        ruleId: "CURSOR_COPILOT_REDUNDANCY_002",
        title: "Cursor and Copilot Redundancy",
        recommendation:
          "Standardize on either Cursor or GitHub Copilot for engineering teams",
        reason: `Maintaining both Cursor ($${cursorSpend.toLocaleString()}/mo) and Copilot ($${copilotSpend.toLocaleString()}/mo) creates overlapping functionality and fragmented developer workflows.`,
        confidenceScore: 81,
        monthlySavings,
        currentCost: cursorSpend + copilotSpend,
        optimizedCost: cursorSpend + copilotSpend - monthlySavings,
      })
    );
  }

  return results;
}

// ── Copilot rules ─────────────────────────────────────────────────────────────
function runCopilotRules(m: WorkspaceMetrics): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];
  const pps = seatPrice(m);

  // Rule 1 — Unused Copilot seats
  if (m.inactiveSeats30d > 5) {
    const monthlySavings = m.inactiveSeats30d * pps;
    results.push(
      rec({
        provider: "Copilot",
        ruleId: "COPILOT_INACTIVE_SEATS_001",
        title: "Inactive GitHub Copilot Licenses",
        recommendation: "Remove inactive GitHub Copilot licenses",
        reason: `${m.inactiveSeats30d} Copilot licenses have shown no coding activity within the last 30 days (${activityNote(m)}).`,
        confidenceScore: 94,
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.totalSeats * pps,
        optimizedCost: m.activeSeats30d * pps,
      })
    );
  }

  // Rule 2 — Junior dev overspend
  if (m.avgPromptsPerUser < 5 && m.powerUsers < m.totalSeats * 0.2) {
    const lowValueSeats = m.totalSeats - m.powerUsers;
    const monthlySavings = Math.round(lowValueSeats * pps * 0.5);
    results.push(
      rec({
        provider: "Copilot",
        ruleId: "COPILOT_POWER_USER_CONCENTRATION_002",
        title: "Copilot Licenses Concentrated in Low-Frequency Users",
        recommendation:
          "Restrict Copilot licenses to high-frequency engineering contributors",
        reason: `Only ${m.powerUsers} of ${m.totalSeats} licensed users qualify as power users (avg ${m.avgPromptsPerUser} prompts/user), suggesting a premium tier mismatch for the majority of the team.`,
        confidenceScore: 83,
        monthlySavings,
        affectedUsers: lowValueSeats,
        currentCost: m.totalSeats * pps,
        optimizedCost: m.totalSeats * pps - monthlySavings,
      })
    );
  }

  return results;
}

// ── Gemini rules ─────────────────────────────────────────────────────────────
function runGeminiRules(m: WorkspaceMetrics): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];
  const pps = seatPrice(m);

  // Rule 1 — Workspace add-on underutilization
  if (m.utilizationRate < 0.4 && m.totalSeats > 10) {
    const monthlySavings = m.inactiveSeats30d * pps;
    results.push(
      rec({
        provider: "Gemini",
        ruleId: "GEMINI_WORKSPACE_UNDERUTILIZATION_001",
        title: "Gemini Workspace Add-on Underutilization",
        recommendation: "Reduce Gemini Workspace add-on seat coverage",
        reason: `${Math.round((1 - m.utilizationRate) * 100)}% of provisioned Gemini seats (${m.inactiveSeats30d} of ${m.totalSeats}) appear inactive or lightly used over the last 30 days (${activityNote(m)}).`,
        confidenceScore: 89,
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.totalSeats * pps,
        optimizedCost: m.activeSeats30d * pps,
      })
    );
  }

  // Rule 2 — Workspace feature overlap
  if (m.duplicateTools.length >= 2) {
    const monthlySavings = Math.round(m.monthlySpend * 0.2);
    results.push(
      rec({
        provider: "Gemini",
        ruleId: "GEMINI_PLATFORM_OVERLAP_002",
        title: "AI Productivity Platform Overlap",
        recommendation: "Consolidate overlapping AI productivity platforms",
        reason: `${m.duplicateTools.length} other AI assistants (${m.duplicateTools.join(", ")}) are currently serving similar productivity use cases alongside Gemini, creating redundant licensing costs.`,
        confidenceScore: 76,
        monthlySavings,
        currentCost: m.monthlySpend,
        optimizedCost: m.monthlySpend - monthlySavings,
      })
    );
  }

  return results;
}

// ── Universal rules ───────────────────────────────────────────────────────────
function runUniversalRules(
  m: WorkspaceMetrics,
  allMetrics: WorkspaceMetrics[]
): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];
  const pps = seatPrice(m);
  const reported = m.activitySource === "reported";

  // Rule 1 — Low utilization
  if (m.utilizationRate < 0.5 && m.inactiveSeats30d > 0) {
    const removableSeats = m.inactiveSeats30d;
    const monthlySavings = removableSeats * pps;
    const confidence = calculateConfidence(
      m.utilizationRate,
      m.totalSeats,
      0.85,
      reported
    );
    results.push(
      rec({
        provider: m.provider,
        ruleId: `UNIVERSAL_LOW_UTILIZATION_001_${m.provider.toUpperCase()}`,
        title: `${m.provider} Seat Utilization Below Benchmark`,
        recommendation: "Reduce inactive AI software licenses",
        reason: `Overall seat utilization is ${Math.round(m.utilizationRate * 100)}% — below the 50% SaaS efficiency benchmark. ${removableSeats} seats have shown no activity in the last 30 days (${activityNote(m)}).`,
        confidenceScore: confidence,
        monthlySavings,
        affectedUsers: removableSeats,
        currentCost: m.monthlySpend,
        optimizedCost: m.monthlySpend - monthlySavings,
      })
    );
  }

  // Rule 2 — Annual contract waste
  if (m.utilizationRate < 0.6 && m.annualCommitment) {
    const monthlySavings = Math.round(m.monthlySpend * 0.1);
    results.push(
      rec({
        provider: m.provider,
        ruleId: `UNIVERSAL_ANNUAL_CONTRACT_002_${m.provider.toUpperCase()}`,
        title: `${m.provider} Annual Commitment Misaligned with Usage`,
        recommendation: "Renegotiate annual AI software commitments",
        reason: `Current utilization (${Math.round(m.utilizationRate * 100)}%) suggests the organization is overcommitted on an annual ${m.plan || ""} contract relative to actual demand.`,
        confidenceScore: 79,
        monthlySavings,
        currentCost: m.monthlySpend,
        optimizedCost: m.monthlySpend - monthlySavings,
      })
    );
  }

  // Rule 3 — Seats exceed team size
  if (
    typeof m.teamSize === "number" &&
    m.teamSize > 0 &&
    m.totalSeats > m.teamSize
  ) {
    const excess = m.totalSeats - m.teamSize;
    const monthlySavings = excess * pps;
    results.push(
      rec({
        provider: m.provider,
        ruleId: `UNIVERSAL_SEATS_EXCEED_TEAM_003_${m.provider.toUpperCase()}`,
        title: `${m.provider} Seats Exceed Team Size`,
        recommendation: "Right-size licenses to match actual headcount",
        reason: `You licensed ${m.totalSeats} ${m.provider} seats for a team of ${m.teamSize} — ${excess} seats cannot be meaningfully used and are likely wasted spend.`,
        confidenceScore: 93,
        monthlySavings,
        affectedUsers: excess,
        currentCost: m.monthlySpend,
        optimizedCost: m.monthlySpend - monthlySavings,
      })
    );
  }

  // Rule 4 — Plan / use-case misfit on premium tiers
  const fit = fitFor(m);
  const premium =
    m.plan &&
    ["enterprise", "business", "ultra", "team"].includes(m.plan.toLowerCase());
  if (premium && fit < 0.55 && m.monthlySpend > 0) {
    const monthlySavings = Math.round(m.monthlySpend * 0.35);
    results.push(
      rec({
        provider: m.provider,
        ruleId: `UNIVERSAL_PLAN_USECASE_MISFIT_004_${m.provider.toUpperCase()}`,
        title: `${m.provider} ${m.plan} Misaligned with ${m.useCase || "Primary"} Work`,
        recommendation: `Reassess ${m.provider} ${m.plan} for a ${m.useCase || "Mixed"}-focused team`,
        reason: `Primary use case "${m.useCase || "Mixed"}" is a weak fit for ${m.provider} at the ${m.plan} tier. Consider a lighter plan or a tool better matched to this workload.`,
        confidenceScore: 74,
        monthlySavings,
        currentCost: m.monthlySpend,
        optimizedCost: m.monthlySpend - monthlySavings,
      })
    );
  }

  // Rule 5 — Cross-tool stack bloat (once per highest-spend workspace)
  const isPrimary =
    allMetrics.length >= 2 &&
    m.monthlySpend === Math.max(...allMetrics.map((x) => x.monthlySpend)) &&
    m.provider ===
      allMetrics.find(
        (x) =>
          x.monthlySpend === Math.max(...allMetrics.map((y) => y.monthlySpend))
      )?.provider;

  if (isPrimary && allMetrics.length >= 2) {
    const totalSpend = allMetrics.reduce((s, x) => s + x.monthlySpend, 0);
    const names = allMetrics.map((x) => x.provider).join(", ");
    const monthlySavings = Math.round(totalSpend * 0.15);
    results.push(
      rec({
        provider: m.provider,
        ruleId: "UNIVERSAL_CROSS_TOOL_STACK_005",
        title: "Multi-Tool AI Stack Consolidation Opportunity",
        recommendation: "Consolidate overlapping AI tools into a smaller core stack",
        reason: `Running ${allMetrics.length} AI tools (${names}) at $${totalSpend.toLocaleString()}/mo for ${m.useCase || "mixed"} work often duplicates capability. Standardizing on 1–2 primary tools typically cuts spend 10–20%.`,
        confidenceScore: 70,
        monthlySavings,
        currentCost: totalSpend,
        optimizedCost: totalSpend - monthlySavings,
      })
    );
  }

  // Rule 6 — Zombie seats (60+ days zero activity — immediate reclaim)
  const seg = m.segmentation;
  if (seg && seg.zombieUsers >= 2) {
    const monthlySavings = seg.zombieUsers * pps;
    results.push(
      rec({
        provider: m.provider,
        ruleId: `UNIVERSAL_ZOMBIE_SEATS_006_${m.provider.toUpperCase()}`,
        title: `${seg.zombieUsers} Zombie ${m.provider} Licenses (60+ Days Inactive)`,
        recommendation: `Immediately reclaim ${seg.zombieUsers} abandoned ${m.provider} licenses`,
        reason: `${seg.zombieUsers} users have shown zero activity for over 60 days (${activityNote(m)}). These are "ghost licenses" — the users have likely left the team, switched tools, or never onboarded. Reclaiming these seats is a zero-risk, immediate cost reduction.`,
        confidenceScore: 96,
        monthlySavings,
        affectedUsers: seg.zombieUsers,
        currentCost: m.monthlySpend,
        optimizedCost: m.monthlySpend - monthlySavings,
      })
    );
  }

  // Rule 7 — Casual user downgrade opportunity
  if (seg && seg.casualUsers >= 2 && pps > 10) {
    // Casual users can often move to Free or a cheaper tier
    const cheaperPrice = Math.min(pps, 10); // assume $10 or free tier available
    const monthlySavings = seg.casualUsers * Math.max(0, pps - cheaperPrice);
    if (monthlySavings > 0) {
      results.push(
        rec({
          provider: m.provider,
          ruleId: `UNIVERSAL_CASUAL_DOWNGRADE_007_${m.provider.toUpperCase()}`,
          title: `${seg.casualUsers} Casual ${m.provider} Users on Premium Plan`,
          recommendation: `Downgrade ${seg.casualUsers} low-usage users to a lighter ${m.provider} plan`,
          reason: `${seg.casualUsers} users average fewer than 5 prompts per week (${activityNote(m)}). At $${pps}/seat on the ${m.plan || "current"} plan, these users would be better served by a Free or lower-cost tier, saving $${Math.max(0, pps - cheaperPrice)}/seat/month without impacting their workflow.`,
          confidenceScore: 82,
          monthlySavings,
          affectedUsers: seg.casualUsers,
          currentCost: seg.casualUsers * pps,
          optimizedCost: seg.casualUsers * cheaperPrice,
        })
      );
    }
  }

  return results;
}

// ── Main engine entry point ───────────────────────────────────────────────────
export function runAuditEngine(workspaces: WorkspaceMetrics[]): AuditEngineResult {
  _seq = 0; // reset ID counter for deterministic output
  const all: AuditRecommendation[] = [];

  for (const m of workspaces) {
    switch (m.provider) {
      case "ChatGPT":
        all.push(...runChatGPTRules(m));
        break;
      case "Claude":
        all.push(...runClaudeRules(m, workspaces));
        break;
      case "Cursor":
        all.push(...runCursorRules(m, workspaces));
        break;
      case "Copilot":
        all.push(...runCopilotRules(m));
        break;
      case "Gemini":
        all.push(...runGeminiRules(m));
        break;
    }
    all.push(...runUniversalRules(m, workspaces));
  }

  // Deduplicate by ruleId (universal rules can overlap with provider-specific)
  const seen = new Set<string>();
  const deduped = all.filter((r) => {
    if (seen.has(r.ruleId)) return false;
    seen.add(r.ruleId);
    return true;
  });

  // Sort: Critical → High → Medium → Low, then by annualSavings desc
  const ORDER: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
  deduped.sort(
    (a, b) =>
      ORDER[a.priority] - ORDER[b.priority] || b.annualSavings - a.annualSavings
  );

  const totalMonthlySavings = deduped.reduce((s, r) => s + r.monthlySavings, 0);
  const totalCurrentSpend = workspaces.reduce((s, m) => s + m.monthlySpend, 0);
  // Optimization score: inverse of waste ratio, clamped 0–100
  // A score of 100 = no waste found. Lower = more savings opportunity identified.
  const wasteRatio =
    totalCurrentSpend > 0 ? totalMonthlySavings / totalCurrentSpend : 0;
  const optimizationScore = Math.round(
    Math.max(0, Math.min(100, (1 - wasteRatio) * 100))
  );

  return {
    recommendations: deduped,
    totalMonthlySavings,
    totalAnnualSavings: totalMonthlySavings * 12,
    totalCurrentSpend,
    criticalCount: deduped.filter((r) => r.priority === "Critical").length,
    highCount: deduped.filter((r) => r.priority === "High").length,
    providersScanned: [...new Set(deduped.map((r) => r.provider))],
    optimizationScore,
    generatedAt: new Date().toISOString(),
  };
}
