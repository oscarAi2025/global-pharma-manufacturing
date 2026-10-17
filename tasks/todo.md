# Global Pharma Manufacturing — plan

Modelo: el comprador pide presupuesto gratis; el fabricante con acuerdo firmado paga el 3 % (dato del propietario)
sobre el primer pedido **y las recompras** del cliente presentado (objetivo: 24 meses), con cláusula de no elusión.

## Decisiones tomadas por la investigación (17/10/2026, ver docs/research/)
- Mercado de entrada: **español y portugués** (México, Colombia, España, Brasil). En inglés los términos
  principales están dominados por grandes CDMO, ferias y directorios; en inglés solo long-tail.
- **Pocas páginas profundas** con normativa verificada de cada país. Nada de matrices país×producto
  (política de Google sobre «scaled content abuse» y «doorway abuse»).
- Primero suplementos/nutracéuticos (pedidos pequeños, ciclo de 3–4 meses, el propietario ya trata con
  fabricantes). CDMO farmacéutica después: ciclos de 6–18 meses y sin referencias públicas de comisión.
- Anonimato: la web nunca muestra contactos de fabricantes; el propietario presenta las partes tras el presupuesto.

## Hito 1 — Investigación (hecho)
- [x] Competencia y monetización (docs/research/competencia.md)
- [x] Comisiones, elusión, economía por operación (docs/research/comisiones.md)
- [x] Búsquedas y saturación en Google (docs/research/seo.md)
- [x] Normativa por país: México, Colombia, España, Brasil (docs/research/normativa-*.md)

## Hito 2 — Web mínima que capta solicitudes (en curso)
- [ ] Next.js estático (SSG) + Tailwind; marca configurable en `src/config/site.ts`
- [ ] Inicio ES / PT / EN, «Cómo funciona», 4 páginas país con normativa citada
- [ ] Formulario de solicitud progresivo (2 pasos), antispam (honeypot), UTM y página de origen → Netlify Forms
- [ ] SEO técnico: canonical, hreflang + x-default, sitemap, robots, JSON-LD (Organization, WebSite, Breadcrumb, FAQPage, Service)
- [ ] Registro de páginas con estado (solo «published» entra en sitemap y build)
- [ ] Pruebas: unidad (registro de páginas, hreflang, validación), build, enlaces internos, Lighthouse
- [ ] Repositorio GitHub (lo crea el propietario) + despliegue Netlify (conecta el propietario)

## Hito 3 — Operación (cuando entren solicitudes)
- [ ] CRM y motor de comisiones (acuerdos, presentaciones, pedidos, comisión devengada/cobrada)
- [ ] Modelo de acuerdo de comisión + no elusión (revisión por abogado)

## Pendiente del propietario
- Crear el repo vacío `global-pharma-manufacturing` en GitHub
- Qué sociedad opera la web (para aviso legal y privacidad) y dominio
- Conectar el repo a Netlify y activar el aviso por correo de Netlify Forms
