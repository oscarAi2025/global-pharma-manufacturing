import type { PageInput } from "./types";
import { colombia } from "./countries/colombia";
import { espana } from "./countries/espana";

/** Páginas por país con normativa verificada (ver docs/research/normativa-*.md). */
export const countryPages: PageInput[] = [espana, colombia];
