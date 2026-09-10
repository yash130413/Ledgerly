import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatsGrid } from "@/components/app/overview/stats-grid";
import { SpendChart } from "@/components/charts/spend-chart";
import { AuditHeroStats } from "@/components/app/overview/audit-hero-stats";
import { RecommendationCard } from "@/components/app/overview/recommendation-card";
import { PageTransition, FadeIn } from "@/components/shared/motion";
import {
  fetchLatestAudit,
  fetchMyAudits,
  spendChartFromWorkspaces,
  statsFromAudit,
} from "@/lib/audits/latest";

export const metadata: Metadata = { title: "Dashboard" };
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [latest, audits] = await Promise.all([
    fetchLatestAudit(),
    fetchMyAudits(),
  ]);

  if (!latest) {
    return (
      <PageTransition>
        <div className="flex flex-col items-start gap-4 py-12">
          <h1 className="text-2xl font-bold tracking-tight">No audits yet</h1>
          <p className="text-sm text-muted-foreground max-w-md">
            Run a free audit or connect providers to see spend and savings here.
          </p>
          <Link href="/audit-form">
            <Button>Start free audit</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const { result } = latest;
  const topRecs = result.recommendations.slice(0, 3);
  const stats = statsFromAudit(latest, audits.length || 1);
  const spendChart = spendChartFromWorkspaces(latest.workspaces);

  return (
    <PageTransition>
      <div className="flex flex-col gap-8">
        <FadeIn delay={0}>
          <div className="flex items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Overview</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {latest.audit.title}
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground pb-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              From your latest audit
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <StatsGrid stats={stats} />
        </FadeIn>

        <FadeIn delay={0.15}>
          <SpendChart data={spendChart} />
        </FadeIn>

        <FadeIn delay={0.2}>
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold">Latest snapshot</h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {result.recommendations.length} findings ·{" "}
                  {result.providersScanned.length} providers
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/audits/${latest.audit.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                    Full audit <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
                <Link href="/recommendations">
                  <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
                    All tips <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </div>

            <AuditHeroStats result={result} />

            <div className="flex flex-col gap-3 mt-2">
              {topRecs.map((rec, i) => (
                <RecommendationCard key={rec.id} rec={rec} index={i} />
              ))}
            </div>

            {result.recommendations.length > 3 && (
              <Link href="/recommendations" className="self-start">
                <Button variant="outline" size="sm" className="gap-1.5">
                  View all {result.recommendations.length} recommendations
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
