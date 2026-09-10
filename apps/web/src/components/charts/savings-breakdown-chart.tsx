"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { motion } from "framer-motion";
import type { AuditRecommendation, AuditProvider } from "@credex/audit-engine";
import { formatCurrency } from "@/lib/utils";

const PROVIDER_COLORS: Record<AuditProvider, string> = {
  ChatGPT: "#34d399",
  Claude: "#fbbf24",
  Cursor: "#a78bfa",
  Copilot: "#38bdf8",
  Gemini: "#60a5fa",
};

interface Props {
  recommendations: AuditRecommendation[];
}

export function SavingsBreakdownChart({ recommendations }: Props) {
  // Aggregate monthly savings per provider
  const providerMap = new Map<AuditProvider, number>();
  for (const r of recommendations) {
    providerMap.set(r.provider, (providerMap.get(r.provider) ?? 0) + r.monthlySavings);
  }

  const data = Array.from(providerMap.entries())
    .map(([provider, savings]) => ({ provider, savings }))
    .sort((a, b) => b.savings - a.savings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.2 }}
      className="rounded-2xl bg-white p-6 flex flex-col gap-5"
      style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.05)" }}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Savings by Provider</p>
          <p className="text-xs text-muted-foreground mt-0.5">Monthly opportunity per tool</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap justify-end">
          {data.map(({ provider }) => (
            <span key={provider} className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span
                className="w-2 h-2 rounded-full"
                style={{ background: PROVIDER_COLORS[provider] }}
              />
              {provider}
            </span>
          ))}
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
            tick={{ fontSize: 11, fill: "#94a3b8" }}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v) => `$${v}`}
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
            formatter={(v) => [formatCurrency(Number(v)), "Monthly savings"]}
          />
          <Bar dataKey="savings" radius={[6, 6, 0, 0]}>
            {data.map(({ provider }) => (
              <Cell key={provider} fill={PROVIDER_COLORS[provider]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
