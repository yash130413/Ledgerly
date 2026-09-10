"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
  Bell,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

// ── Animated score ring ───────────────────────────────────────────────────────
function PerfectRing() {
  const r = 44;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative w-28 h-28 flex items-center justify-center">
      {/* Outer glow */}
      <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-xl" />
      <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle cx="56" cy="56" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        {/* Fill — full circle */}
        <motion.circle
          cx="56" cy="56" r={r}
          fill="none"
          stroke="#34d399"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: 0 }}
          transition={{ duration: 1.8, ease: [0.34, 1.05, 0.64, 1], delay: 0.3 }}
        />
      </svg>
      {/* Center icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.34, 1.2, 0.64, 1], delay: 1.6 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <CheckCircle2 className="w-8 h-8 text-emerald-400" aria-hidden="true" />
      </motion.div>
    </div>
  );
}

// ── Stat pill ─────────────────────────────────────────────────────────────────
function StatPill({
  icon: Icon,
  label,
  color,
  delay,
}: {
  icon: React.ElementType;
  label: string;
  color: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.21, 0.47, 0.32, 0.98], delay }}
      className="flex items-center gap-2 px-3 py-2 rounded-xl border border-white/[0.07] bg-white/[0.03]"
    >
      <Icon className="w-3.5 h-3.5 shrink-0" style={{ color }} aria-hidden="true" />
      <span className="text-xs text-muted-foreground">{label}</span>
    </motion.div>
  );
}

// ── Email signup ──────────────────────────────────────────────────────────────
function MonitoringSignup() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@")) { setError("Enter a valid email address."); return; }
    setState("loading");
    setError("");
    try {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, company: "", role: "Other", teamSize: "1–10" }),
      });
      setState("done");
    } catch {
      setState("idle");
      setError("Something went wrong. Please try again.");
    }
  };

  if (state === "done") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center gap-3 px-5 py-4 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.06]"
      >
        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
        <div>
          <p className="text-sm font-semibold text-emerald-400">You&apos;re on the list</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            We&apos;ll notify you when your AI spend patterns change.
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full max-w-sm">
      <div className="flex gap-2">
        <Input
          type="email"
          placeholder="you@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-label="Work email for monitoring alerts"
          aria-describedby={error ? "email-error" : undefined}
          aria-invalid={!!error}
          className="h-9 text-sm flex-1"
          disabled={state === "loading"}
        />
        <Button
          type="submit"
          size="sm"
          disabled={state === "loading"}
          className="gap-1.5 shrink-0"
        >
          {state === "loading" ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
          ) : (
            <>
              Notify me
              <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
            </>
          )}
        </Button>
      </div>
      {error && (
        <p id="email-error" role="alert" className="text-xs text-destructive">
          {error}
        </p>
      )}
      <p className="text-[11px] text-muted-foreground">
        No spam. Unsubscribe any time.
      </p>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
interface Props {
  score: number;
  providerCount: number;
}

export function AlreadyOptimizedState({ score, providerCount }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative rounded-2xl border border-white/[0.07] bg-card overflow-hidden"
    >
      {/* Top gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/50 to-transparent" />

      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-48 rounded-full bg-emerald-500/[0.04] blur-3xl pointer-events-none" />

      <div className="relative px-6 py-12 sm:px-12 flex flex-col items-center text-center gap-8">

        {/* Score ring */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.1, 0.64, 1], delay: 0.1 }}
        >
          <PerfectRing />
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.25 }}
          className="flex flex-col gap-3 max-w-md"
        >
          <div className="flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" aria-hidden="true" />
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              Audit complete
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Your AI stack is already{" "}
            <span className="text-emerald-400">well optimized</span>
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            We scanned {providerCount} provider{providerCount !== 1 ? "s" : ""} and found no
            significant waste. Your team is getting strong value from its AI tooling — that&apos;s
            genuinely rare.
          </p>
        </motion.div>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2"
        >
          <StatPill icon={ShieldCheck}  label="No inactive seats detected"      color="#34d399" delay={0.38} />
          <StatPill icon={TrendingUp}   label={`Efficiency score: ${score}/100`} color="#818cf8" delay={0.43} />
          <StatPill icon={CheckCircle2} label="No duplicate vendors found"       color="#34d399" delay={0.48} />
        </motion.div>

        {/* Divider */}
        <div className="w-full max-w-sm h-px bg-white/[0.06]" />

        {/* Monitoring CTA */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex flex-col items-center gap-4 w-full"
        >
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
            <p className="text-sm font-medium">Get notified when things change</p>
          </div>
          <p className="text-xs text-muted-foreground max-w-xs">
            AI tooling costs shift as your team grows. We&apos;ll alert you when new
            optimization opportunities appear.
          </p>
          <MonitoringSignup />
        </motion.div>

      </div>
    </motion.div>
  );
}
