import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/motion";

const reasons = [
  {
    stat: "43%",
    label: "of AI seats go unused",
    description:
      "Teams provision licenses during onboarding and never audit them. Inactive seats accumulate silently across ChatGPT, Copilot, and Cursor.",
  },
  {
    stat: "2.4×",
    label: "average vendor overlap",
    description:
      "Most engineering teams run ChatGPT and Claude simultaneously for the same workflows. Consolidating saves 20–35% without changing output quality.",
  },
  {
    stat: "68%",
    label: "of teams lack spend visibility",
    description:
      "AI software spend is fragmented across individual credit cards, team budgets, and corporate accounts. No one has the full picture.",
  },
  {
    stat: "$8,400",
    label: "average annual waste per team",
    description:
      "Across inactive seats, duplicate tools, and unused premium plans, the median 20-person engineering team wastes $700/month on AI tooling.",
  },
];

export function WhyOverspend() {
  return (
    <section className="py-32 px-5 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="text-xs text-green-600 uppercase tracking-widest font-semibold mb-4">
            The problem
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-xl text-gray-900">
            Why teams overspend on AI tooling
          </h2>
          <p className="mt-4 text-gray-500 text-lg max-w-lg leading-relaxed">
            AI software costs are growing faster than visibility into how those tools are
            actually being used.
          </p>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 gap-5">
          {reasons.map((r) => (
            <StaggerItem key={r.stat}>
              <div className="rounded-2xl border border-gray-100 bg-white p-7 flex flex-col gap-4 card-shadow hover:card-shadow-hover transition-all duration-200 hover:-translate-y-0.5">
                <div className="flex items-baseline gap-3">
                  <span className="text-5xl font-bold tracking-tight text-green-600 tabular-nums">
                    {r.stat}
                  </span>
                  <span className="text-sm text-gray-500 font-medium">{r.label}</span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">{r.description}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
