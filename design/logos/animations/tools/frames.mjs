// Render an animation demo page at t = 0, 0.1, ... 1 and build a filmstrip.
// Usage: node frames.mjs <demo.html> <outDir> [steps=10]
import { chromium } from "/home/akiranishii/thera_schedule/e2e/node_modules/playwright/index.mjs";
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve, join } from "node:path";

const [demo, outDir, stepsArg = "10"] = process.argv.slice(2);
if (!demo || !outDir) { console.error("usage: node frames.mjs <demo.html> <outDir> [steps]"); process.exit(1); }
const steps = Number(stepsArg);
mkdirSync(outDir, { recursive: true });
const browser = await chromium.launch({ executablePath: "/home/akiranishii/.cache/ms-playwright/chromium_headless_shell-1208/chrome-headless-shell-linux64/chrome-headless-shell" });
const page = await browser.newPage({ viewport: { width: 560, height: 640 } });
const errors = [];
page.on("pageerror", (e) => errors.push("pageerror: " + e.message));
page.on("console", (m) => { if (m.type() === "error") errors.push("console: " + m.text()); });
await page.goto("file://" + resolve(demo), { waitUntil: "networkidle" });
const ok = await page.evaluate(() => !!(window.__anim && typeof window.__anim.set === "function"));
if (!ok) { console.error("window.__anim.set not found. Errors:", errors); await browser.close(); process.exit(2); }
const stage = page.locator("#stage");
const files = [];
for (let i = 0; i <= steps; i++) {
  const t = i / steps;
  await page.evaluate((t) => window.__anim.set(t), t);
  await page.waitForTimeout(40);
  const f = join(outDir, `frame-${String(Math.round(t * 100)).padStart(3, "0")}.png`);
  await stage.screenshot({ path: f });
  files.push(f);
}
// Reverse check: go to 1 then back to 0 and compare with the first frame.
await page.evaluate(() => { window.__anim.set(1); window.__anim.set(0); });
await page.waitForTimeout(40);
const back = join(outDir, "frame-000-after-reverse.png");
await stage.screenshot({ path: back });
const same = Buffer.compare(readFileSync(files[0]), readFileSync(back)) === 0;
writeFileSync(join(outDir, "reverse-check.txt"), same ? "OK: set(1) then set(0) restored the t=0 frame exactly.\n" : "MISMATCH: set(1) then set(0) did not restore the t=0 frame (see frame-000-after-reverse.png).\n");
// Filmstrip: all frames in a row at 160 px each.
const imgs = files.map((f) => `<img src="data:image/png;base64,${readFileSync(f).toString("base64")}" style="width:160px;height:160px;border-radius:8px;border:1px solid #DDE6EC;display:block">`);
const labels = files.map((_, i) => `<div style="width:160px;text-align:center;font:11px sans-serif;color:#586C79">t = ${(i / steps).toFixed(2)}</div>`);
await page.setViewportSize({ width: 172 * (steps + 1) + 32, height: 220 });
await page.setContent(`<body style="margin:0;background:#F7F9FA;padding:16px"><div style="display:flex;gap:12px">${imgs.map((im, i) => `<div>${im}${labels[i]}</div>`).join("")}</div></body>`);
await page.screenshot({ path: join(outDir, "filmstrip.png") });
await browser.close();
console.log(files.join("\n"));
console.log(join(outDir, "filmstrip.png"));
console.log(same ? "reverse-check OK" : "reverse-check MISMATCH");
if (errors.length) console.log("page errors:\n" + errors.join("\n"));
