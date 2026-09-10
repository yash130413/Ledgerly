import { notFound } from "next/navigation";
import { getPublicAudit } from "@/modules/audits";
import { formatCurrency } from "@/lib/utils";
import type { PublicAuditSafe } from "@/types/database";

interface Props {
  params: Promise<{ shareId: string }>;
}

const PRIORITY_STYLES: Record<
  NonNullable<PublicAuditSafe["recommendations"][number]["priority"]>,
  string
> = {
  Critical: "text-red-400 bg-red-500/10 border-red-500/20",
  High:     "text-orange-400 bg-orange-500/10 border-orange-500/20",
  Medium:   "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Low:      "text-muted-foreground bg-white/[0.04] border-white/[0.06]",
};

export default async function PublicAuditPage({ params }: Props) {
  const { shareId } = await params;

  let audit: PublicAuditSafe;
  try {
    audit = await getPublicAudit(shareId);
  } catch {
    notFound();
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto px-4 py-12 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-bold">{audit.title}</h1>
          <p className="text-sm text-muted-foreground">
            Shared audit report ·{" "}
            {new Date(audit.created_at).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        </div>

        {/* AI summary */}
        {audit.ai_summary && (
          <div className="rounded-xl border border-white/[0.06] bg-card p-5">
            <p className="text-xs font-medium text-muted-foreground mb-2">AI Summary</p>
            <p className="text-sm leading-relaxed">{audit.ai_summary}</p>
          </div>
        )}

        {/* Summary strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Monthly Savings",   value: formatCurrency(audit.estimated_monthly_savings) },
            { label: "Annual Savings",    value: formatCurrency(audit.estimated_annual_savings) },
            { label: "Recommendations",   value: String(audit.recommendations.length) },
            { label: "Optimization Score", value: `${audit.optimization_score}/100` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-white/[0.06] bg-card p-4">
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="text-xl font-bold mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Recommendations */}
        <div className="flex flex-col gap-3">
          {audit.recommendations.map((rec) => (
            <div
              key={rec.id}
              className="rounded-xl border border-white/[0.06] bg-card p-5 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">{rec.provider}</span>
                  <span className="text-muted-foreground">·</span>
                  <span className="font-medium text-sm">{rec.title}</span>
                </div>
                <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full border ${PRIORITY_STYLES[rec.priority]}`}>
                  {rec.priority}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{rec.reason}</p>
              <p className="text-sm">{rec.recommendation}</p>
              <p className="text-xs font-medium text-emerald-400">
                {formatCurrency(rec.monthly_savings)}/mo · {formatCurrency(rec.annual_savings)}/yr
                {rec.affected_users > 0 && ` · ${rec.affected_users} users affected`}
              </p>
            </div>
          ))}
        </div>

      </div>
    </main>
  );
}
