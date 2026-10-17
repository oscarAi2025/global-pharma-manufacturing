# Global Pharma Manufacturing (nombre provisional)

Web que capta solicitudes de fabricación de suplementos (y, más adelante, farmacéutica) por contrato.
El comprador pide presupuesto gratis; el fabricante con acuerdo firmado paga comisión. Ver `tasks/todo.md` y `docs/research/`.

## Qué hay
- Next.js 15 exportado como sitio estático (`out/`), Tailwind, fuente Archivo autoalojada.
- Español, portugués e inglés. Portadas, «Cómo funciona», presupuesto, gracias, aviso legal.
- 4 páginas por país con normativa citada: México, Colombia, España (ES) y Brasil (PT).
- Registro de páginas validado en el build (`src/content/`): solo `published` se indexa y entra en el sitemap.
- Formulario en dos pasos sobre Netlify Forms, con antispam y procedencia (UTM, página de entrada, referente).

## Comandos
```
npm ci
npm run check     # tipos + pruebas unitarias + build + auditoría del sitio
npm run e2e       # prueba del formulario (requiere servir out/ en :4173)
```

## Publicar en Netlify
1. Conectar el repositorio de GitHub en Netlify (build y carpeta ya están en `netlify.toml`).
2. Variables de entorno de producción:
   - `SITE_ENV=production` (sin ella robots.txt bloquea la indexación: útil para vistas previas)
   - `SITE_URL` (dominio definitivo), `CONTACT_EMAIL`
   - `OPERATOR_LEGAL_NAME`, `OPERATOR_TAX_ID`, `OPERATOR_ADDRESS` (aviso legal y privacidad)
3. En Netlify → Forms: activar la detección de formularios y el aviso por correo del formulario `solicitud`.
