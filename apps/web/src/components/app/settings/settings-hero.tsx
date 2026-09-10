"use client";

import { motion } from "framer-motion";
import { Activity, CheckCircle2, Shield, TrendingUp, Zap, type LucideIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const EASE = [0.21, 0.47, 0.32, 0.98] as const;

function MetricCard({
  icon: Icon,
  label,
  value,
  delay = 0,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
    >
      <Card hover={false} className="relative overflow-hidden border-gray-100">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 via-transparent to-transparent" />
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/10 to-green-600/10 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-green-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground font-medium mb-0.5">{label}</p>
              <p className="text-lg font-semibold tracking-tight">{value}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function SettingsHero() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="relative"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 via-emerald-500/5 to-transparent blur-3xl -z-10" />
        
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-br from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent">
                Workspace Settings
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Configure your AI infrastructure, security preferences, and optimization controls.
              </p>
            </div>
            
            <Badge variant="secondary" className="mt-2">
              Pro Plan
            </Badge>
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-4 flex-wrap pt-2">
            <div className="flex items-center gap-2 text-sm">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping" />
              </div>
              <span className="text-muted-foreground font-medium">All Systems Operational</span>
            </div>
            
            <div className="w-px h-4 bg-border" />
            
            <div className="flex items-center gap-2 text-sm">
              <Shield className="w-4 h-4 text-green-600" />
              <span className="text-muted-foreground">Security Verified</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          icon={Zap}
          label="Connected Providers"
          value="3 Active"
          delay={0.1}
        />
        <MetricCard
          icon={Activity}
          label="Infrastructure Health"
          value="98%"
          delay={0.15}
        />
        <MetricCard
          icon={TrendingUp}
          label="Optimization Coverage"
          value="87%"
          delay={0.2}
        />
        <MetricCard
          icon={CheckCircle2}
          label="Last Audit Activity"
          value="2 hours ago"
          delay={0.25}
        />
      </div>

      {/* Divider */}
      <div className="border-b" />
    </div>
  );
}
