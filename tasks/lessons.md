# Lecciones

## 2026-10-17 · Antes de construir: quién cobra y por qué me comprarían
- Inventario Vivo y Clinical Bridge se descartaron tras construir. Aquí se investigó primero competencia,
  modelo de ingresos y búsquedas (docs/research/). Regla: no escribir código sin esas tres respuestas.

## 2026-10-17 · Inputs ocultos en React
- Un `<input type="hidden" defaultValue>` refleja su atributo: al re-renderizar, React lo reescribe y se pierde
  lo que el efecto asignó (las UTM llegaban vacías). Regla: campos ocultos controlados con estado (`value` + `readOnly`).
  Lo detectó la prueba de extremo a extremo (scripts/e2e-form.mjs), no las pruebas unitarias.

## 2026-10-17 · Fuente variable con eje de anchura
- `font-variation-settings: "wdth" 100` en body anula `font-stretch` en los titulares. Usar solo `font-stretch`.
- Google Fonts está bloqueado en el entorno: fuentes autoalojadas vía @fontsource.
