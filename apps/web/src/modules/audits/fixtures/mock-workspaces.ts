import type { WorkspaceMetrics } from "@ledgerly/audit-engine";

// Each fixture is tuned to trigger specific rules while remaining believable
// for a mid-market engineering org (~80 seats total across tools)

export const mockWorkspaces: WorkspaceMetrics[] = [
  {
    provider: "ChatGPT",
    totalSeats: 42,
    activeSeats30d: 27,
    inactiveSeats30d: 15,
    avgPromptsPerUser: 34,
    avgSessionsPerUser: 8,
    monthlySpend: 1_260,
    apiSpend: 680,
    subscriptionSpend: 1_260,
    powerUsers: 11,
    casualUsers: 16,
    duplicateTools: ["ChatGPT", "Claude", "Gemini"],
    utilizationRate: 27 / 42, // 0.643
    annualCommitment: false,
  },
  {
    provider: "Claude",
    totalSeats: 30,
    activeSeats30d: 13,
    inactiveSeats30d: 17,
    avgPromptsPerUser: 14,
    avgSessionsPerUser: 4,
    monthlySpend: 600,
    apiSpend: 0,
    subscriptionSpend: 600,
    powerUsers: 5,
    casualUsers: 8,
    duplicateTools: ["ChatGPT", "Claude", "Gemini"],
    utilizationRate: 13 / 30, // 0.433
    annualCommitment: true,
  },
  {
    provider: "Cursor",
    totalSeats: 24,
    activeSeats30d: 16,
    inactiveSeats30d: 8,
    avgPromptsPerUser: 7,
    avgSessionsPerUser: 3,
    monthlySpend: 480,
    apiSpend: 0,
    subscriptionSpend: 480,
    powerUsers: 6,
    casualUsers: 10,
    duplicateTools: ["Cursor", "Copilot"],
    utilizationRate: 16 / 24, // 0.667
    annualCommitment: false,
  },
  {
    provider: "Copilot",
    totalSeats: 38,
    activeSeats30d: 21,
    inactiveSeats30d: 17,
    avgPromptsPerUser: 4,
    avgSessionsPerUser: 6,
    monthlySpend: 722,
    apiSpend: 0,
    subscriptionSpend: 722,
    powerUsers: 6,
    casualUsers: 15,
    duplicateTools: ["Cursor", "Copilot"],
    utilizationRate: 21 / 38, // 0.553
    annualCommitment: true,
  },
  {
    provider: "Gemini",
    totalSeats: 50,
    activeSeats30d: 18,
    inactiveSeats30d: 32,
    avgPromptsPerUser: 9,
    avgSessionsPerUser: 2,
    monthlySpend: 1_000,
    apiSpend: 0,
    subscriptionSpend: 1_000,
    powerUsers: 7,
    casualUsers: 11,
    duplicateTools: ["ChatGPT", "Claude", "Gemini", "Copilot"],
    utilizationRate: 18 / 50, // 0.36
    annualCommitment: true,
  },
];
