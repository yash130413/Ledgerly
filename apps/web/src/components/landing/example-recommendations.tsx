"use client";

import { motion } from "framer-motion";
import { FadeIn } from "@/components/shared/motion";
import { Users, GitMerge, TrendingDown, ShieldCheck } from "lucide-react";

const recs = [
  {
    provider: "Cursor",
    providerColor: "#818cf8",
    icon: Users,
    priority: "High" as const,
    title: "8 inactive Cursor Pro seats detected",
    description:
      "8 licensed users showed no coding activity in the last 30 days. Downgrading these seats would have no impact on active developers.",
    monthlySavings: 160,
    annualSavings: 1920,
    confidence: 88,
    affectedUsers: 8,
  },
  {
    provider: "ChatGPT",
    providerColor: "#34d399",
    icon: GitMerge,
    priority: "Critical" as const,
    title: "Duplicate usage across Claude and ChatGPT",
    description:
      "Both ChatGPT Team ($30/seat) and Claude Pro ($20/seat) are active for the same 14 users on general-purpose workflows. Consolidating to one vendor eliminates redundant licensing.",
    monthlySavings: 350,
    annualSavings: 4200,
    confidence: 81,
    affectedUsers: 14,
  },
  {
    provider: "Copilot",
    providerColor: "#38bdf8",
    icon: TrendingDown,
    priority: "High" as const,
    title: "12 Copilot licenses with fewer than 5 sessions in 30 days",
    description:
      "Only 6 of 18 licensed engineers qualify as power users. Restricting Copilot Business to high-frequency contributors reduces cost without impacting productivity.",
    monthlySavings: 228,
    annualSavings: 2736,
    confidence: 94,
    affectedUsers: 12,
  },
];

const PRIORITY_STYLE = {
  Critical: "text-red-600 bg-red-50 border-red-200",
  High:     "text-orange-600 bg-orange-50 border-orange-200",
  Medium:   "text-yellow-600 bg-yellow-50 border-yellow-200",
};

function RecCard({
  rec,
  index,
}: {
  rec: (typeof recs)[number];
  index: number;
}) {
  const Icon = rec.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, ease: [0.21, 0.47, 0.32, 0.98], delay: index * 0.08 }}
      className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-5 card-shadow hover:card-shadow-hover transition-all duration-200 hover:-translate-y-0.5"
    >
      {/* Header */}
      <div className="flex items-start gap-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: `${rec.providerColor}15`, border: `1px solid ${rec.providerColor}25` }}
        >
          <Icon className="w-4 h-4" style={{ color: rec.providerColor }} aria-hidden="true" />
        </div>
        <div className="flex-1 min-w-0 flex flex-col gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${PRIORITY_STYLE[rec.priority]}`}>
              {rec.priority}
            </span>
            <span className="text-[10px] text-gray-400 font-medium">{rec.provider}</span>
            <span className="text-[10px] text-gray-400">· {rec.affectedUsers} users affected</span>
          </div>
          <p className="text-sm font-semibold text-gray-900 leading-snug">{rec.title}</p>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-500 leading-relaxed">{rec.description}</p>

      {/* Metrics row */}
      <div className="flex items-center gap-4 pt-1 border-t border-gray-100">
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Annual savings</span>
          <span className="text-base font-bold text-green-600 tabular-nums">
            ${rec.annualSavings.toLocaleString()}
          </span>
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Monthly</span>
          <span className="text-sm font-semibold text-gray-700 tabular-nums">${rec.monthlySavings}/mo</span>
        </div>
        <div className="flex flex-col gap-1.5 ml-auto">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3 h-3 text-green-500" aria-hidden="true" />
            <span className="text-[10px] text-gray-400">Confidence</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                className="h-full rounded-full bg-green-500"
                style={{ width: `${rec.confidence}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 tabular-nums">{rec.confidence}%</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function ExampleRecommendations() {
  return (
    <section className="py-32 px-5 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="text-xs text-green-600 uppercase tracking-widest font-semibold mb-4">
            Example findings
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-xl text-gray-900">
            The kind of recommendations Credex surfaces
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-lg leading-relaxed">
            Every recommendation includes a confidence score, affected user count, and
            the exact reasoning — so your finance team can act on it without a follow-up call.
          </p>
        </FadeIn>

        <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-4">
          {recs.map((rec, i) => (
            <RecCard key={rec.title} rec={rec} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
