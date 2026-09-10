import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#16a34a",
          borderRadius: 8,
          display: "flex",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 7,
            top: 6,
            width: 2,
            height: 20,
            background: "white",
            borderRadius: 2,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 18,
            bottom: 6,
            width: 3,
            height: 14,
            background: "white",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 22,
            bottom: 6,
            width: 3,
            height: 10,
            background: "rgba(255,255,255,0.85)",
            borderRadius: 1,
          }}
        />
        <div
          style={{
            position: "absolute",
            left: 26,
            bottom: 6,
            width: 3,
            height: 6,
            background: "rgba(255,255,255,0.7)",
            borderRadius: 1,
          }}
        />
      </div>
    ),
    { ...size }
  );
}
