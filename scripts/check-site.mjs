// Auditoría del sitio servido (BASE, por defecto el servidor local): páginas del sitemap y estructurales,
// una h1, title, canonical, lang, JSON-LD válido, enlaces internos que responden y formulario donde toca.
const BASE = (process.env.BASE ?? "http://localhost:4173").replace(/\/$/, "");
const problems = [];
const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
const fromSitemap = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
const pages = [...new Set([...fromSitemap, "/", "/es/gracias/", "/es/aviso-legal/", "/en/legal/"])];
const seenLinks = new Map();
async function status(path) {
  if (!seenLinks.has(path)) seenLinks.set(path, fetch(BASE + path, { redirect: "manual" }).then((r) => r.status).catch(() => 0));
  return seenLinks.get(path);
}
for (const p of pages) {
  const res = await fetch(BASE + p);
  const html = await res.text();
  if (res.status !== 200) { problems.push(`${p}: HTTP ${res.status}`); continue; }
  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) problems.push(`${p}: ${h1} h1`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) problems.push(`${p}: sin title`);
  if (!/<link rel="canonical"/.test(html)) problems.push(`${p}: sin canonical`);
  if (!/<html lang="[a-z]{2}(-[A-Z]{2})?"/.test(html)) problems.push(`${p}: sin lang`);
  for (const m of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/g)) { try { JSON.parse(m[1]); } catch { problems.push(`${p}: JSON-LD inválido`); } }
  for (const m of html.matchAll(/<a [^>]*href="(\/[^"#?]*)/g)) { const s = await status(m[1]); if (s !== 200) problems.push(`${p}: enlace ${m[1]} → ${s}`); }
  if (/(solicitar-presupuesto|solicitar-orcamento|request-quote)\/$/.test(p) && !/name="solicitud"/.test(html)) problems.push(`${p}: falta el formulario`);
}
const forms = await fetch(`${BASE}/__forms.html`);
if (forms.status !== 200) problems.push("/__forms.html no disponible (Netlify Forms)");
console.log(`${pages.length} páginas revisadas, ${seenLinks.size} enlaces internos`);
if (problems.length) { console.error(problems.join("\n")); process.exit(1); }
console.log("sitio ok");
