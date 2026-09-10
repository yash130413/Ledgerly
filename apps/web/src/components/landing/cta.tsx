import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/shared/motion";

export function CTA() {
  return (
    <section className="py-32 px-5 border-t border-gray-100">
      <div className="max-w-6xl mx-auto">
        <FadeIn>
          <div className="relative rounded-3xl overflow-hidden px-8 py-20 sm:px-16 flex flex-col items-start gap-8"
            style={{ background: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 50%, #bbf7d0 100%)" }}
          >
            {/* Decorative circles */}
            <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-green-200/40 pointer-events-none" aria-hidden="true" />
            <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-green-300/20 pointer-events-none" aria-hidden="true" />

            <div className="relative flex flex-col gap-4 max-w-xl">
              <p className="text-xs text-green-700 uppercase tracking-widest font-semibold">
                Get started
              </p>
              <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-balance text-gray-900">
                Run your first AI spend audit in under 10 minutes
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect your providers, get a prioritized list of savings opportunities,
                and share a finance-ready report — all for free.
              </p>
            </div>

            <div className="relative flex flex-wrap items-center gap-3">
              <Link href="/audit-form">
                <Button size="lg" className="h-11 px-6 text-sm font-semibold gap-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-md shadow-green-600/20 transition-all">
                  Start Free Audit
                  <ArrowRight className="w-4 h-4" aria-hidden="true" />
                </Button>
              </Link>
              <Link href="https://credex-app-six.vercel.app/" target="_blank" rel="noopener noreferrer">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-11 px-6 text-sm font-medium rounded-2xl border-green-200 bg-white/60 text-gray-700 hover:bg-white hover:text-gray-900 transition-all"
                >
                  View Live Demo
                </Button>
              </Link>
            </div>

            <p className="relative text-sm text-gray-500">
              No credit card required · Free to run your first audit · Cancel anytime
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
