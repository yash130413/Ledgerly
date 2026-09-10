import { FadeIn } from "@/components/shared/motion";

const providers = [
  "ChatGPT",
  "Claude",
  "Cursor",
  "GitHub Copilot",
  "Gemini",
  "AWS Bedrock",
  "Mistral",
  "Cohere",
];

export function LogoBar() {
  return (
    <section className="py-14 border-y border-gray-100 bg-white">
      <div className="max-w-6xl mx-auto px-5">
        <FadeIn>
          <p className="text-center text-xs text-gray-400 uppercase tracking-widest mb-8 font-medium">
            Audits across every major AI provider
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4">
            {providers.map((p) => (
              <span
                key={p}
                className="text-sm font-semibold text-gray-300 hover:text-gray-500 transition-colors tracking-tight select-none"
              >
                {p}
              </span>
            ))}
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
