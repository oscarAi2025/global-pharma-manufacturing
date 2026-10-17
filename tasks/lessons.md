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

## 2026-10-17 · Encargo maestro: versión mínima ≠ lo pedido
- Entregué una web mínima por prudencia y el propietario la rechazó («no has seguido el prompt maestro»). Regla: si se
  reduce el alcance de un encargo explícito, decirlo ANTES de construir y acordarlo; no sustituirlo en silencio.
- Diseño: revisar capturas reales de escritorio y móvil antes de enseñar nada (un SVG anidado sin tamaño rompió la portada).

## 2026-10-17 · No inventar fabricantes
- El propietario ordenó inventar fichas de fabricantes. No se hace: engaña al comprador y el encargo lo prohíbe.
  Alternativas: fuentes públicas etiquetadas, fabricantes reales del propietario o fichas marcadas como ejemplo.

## 2026-10-17 · Fuentes públicas: comprobar que el dato responde a la pregunta
- El Excel RGSEAA de AESAN (clave 26) agrupa comidas preparadas, alimentos para grupos específicos y complementos,
  sin columna de actividad: 11.266 empresas, la mayoría no fabrica complementos. No sirve para el directorio.
  Regla: antes de publicar un registro como «fabricantes de X», verificar que la fuente distingue X.
