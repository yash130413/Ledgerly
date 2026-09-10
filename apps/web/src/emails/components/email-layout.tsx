import {
  Html,
  Head,
  Preview,
  Body,
  Container,
  Section,
  Text,
  Hr,
  Link,
} from "react-email";

interface Props {
  preview: string;
  children: React.ReactNode;
}

export function EmailLayout({ preview, children }: Props) {
  return (
    <Html lang="en">
      <Head />
      <Preview>{preview}</Preview>
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Logo / wordmark */}
          <Section style={styles.header}>
            <Text style={styles.logo}>Credex</Text>
            <Text style={styles.logoSub}>AI Spend Optimization</Text>
          </Section>

          {/* Gradient divider */}
          <div style={styles.gradientBar} />

          {/* Content slot */}
          {children}

          {/* Footer */}
          <Hr style={styles.hr} />
          <Section style={styles.footer}>
            <Text style={styles.footerText}>
              You received this email because you used{" "}
              <Link href={process.env.NEXT_PUBLIC_APP_URL ?? "https://credex.ai"} style={styles.footerLink}>
                Credex
              </Link>
              . We never share your data.
            </Text>
            <Text style={styles.footerText}>
              © {new Date().getFullYear()} Credex · AI Spend Optimization
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  body: {
    backgroundColor: "#0a0a12",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    margin: "0",
    padding: "40px 0",
  },
  container: {
    backgroundColor: "#111118",
    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,0.08)",
    maxWidth: "560px",
    margin: "0 auto",
    padding: "0",
    overflow: "hidden" as const,
  },
  header: {
    padding: "32px 40px 24px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "700",
    color: "#ffffff",
    margin: "0 0 2px",
    letterSpacing: "-0.5px",
  },
  logoSub: {
    fontSize: "12px",
    color: "#6b7280",
    margin: "0",
    letterSpacing: "0.05em",
    textTransform: "uppercase" as const,
  },
  gradientBar: {
    height: "1px",
    background: "linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(99,102,241,0.4), transparent)",
    margin: "0 40px",
  },
  hr: {
    borderColor: "rgba(255,255,255,0.07)",
    margin: "0 40px",
  },
  footer: {
    padding: "24px 40px 32px",
  },
  footerText: {
    fontSize: "12px",
    color: "#4b5563",
    margin: "0 0 4px",
    lineHeight: "1.6",
  },
  footerLink: {
    color: "#6b7280",
    textDecoration: "underline",
  },
} as const;
