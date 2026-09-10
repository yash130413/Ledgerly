"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown,
  ArrowRight,
  Users,
  MessageSquare,
  Code2,
  GitBranch,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import type { AuditRecommendation, AuditPriority, AuditProvider } from "@credex/audit-engine";

const PRIORITY_CONFIG: Record<
  AuditPriority,
  { label: string; badge: string; dot: string; accent: string; strip: string }
> = {
  Critical: {
    label: "Critical",
    badge: "bg-red-50 text-red-600 border-red-200",
    dot: "bg-red-500",
    accent: "#ef4444",
    strip: "from-red-500/20 via-red-500/5 to-transparent",
  },
  High: {
    label: "High",
    badge: "bg-orange-50 text-orange-600 border-orange-200",
    dot: "bg-orange-500",
    accent: "#f97316",
    strip: "from-orange-500/20 via-orange-500/5 to-transparent",
  },
  Medium: {
    label: "Medium",
    badge: "bg-yellow-50 text-yellow-600 border-yellow-200",
    dot: "bg-yellow-500",
    accent: "#eab308",
    strip: "from-yellow-500/20 via-yellow-500/5 to-transparent",
  },
  Low: {
    label: "Low",
    badge: "bg-gray-50 text-gray-500 border-gray-200",
    dot: "bg-gray-400",
    accent: "#94a3b8",
    strip: "from-gray-300/20 via-gray-300/5 to-transparent",
  },
};

const PROVIDER_CONFIG: Record<
  AuditProvider,
  { badge: string; accent: string; icon: React.ElementType }
> = {
  ChatGPT: { badge: "bg-emerald-50 text-emerald-700 border-emerald-200", accent: "#10b981", icon: MessageSquare },
  Claude:  { badge: "bg-amber-50 text-amber-700 border-amber-200",       accent: "#f59e0b", icon: Sparkles },
  Cursor:  { badge: "bg-violet-50 text-violet-700 border-violet-200",    accent: "#8b5cf6", icon: Code2 },
  Copilot: { badge: "bg-sky-50 text-sky-700 border-sky-200",             accent: "#0ea5e9", icon: GitBranch },
  Gemini:  { badge: "bg-blue-50 text-blue-700 border-blue-200",          accent: "#3b82f6", icon: Layers },
};

const CONFIDENCE_CONFIG = (score: number) => {
  if (score >= 85) return { label: "High confidence",   text: "text-green-600",  bar: "bg-green-500",  icon: ShieldCheck };
  if (score >= 70) return { label: "Medium confidence", text: "text-yellow-600", bar: "bg-yellow-500", icon: ShieldCheck };
  return               { label: "Low confidence",    text: "text-orange-500", bar: "bg-orange-500", icon: AlertTriangle };
};

function SavingsPill({ monthly, annual }: { monthly: number; annual: number; index: number }) {
  return (
    <div className="flex flex-col items-end gap-0.5 shrink-0">
      <div className="flex items-baseline gap-1">
        <AnimatedCounter
          value={monthly}
          formatter={(v) => formatCurrency(v)}
          className="text-lg font-bold text-green-600 tabular-nums leading-tight"
        />
        <span className="text-xs text-gray-400">/mo</span>
      </div>
      <AnimatedCounter
        value={annual}
        formatter={(v) => formatCurrency(v)}
        className="text-xs text-gray-400 tabular-nums"
      />
    </div>
  );
}

function ConfidenceBar({ score, index }: { score: number; index: number }) {
  const conf = CONFIDENCE_CONFIG(score);
  const Icon = conf.icon;
  return (
    <div className="flex items-center gap-2 shrink-0" aria-label={`${conf.label}: ${score}/100`}>
      <Icon className={cn("w-3 h-3 shrink-0", conf.text)} aria-hidden="true" />
      <div className="flex flex-col gap-1 min-w-[64px]">
        <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <motion.div
            className={cn("h-full rounded-full", conf.bar)}
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.1, ease: "easeOut", delay: index * 0.05 + 0.35 }}
          />
        </div>
        <span className={cn("text-[10px] font-semibold tabular-nums", conf.text)}>
          {score}%
        </span>
      </div>
    </div>
  );
}

export function RecommendationCard({ rec, index }: { rec: AuditRecommendation; index: number }) {
  const [expanded, setExpanded] = useState(false);
  const priority = PRIORITY_CONFIG[rec.priority];
  const provider = PROVIDER_CONFIG[rec.provider];
  const ProviderIcon = provider.icon;

  const savingsPct =
    rec.currentCost && rec.currentCost > 0
      ? Math.round(((rec.currentCost - (rec.optimizedCost ?? 0)) / rec.currentCost) * 100)
      : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98], delay: index * 0.05 }}
      className="group rounded-2xl border border-gray-100 bg-white overflow-hidden shadow-sm shadow-black/[0.04] hover:shadow-md hover:shadow-black/[0.07] hover:-translate-y-0.5 transition-all duration-200"
    >
      {/* Priority accent strip */}
      <div className={cn("h-0.5 w-full bg-gradient-to-r", priority.strip)} />

      {/* Main row */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left px-5 py-4 flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500/30 focus-visible:ring-inset"
        aria-expanded={expanded}
      >
        {/* Provider icon */}
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${provider.accent}12`, border: `1px solid ${provider.accent}30` }}
        >
          <ProviderIcon className="w-4 h-4" style={{ color: provider.accent }} aria-hidden="true" />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline" className={cn("text-[10px] font-semibold px-2 py-0.5 gap-1.5 h-5 rounded-full", priority.badge)}>
              <span className={cn("w-1.5 h-1.5 rounded-full shrink-0", priority.dot)} aria-hidden="true" />
              {priority.label}
            </Badge>
            <Badge variant="outline" className={cn("text-[10px] font-semibold px-2 py-0.5 h-5 rounded-full", provider.badge)}>
              {rec.provider}
            </Badge>
            {rec.affectedUsers != null && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <Users className="w-3 h-3" aria-hidden="true" />
                {rec.affectedUsers} users
              </span>
            )}
          </div>

          <p className="text-sm font-semibold text-gray-900 leading-snug">{rec.title}</p>
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">{rec.recommendation}</p>
        </div>

        {/* Right: savings + confidence + chevron */}
        <div className="flex items-center gap-4 shrink-0 ml-2">
          <SavingsPill monthly={rec.monthlySavings} annual={rec.annualSavings} index={index} />
          <div className="hidden sm:block">
            <ConfidenceBar score={rec.confidenceScore} index={index} />
          </div>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="text-gray-300 group-hover:text-gray-500 transition-colors"
          >
            <ChevronDown className="w-4 h-4" aria-hidden="true" />
          </motion.div>
        </div>
      </button>

      {/* Expanded detail */}
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 pt-4 border-t border-gray-100 flex flex-col gap-5">

              <div className="sm:hidden">
                <ConfidenceBar score={rec.confidenceScore} index={index} />
              </div>

              {rec.currentCost != null && rec.optimizedCost != null && (
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-0.5 min-w-[100px]">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Current</span>
                    <span className="text-sm font-semibold text-gray-900 tabular-nums">{formatCurrency(rec.currentCost)}/mo</span>
                  </div>

                  <ArrowRight className="w-3.5 h-3.5 text-gray-300 shrink-0" aria-hidden="true" />

                  <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 flex flex-col gap-0.5 min-w-[100px]">
                    <span className="text-[10px] text-green-600/70 uppercase tracking-wider">Optimized</span>
                    <span className="text-sm font-semibold text-green-700 tabular-nums">{formatCurrency(rec.optimizedCost)}/mo</span>
                  </div>

                  {savingsPct !== null && (
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Reduction</span>
                      <span className="text-sm font-semibold text-green-600">{savingsPct}%</span>
                    </div>
                  )}

                  {rec.affectedUsers != null && (
                    <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3 flex flex-col gap-0.5">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider">Affected</span>
                      <span className="text-sm font-semibold text-gray-900">{rec.affectedUsers} users</span>
                    </div>
                  )}
                </div>
              )}

              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <TrendingDown className="w-3 h-3 text-gray-400" aria-hidden="true" />
                  <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Reasoning</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed pl-4 border-l-2 border-gray-100">{rec.reason}</p>
              </div>

              <code className="text-[10px] font-mono text-gray-300 self-start">{rec.ruleId}</code>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
