import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { brand, seo } from "@/config/brand";
import { logo } from "@/config/logo";

export const alt = seo.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const WORD_SIZE = 46;

// Fonts don't depend on the request, so read them once at module scope; the image stays prerendered.
const fontDir = join(process.cwd(), "src/assets/fonts");
const [semibold, regular] = await Promise.all([
  readFile(join(fontDir, "Inter-SemiBold.ttf")),
  readFile(join(fontDir, "Inter-Regular.ttf")),
]);

function Mark({ px }: { px: number }) {
  return (
    <svg viewBox={logo.viewBox} width={px} height={px}>
      <path d={logo.head} fill={logo.colors.sea} />
      <path d={logo.crescent} fill={logo.colors.ink} fillRule="evenodd" />
    </svg>
  );
}

export default function OpenGraphImage() {
  // "Your network, in motion." set on two lines at the comma, like the site hero.
  const [lead, ...restWords] = brand.statement.split(", ");
  const tail = restWords.join(", ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: logo.colors.light,
          color: logo.colors.ink,
          fontFamily: "Inter",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%", maxWidth: 660 }}>
          {/* Lockup proportions from design/logos/final/profile-crescent/lockup-horizontal.svg:
              box 1 em (disc 0.865 em), about 0.27 em between the box and the t. */}
          <div style={{ display: "flex", alignItems: "center", gap: Math.round(WORD_SIZE * 0.27) }}>
            <Mark px={WORD_SIZE} />
            <div style={{ fontSize: WORD_SIZE, fontWeight: 600, letterSpacing: -1.5 }}>{brand.wordmark}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 22 }}>
            <div style={{ fontSize: 22, fontWeight: 600, letterSpacing: 4.5, color: "#466680" }}>
              {brand.tagline.toUpperCase()}
            </div>
            <div style={{ display: "flex", flexDirection: "column", fontSize: 84, fontWeight: 600, letterSpacing: -3.2, lineHeight: 1.02 }}>
              <span>{tail ? `${lead},` : lead}</span>
              {tail ? <span>{tail}</span> : null}
            </div>
            <div style={{ fontSize: 28, fontWeight: 400, color: "#586C79", lineHeight: 1.38 }}>{seo.description}</div>
          </div>
        </div>
        <Mark px={380} />
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Inter", data: semibold, weight: 600, style: "normal" },
        { name: "Inter", data: regular, weight: 400, style: "normal" },
      ],
    },
  );
}
