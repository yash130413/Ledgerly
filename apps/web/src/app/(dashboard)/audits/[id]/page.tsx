import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuditResultsDashboard } from "@/components/app/audits/audit-results-dashboard";
import { PageTransition, FadeIn } from "@/components/shared/motion";
import { fetchAuditById } from "@/lib/audits/latest";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const detail = await fetchAuditById(id);
  return { title: detail?.audit.title ?? "Audit" };
}

export const dynamic = "force-dynamic";

export default async function AuditDetailPage({ params }: Props) {
  const { id } = await params;
  const detail = await fetchAuditById(id);
  if (!detail) notFound();

  const { result, workspaces, audit } = detail;

  return (
    <PageTransition>
      <div className="flex flex-col gap-6">
        <FadeIn delay={0}>
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-2">
              <Link href="/audits">
                <Button variant="ghost" size="sm" className="gap-1.5 -ml-2 text-muted-foreground">
                  <ArrowLeft className="w-3.5 h-3.5" /> All audits
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{audit.title}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(result.generatedAt).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
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
