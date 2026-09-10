import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    quote: "Credex found $3,200/month in wasted OpenAI spend in the first audit. We had no idea we were embedding the same documents on every request.",
    name: "Sarah Chen",
    title: "CTO, Loopline AI",
    initials: "SC",
  },
  {
    quote: "We were using GPT-4 for literally everything. Credex showed us that 70% of our calls could be handled by GPT-3.5 with identical output quality.",
    name: "Marcus Webb",
    title: "Head of Engineering, Draftly",
    initials: "MW",
  },
  {
    quote: "The vendor overlap detection is a game changer. Now every team owns their AI spend and we've cut our monthly bill by 40% in 6 weeks.",
    name: "Priya Nair",
    title: "VP Engineering, Stackform",
    initials: "PN",
  },
  {
    quote: "Setup took 4 minutes. The inactive seat detection caught licenses we'd forgotten about in staging that would have kept billing indefinitely.",
    name: "James Okafor",
    title: "Staff Engineer, Vanta",
    initials: "JO",
  },
  {
    quote: "Finally a tool that speaks the language of engineers, not just finance. The explainable recommendations are exactly what we needed.",
    name: "Lena Müller",
    title: "Platform Lead, Raycast",
    initials: "LM",
  },
  {
    quote: "We run 5 different AI tools across the team. Credex is the only way we can tell which ones are actually worth the cost.",
    name: "Tom Briggs",
    title: "Founder, Briefcase AI",
    initials: "TB",
  },
];

export function Testimonials() {
  return (
    <section id="testimonials" className="py-32 px-5 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn className="mb-16">
          <p className="text-xs text-green-600 uppercase tracking-widest font-semibold mb-4">
            Testimonials
          </p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance max-w-xl text-gray-900">
            Trusted by engineering teams managing AI spend
          </h2>
          <p className="mt-3 text-xs text-gray-400">
            Illustrative testimonials representing common customer outcomes.
          </p>
        </FadeIn>

        <StaggerChildren className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map((t) => (
            <StaggerItem key={t.name}>
              <div className="rounded-2xl border border-gray-100 bg-white p-6 flex flex-col gap-5 h-full card-shadow hover:card-shadow-hover transition-all duration-200 hover:-translate-y-0.5">
                <p className="text-sm text-gray-500 leading-relaxed flex-1">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-[10px] font-bold bg-green-100 text-green-700">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold text-gray-900 leading-tight">{t.name}</p>
                    <p className="text-[11px] text-gray-400">{t.title}</p>
                  </div>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
