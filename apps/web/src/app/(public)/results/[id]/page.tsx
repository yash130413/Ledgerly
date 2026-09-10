import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, ExternalLink } from "lucide-react";
import { getPublicAuditById } from "@/modules/audits";
import { ResultsHero } from "@/components/public/results-hero";
import { ResultsFilters } from "@/components/public/results-filters";
import { ResultsLeadCapture } from "@/components/public/results-lead-capture";
import { AlreadyOptimizedState } from "@/components/public/already-optimized-state";
import { formatCurrency, cn } from "@/lib/utils";
import type { PublicAuditSafe } from "@/types/database";

// ── Metadata ──────────────────────────────────────────────────────────────────

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;

  let audit: PublicAuditSafe | null = null;
  try {
    audit = await getPublicAuditById(id);
  } catch {
    return { title: "Audit Report | Credex" };
  }

  if (!audit) {
    return { title: "Audit Report | Credex" };
  }

  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const title = `${audit.title} | Credex Audit Report`;
  const description = `This AI spend audit identified ${audit.recommendations.length} optimization opportunities worth ${formatCurrency(audit.estimated_annual_savings)}/yr in savings.`;
  const url = `${APP_URL}/results/${id}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "Credex",
      images: [{ url: `${APP_URL}/og-default.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: "@credexai",
      images: [`${APP_URL}/og-default.png`],
    },
    alternates: { canonical: url },
  };
}

// ── Provider accent colors ────────────────────────────────────────────────────

const PROVIDER_COLORS: Record<string, string> = {
  ChatGPT: "#34d399",
  Claude:  "#fbbf24",
  Cursor:  "#a78bfa",
  Copilot: "#38bdf8",
  Gemini:  "#60a5fa",
};

// ── Page ──────────────────────────────────────────────────────────────────────

export default async function ResultsPage({ params }: Props) {
  const { id } = await params;

  let audit: PublicAuditSafe;
  try {
    audit = await getPublicAuditById(id);
  } catch {
    notFound();
  }

  const providers = [...new Set(audit.recommendations.map((r) => r.provider))];
  const providerCount = providers.length || 1;

  const providerSummary = providers.map((p) => {
    const recs = audit.recommendations.filter((r) => r.provider === p);
    return {
      provider: p,
      count: recs.length,
      annualSavings: recs.reduce((s, r) => s + r.annual_savings, 0),
      color: PROVIDER_COLORS[p] ?? "#94a3b8",
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Grid background */}
      <div className="fixed inset-0 hero-grid pointer-events-none" />

      <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex flex-col gap-8">

        {/* Breadcrumb */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-700 transition-colors">Credex</Link>
            <span>/</span>
            <span className="text-gray-600 font-medium truncate max-w-[200px]">{audit.title}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-green-700">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" aria-hidden="true" />
              Public Report
            </span>
            <Link
              href="/"
              className="shrink-0 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors text-gray-600 hover:text-gray-900 shadow-sm"
            >
              Run your own audit
              <ExternalLink className="w-3 h-3" aria-hidden="true" />
            </Link>
          </div>
        </div>

        {/* Report title */}
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 leading-tight">{audit.title}</h1>
          <p className="text-sm text-gray-400">
            Generated{" "}
            {new Date(audit.created_at).toLocaleDateString("en-US", {
              month: "long", day: "numeric", year: "numeric",
            })}
          </p>
        </div>

        {/* Hero stats */}
        <ResultsHero audit={audit} />

        {/* AI Summary */}
        {audit.ai_summary && (
          <div className="rounded-2xl bg-white p-6 flex flex-col gap-3"
            style={{ boxShadow: "0 1px 3px rgba(0,0,0,0.05), 0 4px 16px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.05)" }}
          >
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-violet-500" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">AI Summary</span>
            </div>
            <p className="text-sm leading-relaxed text-gray-700">{audit.ai_summary}</p>
          </div>
        )}

        {/* Recommendations */}
        {audit.recommendations.length === 0 ? (
          <AlreadyOptimizedState score={audit.optimization_score} providerCount={providerCount} />
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-base font-bold text-gray-900">
                Recommendations
                <span className="ml-2 text-sm font-normal text-gray-400">
                  {audit.recommendations.length} total
                </span>
              </h2>
            </div>
            <ResultsFilters recommendations={audit.recommendations} />
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>
            This report was generated by{" "}
            <Link href="/" className="text-gray-700 hover:underline underline-offset-4">
              Credex
            </Link>
            {" "}and contains only sanitized, non-sensitive findings.
          </p>
          <Link
            href="/"
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-gray-200",
              "bg-white hover:bg-gray-50 transition-colors text-gray-700 shadow-sm"
            )}
          >
            Audit your AI spend
            <ExternalLink className="w-3 h-3" />
          </Link>
        </div>

      </div>

      <ResultsLeadCapture
        annualSavings={formatCurrency(audit.estimated_annual_savings)}
        recommendationCount={audit.recommendations.length}
      />
    </div>
  );
}
