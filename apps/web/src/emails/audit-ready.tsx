import { Section, Text, Button, Row, Column } from "react-email";
import { EmailLayout } from "@/emails/components/email-layout";
import type { AuditRecommendation, AuditPriority } from "@ledgerly/audit-engine";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuditReadyEmailProps {
  companyName: string;
  auditTitle: string;
  monthlySavings: number;
  annualSavings: number;
  totalSpend: number;
  optimizationScore: number;
  topRecommendations: Pick<AuditRecommendation, "title" | "provider" | "priority" | "monthlySavings">[];
  auditUrl: string;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatUSD(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

const PRIORITY_COLORS: Record<AuditPriority, { bg: string; text: string; border: string }> = {
  Critical: { bg: "rgba(239,68,68,0.12)",  text: "#f87171", border: "rgba(239,68,68,0.25)" },
  High:     { bg: "rgba(249,115,22,0.10)", text: "#fb923c", border: "rgba(249,115,22,0.25)" },
  Medium:   { bg: "rgba(234,179,8,0.10)",  text: "#facc15", border: "rgba(234,179,8,0.25)" },
  Low:      { bg: "rgba(255,255,255,0.05)", text: "#9ca3af", border: "rgba(255,255,255,0.10)" },
};

// ── Template ──────────────────────────────────────────────────────────────────

export default function AuditReadyEmail({
  companyName,
  auditTitle,
  monthlySavings,
  annualSavings,
  totalSpend,
  optimizationScore,
  topRecommendations,
  auditUrl,
}: AuditReadyEmailProps) {
  const wastePercent =
    totalSpend > 0 ? ((monthlySavings / totalSpend) * 100).toFixed(1) : "0";

  const scoreColor =
    optimizationScore >= 75 ? "#34d399" : optimizationScore >= 50 ? "#fbbf24" : "#f87171";

  return (
    <EmailLayout
      preview={`Your audit found ${formatUSD(annualSavings)}/yr in savings — view your full report`}
    >
      {/* Headline */}
      <Section style={s.section}>
        <Text style={s.eyebrow}>Audit Complete</Text>
        <Text style={s.heading}>Your AI spend report is ready</Text>
        <Text style={s.body}>
          Hi {companyName}, we finished analyzing <strong style={{ color: "#e5e7eb" }}>{auditTitle}</strong>.
          Here's what we found.
        </Text>
      </Section>

      {/* Savings hero card */}
      <Section style={s.section}>
        <div style={s.heroCard}>
          <Row>
            <Column style={{ textAlign: "center" as const, padding: "0 12px" }}>
              <Text style={s.metricLabel}>Monthly Savings</Text>
              <Text style={{ ...s.metricValue, color: "#34d399" }}>
                {formatUSD(monthlySavings)}
              </Text>
            </Column>
            <Column style={{ ...s.dividerCol }}>
              <div style={s.verticalDivider} />
            </Column>
            <Column style={{ textAlign: "center" as const, padding: "0 12px" }}>
              <Text style={s.metricLabel}>Annual Savings</Text>
              <Text style={s.metricValue}>{formatUSD(annualSavings)}</Text>
            </Column>
            <Column style={s.dividerCol}>
              <div style={s.verticalDivider} />
            </Column>
            <Column style={{ textAlign: "center" as const, padding: "0 12px" }}>
              <Text style={s.metricLabel}>Waste Rate</Text>
              <Text style={{ ...s.metricValue, color: "#fbbf24" }}>{wastePercent}%</Text>
            </Column>
          </Row>
          <div style={{ ...s.scoreRow }}>
            <Text style={s.scoreLabel}>Optimization Score</Text>
            <Text style={{ ...s.scoreValue, color: scoreColor }}>
              {optimizationScore}<span style={s.scoreMax}>/100</span>
            </Text>
          </div>
        </div>
      </Section>

      {/* Top recommendations */}
      {topRecommendations.length > 0 && (
        <Section style={s.section}>
          <Text style={s.sectionTitle}>Top Recommendations</Text>
          {topRecommendations.slice(0, 3).map((rec, i) => {
            const p = PRIORITY_COLORS[rec.priority];
            return (
              <div key={i} style={s.recCard}>
                <Row>
                  <Column>
                    <Row style={{ marginBottom: "6px" }}>
                      <Column>
                        <span style={{ ...s.priorityBadge, backgroundColor: p.bg, color: p.text, border: `1px solid ${p.border}` }}>
                          {rec.priority}
                        </span>
                        <span style={s.providerBadge}>{rec.provider}</span>
                      </Column>
                    </Row>
                    <Text style={s.recTitle}>{rec.title}</Text>
                  </Column>
                  <Column style={{ textAlign: "right" as const, verticalAlign: "middle", minWidth: "80px" }}>
                    <Text style={s.recSavings}>{formatUSD(rec.monthlySavings)}/mo</Text>
                  </Column>
                </Row>
              </div>
            );
          })}
        </Section>
      )}

      {/* CTA */}
      <Section style={{ ...s.section, textAlign: "center" as const, paddingBottom: "40px" }}>
        <Button href={auditUrl} style={s.button}>
          View Full Report →
        </Button>
        <Text style={s.ctaNote}>
          Your report is {"{"}shareable{"}"} — send it to your team or finance lead.
        </Text>
      </Section>
    </EmailLayout>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const s = {
  section: {
    padding: "24px 40px 0",
  },
  eyebrow: {
    fontSize: "11px",
    fontWeight: "600",
    color: "#6366f1",
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
  heroCard: {
    backgroundColor: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: "12px",
    padding: "24px 16px 16px",
  },
  metricLabel: {
    fontSize: "11px",
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    margin: "0 0 4px",
  },
  metricValue: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#f9fafb",
    margin: "0",
    letterSpacing: "-0.5px",
  },
  dividerCol: {
    width: "1px",
    padding: "0",
    verticalAlign: "middle" as const,
  },
  verticalDivider: {
    width: "1px",
    height: "40px",
    backgroundColor: "rgba(255,255,255,0.08)",
    margin: "0 auto",
  },
  scoreRow: {
    borderTop: "1px solid rgba(255,255,255,0.06)",
    marginTop: "16px",
    paddingTop: "12px",
    display: "flex" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
  },
  scoreLabel: {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0",
  },
  scoreValue: {
    fontSize: "18px",
    fontWeight: "700",
    margin: "0",
  },
  scoreMax: {
    fontSize: "12px",
    color: "#4b5563",
    fontWeight: "400",
  },
  sectionTitle: {
    fontSize: "13px",
    fontWeight: "600",
    color: "#6b7280",
    textTransform: "uppercase" as const,
    letterSpacing: "0.06em",
    margin: "0 0 12px",
  },
  recCard: {
    backgroundColor: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: "10px",
    padding: "14px 16px",
    marginBottom: "8px",
  },
  priorityBadge: {
    fontSize: "10px",
    fontWeight: "600",
    padding: "2px 8px",
    borderRadius: "999px",
    marginRight: "6px",
    display: "inline-block" as const,
  },
  providerBadge: {
    fontSize: "10px",
    color: "#6b7280",
    backgroundColor: "rgba(255,255,255,0.05)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "2px 8px",
    borderRadius: "999px",
    display: "inline-block" as const,
  },
  recTitle: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#e5e7eb",
    margin: "0",
    lineHeight: "1.4",
  },
  recSavings: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#34d399",
    margin: "0",
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
  ctaNote: {
    fontSize: "12px",
    color: "#4b5563",
    marginTop: "12px",
  },
} as const;
