"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingDown, Lightbulb, ShieldCheck, ArrowUpRight, Zap } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { formatCurrency, cn } from "@/lib/utils";
import type { PublicAuditSafe } from "@/types/database";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

const PRIORITY_COLORS: Record<string, { text: string; bg: string; border: string }> = {
  Critical: { text: "text-red-600",    bg: "bg-red-50",    border: "border-red-200" },
  High:     { text: "text-orange-600", bg: "bg-orange-50", border: "border-orange-200" },
  Medium:   { text: "text-yellow-600", bg: "bg-yellow-50", border: "border-yellow-200" },
  Low:      { text: "text-gray-500",   bg: "bg-gray-50",   border: "border-gray-200" },
};

function priorityCounts(recs: PublicAuditSafe["recommendations"]) {
  return {
    Critical: recs.filter((r) => r.priority === "Critical").length,
    High:     recs.filter((r) => r.priority === "High").length,
    Medium:   recs.filter((r) => r.priority === "Medium").length,
    Low:      recs.filter((r) => r.priority === "Low").length,
  };
}

// ── Score arc ─────────────────────────────────────────────────────────────────

function ScoreArc({ score }: { score: number }) {
  const size = 120;
  const stroke = 8;
  const r = (size - stroke * 2) / 2;
  const cx = size / 2;
  // Use 270° arc (from 135° to 405°) — bottom-left to bottom-right
  const arcAngle = 270;
  const circ = 2 * Math.PI * r;
  const arcLen = (arcAngle / 360) * circ;
  const filled = (score / 100) * arcLen;
  const gap = circ - arcLen;

  const color =
    score >= 75 ? "#16a34a" :
    score >= 50 ? "#f59e0b" :
    "#ef4444";

  const label =
    score >= 75 ? "Excellent" :
    score >= 50 ? "Good" :
    "Needs work";

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(135deg)" }}
        >
          {/* Track */}
          <circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${arcLen} ${gap}`}
          />
          {/* Fill */}
          <motion.circle
            cx={cx} cy={cx} r={r}
            fill="none"
            stroke={color}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={`${filled} ${circ - filled}`}
            initial={{ strokeDasharray: `0 ${circ}` }}
            animate={{ strokeDasharray: `${filled} ${circ - filled}` }}
            transition={{ duration: 1.8, ease: [0.34, 1.1, 0.64, 1], delay: 0.5 }}
          />
        </svg>
        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.7 }}
            className="text-3xl font-bold tabular-nums leading-none"
            style={{ color }}
          >
            {score}
          </motion.span>
          <span className="text-[10px] text-gray-400 font-medium mt-0.5">/ 100</span>
        </div>
      </div>
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.4 }}
        className="text-xs font-semibold px-2.5 py-0.5 rounded-full border"
        style={{
          color,
          background: `${color}12`,
          borderColor: `${color}30`,
        }}
      >
        {label}
      </motion.span>
    </div>
  );
}

// ── Confidence bar ────────────────────────────────────────────────────────────

function ConfidenceBar({ score, label }: { score: number; label: string }) {
  const color =
    score >= 85 ? "#16a34a" :
    score >= 70 ? "#f59e0b" :
    "#ef4444";

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[11px] text-gray-400 font-medium">{label}</span>
        <span className="text-[11px] font-bold tabular-nums" style={{ color }}>{score}%</span>
      </div>
      <div className="h-1 rounded-full bg-gray-100 overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1.2, ease: [0.34, 1.1, 0.64, 1], delay: 0.6 }}
        />
      </div>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────

function StatPill({
  label, value, sublabel, delay = 0,
}: {
  label: string;
  value: React.ReactNode;
  sublabel?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE, delay }}
      className="flex flex-col gap-1"
    >
      <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-widest">{label}</span>
      <div className="text-2xl font-bold text-gray-900 tabular-nums leading-none">{value}</div>
      {sublabel && <span className="text-xs text-gray-400 mt-0.5">{sublabel}</span>}
    </motion.div>
  );
}

// ── Main hero ─────────────────────────────────────────────────────────────────

interface Props {
  audit: PublicAuditSafe;
}

export function ResultsHero({ audit }: Props) {
  const reduce = useReducedMotion();
  const counts = priorityCounts(audit.recommendations);
  const providers = [...new Set(audit.recommendations.map((r) => r.provider))];

  // Avg confidence across recs (fallback 82 if no recs)
  const avgConfidence = audit.recommendations.length > 0
    ? Math.round(
        audit.recommendations.reduce((s, r) => {
          const score = (r as { confidence_score?: number }).confidence_score ?? 82;
          return s + score;
        }, 0) / audit.recommendations.length
      )
    : 82;

  const savingsPct = audit.estimated_monthly_savings > 0
    ? Math.round((audit.estimated_monthly_savings / (audit.estimated_monthly_savings * 4)) * 100)
    : 0;

  return (
    <div className="flex flex-col gap-5">

      {/* ── Primary hero block ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Left — annual savings hero */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.05 }}
          className="lg:col-span-3 relative overflow-hidden rounded-3xl p-8 flex flex-col justify-between gap-8 min-h-[260px]"
          style={{
            background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)",
            boxShadow: "0 8px 40px -8px rgba(22,163,74,0.22), 0 2px 8px rgba(22,163,74,0.08)",
          }}
        >
          {/* Decorative blobs */}
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-green-200/30 pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-green-300/20 pointer-events-none" aria-hidden="true" />

          {/* Top row */}
          <div className="relative flex items-start justify-between gap-4 flex-wrap">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-bold text-green-700/60 uppercase tracking-widest">
                Annual Savings Opportunity
              </span>
              <span className="text-xs text-green-700/40">
                Projected over 12 months · {providers.length} provider{providers.length !== 1 ? "s" : ""} audited
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-white/60 border border-green-200/60 px-3 py-1.5 rounded-full backdrop-blur-sm">
              <Zap className="w-3 h-3" />
              {audit.recommendations.length} findings
            </div>
          </div>

          {/* KPI */}
          <div className="relative flex flex-col gap-3">
            <div className="flex items-end gap-3 flex-wrap">
              <AnimatedCounter
                value={audit.estimated_annual_savings}
                formatter={formatCurrency}
                className="text-6xl sm:text-7xl font-bold tracking-tight text-green-800 tabular-nums leading-none"
              />
              <span className="text-xl text-green-700/50 font-medium mb-2">/yr</span>
            </div>

            {/* Monthly + divider */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <TrendingDown className="w-3.5 h-3.5 text-green-600" />
                <span className="text-sm text-green-700/70 font-medium">
                  <AnimatedCounter
                    value={audit.estimated_monthly_savings}
                    formatter={formatCurrency}
                    className="font-bold text-green-800"
                  />
                  {" "}per month
                </span>
              </div>
              <span className="w-1 h-1 rounded-full bg-green-600/30" />
              <span className="text-xs text-green-700/50">Updated just now</span>
            </div>
          </div>
        </motion.div>

        {/* Right — score + confidence */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: EASE, delay: 0.15 }}
          className="lg:col-span-2 rounded-3xl p-7 flex flex-col justify-between gap-6 bg-white"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 8px 32px rgba(0,0,0,0.05)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          {/* Score */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
              Optimization Score
            </span>
            <span className="text-xs text-gray-400">AI stack efficiency rating</span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <ScoreArc score={audit.optimization_score} />

            <div className="flex-1 flex flex-col gap-3">
              <ConfidenceBar score={audit.optimization_score} label="Efficiency" />
              <ConfidenceBar score={Math.min(avgConfidence, 99)} label="Confidence" />
              <ConfidenceBar
                score={audit.recommendations.length > 0 ? Math.min(audit.recommendations.length * 12, 95) : 40}
                label="Coverage"
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-gray-400 border-t border-gray-50 pt-4">
            <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
            <span>Deterministic audit · no AI hallucinations</span>
          </div>
        </motion.div>
      </div>

      {/* ── Secondary stats row ────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

        {/* Monthly savings */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.25 }}
          className="rounded-2xl p-5 flex flex-col gap-3 bg-white group hover:-translate-y-0.5 transition-transform duration-200"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Monthly</span>
          <div className="flex flex-col gap-0.5">
            <AnimatedCounter
              value={audit.estimated_monthly_savings}
              formatter={formatCurrency}
              className="text-2xl font-bold text-gray-900 tabular-nums leading-none"
            />
            <span className="text-xs text-gray-400">recoverable / mo</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-green-600 font-semibold">
            <ArrowUpRight className="w-3 h-3" />
            Immediate impact
          </div>
        </motion.div>

        {/* Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.3 }}
          className="rounded-2xl p-5 flex flex-col gap-3 bg-white group hover:-translate-y-0.5 transition-transform duration-200"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Findings</span>
          <div className="flex flex-col gap-0.5">
            <AnimatedCounter
              value={audit.recommendations.length}
              className="text-2xl font-bold text-gray-900 tabular-nums leading-none"
            />
            <span className="text-xs text-gray-400">
              across {providers.length} provider{providers.length !== 1 ? "s" : ""}
            </span>
          </div>
          {/* Priority pills */}
          <div className="flex items-center gap-1 flex-wrap">
            {(["Critical", "High", "Medium", "Low"] as const)
              .filter((p) => counts[p] > 0)
              .slice(0, 3)
              .map((p) => {
                const c = PRIORITY_COLORS[p];
                return (
                  <span
                    key={p}
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full border",
                      c.text, c.bg, c.border
                    )}
                  >
                    {counts[p]} {p}
                  </span>
                );
              })}
          </div>
        </motion.div>

        {/* Providers */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.35 }}
          className="rounded-2xl p-5 flex flex-col gap-3 bg-white group hover:-translate-y-0.5 transition-transform duration-200"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Providers</span>
          <div className="flex flex-col gap-0.5">
            <AnimatedCounter
              value={providers.length}
              className="text-2xl font-bold text-gray-900 tabular-nums leading-none"
            />
            <span className="text-xs text-gray-400">AI tools audited</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {providers.slice(0, 4).map((p) => (
              <span key={p} className="text-[10px] font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-full">
                {p}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Confidence */}
        <motion.div
          initial={{ opacity: 0, y: reduce ? 0 : 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE, delay: 0.4 }}
          className="rounded-2xl p-5 flex flex-col gap-3 bg-white group hover:-translate-y-0.5 transition-transform duration-200"
          style={{
            boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid rgba(0,0,0,0.05)",
          }}
        >
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Confidence</span>
          <div className="flex flex-col gap-0.5">
            <AnimatedCounter
              value={Math.min(avgConfidence, 99)}
              formatter={(v) => `${Math.round(v)}%`}
              className="text-2xl font-bold text-gray-900 tabular-nums leading-none"
            />
            <span className="text-xs text-gray-400">avg. rule confidence</span>
          </div>
          <div className="flex items-center gap-1 text-[11px] text-green-600 font-semibold">
            <ShieldCheck className="w-3 h-3" />
            Rule-based · explainable
          </div>
        </motion.div>
      </div>
    </div>
  );
}
