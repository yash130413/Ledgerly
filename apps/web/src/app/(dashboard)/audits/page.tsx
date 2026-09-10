import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageTransition, FadeIn } from "@/components/shared/motion";
import { fetchMyAudits } from "@/lib/audits/latest";
import { formatCurrency } from "@/lib/utils";

export const metadata: Metadata = { title: "Audits" };
export const dynamic = "force-dynamic";

export default async function AuditsListPage() {
  const audits = await fetchMyAudits();

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <FadeIn delay={0}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">Audits</h1>
              <p className="text-sm text-muted-foreground mt-1">
                All spend audits linked to your account
              </p>
            </div>
            <Link href="/audit-form">
              <Button size="sm" className="gap-1.5">
                New audit <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </FadeIn>

        {audits.length === 0 ? (
          <FadeIn delay={0.05}>
            <Card>
              <CardContent className="py-12 flex flex-col items-center gap-3 text-center">
                <p className="text-sm text-muted-foreground">No audits yet.</p>
                <Link href="/audit-form">
                  <Button size="sm">Run your first audit</Button>
                </Link>
              </CardContent>
            </Card>
          </FadeIn>
        ) : (
          <FadeIn delay={0.05}>
            <div className="flex flex-col gap-3">
              {audits.map((a) => (
                <Link key={a.id} href={`/audits/${a.id}`} className="block group">
                  <Card className="transition-colors group-hover:border-green-200 group-hover:bg-green-50/40">
                    <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {a.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {new Date(a.created_at).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                          {a.provider ? ` · ${a.provider}` : ""}
                        </p>
                      </div>
                      <div className="flex items-center gap-4 text-xs sm:text-sm shrink-0">
                        <div className="text-right">
                          <p className="text-muted-foreground">Score</p>
                          <p className="font-semibold tabular-nums">
                            {a.optimization_score}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-muted-foreground">Savings / mo</p>
                          <p className="font-semibold tabular-nums text-green-700">
                            {formatCurrency(Number(a.estimated_monthly_savings))}
                          </p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-green-700" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </FadeIn>
        )}
      </div>
    </PageTransition>
  );
}
