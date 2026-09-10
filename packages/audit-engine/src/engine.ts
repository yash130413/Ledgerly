import type {
  AuditRecommendation,
  AuditEngineResult,
  AuditPriority,
  WorkspaceMetrics,
} from "./types";

// ── Pricing constants ────────────────────────────────────────────────────────
const PRICING = {
  CHATGPT_TEAM: 30,
  CHATGPT_PLUS: 20,
  CLAUDE_PRO: 20,
  CURSOR_PRO: 20,
  COPILOT_BUSINESS: 19,
  GEMINI_BUSINESS: 20,
} as const;

// ── Deterministic confidence formula ────────────────────────────────────────
function calculateConfidence(
  utilizationRate: number,
  sampleSize: number,
  spendingConsistency: number
): number {
  let score = 50;
  if (utilizationRate < 0.4) score += 20;
  if (sampleSize > 20) score += 10;
  if (spendingConsistency > 0.8) score += 15;
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

// ── Helper: build a recommendation ──────────────────────────────────────────
function rec(
  partial: Omit<AuditRecommendation, "id" | "priority" | "annualSavings"> & {
    monthlySavings: number;
  }
): AuditRecommendation {
  const annualSavings = partial.monthlySavings * 12;
  return {
    ...partial,
    id: nextId(),
    annualSavings,
    priority: derivePriority(annualSavings),
  };
}

// ── ChatGPT rules ────────────────────────────────────────────────────────────
function runChatGPTRules(m: WorkspaceMetrics): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];

  // Rule 1 — Inactive team seats
  if (m.inactiveSeats30d >= 3) {
    const monthlySavings = m.inactiveSeats30d * PRICING.CHATGPT_TEAM;
    results.push(
      rec({
        provider: "ChatGPT",
        ruleId: "CHATGPT_INACTIVE_SEATS_001",
        title: "Inactive ChatGPT Team Seats",
        recommendation: "Remove or downgrade inactive ChatGPT Team seats",
        reason: `${m.inactiveSeats30d} licensed users showed no activity in the last 30 days, indicating underutilized subscriptions.`,
        confidenceScore: 92,
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.subscriptionSpend,
        optimizedCost: m.subscriptionSpend - monthlySavings,
      })
    );
  }

  // Rule 2 — Team plan not needed
  if (m.totalSeats <= 5 && m.avgSessionsPerUser < 3) {
    const monthlySavings = m.totalSeats * (PRICING.CHATGPT_TEAM - PRICING.CHATGPT_PLUS);
    results.push(
      rec({
        provider: "ChatGPT",
        ruleId: "CHATGPT_TEAM_PLAN_002",
        title: "Team Plan Overhead for Small Group",
        recommendation: "Consider switching from ChatGPT Team to individual Plus subscriptions",
        reason: `Current collaboration usage (avg ${m.avgSessionsPerUser.toFixed(1)} sessions/user) appears low relative to team plan pricing.`,
        confidenceScore: 84,
        monthlySavings,
        affectedUsers: m.totalSeats,
        currentCost: m.totalSeats * PRICING.CHATGPT_TEAM,
        optimizedCost: m.totalSeats * PRICING.CHATGPT_PLUS,
      })
    );
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

  // Rule 1 — Premium usage without heavy activity
  if (m.avgPromptsPerUser < 20 && m.utilizationRate < 0.5) {
    const monthlySavings = m.inactiveSeats30d * PRICING.CLAUDE_PRO;
    results.push(
      rec({
        provider: "Claude",
        ruleId: "CLAUDE_LOW_ACTIVITY_001",
        title: "Claude Pro Seats Without Heavy Usage",
        recommendation: "Reduce unused Claude Pro seats",
        reason: `Current Claude usage (avg ${m.avgPromptsPerUser} prompts/user) and ${Math.round(m.utilizationRate * 100)}% seat utilization do not justify the number of active premium licenses.`,
        confidenceScore: 90,
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.totalSeats * PRICING.CLAUDE_PRO,
        optimizedCost: m.activeSeats30d * PRICING.CLAUDE_PRO,
      })
    );
  }

  // Rule 2 — Mixed vendor consolidation
  const chatgptMetrics = allMetrics.find((x) => x.provider === "ChatGPT");
  if (
    m.duplicateTools.includes("ChatGPT") &&
    m.duplicateTools.includes("Claude") &&
    chatgptMetrics
  ) {
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

  // Rule 1 — Casual users on Cursor Pro
  if (m.avgPromptsPerUser < 10 && m.avgSessionsPerUser < 5) {
    const monthlySavings = m.casualUsers * PRICING.CURSOR_PRO;
    results.push(
      rec({
        provider: "Cursor",
        ruleId: "CURSOR_LOW_UTILIZATION_001",
        title: "Low Utilization of Cursor Pro Seats",
        recommendation: "Downgrade low-usage Cursor Pro users",
        reason: `${m.casualUsers} licensed users showed fewer than 5 active coding sessions during the last 30 days, reducing ROI on premium coding assistant licenses.`,
        confidenceScore: 88,
        monthlySavings,
        affectedUsers: m.casualUsers,
        currentCost: m.totalSeats * PRICING.CURSOR_PRO,
        optimizedCost: (m.totalSeats - m.casualUsers) * PRICING.CURSOR_PRO,
      })
    );
  }

  // Rule 2 — Copilot + Cursor redundancy
  const copilotMetrics = allMetrics.find((x) => x.provider === "Copilot");
  if (
    m.duplicateTools.includes("Cursor") &&
    m.duplicateTools.includes("Copilot") &&
    copilotMetrics
  ) {
    const cursorSpend = m.monthlySpend;
    const copilotSpend = copilotMetrics.monthlySpend;
    const monthlySavings = Math.round(Math.min(cursorSpend, copilotSpend) * 0.3);
    results.push(
      rec({
        provider: "Cursor",
        ruleId: "CURSOR_COPILOT_REDUNDANCY_002",
        title: "Cursor and Copilot Redundancy",
        recommendation: "Standardize on either Cursor or GitHub Copilot for engineering teams",
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

  // Rule 1 — Unused Copilot seats
  if (m.inactiveSeats30d > 5) {
    const monthlySavings = m.inactiveSeats30d * PRICING.COPILOT_BUSINESS;
    results.push(
      rec({
        provider: "Copilot",
        ruleId: "COPILOT_INACTIVE_SEATS_001",
        title: "Inactive GitHub Copilot Licenses",
        recommendation: "Remove inactive GitHub Copilot licenses",
        reason: `${m.inactiveSeats30d} Copilot licenses have shown no coding activity within the last 30 days.`,
        confidenceScore: 94,
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.totalSeats * PRICING.COPILOT_BUSINESS,
        optimizedCost: m.activeSeats30d * PRICING.COPILOT_BUSINESS,
      })
    );
  }

  // Rule 2 — Junior dev overspend
  if (m.avgPromptsPerUser < 5 && m.powerUsers < m.totalSeats * 0.2) {
    const lowValueSeats = m.totalSeats - m.powerUsers;
    const monthlySavings = Math.round(lowValueSeats * PRICING.COPILOT_BUSINESS * 0.5);
    results.push(
      rec({
        provider: "Copilot",
        ruleId: "COPILOT_POWER_USER_CONCENTRATION_002",
        title: "Copilot Licenses Concentrated in Low-Frequency Users",
        recommendation: "Restrict Copilot licenses to high-frequency engineering contributors",
        reason: `Only ${m.powerUsers} of ${m.totalSeats} licensed users qualify as power users (avg ${m.avgPromptsPerUser} prompts/user), suggesting a premium tier mismatch for the majority of the team.`,
        confidenceScore: 83,
        monthlySavings,
        affectedUsers: lowValueSeats,
        currentCost: m.totalSeats * PRICING.COPILOT_BUSINESS,
        optimizedCost: m.totalSeats * PRICING.COPILOT_BUSINESS - monthlySavings,
      })
    );
  }

  return results;
}

// ── Gemini rules ─────────────────────────────────────────────────────────────
function runGeminiRules(m: WorkspaceMetrics): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];

  // Rule 1 — Workspace add-on underutilization
  if (m.utilizationRate < 0.4 && m.totalSeats > 10) {
    const monthlySavings = m.inactiveSeats30d * PRICING.GEMINI_BUSINESS;
    results.push(
      rec({
        provider: "Gemini",
        ruleId: "GEMINI_WORKSPACE_UNDERUTILIZATION_001",
        title: "Gemini Workspace Add-on Underutilization",
        recommendation: "Reduce Gemini Workspace add-on seat coverage",
        reason: `${Math.round((1 - m.utilizationRate) * 100)}% of provisioned Gemini seats (${m.inactiveSeats30d} of ${m.totalSeats}) appear inactive or lightly used over the last 30 days.`,
        confidenceScore: 89,
        monthlySavings,
        affectedUsers: m.inactiveSeats30d,
        currentCost: m.totalSeats * PRICING.GEMINI_BUSINESS,
        optimizedCost: m.activeSeats30d * PRICING.GEMINI_BUSINESS,
      })
    );
  }

  // Rule 2 — Workspace feature overlap
  if (m.duplicateTools.length >= 3) {
    const monthlySavings = Math.round(m.monthlySpend * 0.2);
    results.push(
      rec({
        provider: "Gemini",
        ruleId: "GEMINI_PLATFORM_OVERLAP_002",
        title: "AI Productivity Platform Overlap",
        recommendation: "Consolidate overlapping AI productivity platforms",
        reason: `${m.duplicateTools.length} AI assistants (${m.duplicateTools.join(", ")}) are currently serving similar productivity use cases across the organization, creating redundant licensing costs.`,
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
function runUniversalRules(m: WorkspaceMetrics): AuditRecommendation[] {
  const results: AuditRecommendation[] = [];

  // Rule 1 — Low utilization
  if (m.utilizationRate < 0.5) {
    const removableSeats = m.inactiveSeats30d;
    const pricePerSeat =
      m.totalSeats > 0 ? Math.round(m.monthlySpend / m.totalSeats) : 20;
    const monthlySavings = removableSeats * pricePerSeat;
    const confidence = calculateConfidence(m.utilizationRate, m.totalSeats, 0.85);
    results.push(
      rec({
        provider: m.provider,
        ruleId: `UNIVERSAL_LOW_UTILIZATION_001_${m.provider.toUpperCase()}`,
        title: `${m.provider} Seat Utilization Below Benchmark`,
        recommendation: "Reduce inactive AI software licenses",
        reason: `Overall seat utilization is ${Math.round(m.utilizationRate * 100)}% — below the 50% SaaS efficiency benchmark. ${removableSeats} seats have shown no activity in the last 30 days.`,
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
        reason: `Current utilization (${Math.round(m.utilizationRate * 100)}%) suggests the organization is overcommitted on an annual contract relative to actual demand.`,
        confidenceScore: 79,
        monthlySavings,
        currentCost: m.monthlySpend,
        optimizedCost: m.monthlySpend - monthlySavings,
      })
    );
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
    all.push(...runUniversalRules(m));
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
  const wasteRatio = totalCurrentSpend > 0 ? totalMonthlySavings / totalCurrentSpend : 0;
  const optimizationScore = Math.round(Math.max(0, Math.min(100, (1 - wasteRatio) * 100)));

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
