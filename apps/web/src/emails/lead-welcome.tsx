import { Section, Text, Button } from "react-email";
import { EmailLayout } from "@/emails/components/email-layout";

export interface LeadWelcomeEmailProps {
  company: string;
  role: string;
  reportUrl?: string;
}

export default function LeadWelcomeEmail({
  company,
  role,
  reportUrl,
}: LeadWelcomeEmailProps) {
  return (
    <EmailLayout preview={`Welcome to Credex, ${company} — here's what happens next`}>

      {/* Headline */}
      <Section style={s.section}>
        <Text style={s.eyebrow}>You're in</Text>
        <Text style={s.heading}>Welcome to Credex</Text>
        <Text style={s.body}>
          Thanks for your interest, {company}. We've noted your role as{" "}
          <strong style={{ color: "#e5e7eb" }}>{role}</strong> and will tailor
          our recommendations accordingly.
        </Text>
      </Section>

      {/* What happens next */}
      <Section style={s.section}>
        <Text style={s.sectionTitle}>What happens next</Text>

        {STEPS.map((step, i) => (
          <div key={i} style={s.stepCard}>
            <div style={s.stepNumber}>{i + 1}</div>
            <div style={s.stepContent}>
              <Text style={s.stepTitle}>{step.title}</Text>
              <Text style={s.stepDesc}>{step.desc}</Text>
            </div>
          </div>
        ))}
      </Section>

      {/* CTA */}
      {reportUrl && (
        <Section style={{ ...s.section, textAlign: "center" as const, paddingBottom: "40px" }}>
          <Text style={s.ctaHeading}>Your report is still waiting</Text>
          <Button href={reportUrl} style={s.button}>
            View Audit Report →
          </Button>
        </Section>
      )}

      {!reportUrl && (
        <Section style={{ ...s.section, paddingBottom: "40px" }}>
          <Text style={s.body}>
            In the meantime, reply to this email with any questions — we read every one.
          </Text>
        </Section>
      )}

    </EmailLayout>
  );
}

const STEPS = [
  {
    title: "Personalized savings plan",
    desc: "We'll prepare a detailed action plan based on your team size and role.",
  },
  {
    title: "Early access to Credex",
    desc: "You'll be among the first to access our full platform when it launches.",
  },
  {
    title: "Expert review",
    desc: "Our team will review your audit and reach out with tailored recommendations.",
  },
];

const s = {
  section: {
    padding: "24px 40px 0",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#34d399",
    textTransform: "uppercase" as const,
    letterSpacing: "0.08em",
    margin: "0 0 8px",
  },
  heading: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#f9fafb",
    margin: "0 0 12px",
    lineHeight: "1.2",
    letterSpacing: "-0.5px",
  },
  body: {
    fontSize: "15px",
    color: "#9ca3af",
    lineHeight: "1.6",
    margin: "0",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    margin: "0 0 12px",
  },
  stepCard: {
    display: "flex" as const,
    alignItems: "flex-start" as const,
    gap: "14px",
    backgroundColor: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
    padding: "16px",
    marginBottom: "8px",
  },
  stepNumber: {
    width: "24px",
    height: "24px",
    borderRadius: "6px",
    backgroundColor: "rgba(99,102,241,0.15)",
    border: "1px solid rgba(99,102,241,0.25)",
    color: "#818cf8",
    fontSize: "12px",
    fontWeight: "700",
    display: "flex" as const,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    flexShrink: 0,
    lineHeight: "24px",
    textAlign: "center" as const,
  },
  stepContent: {
    flex: 1,
  },
  stepTitle: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#e5e7eb",
    margin: "0 0 3px",
  },
  stepDesc: {
    fontSize: "13px",
    color: "#6b7280",
    margin: "0",
    lineHeight: "1.5",
  },
  ctaHeading: {
    fontSize: "15px",
    color: "#9ca3af",
    marginBottom: "16px",
  },
  button: {
    backgroundColor: "#6366f1",
    color: "#ffffff",
    fontSize: "15px",
    fontWeight: "600",
    padding: "14px 32px",
    borderRadius: "10px",
    textDecoration: "none",
    display: "inline-block" as const,
    letterSpacing: "-0.1px",
  },
} as const;
