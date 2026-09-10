import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/motion";
import { ShieldCheck, FileSearch, Lock, Server } from "lucide-react";

const pillars = [
  {
    icon: ShieldCheck,
    label: "SOC 2 Ready",
    description:
      "All data encrypted at rest (AES-256) and in transit (TLS 1.3). Audit logs retained for 12 months. Access controls enforced at the row level.",
  },
  {
    icon: FileSearch,
    label: "Deterministic Audits",
    description:
      "Every recommendation traces back to a named rule and a concrete formula. No LLM-generated savings estimates. No hallucinated numbers.",
  },
  {
    icon: Lock,
    label: "Explainable Recommendations",
    description:
      "Each finding includes the rule ID, the threshold that triggered it, the affected users, and the exact savings calculation — reviewable by your finance team.",
  },
  {
    icon: Server,
    label: "Enterprise Infrastructure",
    description:
      "Deployed on Vercel Edge with Supabase PostgreSQL and Row Level Security. Your data is never shared across organizations.",
  },
];

export function TrustSection() {
  return (
    <section className="py-32 px-5 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="text-xs text-green-600 uppercase tracking-widest font-semibold mb-4">
            Security & trust
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-xl text-gray-900">
            Built for finance and engineering teams that need to trust the numbers
          </h2>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {pillars.map((p) => (
            <StaggerItem key={p.label}>
              <div className="flex flex-col gap-4 p-6 rounded-2xl border border-gray-100 bg-white card-shadow hover:card-shadow-hover transition-all duration-200 hover:-translate-y-0.5 h-full">
                <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0">
                  <p.icon className="w-4.5 h-4.5 text-green-600" aria-hidden="true" />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="text-sm font-semibold text-gray-900">{p.label}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
