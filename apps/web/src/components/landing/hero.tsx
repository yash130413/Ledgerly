"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, TrendingDown, Users, GitMerge, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

// ── SVG logos ─────────────────────────────────────────────────────────────────

function OpenAILogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#0f0f0f]">
      <path d="M22.282 9.821a5.985 5.985 0 0 0-.516-4.91 6.046 6.046 0 0 0-6.51-2.9A6.065 6.065 0 0 0 4.981 4.18a5.985 5.985 0 0 0-3.998 2.9 6.046 6.046 0 0 0 .743 7.097 5.98 5.98 0 0 0 .51 4.911 6.051 6.051 0 0 0 6.515 2.9A5.985 5.985 0 0 0 13.26 24a6.056 6.056 0 0 0 5.772-4.206 5.99 5.99 0 0 0 3.997-2.9 6.056 6.056 0 0 0-.747-7.073zM13.26 22.43a4.476 4.476 0 0 1-2.876-1.04l.141-.081 4.779-2.758a.795.795 0 0 0 .392-.681v-6.737l2.02 1.168a.071.071 0 0 1 .038.052v5.583a4.504 4.504 0 0 1-4.494 4.494zM3.6 18.304a4.47 4.47 0 0 1-.535-3.014l.142.085 4.783 2.759a.771.771 0 0 0 .78 0l5.843-3.369v2.332a.08.08 0 0 1-.033.062L9.74 19.95a4.5 4.5 0 0 1-6.14-1.646zM2.34 7.896a4.485 4.485 0 0 1 2.366-1.973V11.6a.766.766 0 0 0 .388.676l5.815 3.355-2.02 1.168a.076.076 0 0 1-.071 0l-4.83-2.786A4.504 4.504 0 0 1 2.34 7.872zm16.597 3.855l-5.843-3.369 2.02-1.168a.076.076 0 0 1 .071 0l4.83 2.791a4.494 4.494 0 0 1-.676 8.105v-5.678a.79.79 0 0 0-.402-.681zm2.01-3.023l-.141-.085-4.774-2.782a.776.776 0 0 0-.785 0L9.409 9.23V6.897a.066.066 0 0 1 .028-.061l4.83-2.787a4.5 4.5 0 0 1 6.68 4.66zm-12.64 4.135l-2.02-1.164a.08.08 0 0 1-.038-.057V6.075a4.5 4.5 0 0 1 7.375-3.453l-.142.08L8.704 5.46a.795.795 0 0 0-.393.681zm1.097-2.365l2.602-1.5 2.607 1.5v2.999l-2.597 1.5-2.607-1.5z"/>
    </svg>
  );
}

function AWSLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#FF9900]">
      <path d="M6.763 10.036c0 .296.032.535.088.71.064.176.144.368.256.576.04.063.056.127.056.183 0 .08-.048.16-.152.24l-.503.335a.383.383 0 0 1-.208.072c-.08 0-.16-.04-.239-.112a2.47 2.47 0 0 1-.287-.375 6.18 6.18 0 0 1-.248-.471c-.622.734-1.405 1.101-2.347 1.101-.67 0-1.205-.191-1.596-.574-.391-.384-.59-.894-.59-1.533 0-.678.239-1.23.726-1.644.487-.415 1.133-.623 1.955-.623.272 0 .551.024.846.064.296.04.6.104.918.176v-.583c0-.607-.127-1.03-.375-1.277-.255-.248-.686-.367-1.3-.367-.28 0-.568.031-.863.103-.295.072-.583.16-.862.272a2.287 2.287 0 0 1-.28.104.488.488 0 0 1-.127.023c-.112 0-.168-.08-.168-.247v-.391c0-.128.016-.224.056-.28a.597.597 0 0 1 .224-.167c.279-.144.614-.264 1.005-.36a4.84 4.84 0 0 1 1.246-.151c.95 0 1.644.216 2.091.647.439.43.662 1.085.662 1.963v2.586zm-3.24 1.214c.263 0 .534-.048.822-.144.287-.096.543-.271.758-.51.128-.152.224-.32.272-.512.047-.191.08-.423.08-.694v-.335a6.66 6.66 0 0 0-.735-.136 6.02 6.02 0 0 0-.75-.048c-.535 0-.926.104-1.19.32-.263.215-.39.518-.39.917 0 .375.095.655.295.846.191.2.47.296.838.296zm6.41.862c-.144 0-.24-.024-.304-.08-.064-.048-.12-.16-.168-.311L7.586 5.55a1.398 1.398 0 0 1-.072-.32c0-.128.064-.2.191-.2h.783c.151 0 .255.025.31.08.065.048.113.16.16.312l1.342 5.284 1.245-5.284c.04-.16.088-.264.151-.312a.549.549 0 0 1 .32-.08h.638c.152 0 .256.025.32.08.063.048.12.16.151.312l1.261 5.348 1.381-5.348c.048-.16.104-.264.16-.312a.52.52 0 0 1 .311-.08h.743c.127 0 .2.065.2.2 0 .04-.009.08-.017.128a1.137 1.137 0 0 1-.056.2l-1.923 6.17c-.048.16-.104.263-.168.311a.51.51 0 0 1-.303.08h-.687c-.151 0-.255-.024-.32-.08-.063-.056-.119-.16-.15-.32l-1.238-5.148-1.23 5.14c-.04.16-.087.264-.15.32-.065.056-.177.08-.32.08zm10.256.215c-.415 0-.83-.048-1.229-.143-.399-.096-.71-.2-.918-.32-.128-.071-.215-.151-.247-.223a.563.563 0 0 1-.048-.224v-.407c0-.167.064-.247.183-.247.048 0 .096.008.144.024.048.016.12.048.2.08.271.12.566.215.878.279.319.064.63.096.95.096.502 0 .894-.088 1.165-.264a.86.86 0 0 0 .415-.758.777.777 0 0 0-.215-.559c-.144-.151-.416-.287-.807-.415l-1.157-.36c-.583-.183-1.014-.454-1.277-.813a1.902 1.902 0 0 1-.4-1.158c0-.335.073-.63.216-.886.144-.255.335-.479.575-.654.24-.184.51-.32.83-.415.32-.096.655-.136 1.006-.136.175 0 .359.008.535.032.183.024.35.056.518.088.16.04.312.08.455.127.144.048.256.096.336.144a.69.69 0 0 1 .24.2.43.43 0 0 1 .071.263v.375c0 .168-.064.256-.184.256a.83.83 0 0 1-.303-.096 3.652 3.652 0 0 0-1.532-.311c-.455 0-.815.071-1.062.223-.248.152-.375.383-.375.71 0 .224.08.416.24.567.159.152.454.304.877.44l1.134.358c.574.184.99.44 1.237.767.247.327.367.702.367 1.117 0 .343-.072.655-.207.926-.144.272-.336.511-.583.703-.248.2-.543.343-.886.447-.36.111-.734.167-1.142.167z"/>
    </svg>
  );
}

function AzureLogo() {
  return (
    <svg viewBox="0 0 96 96" fill="none" className="w-full h-full">
      <path d="M33.338 6h26.038L33.616 90H7.578L33.338 6z" fill="#0078D4"/>
      <path d="M62.667 6h25.755L55.396 51.97l17.027 26.21H40.97L62.667 6z" fill="#0078D4" opacity=".7"/>
    </svg>
  );
}

function GCPLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
      <path d="M12 6.5l2.5 2.5H9.5L12 6.5z" fill="#EA4335"/>
      <path d="M17.5 9H14l-2-2.5 1.5-1.5L17.5 9z" fill="#4285F4"/>
      <path d="M6.5 9H10l2-2.5-1.5-1.5L6.5 9z" fill="#34A853"/>
      <path d="M5 10.5l1.5-1.5h11L19 10.5l-7 7-7-7z" fill="#FBBC05"/>
      <path d="M5 10.5l7 7 7-7H5z" fill="#4285F4" opacity=".35"/>
    </svg>
  );
}

function AnthropicLogo() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full text-[#C5703A]">
      <path d="M13.827 3.52h3.603L24 20h-3.603l-6.57-16.48zm-3.654 0H6.57L0 20h3.603l1.357-3.415h6.509l1.357 3.415h3.603L10.173 3.52zm-1.125 9.99l2.015-5.082 2.015 5.083H8.048z"/>
    </svg>
  );
}

// ── Card config ───────────────────────────────────────────────────────────────

type LogoCard = {
  id: string;
  name: string;
  Logo: () => React.ReactElement;
  glow: string;
  border: string;
  pos: Record<string, string>;
  floatY: number[];
  floatR: number[];
  duration: number;
  delay: number;
};

const LOGO_CARDS: LogoCard[] = [
  {
    id: "openai",
    name: "OpenAI",
    Logo: OpenAILogo,
    glow: "rgba(15,15,15,0.07)",
    border: "rgba(15,15,15,0.10)",
    pos: { top: "13%", left: "1%" },
    floatY: [0, -10, -4, 0],
    floatR: [-0.8, 0.6, -0.4, -0.8],
    duration: 7,
    delay: 0,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    Logo: AnthropicLogo,
    glow: "rgba(197,112,58,0.10)",
    border: "rgba(197,112,58,0.18)",
    pos: { top: "44%", left: "0%" },
    floatY: [0, -13, -5, 0],
    floatR: [1, -0.5, 0.8, 1],
    duration: 8.5,
    delay: 1.6,
  },
  {
    id: "aws",
    name: "AWS",
    Logo: AWSLogo,
    glow: "rgba(255,153,0,0.10)",
    border: "rgba(255,153,0,0.18)",
    pos: { top: "72%", left: "1%" },
    floatY: [0, -8, -3, 0],
    floatR: [-1, 0.8, -0.6, -1],
    duration: 6.5,
    delay: 0.8,
  },
  {
    id: "azure",
    name: "Azure",
    Logo: AzureLogo,
    glow: "rgba(0,120,212,0.09)",
    border: "rgba(0,120,212,0.16)",
    pos: { top: "13%", right: "1%" },
    floatY: [0, -11, -4, 0],
    floatR: [0.7, -0.7, 0.5, 0.7],
    duration: 7.5,
    delay: 0.4,
  },
  {
    id: "gcp",
    name: "Google Cloud",
    Logo: GCPLogo,
    glow: "rgba(66,133,244,0.09)",
    border: "rgba(66,133,244,0.15)",
    pos: { top: "44%", right: "0%" },
    floatY: [0, -14, -6, 0],
    floatR: [-0.9, 0.6, -0.7, -0.9],
    duration: 9,
    delay: 2.2,
  },
];

// ── Floating logo card ────────────────────────────────────────────────────────

function FloatingLogoCard({ name, Logo, glow, border, pos, floatY, floatR, duration, delay }: LogoCard) {
  return (
    <motion.div
      className="absolute hidden xl:flex flex-col items-center gap-2 select-none"
      style={{ ...pos }}
      initial={{ opacity: 0, scale: 0.75, y: 16 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: delay + 0.9 }}
    >
      <motion.div
        animate={{ y: floatY, rotate: floatR }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "easeInOut",
          delay,
          times: [0, 0.4, 0.7, 1],
        }}
        className="relative"
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 rounded-2xl scale-110 blur-2xl"
          style={{ background: glow }}
          aria-hidden="true"
        />
        {/* Glass card */}
        <div
          className="relative w-[68px] h-[68px] rounded-2xl flex items-center justify-center p-4"
          style={{
            background: "rgba(255,255,255,0.75)",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid ${border}`,
            boxShadow:
              "0 8px 32px -8px rgba(0,0,0,0.10), 0 2px 8px -2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.95)",
          }}
        >
          <Logo />
        </div>
      </motion.div>

      {/* Label pill */}
      <motion.span
        animate={{ y: floatY }}
        transition={{ duration, repeat: Infinity, ease: "easeInOut", delay, times: [0, 0.4, 0.7, 1] }}
        className="text-[10px] font-semibold text-gray-400 tracking-wide whitespace-nowrap px-2 py-0.5 rounded-full"
        style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
        }}
      >
        {name}
      </motion.span>
    </motion.div>
  );
}

// ── Mock dashboard ────────────────────────────────────────────────────────────

function MockDashboard() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: reduce ? 0 : 32 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98], delay: 0.5 }}
      className="w-full max-w-lg"
    >
      <div className="rounded-2xl border border-gray-200 bg-white shadow-xl shadow-black/[0.08] overflow-hidden">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-100 bg-gray-50/80">
          <span className="w-2.5 h-2.5 rounded-full bg-red-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/60" />
          <span className="w-2.5 h-2.5 rounded-full bg-green-400/60" />
          <span className="ml-3 h-5 flex-1 max-w-[180px] rounded-lg bg-gray-200/60 text-[10px] text-gray-400 flex items-center px-2.5">
            app.credex.ai/audits
          </span>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Stats row */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Monthly Savings", value: "$1,840",  color: "text-green-600" },
              { label: "Annual Savings",  value: "$22,080", color: "text-gray-900" },
              { label: "Findings",        value: "7",       color: "text-orange-500" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl bg-gray-50 border border-gray-100 p-3 flex flex-col gap-1">
                <span className="text-[10px] text-gray-400">{s.label}</span>
                <span className={`text-lg font-bold tabular-nums ${s.color}`}>{s.value}</span>
              </div>
            ))}
          </div>

          {/* Bar chart */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 p-3">
            <p className="text-[10px] text-gray-400 mb-3">Seat utilization by provider</p>
            <div className="flex items-end gap-2 h-14">
              {[
                { label: "ChatGPT", pct: 62, color: "#16a34a" },
                { label: "Claude",  pct: 45, color: "#f59e0b" },
                { label: "Cursor",  pct: 38, color: "#8b5cf6" },
                { label: "Copilot", pct: 71, color: "#0ea5e9" },
                { label: "Gemini",  pct: 29, color: "#6366f1" },
              ].map((b) => (
                <div key={b.label} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full rounded-sm opacity-70" style={{ height: `${b.pct}%`, background: b.color }} />
                  <span className="text-[8px] text-gray-400">{b.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Rec cards */}
          <div className="flex flex-col gap-2">
            <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Top findings</p>
            {[
              { provider: "Cursor",  title: "8 inactive Pro seats detected",           savings: "$1,920", priority: "High",     color: "text-orange-500 bg-orange-50 border-orange-200" },
              { provider: "ChatGPT", title: "Duplicate usage across Claude + ChatGPT", savings: "$4,200", priority: "Critical", color: "text-red-500 bg-red-50 border-red-200" },
            ].map((r) => (
              <div key={r.title} className="rounded-xl border border-gray-100 bg-white p-3 flex items-start gap-3 shadow-sm">
                <div className="flex-1 min-w-0 flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full border ${r.color}`}>{r.priority}</span>
                    <span className="text-[10px] text-gray-400 font-medium">{r.provider}</span>
                  </div>
                  <p className="text-xs font-medium text-gray-800 leading-snug">{r.title}</p>
                  <span className="text-xs text-green-600 font-semibold">{r.savings}/yr</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────

export function Hero() {
  const reduce = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduce
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.25, delay } }
      : { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const, delay } };

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-5 pt-28 pb-20">
      {/* Grid background */}
      <div className="absolute inset-0 hero-grid pointer-events-none" aria-hidden="true" />

      {/* Subtle green radial */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 40% at 50% 0%, rgba(22,163,74,0.06) 0%, transparent 70%)" }}
        aria-hidden="true"
      />

      {/* Floating logo cards */}
      {LOGO_CARDS.map((card) => (
        <FloatingLogoCard key={card.id} {...card} />
      ))}

      <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col lg:flex-row items-center gap-16 lg:gap-20">

        {/* Left — copy */}
        <div className="flex-1 flex flex-col gap-7 max-w-xl">

          {/* Eyebrow pill */}
          <motion.div {...fadeUp(0)}>
            <span className="inline-flex items-center gap-2 text-xs font-medium text-green-700 border border-green-200 bg-green-50 px-3 py-1.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" aria-hidden="true" />
              AI spend visibility for engineering teams
            </span>
          </motion.div>

          {/* Headline */}
          <motion.h1
            {...fadeUp(0.08)}
            className="text-5xl sm:text-6xl font-bold tracking-tight leading-[1.08] text-balance text-gray-900"
          >
            Understand where your{" "}
            <span className="gradient-text-green">AI budget</span>{" "}
            is going
          </motion.h1>

          {/* Subtext */}
          <motion.p
            {...fadeUp(0.16)}
            className="text-lg text-gray-500 leading-relaxed max-w-md"
          >
            Credex audits seat utilization, detects duplicate vendors, and surfaces
            finance-ready optimization recommendations across all major AI providers.
          </motion.p>

          {/* Trust signals */}
          <motion.div {...fadeUp(0.22)} className="flex flex-wrap gap-x-5 gap-y-2">
            {[
              { icon: ShieldCheck, label: "Deterministic audits" },
              { icon: TrendingDown, label: "Explainable savings" },
              { icon: Users,        label: "Seat-level visibility" },
              { icon: GitMerge,     label: "Vendor overlap detection" },
            ].map(({ icon: Icon, label }) => (
              <span key={label} className="flex items-center gap-1.5 text-sm text-gray-500">
                <Icon className="w-3.5 h-3.5 text-green-600 shrink-0" aria-hidden="true" />
                {label}
              </span>
            ))}
          </motion.div>

          {/* CTAs */}
          <motion.div {...fadeUp(0.28)} className="flex flex-wrap items-center gap-3">
            <Link href="/audit-form">
              <Button size="lg" className="h-11 px-6 text-sm font-semibold gap-2 bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-md shadow-green-600/20 hover:shadow-lg hover:shadow-green-600/25 transition-all">
                Start Free Audit
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </Button>
            </Link>
            <Link href="https://credex-app-six.vercel.app/" target="_blank" rel="noopener noreferrer">
              <Button
                size="lg"
                variant="outline"
                className="h-11 px-6 text-sm font-medium rounded-2xl border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all"
              >
                View Live Demo
              </Button>
            </Link>
          </motion.div>

          {/* Social proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: reduce ? 0 : 0.4 }}
            className="text-sm text-gray-400"
          >
            No credit card required · Free to run your first audit · 2-minute setup
          </motion.p>
        </div>

        {/* Right — product preview */}
        <div className="flex-1 w-full flex justify-center lg:justify-end">
          <MockDashboard />
        </div>
      </div>
    </section>
  );
}
