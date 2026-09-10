"use client";

import { useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
  ChevronDown, ArrowRight, Users, ShieldCheck,
  AlertTriangle, Lightbulb, TrendingDown, Zap,
} from "lucide-react";
import { formatCurrency, cn } from "@/lib/utils";
import type { PublicAuditSafe } from "@/types/database";

type Rec = PublicAuditSafe["recommendations"][number];

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// ── Config ────────────────────────────────────────────────────────────────────

const PRIORITY: Record<Rec["priority"], {
  label: string;
  accent: string;
  badgeBg: string; badgeText: string; badgeBorder: string;
  stripFrom: string;
  urgency: string;
}> = {
  Critical: {
    label: "Critical",
    accent: "#ef4444",
    badgeBg: "bg-red-50", badgeText: "text-red-600", badgeBorder: "border-red-200",
    stripFrom: "from-red-400",
    urgency: "Act immediately",
  },
  High: {
    label: "High",
    accent: "#f97316",
    badgeBg: "bg-orange-50", badgeText: "text-orange-600", badgeBorder: "border-orange-200",
    stripFrom: "from-orange-400",
    urgency: "High priority",
  },
  Medium: {
    label: "Medium",
    accent: "#eab308",
    badgeBg: "bg-yellow-50", badgeText: "text-yellow-600", badgeBorder: "border-yellow-200",
    stripFrom: "from-yellow-400",
    urgency: "Review soon",
  },
  Low: {
    label: "Low",
    accent: "#94a3b8",
    badgeBg: "bg-gray-50", badgeText: "text-gray-500", badgeBorder: "border-gray-200",
    stripFrom: "from-gray-300",
    urgency: "When convenient",
  },
};

const PROVIDER_STYLE: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  ChatGPT: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", dot: "#10b981" },
  Claude:  { bg: "bg-amber-50",   text: "text-amber-700",   border: "border-amber-200",   dot: "#f59e0b" },
  Cursor:  { bg: "bg-violet-50",  text: "text-violet-700",  border: "border-violet-200",  dot: "#8b5cf6" },
  Copilot: { bg: "bg-sky-50",     text: "text-sky-700",     border: "border-sky-200",     dot: "#0ea5e9" },
  Gemini:  { bg: "bg-blue-50",    text: "text-blue-700",    border: "border-blue-200",    dot: "#3b82f6" },
};

const DEFAULT_PROVIDER = { bg: "bg-gray-50", text: "text-gray-600", border: "border-gray-200", dot: "#94a3b8" };

// ── Confidence ring ───────────────────────────────────────────────────────────

function ConfidenceRing({ score }: { score: number }) {
  const size = 36;
  const stroke = 3;
  const r = (size - stroke * 2) / 2;
  const circ = 2 * Math.PI * r;
  const filled = (score / 100) * circ;
  const color = score >= 85 ? "#16a34a" : score >= 70 ? "#f59e0b" : "#ef4444";
  const cx = size / 2;

  return (
    <div className="relative flex items-center justify-center shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90" aria-hidden="true">
        <circle cx={cx} cy={cx} r={r} fill="none" stroke="#f1f5f9" strokeWidth={stroke} />
        <motion.circle
          cx={cx} cy={cx} r={r}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: circ - filled }}
          transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.4 }}
        />
      </svg>
      <span
        className="absolute text-[9px] font-bold tabular-nums"
        style={{ color }}
      >
        {score}
      </span>
    </div>
  );
}

// ── Savings bar ───────────────────────────────────────────────────────────────

function SavingsBar({ monthly, annual }: { monthly: number; annual: number }) {
  return (
    <div className="flex flex-col items-end gap-0.5 shrink-0 min-w-[88px]">
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-bold text-green-600 tabular-nums leading-none">
          {formatCurrency(monthly)}
        </span>
        <span className="text-[11px] text-gray-400 font-medium">/mo</span>
      </div>
      <span className="text-xs text-gray-400 tabular-nums">
        {formatCurrency(annual)}/yr
      </span>
    </div>
  );
}

// ── Expanded detail panel ─────────────────────────────────────────────────────

function DetailPanel({ rec, priority }: { rec: Rec; priority: typeof PRIORITY[Rec["priority"]] }) {
  return (
    <div className="px-6 pb-6 pt-5 flex flex-col gap-6">

      {/* Savings breakdown */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-2xl bg-green-50 border border-green-100 p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-green-600/60 uppercase tracking-widest">Monthly savings</span>
          <span className="text-2xl font-bold text-green-700 tabular-nums leading-none">
            {formatCurrency(rec.monthly_savings)}
          </span>
          <span className="text-[11px] text-green-600/60">recoverable / mo</span>
        </div>

        <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 flex flex-col gap-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Annual impact</span>
          <span className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
            {formatCurrency(rec.annual_savings)}
          </span>
          <span className="text-[11px] text-gray-400">projected / yr</span>
        </div>

        {rec.affected_users > 0 && (
          <div className="rounded-2xl bg-gray-50 border border-gray-100 p-4 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Affected users</span>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-gray-400" />
              <span className="text-2xl font-bold text-gray-900 tabular-nums leading-none">
                {rec.affected_users}
              </span>
            </div>
            <span className="text-[11px] text-gray-400">seats impacted</span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="h-px bg-gray-100" />

      {/* Why this matters */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
            <Lightbulb className="w-3 h-3 text-amber-500" />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Why this matters</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed pl-7">{rec.reason}</p>
      </div>

      {/* Recommended action */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
            <ArrowRight className="w-3 h-3 text-green-600" />
          </div>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Recommended action</span>
        </div>
        <div
          className="ml-7 rounded-xl p-4 text-sm text-gray-700 leading-relaxed border-l-2"
          style={{
            background: `${priority.accent}06`,
            borderLeftColor: `${priority.accent}40`,
          }}
        >
          {rec.recommendation}
        </div>
      </div>

      {/* Urgency + confidence footer */}
      <div className="flex items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5" style={{ color: priority.accent }} />
          <span className="text-xs font-semibold" style={{ color: priority.accent }}>
            {priority.urgency}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
          Rule-based · deterministic
        </div>
      </div>
    </div>
  );
}

// ── Main card ─────────────────────────────────────────────────────────────────

interface Props {
  rec: Rec;
  index: number;
}

export function ResultsRecommendationCard({ rec, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  const reduce = useReducedMotion();
  const p = PRIORITY[rec.priority];
  const prov = PROVIDER_STYLE[rec.provider] ?? DEFAULT_PROVIDER;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay: index * 0.06 }}
      className={cn(
        "group relative rounded-2xl bg-white overflow-hidden",
        "transition-all duration-200",
        expanded
          ? "shadow-lg shadow-black/[0.08]"
          : "shadow-sm shadow-black/[0.04] hover:shadow-md hover:shadow-black/[0.07] hover:-translate-y-0.5",
      )}
      style={{ border: "1px solid rgba(0,0,0,0.06)" }}
    >
      {/* Priority accent strip — left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-2xl"
        style={{ background: p.accent }}
        aria-hidden="true"
      />

      {/* Collapsed header — always visible */}
      <button
        onClick={() => setExpanded((v) => !v)}
        className="w-full text-left pl-7 pr-5 py-5 flex items-start gap-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500/30"
        aria-expanded={expanded}
      >
        {/* Left content */}
        <div className="flex-1 min-w-0 flex flex-col gap-2.5">

          {/* Badge row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Priority */}
            <span className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-0.5 rounded-full border",
              p.badgeBg, p.badgeText, p.badgeBorder,
            )}>
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: p.accent }}
                aria-hidden="true"
              />
              {p.label}
            </span>

            {/* Provider */}
            <span className={cn(
              "inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border",
              prov.bg, prov.text, prov.border,
            )}>
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: prov.dot }} aria-hidden="true" />
              {rec.provider}
            </span>

            {/* Affected users */}
            {rec.affected_users > 0 && (
              <span className="inline-flex items-center gap-1 text-[11px] text-gray-400 font-medium">
                <Users className="w-3 h-3" aria-hidden="true" />
                {rec.affected_users} users
              </span>
            )}
          </div>

          {/* Title */}
          <p className="text-[15px] font-semibold text-gray-900 leading-snug tracking-tight">
            {rec.title}
          </p>

          {/* Preview — hidden when expanded */}
          <AnimatePresence initial={false}>
            {!expanded && (
              <motion.p
                initial={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.15 }}
                className="text-sm text-gray-400 leading-relaxed line-clamp-1 overflow-hidden"
              >
                {rec.recommendation}
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Right — savings + confidence + chevron */}
        <div className="flex items-center gap-4 shrink-0 ml-2 pt-0.5">
          <SavingsBar monthly={rec.monthly_savings} annual={rec.annual_savings} />

          <div className="hidden sm:flex flex-col items-center gap-1">
            <ConfidenceRing score={75} />
            <span className="text-[9px] text-gray-400 font-medium">conf.</span>
          </div>

          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.22, ease: EASE }}
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
            key="detail"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="mx-7 h-px bg-gray-100" />
            <DetailPanel rec={rec} priority={p} />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
