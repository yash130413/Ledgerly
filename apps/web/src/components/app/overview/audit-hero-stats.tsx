"use client";

import { motion } from "framer-motion";
import {
  TrendingDown,
  AlertTriangle,
  Layers,
  Zap,
  ArrowUpRight,
} from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { formatCurrency, cn } from "@/lib/utils";
import type { AuditEngineResult } from "@ledgerly/audit-engine";
import styles from "@/components/components.module.css";

// ── Efficiency score ring ─────────────────────────────────────────────────────
function EfficiencyRing({ score }: { score: number }) {
  const r = 38;
  const circ = 2 * Math.PI * r;
  const filled = circ * (score / 100);

  const { color, label, labelColor } =
    score >= 75
      ? { color: "#34d399", label: "Efficient",   labelColor: "text-emerald-400" }
      : score >= 50
      ? { color: "#fbbf24", label: "Moderate",    labelColor: "text-yellow-400" }
      : { color: "#f87171", label: "High waste",  labelColor: "text-red-400" };

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-24 h-24 flex items-center justify-center">
        {/* Outer glow */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-md"
          style={{ background: color }}
        />
        <svg width="96" height="96" viewBox="0 0 96 96" className="-rotate-90" aria-hidden="true">
          <circle cx="48" cy="48" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
          <motion.circle
            cx="48" cy="48" r={r}
            fill="none"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: circ - filled }}
            transition={{ duration: 1.8, ease: [0.34, 1.1, 0.64, 1], delay: 0.4 }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5">
          <AnimatedCounter
            value={score}
            formatter={(v) => `${Math.round(v)}`}
            className="text-2xl font-bold tabular-nums leading-none"
          />
          <span className="text-[9px] text-muted-foreground tracking-wider uppercase">/ 100</span>
        </div>
      </div>
      <span className={cn("text-[11px] font-semibold", labelColor)}>{label}</span>
    </div>
  );
}

// ── Priority breakdown bar ────────────────────────────────────────────────────
function PriorityBar({ critical, high, total }: { critical: number; high: number; total: number }) {
  const medium = total - critical - high;
  const segments = [
    { count: critical, color: "bg-red-500",    label: "Critical" },
    { count: high,     color: "bg-orange-500", label: "High" },
    { count: medium,   color: "bg-yellow-500", label: "Medium" },
  ].filter((s) => s.count > 0);

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex h-1.5 rounded-full overflow-hidden gap-px bg-white/[0.04]">
        {segments.map((s) => (
          <motion.div
            key={s.label}
            className={cn("h-full rounded-full", s.color)}
            initial={{ flex: 0 }}
            animate={{ flex: s.count }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
          />
        ))}
      </div>
      <div className="flex items-center gap-3 flex-wrap">
        {segments.map((s) => (
          <span key={s.label} className="flex items-center gap-1 text-[10px] text-muted-foreground">
            <span className={cn("w-1.5 h-1.5 rounded-full", s.color)} />
            {s.count} {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function HeroStat({
  label,
  sublabel,
  icon: Icon,
  iconColor,
  accent,
  children,
  delay,
  className,
}: {
  label: string;
  sublabel: string;
  icon: React.ElementType;
  iconColor: string;
  accent?: string;
  children: React.ReactNode;
  delay: number;
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className={cn(
        "relative flex-1 min-w-0 rounded-2xl border border-white/[0.07] bg-card overflow-hidden p-6 flex flex-col gap-4",
        "hover:border-white/[0.12] transition-colors duration-300",
        className
      )}
    >
      {/* Corner glow */}
      <div
        className={`absolute -top-10 -left-10 w-36 h-36 rounded-full pointer-events-none ${styles.iconGlow}`}
        style={{ "--icon-color": iconColor } as React.CSSProperties}
      />
      {/* Top gradient line */}
      {accent && (
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent, ${accent}60, transparent)` }}
        />
      )}

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
          {label}
        </span>
        <span
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${styles.iconBg}`}
          style={{ "--icon-color": iconColor } as React.CSSProperties}
        >
          <Icon
            className={`w-4 h-4 ${styles.iconColor}`}
            style={{ "--icon-color": iconColor } as React.CSSProperties}
            aria-hidden="true"
          />
        </span>
      </div>

      <div className="flex flex-col gap-1.5">
        {children}
        <span className="text-xs text-muted-foreground">{sublabel}</span>
      </div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export function AuditHeroStats({ result }: { result: AuditEngineResult }) {
  const wastePercent =
    result.totalCurrentSpend > 0
      ? (result.totalMonthlySavings / result.totalCurrentSpend) * 100
      : 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Top row: 3 metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Monthly savings */}
        <HeroStat
          label="Monthly Savings"
          sublabel={`${wastePercent.toFixed(1)}% of total spend recoverable`}
          icon={TrendingDown}
          iconColor="#34d399"
          accent="#34d399"
          delay={0}
        >
          <div className="flex items-end gap-2">
            <AnimatedCounter
              value={result.totalMonthlySavings}
              formatter={(v) => formatCurrency(v)}
              className="text-3xl font-bold tracking-tight text-emerald-400 tabular-nums"
            />
            <span className="flex items-center gap-0.5 text-xs text-emerald-400/70 mb-1">
              <ArrowUpRight className="w-3 h-3" aria-hidden="true" />
              /mo
            </span>
          </div>
        </HeroStat>

        {/* Annual savings */}
        <HeroStat
          label="Annual Savings"
          sublabel="Projected over 12 months"
          icon={Zap}
          iconColor="#818cf8"
          accent="#818cf8"
          delay={0.07}
        >
          <AnimatedCounter
            value={result.totalAnnualSavings}
            formatter={(v) => formatCurrency(v)}
            className="text-3xl font-bold tracking-tight tabular-nums"
          />
        </HeroStat>

        {/* Findings */}
        <HeroStat
          label="Findings"
          sublabel={`${result.recommendations.length} total · ${result.providersScanned.length} providers`}
          icon={AlertTriangle}
          iconColor="#f87171"
          accent="#f87171"
          delay={0.14}
        >
          <div className="flex items-baseline gap-2 mb-1">
            <AnimatedCounter
              value={result.criticalCount}
              className="text-3xl font-bold tracking-tight text-red-400 tabular-nums"
            />
            <span className="text-sm text-muted-foreground">critical</span>
            {result.highCount > 0 && (
              <>
                <AnimatedCounter
                  value={result.highCount}
                  className="text-xl font-semibold tracking-tight text-orange-400 tabular-nums"
                />
                <span className="text-sm text-muted-foreground">high</span>
              </>
            )}
          </div>
          <PriorityBar
            critical={result.criticalCount}
            high={result.highCount}
            total={result.recommendations.length}
          />
        </HeroStat>
      </div>

      {/* Bottom row: efficiency score + spend context */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.22 }}
        className="relative rounded-2xl border border-white/[0.07] bg-card overflow-hidden p-6 hover:border-white/[0.12] transition-colors duration-300"
      >
        {/* Gradient accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-violet-500/40 to-transparent" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Score ring */}
          <div className="flex items-center gap-5 shrink-0">
            <EfficiencyRing score={result.optimizationScore} />
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-violet-400" aria-hidden="true" />
                <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest">
                  AI Spend Efficiency Score
                </span>
              </div>
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                {result.optimizationScore >= 75
                  ? "Your AI tooling spend is well-optimized. Minor improvements available."
                  : result.optimizationScore >= 50
                  ? "Moderate waste detected. Addressing high-priority items will have significant impact."
                  : "Significant optimization opportunities identified across your AI stack."}
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="hidden sm:block w-px self-stretch bg-white/[0.06]" />

          {/* Spend breakdown */}
          <div className="flex flex-wrap gap-6 flex-1">
            {[
              {
                label: "Current Spend",
                value: formatCurrency(result.totalCurrentSpend),
                sub: "per month",
                color: "text-foreground",
              },
              {
                label: "After Optimization",
                value: formatCurrency(result.totalCurrentSpend - result.totalMonthlySavings),
                sub: "per month",
                color: "text-emerald-400",
              },
              {
                label: "Waste Ratio",
                value: `${wastePercent.toFixed(1)}%`,
                sub: "of spend recoverable",
                color: wastePercent > 20 ? "text-red-400" : wastePercent > 10 ? "text-yellow-400" : "text-emerald-400",
              },
            ].map(({ label, value, sub, color }) => (
              <div key={label} className="flex flex-col gap-1">
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  {label}
                </span>
                <span className={cn("text-xl font-bold tabular-nums", color)}>{value}</span>
                <span className="text-[11px] text-muted-foreground">{sub}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
