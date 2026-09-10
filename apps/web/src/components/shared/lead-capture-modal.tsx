"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, TrendingDown, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { leadCaptureSchema, type LeadCaptureInput } from "@/lib/validators";
import { HONEYPOT_FIELD } from "@/lib/honeypot";
import styles from "./lead-capture-modal.module.css";

// ── Config ────────────────────────────────────────────────────────────────────

const ROLES = [
  "CTO / VP Engineering",
  "Engineering Manager",
  "Software Engineer",
  "DevOps / Platform",
  "Finance / Procurement",
  "Founder / CEO",
  "Other",
];

const TEAM_SIZES = [
  "1–10",
  "11–50",
  "51–200",
  "201–500",
  "500+",
];

// ── Field wrapper ─────────────────────────────────────────────────────────────

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        {label}
      </Label>
      {children}
      {error && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}

// ── Native select styled to match the design system ──────────────────────────

function StyledSelect({
  placeholder,
  options,
  error,
  ...props
}: React.ComponentProps<"select"> & { placeholder: string; options: string[]; error?: boolean }) {
  return (
    <select
      className={cn(
        "h-8 w-full rounded-lg border border-input bg-transparent px-2.5 py-1 text-sm",
        "text-foreground transition-colors outline-none appearance-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:opacity-50 dark:bg-input/30",
        error && "border-destructive ring-3 ring-destructive/20",
        // show muted color when placeholder is selected
        "invalid:text-muted-foreground"
      )}
      defaultValue=""
      {...props}
    >
      <option value="" disabled className="text-muted-foreground bg-popover">
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} className="bg-popover text-foreground">
          {o}
        </option>
      ))}
    </select>
  );
}

// ── Success state ─────────────────────────────────────────────────────────────

function SuccessState({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="flex flex-col items-center gap-5 py-6 text-center"
    >
      <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
        <CheckCircle2 className="w-7 h-7 text-emerald-400" />
      </div>
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">You&apos;re on the list</h3>
        <p className="text-sm text-muted-foreground max-w-xs">
          We'll be in touch with personalized recommendations and early access to Credex.
        </p>
      </div>
      <Button onClick={onClose} size="sm" className="gap-1.5">
        View full report
        <ArrowRight className="w-3.5 h-3.5" />
      </Button>
    </motion.div>
  );
}

// ── Modal ─────────────────────────────────────────────────────────────────────

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmitted: () => void;
  /** Passed from the results page to personalise the value prop */
  annualSavings?: string;
  recommendationCount?: number;
}

export function LeadCaptureModal({
  open,
  onClose,
  onSubmitted,
  annualSavings,
  recommendationCount,
}: Props) {
  const [serverError, setServerError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadCaptureInput>({ resolver: zodResolver(leadCaptureSchema) });

  const onSubmit = async (data: LeadCaptureInput) => {
    setServerError(null);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      setDone(true);
      onSubmitted();
    } catch {
      setServerError("Something went wrong. Please try again.");
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.96, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.3, ease: [0.21, 0.47, 0.32, 0.98] }}
            className={cn(
              "fixed z-50 inset-x-4 top-1/2 -translate-y-1/2",
              "sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:w-full sm:max-w-lg",
              "rounded-2xl border border-white/[0.08] bg-card shadow-2xl overflow-hidden"
            )}
            role="dialog"
            aria-modal="true"
            aria-labelledby="lead-modal-title"
          >
            {/* Gradient accent bar */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

            <div className="p-6 flex flex-col gap-6">
              {/* Close button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-colors"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              <AnimatePresence mode="wait">
                {done ? (
                  <SuccessState key="success" onClose={onClose} />
                ) : (
                  <motion.div
                    key="form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col gap-6"
                  >
                    {/* Header */}
                    <div className="flex flex-col gap-3 pr-6">
                      <div className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Sparkles className="w-3.5 h-3.5 text-primary" />
                        </span>
                        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                          Get your full report
                        </span>
                      </div>

                      <h2 id="lead-modal-title" className="text-xl font-bold leading-snug">
                        {annualSavings
                          ? <>Save <span className="text-emerald-400">{annualSavings}</span> this year</>
                          : "Unlock your personalized savings plan"}
                      </h2>

                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {recommendationCount
                          ? `We found ${recommendationCount} optimization opportunities in your stack. `
                          : ""}
                        Get a personalized action plan and early access to Credex.
                      </p>

                      {/* Social proof strip */}
                      <div className="flex items-center gap-4 pt-1">
                        {[
                          { icon: TrendingDown, text: "Avg. 34% cost reduction" },
                          { icon: CheckCircle2, text: "No credit card required" },
                        ].map(({ icon: Icon, text }) => (
                          <div key={text} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            {text}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
                      {/*
                        Honeypot field — visually hidden, never filled by real users.
                        Bots that auto-fill forms will populate this, exposing themselves.
                        CSS-hidden (not type="hidden") because bots skip type="hidden".
                      */}
                      <div className={styles.honeypot} aria-hidden="true">
                        <input
                          type="text"
                          autoComplete="off"
                          tabIndex={-1}
                          {...register(HONEYPOT_FIELD)}
                        />
                      </div>
                      <Field label="Work email" error={errors.email?.message}>
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          autoComplete="email"
                          autoFocus
                          {...register("email")}
                          aria-invalid={!!errors.email}
                          className="h-9 text-sm"
                        />
                      </Field>

                      <Field label="Company" error={errors.company?.message}>
                        <Input
                          placeholder="Acme Corp"
                          autoComplete="organization"
                          {...register("company")}
                          aria-invalid={!!errors.company}
                          className="h-9 text-sm"
                        />
                      </Field>

                      <div className="grid grid-cols-2 gap-3">
                        <Field label="Your role" error={errors.role?.message}>
                          <StyledSelect
                            placeholder="Select role"
                            options={ROLES}
                            error={!!errors.role}
                            {...register("role")}
                          />
                        </Field>

                        <Field label="Team size" error={errors.teamSize?.message}>
                          <StyledSelect
                            placeholder="Select size"
                            options={TEAM_SIZES}
                            error={!!errors.teamSize}
                            {...register("teamSize")}
                          />
                        </Field>
                      </div>

                      {serverError && (
                        <p className="text-xs text-destructive">{serverError}</p>
                      )}

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full h-9 gap-2 mt-1"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Saving…
                          </>
                        ) : (
                          <>
                            Get my savings plan
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </Button>

                      <p className="text-center text-xs text-muted-foreground">
                        No spam. Unsubscribe any time.
                      </p>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
