import { ImageResponse } from "next/og";
import { brand, seo } from "@/config/brand";

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(180deg, #F7F9FA 0%, #EAF0F4 100%)",
          color: "#223848",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg viewBox="0 0 64 64" width="56" height="56">
            <circle cx="26" cy="32" r="15" fill="none" stroke="#223848" strokeWidth="3.5" />
            <circle cx="38" cy="32" r="15" fill="none" stroke="#223848" strokeWidth="3.5" />
            <path d="M32 20.6a15 15 0 0 1 0 22.8 15 15 0 0 1 0-22.8z" fill="#466680" />
          </svg>
          <div style={{ fontSize: 44, fontWeight: 600, letterSpacing: -1.5 }}>{brand.wordmark}</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div style={{ fontSize: 26, fontWeight: 600, letterSpacing: 5, color: "#466680" }}>
            {brand.tagline.toUpperCase()}
          </div>
          <div style={{ fontSize: 88, fontWeight: 600, letterSpacing: -3, lineHeight: 1.02 }}>{brand.statement}</div>
          <div style={{ fontSize: 30, color: "#586C79", lineHeight: 1.35, maxWidth: 980 }}>{seo.description}</div>
        </div>
      </div>
    ),
    size,
  );
}
