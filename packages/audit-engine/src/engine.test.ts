import { describe, it, expect } from "vitest";
import { runAuditEngine } from "./engine";
import type { WorkspaceMetrics } from "./types";

// ── Shared factory ────────────────────────────────────────────────────────────
function makeMetrics(overrides: Partial<WorkspaceMetrics> = {}): WorkspaceMetrics {
  return {
    provider: "ChatGPT",
    totalSeats: 10,
    activeSeats30d: 8,
    inactiveSeats30d: 2,
    avgPromptsPerUser: 30,
    avgSessionsPerUser: 10,
    monthlySpend: 300,
    apiSpend: 0,
    subscriptionSpend: 300,
    powerUsers: 5,
    casualUsers: 2,
    duplicateTools: [],
    utilizationRate: 0.8,
    annualCommitment: false,
    ...overrides,
  };
}

// ── 1. Savings calculations ───────────────────────────────────────────────────
describe("savings calculations", () => {
  it("computes annualSavings as monthlySavings × 12 for each recommendation", () => {
    const metrics = makeMetrics({
      inactiveSeats30d: 5, // triggers CHATGPT_INACTIVE_SEATS_001 → 5 × $30 = $150/mo
    });
    const result = runAuditEngine([metrics]);

    for (const rec of result.recommendations) {
      expect(rec.annualSavings).toBe(rec.monthlySavings * 12);
    }
  });

  it("totalAnnualSavings equals totalMonthlySavings × 12", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 5 });
    const result = runAuditEngine([metrics]);

    expect(result.totalAnnualSavings).toBe(result.totalMonthlySavings * 12);
  });

  it("totalMonthlySavings is the sum of all recommendation monthlySavings", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 5 });
    const result = runAuditEngine([metrics]);

    const summed = result.recommendations.reduce((s, r) => s + r.monthlySavings, 0);
    expect(result.totalMonthlySavings).toBe(summed);
  });

  it("inactive ChatGPT seats produce correct per-seat savings ($30/seat)", () => {
    const inactiveSeats = 4;
    const metrics = makeMetrics({ inactiveSeats30d: inactiveSeats });
    const result = runAuditEngine([metrics]);

    const rec = result.recommendations.find(
      (r) => r.ruleId === "CHATGPT_INACTIVE_SEATS_001"
    );
    expect(rec).toBeDefined();
    expect(rec!.monthlySavings).toBe(inactiveSeats * 30);
  });

  it("optimizedCost equals currentCost minus monthlySavings on each recommendation", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 5 });
    const result = runAuditEngine([metrics]);

    for (const rec of result.recommendations) {
      if (rec.currentCost !== undefined && rec.optimizedCost !== undefined) {
        expect(rec.optimizedCost).toBe(rec.currentCost - rec.monthlySavings);
      }
    }
  });
});

// ── 2. Edge cases ─────────────────────────────────────────────────────────────
describe("edge cases", () => {
  it("returns no recommendations for an empty workspace list", () => {
    const result = runAuditEngine([]);
    expect(result.recommendations).toHaveLength(0);
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.totalAnnualSavings).toBe(0);
  });

  it("does not fire CHATGPT_INACTIVE_SEATS_001 when inactiveSeats30d < 3", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 2 });
    const result = runAuditEngine([metrics]);

    const rec = result.recommendations.find(
      (r) => r.ruleId === "CHATGPT_INACTIVE_SEATS_001"
    );
    expect(rec).toBeUndefined();
  });

  it("handles zero monthlySpend without dividing by zero (optimizationScore stays 100)", () => {
    const metrics = makeMetrics({
      monthlySpend: 0,
      subscriptionSpend: 0,
      apiSpend: 0,
      utilizationRate: 0.9,
    });
    const result = runAuditEngine([metrics]);
    expect(result.optimizationScore).toBe(100);
  });

  it("clamps optimizationScore between 0 and 100", () => {
    const metrics = makeMetrics({
      inactiveSeats30d: 100,
      monthlySpend: 1,
      utilizationRate: 0.1,
    });
    const result = runAuditEngine([metrics]);
    expect(result.optimizationScore).toBeGreaterThanOrEqual(0);
    expect(result.optimizationScore).toBeLessThanOrEqual(100);
  });

  it("deduplicates recommendations with the same ruleId across multiple runs", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 5 });
    const result = runAuditEngine([metrics]);

    const ruleIds = result.recommendations.map((r) => r.ruleId);
    const unique = new Set(ruleIds);
    expect(ruleIds.length).toBe(unique.size);
  });
});

// ── 3. Plan downgrade logic ───────────────────────────────────────────────────
describe("plan downgrade logic", () => {
  it("recommends downgrading ChatGPT Team → Plus for small low-usage groups", () => {
    const metrics = makeMetrics({
      totalSeats: 4,           // ≤ 5
      avgSessionsPerUser: 2,   // < 3
    });
    const result = runAuditEngine([metrics]);

    const rec = result.recommendations.find(
      (r) => r.ruleId === "CHATGPT_TEAM_PLAN_002"
    );
    expect(rec).toBeDefined();
    // savings = seats × ($30 Team − $20 Plus) = 4 × $10 = $40
    expect(rec!.monthlySavings).toBe(4 * (30 - 20));
  });

  it("does NOT recommend Team → Plus downgrade when group is large (> 5 seats)", () => {
    const metrics = makeMetrics({
      totalSeats: 10,
      avgSessionsPerUser: 2,
    });
    const result = runAuditEngine([metrics]);

    const rec = result.recommendations.find(
      (r) => r.ruleId === "CHATGPT_TEAM_PLAN_002"
    );
    expect(rec).toBeUndefined();
  });

  it("recommends downgrading low-usage Cursor Pro seats", () => {
    const casualUsers = 6;
    const metrics = makeMetrics({
      provider: "Cursor",
      avgPromptsPerUser: 5,    // < 10
      avgSessionsPerUser: 3,   // < 5
      casualUsers,
    });
    const result = runAuditEngine([metrics]);

    const rec = result.recommendations.find(
      (r) => r.ruleId === "CURSOR_LOW_UTILIZATION_001"
    );
    expect(rec).toBeDefined();
    // savings = casualUsers × $20
    expect(rec!.monthlySavings).toBe(casualUsers * 20);
  });
});

// ── 4. Already-optimized users ────────────────────────────────────────────────
describe("already optimized users", () => {
  it("produces no recommendations for a fully-utilized workspace", () => {
    const metrics = makeMetrics({
      totalSeats: 10,
      activeSeats30d: 10,
      inactiveSeats30d: 0,
      avgPromptsPerUser: 50,
      avgSessionsPerUser: 20,
      utilizationRate: 1.0,
      apiSpend: 0,
      subscriptionSpend: 300,
      annualCommitment: false,
      duplicateTools: [],
    });
    const result = runAuditEngine([metrics]);
    expect(result.recommendations).toHaveLength(0);
  });

  it("scores 100 when no savings are identified", () => {
    const metrics = makeMetrics({
      totalSeats: 5,
      activeSeats30d: 5,
      inactiveSeats30d: 0,
      avgPromptsPerUser: 60,
      avgSessionsPerUser: 15,
      utilizationRate: 1.0,
      apiSpend: 0,
      subscriptionSpend: 150,
      annualCommitment: false,
      duplicateTools: [],
    });
    const result = runAuditEngine([metrics]);
    expect(result.optimizationScore).toBe(100);
  });

  it("does not flag annual contract waste when utilization is healthy (≥ 60%)", () => {
    const metrics = makeMetrics({
      utilizationRate: 0.75,
      annualCommitment: true,
    });
    const result = runAuditEngine([metrics]);

    const rec = result.recommendations.find((r) =>
      r.ruleId.startsWith("UNIVERSAL_ANNUAL_CONTRACT_002")
    );
    expect(rec).toBeUndefined();
  });
});

// ── 5. Recommendation validation ─────────────────────────────────────────────
describe("recommendation validation", () => {
  it("every recommendation has a non-empty id, ruleId, title, and recommendation string", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 5, utilizationRate: 0.3 });
    const result = runAuditEngine([metrics]);

    for (const rec of result.recommendations) {
      expect(rec.id).toBeTruthy();
      expect(rec.ruleId).toBeTruthy();
      expect(rec.title).toBeTruthy();
      expect(rec.recommendation).toBeTruthy();
    }
  });

  it("every recommendation has a valid priority derived from annualSavings", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 5, utilizationRate: 0.3 });
    const result = runAuditEngine([metrics]);

    const validPriorities = new Set(["Low", "Medium", "High", "Critical"]);
    for (const rec of result.recommendations) {
      expect(validPriorities.has(rec.priority)).toBe(true);
    }
  });

  it("recommendations are sorted Critical → High → Medium → Low", () => {
    // Trigger multiple rules across providers to get mixed priorities
    const chatgpt = makeMetrics({
      inactiveSeats30d: 40, // large → Critical annual savings
      utilizationRate: 0.3,
      annualCommitment: true,
    });
    const result = runAuditEngine([chatgpt]);

    const ORDER: Record<string, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 };
    const priorities = result.recommendations.map((r) => ORDER[r.priority]);
    for (let i = 1; i < priorities.length; i++) {
      expect(priorities[i]).toBeGreaterThanOrEqual(priorities[i - 1]);
    }
  });

  it("confidenceScore is between 0 and 100 for all recommendations", () => {
    const metrics = makeMetrics({ inactiveSeats30d: 5, utilizationRate: 0.3 });
    const result = runAuditEngine([metrics]);

    for (const rec of result.recommendations) {
      expect(rec.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(rec.confidenceScore).toBeLessThanOrEqual(100);
    }
  });

  it("providersScanned only contains providers that actually produced recommendations", () => {
    const metrics = makeMetrics({
      provider: "Copilot",
      inactiveSeats30d: 8, // triggers COPILOT_INACTIVE_SEATS_001
      utilizationRate: 0.3,
    });
    const result = runAuditEngine([metrics]);

    expect(result.providersScanned).toContain("Copilot");
    expect(result.providersScanned).not.toContain("ChatGPT");
    expect(result.providersScanned).not.toContain("Claude");
  });
});
