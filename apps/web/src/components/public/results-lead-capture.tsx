"use client";

import { LeadCaptureModal } from "@/components/shared/lead-capture-modal";
import { useLeadCapture } from "@/hooks/use-lead-capture";

interface Props {
  annualSavings: string;
  recommendationCount: number;
}

export function ResultsLeadCapture({ annualSavings, recommendationCount }: Props) {
  const { open, setOpen, onSubmitted, onDismiss } = useLeadCapture();

  return (
    <LeadCaptureModal
      open={open}
      onClose={() => { onDismiss(); setOpen(false); }}
      onSubmitted={onSubmitted}
      annualSavings={annualSavings}
      recommendationCount={recommendationCount}
    />
  );
}
