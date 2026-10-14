// Rasterize an SVG logo at several sizes for inspection.
// Usage: node render.mjs <file.svg> <outDir> [sizes=512,48,16] [bg=#ffffff|#1c2e3d|transparent]
import { chromium } from "/home/akiranishii/thera_schedule/e2e/node_modules/playwright/index.mjs";
import { readFileSync, mkdirSync } from "node:fs";
import { basename, join } from "node:path";

const [svgPath, outDir, sizesArg = "512,48,16", bg = "#ffffff"] = process.argv.slice(2);
if (!svgPath || !outDir) { console.error("usage: node render.mjs <file.svg> <outDir> [sizes] [bg]"); process.exit(1); }
mkdirSync(outDir, { recursive: true });
const svg = readFileSync(svgPath, "utf8");
const name = basename(svgPath, ".svg");
const sizes = sizesArg.split(",").map(Number);
const browser = await chromium.launch({ executablePath: "/home/akiranishii/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell" });
const page = await browser.newPage();
const out = [];
for (const size of sizes) {
  // Natural render at `size` CSS px, 1x.
  await page.setViewportSize({ width: size + 32, height: size + 32 });
  await page.setContent(`<!doctype html><html><body style="margin:0;background:${bg};display:flex;align-items:center;justify-content:center;width:${size + 32}px;height:${size + 32}px">
    <div id="m" style="width:${size}px;height:${size}px;display:flex">${svg.replace(/<svg([^>]*)>/, (m, a) => `<svg${a.replace(/\s(width|height)="[^"]*"/g, "")} width="${size}" height="${size}" style="width:${size}px;height:${size}px">`)}</div></body></html>`);
  const file = join(outDir, `${name}-${size}.png`);
  await page.locator("#m").screenshot({ path: file, omitBackground: bg === "transparent" });
  out.push(file);
  // For small sizes, also save a pixelated zoom so the 1x raster can be inspected.
  if (size <= 64) {
    const zoom = Math.round(256 / size);
    const buf = readFileSync(file).toString("base64");
    await page.setViewportSize({ width: size * zoom + 32, height: size * zoom + 32 });
    await page.setContent(`<!doctype html><body style="margin:0;background:${bg};padding:16px"><img id="z" src="data:image/png;base64,${buf}" style="width:${size * zoom}px;height:${size * zoom}px;image-rendering:pixelated;display:block"></body>`);
    const zfile = join(outDir, `${name}-${size}-zoom.png`);
    await page.locator("#z").screenshot({ path: zfile });
    out.push(zfile);
  }
}
await browser.close();
console.log(out.join("\n"));
