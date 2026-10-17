import { describe, expect, it } from "vitest";
import { alternatesOf, buildRegistry, builtPages, findPage, isIndexable, pathOf, registry } from "@/content/registry";
import { corePages } from "@/content/core-pages";
import type { PageInput } from "@/content/types";

describe("registro de páginas", () => {
  it("es válido y sin duplicados", () => {
    expect(registry.length).toBeGreaterThan(10);
  });
  it("rechaza ids y rutas repetidas", () => {
    expect(() => buildRegistry([corePages[0], corePages[0]])).toThrow(/repetid/);
    const twin: PageInput = { ...corePages[0], id: "otra", group: "x" };
    expect(() => buildRegistry([corePages[0], twin])).toThrow(/Ruta repetida/);
  });
  it("no publica páginas de país sin contenido ni fuentes", () => {
    const thin: PageInput = { ...corePages[0], id: "pais", group: "pais", slug: ["maquila", "x"], type: "country", body: [{ kind: "p", text: "hola" }] };
    expect(() => buildRegistry([thin])).toThrow(/suficientes/);
    expect(() => buildRegistry([{ ...thin, status: "draft" }])).not.toThrow();
  });
  it("las páginas no publicadas no se generan", () => {
    expect(builtPages().every((p) => p.status === "published" || p.status === "noindex")).toBe(true);
  });
  it("hreflang: recíproco, solo equivalentes y con x-default en inglés", () => {
    const es = findPage("es", [])!;
    const alts = alternatesOf(es);
    expect(alts.map((a) => a.hreflang).sort()).toEqual(["en", "es", "pt-BR", "x-default"]);
    for (const a of alts.filter((x) => x.hreflang !== "x-default")) {
      const other = builtPages().find((p) => a.href.endsWith(pathOf(p)))!;
      expect(alternatesOf(other).some((b) => b.href.endsWith(pathOf(es)))).toBe(true);
    }
  });
  it("las páginas noindex no declaran hreflang hacia páginas indexables", () => {
    for (const p of builtPages().filter((x) => !isIndexable(x))) {
      for (const a of alternatesOf(p)) expect(builtPages().find((o) => a.href.endsWith(pathOf(o)))!.status).toBe("noindex");
    }
  });
  it("títulos y descripciones únicos entre páginas indexables", () => {
    const idx = registry.filter(isIndexable);
    expect(new Set(idx.map((p) => p.metaTitle)).size).toBe(idx.length);
    expect(new Set(idx.map((p) => p.description)).size).toBe(idx.length);
  });
});
