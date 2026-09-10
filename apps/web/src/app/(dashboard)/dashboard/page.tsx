import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, FlaskConical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/app/overview/stats-grid";
import { SpendChart } from "@/components/charts/spend-chart";
import { AuditHeroStats } from "@/components/app/overview/audit-hero-stats";
import { RecommendationCard } from "@/components/app/overview/recommendation-card";
import { PageTransition, FadeIn } from "@/components/shared/motion";
import { mockStats, mockSpendChart } from "@/modules/integrations/mock-data";
import { mockWorkspaces } from "@/modules/audits/fixtures/mock-workspaces";
import { runAuditEngine } from "@ledgerly/audit-engine";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardPage() {
  const auditResult = runAuditEngine(mockWorkspaces);
  const topRecs = auditResult.recommendations.slice(0, 3);

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        {/* Demo data banner */}
        <FadeIn delay={0}>
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.06] text-amber-400">
            <FlaskConical className="w-4 h-4 shrink-0" aria-hidden="true" />
            <p className="text-xs font-medium">
              Demo data — connect your providers on the{" "}
              <Link href="/integrations" className="underline underline-offset-2 hover:text-amber-300 transition-colors">
                Integrations
              </Link>{" "}
              page to see live results.
            </p>
          </div>
        </FadeIn>

        <FadeIn delay={0.05}>
          <div className="h-px" />
        </FadeIn>

        <FadeIn delay={0.1}>
          <StatsGrid
            stats={{ ...mockStats, estimatedSavings: auditResult.totalMonthlySavings }}
          />
        </FadeIn>

        <FadeIn delay={0.15}>
          <SpendChart data={mockSpendChart} />
        </FadeIn>

        {/* Audit snapshot */}
        <FadeIn delay={0.2}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Latest Audit Snapshot</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {auditResult.recommendations.length} findings across{" "}
                  {auditResult.providersScanned.length} providers
                </p>
              </div>
              <Link href="/audits">
                <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground hover:text-foreground">
                  Full results <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            </div>

            <AuditHeroStats result={auditResult} />

            <div className="flex flex-col gap-3 mt-2">
              {topRecs.map((rec, i) => (
                <RecommendationCard key={rec.id} rec={rec} index={i} />
              ))}
            </div>

            {auditResult.recommendations.length > 3 && (
              <Link href="/audits" className="self-start">
                <Button variant="outline" size="sm" className="gap-1.5 border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06]">
                  View all {auditResult.recommendations.length} recommendations
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </Link>
            )}
          </div>
        </FadeIn>
      </div>
    </PageTransition>
  );
}
