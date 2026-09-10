import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AuditResultsDashboard } from "@/components/app/audits/audit-results-dashboard";
import { PageTransition, FadeIn } from "@/components/shared/motion";
import { fetchLatestAudit } from "@/lib/audits/latest";

export const metadata: Metadata = { title: "Audit Results" };
export const dynamic = "force-dynamic";

export default async function AuditsPage() {
  const latest = await fetchLatestAudit();

  if (!latest) {
    return (
      <PageTransition>
        <div className="flex flex-col items-start gap-4 py-12">
          <h1 className="text-2xl font-bold tracking-tight">No audit results</h1>
          <p className="text-sm text-muted-foreground">
            Seeded or live audits for your account will show up here.
          </p>
          <Link href="/audit-form">
            <Button>Run an audit</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  const { result, workspaces, audit } = latest;

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <FadeIn delay={0}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Audit Results</h1>
              <p className="text-sm text-muted-foreground mt-1">
                {audit.title} ·{" "}
                {new Date(result.generatedAt).toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
            <div className="shrink-0 flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-medium text-emerald-400">
                From your account
              </span>
            </div>
          </div>
        </FadeIn>

        <FadeIn delay={0.08}>
          <AuditResultsDashboard result={result} workspaces={workspaces} />
        </FadeIn>
      </div>
    </PageTransition>
  );
}
