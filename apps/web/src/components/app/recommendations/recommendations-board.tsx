"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Inbox } from "lucide-react";
import { RecommendationCard } from "@/components/app/overview/recommendation-card";
import { formatCurrency, cn } from "@/lib/utils";
import type {
  AuditEngineResult,
  AuditPriority,
  AuditProvider,
} from "@ledgerly/audit-engine";

const PRIORITY_ORDER: AuditPriority[] = ["Critical", "High", "Medium", "Low"];

const PRIORITY_PILL: Record<
  AuditPriority | "All",
  { active: string; dot?: string }
> = {
  All: { active: "bg-green-50 text-green-800 border-green-200" },
  Critical: {
    active: "bg-red-50 text-red-700 border-red-200",
    dot: "bg-red-500",
  },
  High: {
    active: "bg-orange-50 text-orange-700 border-orange-200",
    dot: "bg-orange-500",
  },
  Medium: {
    active: "bg-yellow-50 text-yellow-800 border-yellow-200",
    dot: "bg-yellow-500",
  },
  Low: {
    active: "bg-gray-50 text-gray-600 border-gray-200",
  },
};

export function RecommendationsBoard({ result }: { result: AuditEngineResult }) {
  const [priorityFilter, setPriorityFilter] = useState<AuditPriority | "All">(
    "All"
  );
  const [providerFilter, setProviderFilter] = useState<AuditProvider | "All">(
    "All"
  );

  const filtered = useMemo(() => {
    return result.recommendations.filter((r) => {
      if (priorityFilter !== "All" && r.priority !== priorityFilter) return false;
      if (providerFilter !== "All" && r.provider !== providerFilter) return false;
      return true;
    });
  }, [result.recommendations, priorityFilter, providerFilter]);

  const filteredSavings = filtered.reduce((s, r) => s + r.monthlySavings, 0);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
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
              <span className="text-green-700 font-medium">
                {formatCurrency(filteredSavings)}/mo
              </span>{" "}
              in selected view
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <div
            className="flex items-center gap-1.5 flex-wrap"
            role="group"
            aria-label="Filter by priority"
          >
            {(["All", ...PRIORITY_ORDER] as const).map((p) => {
              const active = priorityFilter === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriorityFilter(p)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
                    active
                      ? PRIORITY_PILL[p].active
                      : "border-gray-200 text-muted-foreground hover:bg-gray-50"
                  )}
                >
                  {PRIORITY_PILL[p].dot && (
                    <span
                      className={cn("w-1.5 h-1.5 rounded-full", PRIORITY_PILL[p].dot)}
                    />
                  )}
                  {p}
                </button>
              );
            })}
          </div>
          <div
            className="flex items-center gap-1.5 flex-wrap"
            role="group"
            aria-label="Filter by provider"
          >
            {(["All", ...result.providersScanned] as const).map((p) => {
              const active = providerFilter === p;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => setProviderFilter(p as AuditProvider | "All")}
                  className={cn(
                    "px-2.5 py-1 rounded-full border text-xs font-medium transition-colors",
                    active
                      ? "bg-green-50 text-green-800 border-green-200"
                      : "border-gray-200 text-muted-foreground hover:bg-gray-50"
                  )}
                >
                  {p}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center gap-2 py-16 text-muted-foreground">
          <Inbox className="w-8 h-8 opacity-40" />
          <p className="text-sm">No recommendations match these filters.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((rec, i) => (
            <RecommendationCard key={rec.id} rec={rec} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
