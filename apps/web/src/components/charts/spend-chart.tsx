"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SpendChartData } from "@/types";

const AREAS = [
  { key: "openai", color: "#10a37f", label: "OpenAI" },
  { key: "anthropic", color: "#d97706", label: "Anthropic" },
  { key: "gemini", color: "#4285f4", label: "Gemini" },
  { key: "other", color: "#8b5cf6", label: "Other" },
];

export function SpendChart({ data }: { data: SpendChartData[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Spend Over Time</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={data} margin={{ top: 4, right: 4, left: -16, bottom: 0 }}>
            <defs>
              {AREAS.map(({ key, color }) => (
                <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={color} stopOpacity={0.2} />
                  <stop offset="95%" stopColor={color} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              formatter={(value) => [`$${value}`, undefined]}
              contentStyle={{
                fontSize: 12,
                borderRadius: 8,
                background: "#ffffff",
                border: "1px solid #e2e8f0",
                color: "#0f1117",
                boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
              }}
            />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12 }} />
            {AREAS.map(({ key, color, label }) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                name={label}
                stroke={color}
                fill={`url(#grad-${key})`}
                strokeWidth={2}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
