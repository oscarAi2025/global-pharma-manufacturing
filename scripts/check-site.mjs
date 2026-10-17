// Auditoría del sitio generado (out/): enlaces internos, una h1, title, canonical, lang, JSON-LD válido,
// formulario Netlify presente donde toca, y en producción datos del operador completos.
import { readdirSync, readFileSync, statSync, existsSync } from "node:fs";
import { join } from "node:path";

const OUT = "out";
const files = [];
(function walk(d) { for (const f of readdirSync(d)) { const p = join(d, f); statSync(p).isDirectory() ? (f !== "_next" && walk(p)) : f.endsWith(".html") && files.push(p); } })(OUT);

const problems = [];
const exists = (href) => {
  const clean = href.split("#")[0].split("?")[0];
  if (!clean) return true;
  const p = join(OUT, clean);
  return existsSync(p) && statSync(p).isFile() || existsSync(join(p, "index.html"));
};
for (const f of files) {
  if (f.endsWith("404.html") || f.includes("/404/")) continue;
  const html = readFileSync(f, "utf8");
  const rel = f.slice(OUT.length);
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`${rel}: ${h1} h1`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push(`${rel}: sin title`);
  if (!/<link rel="canonical"/.test(html)) problems.push(`${rel}: sin canonical`);
  if (!/<html lang="[a-z]{2}(-[A-Z]{2})?"/.test(html)) problems.push(`${rel}: sin lang`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) {
    try { JSON.parse(m[1]); } catch { problems.push(`${rel}: JSON-LD inválido`); }
  }
  for (const m of html.matchAll(/<a [^>]*href="(\/[^"]*)"/g)) if (!exists(m[1])) problems.push(`${rel}: enlace roto ${m[1]}`);
  if (/(solicitar-presupuesto|solicitar-orcamento|request-quote)\//.test(rel) && !/data-netlify="true"/.test(html)) problems.push(`${rel}: falta el formulario`);
}
if (process.env.SITE_ENV === "production") {
  for (const k of ["SITE_URL", "CONTACT_EMAIL", "OPERATOR_TAX_ID"])
    if (!process.env[k]) problems.push(`Producción: falta la variable ${k}`);
}
console.log(`${files.length} páginas revisadas`);
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log("sitio ok");
