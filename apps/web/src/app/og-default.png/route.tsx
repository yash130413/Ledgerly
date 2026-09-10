import { ImageResponse } from "next/og";

export const runtime = "edge";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0d0b14",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Grid */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Glow */}
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "700px",
            height: "400px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, rgba(124,101,246,0.2) 0%, transparent 70%)",
          }}
        />

        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "72px",
            height: "72px",
            borderRadius: "18px",
            background: "#7c65f6",
            marginBottom: "32px",
          }}
        >
          <svg width="32" height="32" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h4M8 7h4M7 2v4M7 8v4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </div>

        {/* Wordmark */}
        <div style={{ fontSize: "56px", fontWeight: 700, color: "white", letterSpacing: "-1.5px", marginBottom: "18px" }}>
          Credex
        </div>

        {/* Tagline */}
        <div style={{ fontSize: "26px", color: "rgba(255,255,255,0.45)", fontWeight: 400, textAlign: "center", maxWidth: "640px" }}>
          AI Spend Audit &amp; Optimization Platform
        </div>

        {/* Bottom pill */}
        <div
          style={{
            position: "absolute",
            bottom: "52px",
            display: "flex",
            alignItems: "center",
            padding: "10px 24px",
            borderRadius: "999px",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "rgba(255,255,255,0.05)",
            color: "rgba(255,255,255,0.5)",
            fontSize: "18px",
          }}
        >
          credex-app-six.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
