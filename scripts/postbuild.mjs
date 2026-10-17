// Netlify sirve out/404.html para rutas inexistentes. Next genera 404.html en la exportación estática.
import { existsSync } from "node:fs";
if (!existsSync("out/404.html")) { console.error("Falta out/404.html"); process.exit(1); }
console.log("postbuild ok");
