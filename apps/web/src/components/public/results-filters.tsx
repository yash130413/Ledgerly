"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, TrendingDown } from "lucide-react";
import { ResultsRecommendationCard } from "@/components/public/results-recommendation-card";
import { formatCurrency, cn } from "@/lib/utils";
import type { PublicAuditSafe } from "@/types/database";

type Rec = PublicAuditSafe["recommendations"][number];
type Priority = Rec["priority"] | "All";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;
const PRIORITY_ORDER: Rec["priority"][] = ["Critical", "High", "Medium", "Low"];

const PRIORITY_PILL: Record<Rec["priority"], { active: string; dot: string }> = {
  Critical: { active: "bg-red-50 text-red-600 border-red-200",         dot: "#ef4444" },
  High:     { active: "bg-orange-50 text-orange-600 border-orange-200", dot: "#f97316" },
  Medium:   { active: "bg-yellow-50 text-yellow-600 border-yellow-200", dot: "#eab308" },
  Low:      { active: "bg-gray-50 text-gray-500 border-gray-200",       dot: "#94a3b8" },
};

const PROVIDER_DOT: Record<string, string> = {
  ChatGPT: "#10b981", Claude: "#f59e0b", Cursor: "#8b5cf6",
  Copilot: "#0ea5e9", Gemini: "#3b82f6",
};

interface Props {
  recommendations: Rec[];
}

export function ResultsFilters({ recommendations }: Props) {
  const [priority, setPriority] = useState<Priority>("All");
  const [provider, setProvider] = useState<string>("All");

  const providers = [...new Set(recommendations.map((r) => r.provider))];

  const filtered = recommendations.filter((r) => {
    if (priority !== "All" && r.priority !== priority) return false;
    if (provider !== "All" && r.provider !== provider) return false;
    return true;
  });

  // Sort: Critical → High → Medium → Low, then by savings desc
  const sorted = [...filtered].sort((a, b) => {
    const po = PRIORITY_ORDER.indexOf(a.priority) - PRIORITY_ORDER.indexOf(b.priority);
    return po !== 0 ? po : b.annual_savings - a.annual_savings;
  });

  const totalMonthly = filtered.reduce((s, r) => s + r.monthly_savings, 0);
  const totalAnnual  = filtered.reduce((s, r) => s + r.annual_savings, 0);
  const isFiltered   = priority !== "All" || provider !== "All";

  return (
    <div className="flex flex-col gap-5">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div
        className="rounded-2xl bg-white p-4 flex flex-col sm:flex-row sm:items-center gap-4"
        style={{
          boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
          border: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        {/* Filter icon */}
        <div className="flex items-center gap-2 shrink-0">
          <SlidersHorizontal className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter</span>
        </div>

        {/* Priority pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <FilterPill
            label="All"
            count={recommendations.length}
            active={priority === "All"}
            onClick={() => setPriority("All")}
          />
          {PRIORITY_ORDER.map((p) => {
            const count = recommendations.filter((r) => r.priority === p).length;
            if (count === 0) return null;
            const cfg = PRIORITY_PILL[p];
            return (
              <FilterPill
                key={p}
                label={p}
                count={count}
                active={priority === p}
                onClick={() => setPriority(priority === p ? "All" : p)}
                dot={cfg.dot}
                activeClass={cfg.active}
              />
            );
          })}
        </div>

        {/* Provider pills — only if multiple */}
        {providers.length > 1 && (
          <>
            <div className="hidden sm:block w-px h-4 bg-gray-200 shrink-0" />
            <div className="flex items-center gap-1.5 flex-wrap sm:ml-auto">
              {providers.map((p) => {
                const count = recommendations.filter((r) => r.provider === p).length;
                return (
                  <FilterPill
                    key={p}
                    label={p}
                    count={count}
                    active={provider === p}
                    onClick={() => setProvider(provider === p ? "All" : p)}
                    dot={PROVIDER_DOT[p]}
                  />
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* ── Savings summary bar — shown when filtered ────────────────────────── */}
      <AnimatePresence>
        {isFiltered && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="flex items-center justify-between gap-4 px-5 py-3 rounded-xl bg-green-50 border border-green-100"
          >
            <div className="flex items-center gap-2 text-sm text-green-700">
              <TrendingDown className="w-3.5 h-3.5" />
              <span className="font-medium">
                {filtered.length} of {recommendations.length} insights
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-green-600 font-bold tabular-nums">
                {formatCurrency(totalMonthly)}/mo
              </span>
              <span className="text-green-700/50 text-xs">·</span>
              <span className="text-green-700 font-semibold tabular-nums">
                {formatCurrency(totalAnnual)}/yr
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Section header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-4 px-1">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-gray-900">
            Optimization Insights
          </h2>
          <span className="text-sm text-gray-400 font-normal">
            {sorted.length} {sorted.length === 1 ? "finding" : "findings"}
          </span>
        </div>
        {!isFiltered && (
          <span className="text-xs text-gray-400">
            Sorted by priority · {formatCurrency(totalAnnual)}/yr total
          </span>
        )}
      </div>

      {/* ── Cards ────────────────────────────────────────────────────────────── */}
      {sorted.length === 0 ? (
        <div
          className="rounded-2xl bg-white p-14 text-center"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <p className="text-sm text-gray-400">No insights match the selected filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {sorted.map((rec, i) => (
            <ResultsRecommendationCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Filter pill ───────────────────────────────────────────────────────────────

function FilterPill({
  label, count, active, onClick, dot, activeClass,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  dot?: string;
  activeClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-150",
        active
          ? activeClass ?? "bg-gray-900 text-white border-gray-900"
          : "bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:text-gray-700",
      )}
    >
      {dot && !active && (
        <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dot }} aria-hidden="true" />
      )}
      {label}
      <span className={cn("tabular-nums", active ? "opacity-70" : "opacity-50")}>
        {count}
      </span>
    </button>
  );
}
