"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { FadeIn, StaggerChildren, StaggerItem } from "@/components/shared/motion";
import { cn } from "@/lib/utils";

const faqs = [
  {
    q: "How does Credex connect to my AI providers?",
    a: "You paste your existing API keys — we never store them in plaintext. We use them read-only to pull usage logs and billing data. You can revoke access at any time from your settings.",
  },
  {
    q: "Will Credex slow down my API calls?",
    a: "No. Credex is entirely out-of-band. We pull usage data directly from provider billing APIs and logs — we never sit in the request path, so there's zero latency impact.",
  },
  {
    q: "How much does Credex cost?",
    a: "Credex is free for teams spending up to $5k/month on AI APIs. Above that, we charge 1% of the spend we audit — and we guarantee to find at least 3x that in savings, or your money back.",
  },
  {
    q: "Which providers are supported?",
    a: "OpenAI, Anthropic, Google Gemini, Cohere, Mistral AI, and AWS Bedrock are fully supported today. Azure OpenAI and Replicate are in beta. More providers ship every month.",
  },
  {
    q: "How long does an audit take?",
    a: "Initial setup takes under 5 minutes. The first full audit runs in 2–10 minutes depending on how much usage history you have. After that, audits run continuously in the background.",
  },
  {
    q: "Is my data secure?",
    a: "Yes. All data is encrypted at rest (AES-256) and in transit (TLS 1.3). We are SOC 2 Type II certified and GDPR compliant. We never share your data with third parties.",
  },
  {
    q: "Can I use Credex for multiple teams or projects?",
    a: "Absolutely. You can create workspaces per team, tag API calls by project or feature, and set separate budgets and alerts for each. It's built for multi-team engineering orgs.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);

  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="w-full text-left border border-gray-100 rounded-2xl px-5 py-4 bg-white hover:bg-gray-50 transition-colors shadow-sm"
    >
      <div className="flex items-center justify-between gap-4">
        <span className="text-sm font-semibold text-gray-900">{q}</span>
        <span
          className={cn(
            "w-6 h-6 rounded-full border border-gray-200 bg-gray-50 flex items-center justify-center shrink-0 transition-transform duration-200",
            open && "rotate-45 bg-green-50 border-green-200"
          )}
        >
          <Plus className="w-3 h-3 text-gray-400" />
        </span>
      </div>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.21, 0.47, 0.32, 0.98] }}
            className="overflow-hidden"
          >
            <p className="pt-3 text-sm text-gray-500 leading-relaxed text-left">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="py-28 px-5 border-t border-gray-100">
      <div className="max-w-3xl mx-auto">
        <FadeIn className="text-center mb-12">
          <p className="text-xs text-green-600 uppercase tracking-widest font-semibold mb-3">FAQ</p>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance text-gray-900">
            Common questions
          </h2>
        </FadeIn>

        <StaggerChildren className="flex flex-col gap-3">
          {faqs.map((f) => (
            <StaggerItem key={f.q}>
              <FAQItem q={f.q} a={f.a} />
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  );
}
