"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AuditHeroStats } from "@/components/app/overview/audit-hero-stats";
import { SavingsBreakdownChart } from "@/components/charts/savings-breakdown-chart";
import { UtilizationChart } from "@/components/charts/utilization-chart";
import { RecommendationCard } from "@/components/app/overview/recommendation-card";
import { formatCurrency, cn } from "@/lib/utils";
import { useAuditForm } from "@/hooks/use-audit-form";
import { useAuditResults } from "@/hooks/use-audit-results";
import type {
  AuditEngineResult,
  AuditPriority,
  AuditProvider,
  WorkspaceMetrics,
} from "@ledgerly/audit-engine";
import styles from "@/components/components.module.css";
import { SlidersHorizontal, Inbox } from "lucide-react";

const PRIORITY_ORDER: AuditPriority[] = ["Critical", "High", "Medium", "Low"];

const PRIORITY_PILL: Record<AuditPriority | "All", { active: string; dot?: string }> = {
  All:      { active: "bg-white/[0.08] text-foreground border-white/20" },
  Critical: { active: "bg-red-500/10 text-red-400 border-red-500/30",    dot: "bg-red-400" },
  High:     { active: "bg-orange-500/10 text-orange-400 border-orange-500/30", dot: "bg-orange-400" },
  Medium:   { active: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400" },
  Low:      { active: "bg-white/[0.05] text-muted-foreground border-white/10" },
};

const PROVIDER_COLORS: Record<AuditProvider, string> = {
  ChatGPT: "#34d399",
  Claude:  "#fbbf24",
  Cursor:  "#a78bfa",
  Copilot: "#38bdf8",
  Gemini:  "#60a5fa",
};

interface Props {
  result: AuditEngineResult;
  workspaces: WorkspaceMetrics[];
}

export function AuditResultsDashboard({ result, workspaces }: Props) {
  const {
    priorityFilter,
    providerFilter,
    setPriorityFilter,
    setProviderFilter,
    isHydrated: formHydrated,
  } = useAuditForm();
  const { setResults } = useAuditResults();

  useEffect(() => {
    setResults(result);
  }, [result]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!formHydrated) return null;

  const filtered = result.recommendations.filter((r) => {
    if (priorityFilter !== "All" && r.priority !== priorityFilter) return false;
    if (providerFilter !== "All" && r.provider !== providerFilter) return false;
    return true;
  });

  const filteredSavings = filtered.reduce((s, r) => s + r.monthlySavings, 0);

  const providerSummary = result.providersScanned.map((p) => {
    const recs = result.recommendations.filter((r) => r.provider === p);
    return {
      provider: p,
      count: recs.length,
      savings: recs.reduce((s, r) => s + r.monthlySavings, 0),
    };
  });

  return (
    <div className="flex flex-col gap-8">

      {/* ── Hero stats ──────────────────────────────────────────────────────── */}
      <AuditHeroStats result={result} />

      {/* ── Charts ──────────────────────────────────────────────────────────── */}
      <div className="grid lg:grid-cols-2 gap-4">
        <SavingsBreakdownChart recommendations={result.recommendations} />
        <UtilizationChart workspaces={workspaces} />
      </div>

      {/* ── Provider pills ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
      >
        {providerSummary.map(({ provider, count, savings }) => {
          const isActive = providerFilter === provider;
          const color = PROVIDER_COLORS[provider];
          return (
            <button
              key={provider}
              onClick={() => setProviderFilter(isActive ? "All" : provider)}
              className={cn(
                "group rounded-xl border px-4 py-3 flex flex-col gap-2 text-left transition-all duration-200",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                isActive
                  ? "border-white/20 bg-white/[0.07] shadow-sm"
                  : "border-white/[0.06] bg-card hover:bg-white/[0.04] hover:border-white/[0.10]"
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2 h-2 rounded-full shrink-0 transition-transform duration-200 ${isActive ? "scale-125" : "group-hover:scale-110"} ${styles.dotBg}`}
                    style={{ "--dot-color": color } as React.CSSProperties}
                  />
                  <span className="text-xs font-semibold">{provider}</span>
                </div>
                {isActive && (
                  <span className="text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                    Active
                  </span>
                )}
              </div>
              <div className="flex items-end justify-between gap-2">
                <span className="text-2xl font-bold tabular-nums leading-none">{count}</span>
                <span
                  className={`text-xs font-semibold tabular-nums ${styles.dotColor}`}
                  style={{ "--dot-color": color } as React.CSSProperties}
                >
                  {formatCurrency(savings)}/mo
                </span>
              </div>
            </button>
          );
        })}
      </motion.div>

      {/* ── Recommendations ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-5">

        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
        >
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
              <h2 className="text-base font-semibold">
                Recommendations
                {filtered.length !== result.recommendations.length && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    {filtered.length} of {result.recommendations.length}
                  </span>
                )}
              </h2>
            </div>
            {filteredSavings > 0 && (
              <p className="text-xs text-muted-foreground pl-6">
                <span className="text-emerald-400 font-medium">{formatCurrency(filteredSavings)}/mo</span>
                {" "}in selected view
              </p>
            )}
          </div>

          {/* Priority filter pills */}
          <div className="flex items-center gap-1.5 flex-wrap" role="group" aria-label="Filter by priority">
            {(["All", ...PRIORITY_ORDER] as const).map((p) => {
              const count =
                p === "All"
                  ? result.recommendations.length
                  : result.recommendations.filter((r) => r.priority === p).length;
              if (count === 0 && p !== "All") return null;
              const isActive = priorityFilter === p;
              const cfg = PRIORITY_PILL[p];
              return (
                <button
                  key={p}
                  onClick={() => setPriorityFilter(p)}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all duration-150",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    isActive
                      ? cfg.active
                      : "border-white/[0.06] text-muted-foreground hover:text-foreground hover:bg-white/[0.04] hover:border-white/[0.10]"
                  )}
                  aria-pressed={isActive}
                >
                  {cfg.dot && isActive && (
                    <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", cfg.dot)} aria-hidden="true" />
                  )}
                  {p}
                  <span className="opacity-50 tabular-nums">{count}</span>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Cards list */}
        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-2xl border border-white/[0.06] bg-card p-14 flex flex-col items-center gap-3 text-center"
          >
            <Inbox className="w-8 h-8 text-muted-foreground/40" aria-hidden="true" />
            <p className="text-sm text-muted-foreground">No recommendations match the selected filters.</p>
          </motion.div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {filtered.map((rec, i) => (
              <RecommendationCard key={rec.id} rec={rec} index={i} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
