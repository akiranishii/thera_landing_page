// Palette compliance check for an animation module.
// Rasterizes the module's SVG at t = 0, 0.05, ... 1 and classifies every pixel in OKLCH:
//   neutral  : chroma <= 0.016 (whites, near-greys)                       -> allowed
//   blue     : hue 218..262 and chroma <= 0.080 (the Blue Haze family)     -> allowed
//   accent   : the three calendar pastels (lavender, mint, sand) region    -> allowed up to 4% of pixels
//   off      : anything else (warm, saturated, green, purple...)           -> must stay under 1%
// Usage: node palette-check.mjs <demo.html> [steps=20]
import { chromium } from "/home/akiranishii/thera_schedule/e2e/node_modules/playwright/index.mjs";
import { resolve } from "node:path";
const [demo, stepsArg = "20"] = process.argv.slice(2);
const steps = Number(stepsArg);
const browser = await chromium.launch({ executablePath: "/home/akiranishii/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell" });
const page = await browser.newPage({ viewport: { width: 560, height: 640 } });
await page.goto("file://" + resolve(demo), { waitUntil: "networkidle" });
const report = await page.evaluate(async (steps) => {
  const lin = (c) => { c /= 255; return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
  function oklch(r, g, b) {
    r = lin(r); g = lin(g); b = lin(b);
    const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
    const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
    const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
    const L = 0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s;
    const A = 1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s;
    const B = 0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s;
    return [L, Math.hypot(A, B), (Math.atan2(B, A) * 180 / Math.PI + 360) % 360];
  }
  function cls(L, C, H) {
    if (C <= 0.016) return "neutral";
    if (H >= 218 && H <= 262 && C <= 0.080) return "blue";
    if (L >= 0.85 && C <= 0.03 && ((H >= 280 && H <= 310) || (H >= 170 && H <= 195) || (H >= 45 && H <= 75))) return "accent";
    return "off";
  }
  const svg = document.querySelector("#stage svg");
  const size = 256, canvas = document.createElement("canvas"); canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  const out = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    window.__anim.set(t);
    const xml = new XMLSerializer().serializeToString(svg);
    const img = new Image();
    await new Promise((res, rej) => { img.onload = res; img.onerror = rej; img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(xml); });
    ctx.clearRect(0, 0, size, size); ctx.fillStyle = "#F7F9FA"; ctx.fillRect(0, 0, size, size);
    ctx.drawImage(img, 0, 0, size, size);
    const d = ctx.getImageData(0, 0, size, size).data;
    const counts = { neutral: 0, blue: 0, accent: 0, off: 0 }, offColors = new Map();
    for (let p = 0; p < d.length; p += 4) {
      const [L, C, H] = oklch(d[p], d[p + 1], d[p + 2]);
      const c = cls(L, C, H); counts[c]++;
      if (c === "off") { const key = "#" + [d[p], d[p + 1], d[p + 2]].map((v) => (v >> 3 << 3).toString(16).padStart(2, "0")).join(""); offColors.set(key, (offColors.get(key) || 0) + 1); }
    }
    const n = size * size;
    const worst = [...offColors.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([k, v]) => `${k} ${(100 * v / n).toFixed(1)}%`);
    out.push({ t: +t.toFixed(2), off: +(100 * counts.off / n).toFixed(2), accent: +(100 * counts.accent / n).toFixed(2), blue: +(100 * counts.blue / n).toFixed(1), neutral: +(100 * counts.neutral / n).toFixed(1), worst });
  }
  return out;
}, steps);
await browser.close();
let fail = false;
for (const r of report) {
  const bad = r.off > 1 || r.accent > 4;
  if (bad) fail = true;
  console.log(`${bad ? "FAIL" : "ok  "} t=${r.t.toFixed(2)}  off=${r.off}%  accent=${r.accent}%  blue=${r.blue}%  neutral=${r.neutral}%${r.worst.length ? "  worst: " + r.worst.join(", ") : ""}`);
}
console.log(fail ? "PALETTE: FAIL (off-palette > 1% or accent > 4% in at least one frame)" : "PALETTE: PASS");
