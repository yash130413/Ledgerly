"use client";

import { motion, useReducedMotion } from "framer-motion";
import { TrendingUp, TrendingDown, Zap, Activity, DollarSign, Cpu, ArrowUpRight } from "lucide-react";
import { AnimatedCounter } from "@/components/shared/animated-counter";
import { formatCurrency, formatNumber, formatPercent } from "@/lib/utils";
import type { DashboardStats } from "@/types";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

// ── Sparkline ─────────────────────────────────────────────────────────────────

function Sparkline({ values, color, height = 32 }: { values: number[]; color: string; height?: number }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  const w = 80;
  const h = height;
  const step = w / (values.length - 1);

  const points = values
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h * 0.85 - h * 0.075}`)
    .join(" ");

  const areaPoints = `0,${h} ${points} ${w},${h}`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={`sg-${color.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={areaPoints} fill={`url(#sg-${color.replace("#", "")})`} />
      <polyline points={points} stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      {/* End dot */}
      <circle
        cx={(values.length - 1) * step}
        cy={h - ((values[values.length - 1] - min) / range) * h * 0.85 - h * 0.075}
        r="2.5"
        fill={color}
      />
    </svg>
  );
}

// ── Trend badge ───────────────────────────────────────────────────────────────

function TrendBadge({ change }: { change: number }) {
  const up = change >= 0;
  const Icon = up ? TrendingUp : TrendingDown;
  return (
    <span
      className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
        up
          ? "text-green-700 bg-green-50 border border-green-100"
          : "text-red-600 bg-red-50 border border-red-100"
      }`}
    >
      <Icon className="w-3 h-3" />
      {formatPercent(Math.abs(change))}
    </span>
  );
}

// ── Hero savings card ─────────────────────────────────────────────────────────

function HeroSavingsCard({ savings, spend }: { savings: number; spend: number }) {
  const reduce = useReducedMotion();
  const pct = spend > 0 ? Math.round((savings / spend) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.05 }}
      whileHover={reduce ? {} : { y: -3, transition: { duration: 0.2, ease: EASE } }}
      className="relative overflow-hidden rounded-3xl p-7 flex flex-col justify-between gap-6 min-h-[220px] cursor-default"
      style={{
        background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 45%, #bbf7d0 100%)",
        boxShadow: "0 4px 32px -4px rgba(22,163,74,0.18), 0 1px 4px rgba(22,163,74,0.08)",
      }}
    >
      {/* Decorative circles */}
      <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full bg-green-200/30 pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-green-300/20 pointer-events-none" aria-hidden="true" />

      {/* Top row */}
      <div className="relative flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold text-green-700/70 uppercase tracking-widest">
            Estimated Savings
          </span>
          <span className="text-xs text-green-700/50">This month · recoverable spend</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-semibold text-green-700 bg-white/60 border border-green-200/60 px-2.5 py-1 rounded-full backdrop-blur-sm">
          <Zap className="w-3 h-3" />
          {pct}% of spend
        </div>
      </div>

      {/* KPI */}
      <div className="relative flex flex-col gap-3">
        <div className="flex items-end gap-3">
          <AnimatedCounter
            value={savings}
            formatter={formatCurrency}
            className="text-5xl font-bold tracking-tight text-green-800 tabular-nums leading-none"
          />
          <span className="text-lg text-green-700/60 font-medium mb-1">/mo</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-green-700/70 font-medium">
            <AnimatedCounter
              value={savings * 12}
              formatter={formatCurrency}
              className="font-semibold text-green-800"
            />
            {" "}annually
          </span>
          <span className="w-1 h-1 rounded-full bg-green-600/30" />
          <span className="text-xs text-green-700/50">Updated just now</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Supporting metric card ────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: number;
  formatter: (v: number) => string;
  change?: number;
  sublabel?: string;
  icon: React.ElementType;
  sparkData?: number[];
  sparkColor?: string;
  delay?: number;
  accent?: string;
}

function MetricCard({
  title, value, formatter, change, sublabel, icon: Icon,
  sparkData, sparkColor = "#16a34a", delay = 0, accent = "#f8fafc",
}: MetricCardProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      whileHover={reduce ? {} : { y: -2, transition: { duration: 0.18, ease: EASE } }}
      className="group relative rounded-2xl p-5 flex flex-col gap-4 cursor-default overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      {/* Hover surface tint */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
        style={{ background: `linear-gradient(135deg, ${accent}80 0%, transparent 60%)` }}
        aria-hidden="true"
      />

      {/* Header */}
      <div className="relative flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className="w-7 h-7 rounded-xl flex items-center justify-center"
            style={{ background: `${sparkColor}12`, border: `1px solid ${sparkColor}20` }}
          >
            <Icon className="w-3.5 h-3.5" style={{ color: sparkColor }} />
          </div>
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{title}</span>
        </div>
        {change !== undefined && <TrendBadge change={change} />}
      </div>

      {/* KPI */}
      <div className="relative flex items-end justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <AnimatedCounter
            value={value}
            formatter={formatter}
            className="text-3xl font-bold text-gray-900 tabular-nums leading-none tracking-tight"
          />
          {sublabel && (
            <span className="text-xs text-gray-400 mt-1">{sublabel}</span>
          )}
        </div>
        {sparkData && (
          <div className="opacity-60 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkline values={sparkData} color={sparkColor} />
          </div>
        )}
      </div>

      {/* Bottom link hint */}
      <div className="relative flex items-center gap-1 text-[11px] text-gray-300 group-hover:text-gray-400 transition-colors duration-200">
        <ArrowUpRight className="w-3 h-3" />
        <span>View details</span>
      </div>
    </motion.div>
  );
}

// ── Provider dots ─────────────────────────────────────────────────────────────

const PROVIDER_COLORS = ["#16a34a", "#f59e0b", "#6366f1"];

function ActiveProvidersCard({ count, delay = 0 }: { count: number; delay?: number }) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: EASE, delay }}
      whileHover={reduce ? {} : { y: -2, transition: { duration: 0.18, ease: EASE } }}
      className="group relative rounded-2xl p-5 flex flex-col gap-4 cursor-default overflow-hidden"
      style={{
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    >
      <div className="relative flex items-center gap-2">
        <div className="w-7 h-7 rounded-xl flex items-center justify-center bg-violet-50 border border-violet-100">
          <Activity className="w-3.5 h-3.5 text-violet-500" />
        </div>
        <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Active Providers</span>
      </div>

      <div className="relative flex items-end justify-between gap-2">
        <div className="flex flex-col gap-1">
          <AnimatedCounter
            value={count}
            className="text-3xl font-bold text-gray-900 tabular-nums leading-none tracking-tight"
          />
          <span className="text-xs text-gray-400">of 5 supported</span>
        </div>

        {/* Provider dots */}
        <div className="flex flex-col gap-1.5 items-end">
          {PROVIDER_COLORS.slice(0, count).map((color, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 + i * 0.08, duration: 0.3, ease: EASE }}
              className="flex items-center gap-1.5"
            >
              <span className="text-[10px] text-gray-300 font-medium">
                {["OpenAI", "Anthropic", "Gemini"][i]}
              </span>
              <span className="w-2 h-2 rounded-full" style={{ background: color }} />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative flex items-center gap-1 text-[11px] text-gray-300 group-hover:text-gray-400 transition-colors duration-200">
        <ArrowUpRight className="w-3 h-3" />
        <span>Manage integrations</span>
      </div>
    </motion.div>
  );
}

// ── Section header ────────────────────────────────────────────────────────────

function SectionHeader() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
      className="flex items-end justify-between gap-4"
    >
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-gray-900">Overview</h1>
        <p className="text-sm text-gray-400 mt-0.5">Your AI spend at a glance</p>
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400 pb-0.5">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        Live · updated just now
      </div>
    </motion.div>
  );
}

// ── Spend sparkline data (mock trend) ─────────────────────────────────────────

const SPEND_SPARK  = [820, 932, 1100, 980, 1240, 1380, 1820, 1640, 1920, 2100, 1980, 2240];
const TOKEN_SPARK  = [60, 72, 88, 80, 95, 110, 130, 118, 142, 155, 148, 165];

// ── Main export ───────────────────────────────────────────────────────────────

export function StatsGrid({ stats }: { stats: DashboardStats }) {
  return (
    <div className="flex flex-col gap-4">
      <SectionHeader />

      {/* Asymmetric grid: hero left + 3 supporting right */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">

        {/* Hero savings — spans 2 cols */}
        <div className="lg:col-span-2">
          <HeroSavingsCard savings={stats.estimatedSavings} spend={stats.totalSpend} />
        </div>

        {/* Supporting 3 — spans 3 cols in a sub-grid */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <MetricCard
            title="Total Spend"
            value={stats.totalSpend}
            formatter={formatCurrency}
            change={stats.spendChange}
            sublabel="This month"
            icon={DollarSign}
            sparkData={SPEND_SPARK}
            sparkColor="#16a34a"
            accent="#f0fdf4"
            delay={0.1}
          />
          <MetricCard
            title="Total Tokens"
            value={stats.totalTokens}
            formatter={formatNumber}
            change={stats.tokensChange}
            sublabel="Processed"
            icon={Cpu}
            sparkData={TOKEN_SPARK}
            sparkColor="#6366f1"
            accent="#f5f3ff"
            delay={0.15}
          />
          <ActiveProvidersCard count={stats.activeProviders} delay={0.2} />
        </div>
      </div>
    </div>
  );
}
