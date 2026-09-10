import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageTransition, FadeIn } from "@/components/shared/motion";
import { RecommendationsBoard } from "@/components/app/recommendations/recommendations-board";
import { fetchLatestAudit } from "@/lib/audits/latest";

export const metadata: Metadata = { title: "Recommendations" };
export const dynamic = "force-dynamic";

export default async function RecommendationsPage() {
  const latest = await fetchLatestAudit();

  if (!latest) {
    return (
      <PageTransition>
        <div className="flex flex-col items-start gap-4 py-12">
          <h1 className="text-2xl font-bold tracking-tight">Recommendations</h1>
          <p className="text-sm text-muted-foreground">
            Run an audit to see savings tips here.
          </p>
          <Link href="/audit-form">
            <Button>Run an audit</Button>
          </Link>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <FadeIn delay={0}>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Recommendations</h1>
            <p className="text-sm text-muted-foreground mt-1">
              From {latest.audit.title} ·{" "}
              <Link
                href={`/audits/${latest.audit.id}`}
                className="underline underline-offset-2 hover:text-foreground"
              >
                View full audit
              </Link>
            </p>
          </div>
        </FadeIn>
        <FadeIn delay={0.06}>
          <RecommendationsBoard result={latest.result} />
        </FadeIn>
      </div>
    </PageTransition>
  );
}
