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
          background: "#f8faf9",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(22,163,74,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(22,163,74,0.06) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        <div
          style={{
            position: "absolute",
            top: "8%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "720px",
            height: "360px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(22,163,74,0.18) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "84px",
            height: "84px",
            borderRadius: "22px",
            background: "#16a34a",
            marginBottom: "28px",
            boxShadow: "0 12px 40px rgba(22,163,74,0.35)",
          }}
        >
          <svg width="44" height="44" viewBox="0 0 32 32" fill="none">
            <path
              d="M8 7.5v17"
              stroke="white"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M11 10.5h5.5M11 14h4M11 17.5h5"
              stroke="white"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeOpacity="0.55"
            />
            <rect x="18" y="10" width="3.4" height="12.5" rx="1" fill="white" />
            <rect
              x="22.2"
              y="13.5"
              width="3.4"
              height="9"
              rx="1"
              fill="white"
              fillOpacity="0.85"
            />
            <rect
              x="26.4"
              y="17"
              width="3.4"
              height="5.5"
              rx="1"
              fill="white"
              fillOpacity="0.7"
            />
            <path
              d="M18.5 22.8l1.7 1.7 3.5-3.6"
              stroke="#bbf7d0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div
          style={{
            fontSize: "58px",
            fontWeight: 700,
            color: "#111827",
            letterSpacing: "-1.5px",
            marginBottom: "16px",
          }}
        >
          Ledgerly
        </div>

        <div
          style={{
            fontSize: "26px",
            color: "#4b5563",
            fontWeight: 400,
            textAlign: "center",
            maxWidth: "640px",
          }}
        >
          AI Spend Audit &amp; Optimization Platform
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
