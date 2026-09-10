import { BarChart3, Users, Zap, GitMerge, Bell, FileText } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/motion";

const features = [
  {
    icon: BarChart3,
    title: "Multi-provider spend dashboard",
    description:
      "One view across ChatGPT, Claude, Cursor, GitHub Copilot, and Gemini. Track monthly spend, seat counts, and utilization rates without switching tabs.",
    soon: false,
  },
  {
    icon: Users,
    title: "Seat utilization analysis",
    description:
      "Identify inactive seats, casual users, and over-provisioned licenses. See exactly which team members haven't used a tool in 30 days.",
    soon: false,
  },
  {
    icon: Zap,
    title: "Deterministic audit engine",
    description:
      "13 rule-based checks across 5 providers produce explainable, finance-friendly recommendations — no LLM hallucinations, no black-box outputs.",
    soon: false,
  },
  {
    icon: GitMerge,
    title: "Vendor overlap detection",
    description:
      "Automatically flags redundant subscriptions — Cursor + Copilot on the same team, ChatGPT + Claude for identical workflows, and more.",
    soon: false,
  },
  {
    icon: Bell,
    title: "Recurring spend monitoring",
    description:
      "Schedule monthly re-audits to catch new waste as your team grows, adds seats, or onboards new AI tools.",
    soon: true,
  },
  {
    icon: FileText,
    title: "Shareable audit reports",
    description:
      "Generate a public, sanitized audit report URL to share with your CFO, board, or finance team — no login required to view.",
    soon: false,
  },
];

export function Features() {
  return (
    <section id="features" className="py-32 px-5 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="text-xs text-green-600 uppercase tracking-widest font-semibold mb-4">
            Platform
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-xl text-gray-900">
            Everything your team needs to control AI spend
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-lg leading-relaxed">
            Built for engineering and finance teams who need visibility without complexity.
          </p>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <StaggerItem key={f.title}>
              <div className="bg-white rounded-2xl border border-gray-100 p-7 flex flex-col gap-4 h-full card-shadow hover:card-shadow-hover transition-all duration-200 hover:-translate-y-0.5 group">
                <div className="flex items-start justify-between gap-2">
                  <div className="w-10 h-10 rounded-xl bg-green-50 border border-green-100 flex items-center justify-center shrink-0 group-hover:bg-green-100 transition-colors">
                    <f.icon className="w-4.5 h-4.5 text-green-600" aria-hidden="true" />
                  </div>
                  {f.soon && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border border-gray-200 text-gray-400 bg-gray-50 shrink-0">
                      Soon
                    </span>
                  )}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-semibold text-gray-900 tracking-tight">{f.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
