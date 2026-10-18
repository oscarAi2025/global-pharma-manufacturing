// Capturas para la auditoría visual: móvil (390) y escritorio (1366), página completa.
import { chromium } from "playwright-core";
import { execSync } from "node:child_process";
const base = process.env.BASE ?? "http://localhost:4173";
const out = process.env.OUT ?? "/tmp";
let exe = "/opt/pw-browsers/chromium"; try { execSync(`test -x ${exe}`); } catch { exe = execSync("ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1").toString().trim(); }
const b = await chromium.launch({ executablePath: exe });
const pages = { home: "/es/", categoria: "/es/fabricacion/fabricacion-gominolas/", pais: "/es/maquila-suplementos/mexico/", directorio: "/es/fabricantes/", presupuesto: "/es/solicitar-presupuesto/" };
for (const [name, path] of Object.entries(pages)) {
  for (const [w, h, tag] of [[390, 844, "movil"], [1366, 900, "escritorio"]]) {
    const pg = await b.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: tag === "movil" ? 2 : 1 });
    await pg.goto(base + path, { waitUntil: "networkidle" });
    const sw = await pg.evaluate(() => document.documentElement.scrollWidth);
    await pg.screenshot({ path: `${out}/${name}-${tag}.png`, fullPage: true });
    if (sw > w) console.log("DESBORDA", name, tag, sw);
    await pg.close();
  }
}
await b.close();
console.log("ok");
