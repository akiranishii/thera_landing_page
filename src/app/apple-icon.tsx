import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#F7F9FA",
        }}
      >
        <svg viewBox="0 0 64 64" width="140" height="140">
          <circle cx="26" cy="32" r="15" fill="none" stroke="#223848" strokeWidth="3.5" />
          <circle cx="38" cy="32" r="15" fill="none" stroke="#223848" strokeWidth="3.5" />
          <path d="M32 20.6a15 15 0 0 1 0 22.8 15 15 0 0 1 0-22.8z" fill="#466680" />
        </svg>
      </div>
    ),
    size,
  );
}
