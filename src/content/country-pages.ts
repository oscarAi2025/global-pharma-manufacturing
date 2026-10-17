import type { PageInput } from "./types";
import { brasil } from "./countries/brasil";
import { colombia } from "./countries/colombia";
import { espana } from "./countries/espana";
import { mexico } from "./countries/mexico";

/** Páginas por país con normativa verificada (ver docs/research/normativa-*.md). */
export const countryPages: PageInput[] = [espana, mexico, colombia, brasil];
