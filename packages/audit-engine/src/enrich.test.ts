import { describe, it, expect } from "vitest";
import {
  buildAuditWorkspaces,
  estimateActiveSeats,
  pricePerSeat,
  segmentUsers,
} from "./enrich";

describe("estimateActiveSeats", () => {
  it("does not use a blind 70/30 split", () => {
    const a = estimateActiveSeats({
      seats: 10,
      provider: "Cursor",
      plan: "Pro",
      teamSize: 10,
      useCase: "Coding",
    });
    const b = estimateActiveSeats({
      seats: 10,
      provider: "Cursor",
      plan: "Pro",
      teamSize: 10,
      useCase: "Writing",
    });
    expect(a.active).not.toBe(7);
    expect(a.active).toBeGreaterThan(b.active);
  });

  it("caps useful seats by team size", () => {
    const est = estimateActiveSeats({
      seats: 50,
      provider: "ChatGPT",
      plan: "Team",
      teamSize: 8,
      useCase: "Mixed",
    });
    expect(est.active + est.inactive).toBe(50);
    expect(est.active).toBeLessThanOrEqual(8);
    expect(est.source).toBe("estimated");
  });
});

describe("buildAuditWorkspaces", () => {
  it("prefers reported active seats", () => {
    const [ws] = buildAuditWorkspaces(
      [{ provider: "chatgpt", plan: "Team", monthlySpend: 300, seats: 10, activeSeats: 4 }],
      { teamSize: 10, useCase: "Coding" }
    );
    expect(ws.activeSeats30d).toBe(4);
    expect(ws.inactiveSeats30d).toBe(6);
    expect(ws.activitySource).toBe("reported");
    expect(ws.plan).toBe("Team");
    expect(ws.teamSize).toBe(10);
    expect(ws.useCase).toBe("Coding");
  });

  it("marks cross-tool duplicates across form tools", () => {
    const workspaces = buildAuditWorkspaces(
      [
        { provider: "ChatGPT", plan: "Plus", monthlySpend: 100, seats: 5 },
        { provider: "Claude", plan: "Pro", monthlySpend: 100, seats: 5 },
      ],
      { teamSize: 5, useCase: "Writing" }
    );
    expect(workspaces[0].duplicateTools).toEqual(["Claude"]);
    expect(workspaces[1].duplicateTools).toEqual(["ChatGPT"]);
  });

  it("sets annualCommitment for Team/Enterprise plans", () => {
    const [ws] = buildAuditWorkspaces([
      { provider: "cursor", plan: "Business", monthlySpend: 400, seats: 10 },
    ]);
    expect(ws.annualCommitment).toBe(true);
  });
});

describe("pricePerSeat", () => {
  it("returns published plan prices", () => {
    expect(pricePerSeat("ChatGPT", "Team")).toBe(30);
    expect(pricePerSeat("Copilot", "Business")).toBe(19);
  });
});

describe("segmentUsers", () => {
  it("segments total seats across zombie, casual, regular, and power tiers", () => {
    const seg = segmentUsers({
      totalSeats: 20,
      activeSeats: 12,
      inactiveSeats: 8,
      provider: "ChatGPT",
      plan: "Team",
      useCase: "Coding",
    });

    // Sum must equal total seats
    const total = seg.zombieUsers + seg.casualUsers + seg.regularUsers + seg.powerUsers;
    expect(total).toBe(20);
    // Inactive seats produce zombie users
    expect(seg.zombieUsers).toBeGreaterThan(0);
    expect(seg.powerUsers).toBeGreaterThan(0);
  });

  it("handles 0 seats gracefully", () => {
    const seg = segmentUsers({
      totalSeats: 0,
      activeSeats: 0,
      inactiveSeats: 0,
      provider: "ChatGPT",
    });
    expect(seg).toEqual({ zombieUsers: 0, casualUsers: 0, regularUsers: 0, powerUsers: 0 });
  });
});
