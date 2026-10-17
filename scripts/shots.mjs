import { chromium } from "playwright-core";
const base = process.env.BASE ?? "http://localhost:4173";
const pages = process.argv.slice(2);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium" }).catch(async () => {
  const { execSync } = await import("node:child_process");
  const p = execSync("ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1").toString().trim();
  return chromium.launch({ executablePath: p });
});
for (const [i, path] of pages.entries()) {
  for (const [w, h, tag] of [[1366, 900, "d"], [390, 844, "m"]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h } });
    await pg.goto(base + path, { waitUntil: "networkidle" });
    const sw = await pg.evaluate(() => document.documentElement.scrollWidth);
    await pg.screenshot({ path: `/tmp/claude-0/-home-claude/cc809211-d237-5d8a-8dcb-ec68bc3fe822/scratchpad/shot-${i}-${tag}.png`, fullPage: tag === "d" });
    console.log(path, tag, "scrollWidth", sw);
    await pg.close();
  }
}
await b.close();
