"use client";

import { motion, useInView } from "framer-motion";
import { Activity, Shield, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    if (end === 0) {
      setCount(0);
      return;
    }
    const duration = 900;
    const increment = end / (duration / 16);

    const timer = setInterval(() => {
      start += increment;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <span ref={ref}>
      {count}
      {suffix}
    </span>
  );
}

function StatCard({
  icon: Icon,
  label,
  children,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <Card hover className="relative overflow-hidden group">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground font-medium mb-2">{label}</p>
              <p className="text-3xl font-bold tracking-tight tabular-nums">{children}</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Icon className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function StatusBanner({
  connectedCount,
}: {
  connectedCount: number;
}) {
  const empty = connectedCount === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4, ease: EASE }}
    >
      <Card
        hover={false}
        className={
          empty
            ? "relative overflow-hidden border-amber-200/60 bg-gradient-to-r from-amber-50/60 to-orange-50/30"
            : "relative overflow-hidden border-green-200/50 bg-gradient-to-r from-green-50/50 to-emerald-50/30"
        }
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div
                  className={`w-2 h-2 rounded-full ${empty ? "bg-amber-500" : "bg-green-500"}`}
                />
                {!empty && (
                  <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
                )}
              </div>
              <div>
                <p
                  className={`text-sm font-semibold ${empty ? "text-amber-900" : "text-green-900"}`}
                >
                  {empty ? "No providers connected" : "All systems operational"}
                </p>
                <p
                  className={`text-xs ${empty ? "text-amber-800/70" : "text-green-700/70"}`}
                >
                  {empty
                    ? "Connect a provider below to start monitoring spend"
                    : `${connectedCount} provider${connectedCount === 1 ? "" : "s"} syncing`}
                </p>
              </div>
            </div>
            <div
              className={`flex items-center gap-6 text-xs ${empty ? "text-amber-900/60" : "text-green-800/70"}`}
            >
              <div className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5" />
                <span>Encrypted Storage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5" />
                <span>{empty ? "Monitoring idle" : "Live monitoring"}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export type IntegrationsHeroStats = {
  connectedCount: number;
  availableCount: number;
  activeCount: number;
  /** Monthly spend monitored via connected providers / latest audit when connected */
  monthlySpend: number;
};

export function IntegrationsHero({ stats }: { stats: IntegrationsHeroStats }) {
  const { connectedCount, availableCount, activeCount, monthlySpend } = stats;

  const healthPercent =
    connectedCount === 0
      ? 0
      : Math.round((activeCount / connectedCount) * 100);

  const coveragePercent =
    availableCount === 0
      ? 0
      : Math.round((connectedCount / availableCount) * 100);

  return (
    <div className="flex flex-col gap-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-transparent blur-3xl -z-10" />
        <div className="space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
            Connected AI Infrastructure
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Monitor, optimize, and manage all AI provider integrations from one
            secure workspace.
          </p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Zap} label="Connected Providers" delay={0.1}>
          <AnimatedCounter value={connectedCount} />
        </StatCard>
        <StatCard icon={TrendingUp} label="Monthly Spend Monitored" delay={0.15}>
          {formatCurrency(monthlySpend)}
        </StatCard>
        <StatCard icon={Activity} label="Infrastructure Health" delay={0.2}>
          <AnimatedCounter value={healthPercent} suffix="%" />
        </StatCard>
        <StatCard icon={Shield} label="Optimization Coverage" delay={0.25}>
          <AnimatedCounter value={coveragePercent} suffix="%" />
        </StatCard>
      </div>

      <StatusBanner connectedCount={connectedCount} />
    </div>
  );
}
