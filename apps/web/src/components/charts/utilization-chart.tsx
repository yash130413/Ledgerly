"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import type { WorkspaceMetrics } from "@ledgerly/audit-engine";

interface Props {
  workspaces: WorkspaceMetrics[];
}

export function UtilizationChart({ workspaces }: Props) {
  const data = workspaces.map((w) => ({
    provider: w.provider,
    utilization: Math.round(w.utilizationRate * 100),
    active: w.activeSeats30d,
    total: w.totalSeats,
  }));

  const barColor = (utilization: number) => {
    if (utilization >= 70) return "#34d399";
    if (utilization >= 50) return "#fbbf24";
    return "#f87171";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.3 }}
      className="rounded-2xl bg-white p-6 flex flex-col gap-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Seat Utilization</p>
          <p className="text-xs text-muted-foreground mt-0.5">Active seats / total seats (30d)</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" />≥70%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-400" />50–70%</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-400" />&lt;50%</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }} barSize={32}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" vertical={false} />
          <XAxis
            dataKey="provider"
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `${v}%`}
          />
          <ReferenceLine
            y={50}
            stroke="rgba(0,0,0,0.12)"
            strokeDasharray="4 4"
            label={{ value: "Benchmark", position: "right", fontSize: 10, fill: "#94a3b8" }}
          />
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.04)" }}
            contentStyle={{
              background: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "10px",
              fontSize: 12,
              color: "#0f1117",
              boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
            }}
            formatter={(v, _, props) => [
              `${v}% (${(props as { payload?: { active?: number; total?: number } }).payload?.active ?? 0}/${(props as { payload?: { active?: number; total?: number } }).payload?.total ?? 0} seats)`,
              "Utilization",
            ]}
          />
          <Bar dataKey="utilization" radius={[6, 6, 0, 0]}>
            {data.map(({ provider, utilization }) => (
              <Cell key={provider} fill={barColor(utilization)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
