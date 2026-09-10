"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import type { AuditRecommendation, AuditPriority, AuditProvider } from "@ledgerly/audit-engine";

const PRIORITY_STYLES: Record<AuditPriority, string> = {
  Critical: "bg-red-50 text-red-600 border-red-200",
  High:     "bg-orange-50 text-orange-600 border-orange-200",
  Medium:   "bg-yellow-50 text-yellow-600 border-yellow-200",
  Low:      "bg-gray-50 text-gray-500 border-gray-200",
};

const PROVIDER_STYLES: Record<AuditProvider, string> = {
  ChatGPT: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Claude:  "bg-amber-50 text-amber-700 border-amber-200",
  Cursor:  "bg-violet-50 text-violet-700 border-violet-200",
  Copilot: "bg-sky-50 text-sky-700 border-sky-200",
  Gemini:  "bg-blue-50 text-blue-700 border-blue-200",
};

const CONFIDENCE_BAR = (score: number) => {
  if (score >= 85) return "bg-green-500";
  if (score >= 70) return "bg-yellow-500";
  return "bg-orange-500";
};

function RecommendationRow({ rec }: { rec: AuditRecommendation }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        className={cn(
          "border-b border-gray-50 transition-colors cursor-pointer",
          expanded ? "bg-gray-50/80" : "hover:bg-gray-50/60"
        )}
        onClick={() => setExpanded((v) => !v)}
      >
        <td className="pl-4 pr-2 py-3.5 w-8">
          {expanded
            ? <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
            : <ChevronRight className="w-3.5 h-3.5 text-gray-300" />
          }
        </td>

        <td className="px-3 py-3.5 whitespace-nowrap">
          <Badge variant="outline" className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", PRIORITY_STYLES[rec.priority])}>
            {rec.priority}
          </Badge>
        </td>

        <td className="px-3 py-3.5 whitespace-nowrap">
          <Badge variant="outline" className={cn("text-[11px] font-semibold px-2 py-0.5 rounded-full", PROVIDER_STYLES[rec.provider])}>
            {rec.provider}
          </Badge>
        </td>

        <td className="px-3 py-3.5 min-w-[220px]">
          <p className="text-sm font-semibold text-gray-900 leading-tight">{rec.title}</p>
          <p className="text-xs text-gray-400 mt-0.5 line-clamp-1">{rec.recommendation}</p>
        </td>

        <td className="px-3 py-3.5 w-32 hidden md:table-cell">
          <div className="flex items-center gap-2">
            <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all", CONFIDENCE_BAR(rec.confidenceScore))}
                style={{ width: `${rec.confidenceScore}%` }}
              />
            </div>
            <span className="text-xs text-gray-400 w-7 text-right tabular-nums">{rec.confidenceScore}</span>
          </div>
        </td>

        <td className="px-3 py-3.5 text-right whitespace-nowrap">
          <span className="text-sm font-bold text-green-600">{formatCurrency(rec.monthlySavings)}</span>
          <span className="text-xs text-gray-400 block">/ mo</span>
        </td>

        <td className="px-3 py-3.5 text-right whitespace-nowrap hidden lg:table-cell">
          <span className="text-sm font-semibold text-gray-900">{formatCurrency(rec.annualSavings)}</span>
          <span className="text-xs text-gray-400 block">/ yr</span>
        </td>

        <td className="px-3 py-3.5 text-right whitespace-nowrap hidden xl:table-cell">
          <span className="text-sm tabular-nums text-gray-700">
            {rec.affectedUsers != null ? rec.affectedUsers : "—"}
          </span>
          {rec.affectedUsers != null && <span className="text-xs text-gray-400 block">users</span>}
        </td>
      </tr>

      {expanded && (
        <tr className="bg-gray-50/60 border-b border-gray-100">
          <td colSpan={8} className="px-10 py-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {rec.currentCost != null && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Current cost</span>
                  <span className="text-sm font-semibold text-gray-900">{formatCurrency(rec.currentCost)}/mo</span>
                </div>
              )}
              {rec.optimizedCost != null && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Optimized cost</span>
                  <span className="text-sm font-semibold text-green-600">{formatCurrency(rec.optimizedCost)}/mo</span>
                </div>
              )}
              {rec.affectedUsers != null && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Affected users</span>
                  <span className="text-sm font-semibold text-gray-900">{rec.affectedUsers}</span>
                </div>
              )}
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Rule ID</span>
                <code className="text-xs font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded-lg w-fit">{rec.ruleId}</code>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-gray-400 uppercase tracking-wider font-medium">Reasoning</span>
              <p className="text-sm text-gray-500 leading-relaxed max-w-3xl">{rec.reason}</p>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

function Th({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <th className={cn("px-3 py-3 text-left text-[11px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap", className)}>
      {children}
    </th>
  );
}

export function RecommendationsTable({ recommendations }: { recommendations: AuditRecommendation[] }) {
  if (recommendations.length === 0) {
    return (
      <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center text-sm text-gray-400 shadow-sm">
        No recommendations generated. All utilization metrics are within benchmark thresholds.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm shadow-black/[0.04]">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-100 bg-gray-50/60">
            <tr>
              <th className="w-8 pl-4" />
              <Th>Priority</Th>
              <Th>Provider</Th>
              <Th>Finding</Th>
              <Th className="hidden md:table-cell">Confidence</Th>
              <Th className="text-right">Monthly</Th>
              <Th className="text-right hidden lg:table-cell">Annual</Th>
              <Th className="text-right hidden xl:table-cell">Users</Th>
            </tr>
          </thead>
          <tbody>
            {recommendations.map((rec) => (
              <RecommendationRow key={rec.id} rec={rec} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
