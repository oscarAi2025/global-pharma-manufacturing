// Prueba de extremo a extremo del formulario sobre el sitio generado (servidor estático local).
import { chromium } from "playwright-core";
import { execSync } from "node:child_process";
const base = process.env.BASE ?? "http://localhost:4173";
let exe = "/opt/pw-browsers/chromium";
try { execSync(`test -x ${exe}`); } catch { exe = execSync("ls -d /opt/pw-browsers/chromium-*/chrome-linux/chrome | head -1").toString().trim(); }
const b = await chromium.launch({ executablePath: exe });
const pg = await b.newPage();
let posted = null;
await pg.route("**/", async (route) => {
  if (route.request().method() === "POST") { posted = route.request().postData(); return route.fulfill({ status: 200, body: "ok" }); }
  return route.continue();
});
const fail = (m) => { console.error("FALLO:", m); process.exit(1); };
await pg.goto(base + "/es/solicitar-presupuesto/?utm_source=google&utm_campaign=prueba", { waitUntil: "networkidle" });
const f = pg.locator("main form");
if (await f.locator("#formulation").isVisible()) fail("el paso 2 se ve antes de tiempo");
await f.getByRole("button", { name: "Continuar" }).click();
if (!(await f.locator("#dosage_form-err").isVisible())) fail("no muestra error de campo obligatorio");
await f.locator("#dosage_form").selectOption("gummies");
await f.locator("#quantity").fill("5.000 frascos de 60 gominolas");
await f.locator("#market").fill("México");
await f.getByRole("button", { name: "Continuar" }).click();
if (!(await f.locator("#formulation").isVisible())) fail("no pasa al paso 2");
await f.locator("#formulation").selectOption("develop");
await f.locator("#timeline").selectOption("q");
await f.locator("#name").fill("Ana Prueba");
await f.locator("#company").fill("Marca de Prueba");
await f.locator("#email").fill("ana@");
await f.getByRole("button", { name: "Enviar solicitud" }).click();
if (!(await f.locator("#email-err").isVisible())) fail("no valida el correo");
await f.locator("#email").fill("ana@example.com");
await f.locator("#consent").check();
await f.getByRole("button", { name: "Enviar solicitud" }).click();
await pg.getByText("Solicitud enviada").waitFor({ timeout: 5000 });
const data = Object.fromEntries(new URLSearchParams(posted));
for (const [k, v] of Object.entries({ "form-name": "solicitud", dosage_form: "gummies", market: "México", email: "ana@example.com", consent: "yes", utm_source: "google", utm_campaign: "prueba", landing_page: "/es/solicitar-presupuesto/", locale: "es" }))
  if (data[k] !== v) fail(`campo ${k}=${data[k]} (esperado ${v}) :: ${posted}`);
console.log("formulario ok:", Object.keys(data).length, "campos enviados");
await b.close();
