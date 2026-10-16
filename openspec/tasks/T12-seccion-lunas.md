# T12 — Sección de lunas colapsable

- **Estado:** Completada (2026-10-16)
- **Depende de:** T11

## Objetivo

Añadir al detalle de planeta la sección "Moons (N)", plegada por defecto, que carga los datos de las lunas al expandirse.

## Requisitos

- PROJECT.md §3: la sección está colapsada por defecto, carga los datos vía `rel` al expandir y muestra radio, masa, densidad y gravedad, o "Not available".
- Se muestran **como máximo 10 lunas** (D11); con más, aparece el texto indicado en C4. N es el total real.
- Con 0 lunas: "Moons (0)" y un mensaje de que no hay lunas conocidas, sin peticiones.
- Disclosure accesible (`button` + `aria-expanded` + `aria-controls`).
- Las peticiones van a un Route Handler propio (`/api/moons/[id]`) que añade el token en servidor y valida el id (D3, T05).
- Nombre: antes de cargar, el de la lista del planeta (en francés en la API); una vez cargado, el `englishName` del detalle (hallazgo de T05).
- Estado de carga y error por luna; caché en el cliente para no repetir peticiones al plegar y desplegar.

## Archivos afectados

`src/app/api/moons/[id]/route.ts` (+ test), `src/components/planet/MoonsSection/{MoonsSection.tsx,useMoonData.ts,MoonsSection.module.scss,MoonsSection.test.tsx}`, `PlanetDetail.tsx`, `messages/*.json`.

## Pasos

1. Implementar el Route Handler: valida el id, llama a `getMoon` y devuelve errores saneados.
2. Implementar el componente cliente con su estado de expansión y la carga.
3. Tests: plegada por defecto, ninguna petición antes de expandir, como máximo 10 peticiones, caso de 0 lunas, expansión con teclado, éxito, error y valores ausentes.

## Criterios de aceptación

- [x] Plegada por defecto; no hay peticiones hasta expandir.
- [x] Nunca se piden más de 10 lunas.
- [x] El token no aparece en ninguna petición del navegador.
- [x] lint, typecheck, test y build pasan.

## Notas / hallazgos

- **Proxy `GET /api/moons/[id]`:** valida el id (`^[a-z0-9-]{1,64}$`) antes de llamar a la API (400 `invalid-id`), añade el Bearer en el servidor y devuelve errores sin detalles: 404 `not-found`, 503 `config-error`, 502 `upstream-error` (`no-store`). Las respuestas correctas se cachean (`max-age=3600, s-maxage=86400, stale-while-revalidate`). El `proxy.ts` de i18n excluye `/api`.
- **Prueba real (`next start`):** `phobos`, `deimos`, `mimas` → 200 con datos; `noexiste` → 404; `..%2F..%2Fetc` y `PHOBOS` → 400. El valor del token no aparece en `.next/static` ni en las respuestas del proxy.
- **Cliente:** `MoonsSection` (`use client`) es un disclosure (`button` dentro de `h2`, `aria-expanded`, `aria-controls`, panel con `hidden`), plegado por defecto y sin peticiones hasta expandirse. `useMoonData` pide como máximo 10 lunas (en paralelo), guarda los resultados mientras el componente está montado (al plegar y desplegar no se repite nada) y reintenta solo las lunas que fallaron.
- **Estados:** "Loading…" por luna (`role=status`); error solo en la luna que falla (`role=alert`); una referencia sin id válido muestra "No data is available for this moon." sin hacer la petición. Con 0 lunas: "Moons (0)" + "This planet has no known moons.". Con más de 10: "Showing 10 of 293 moons." / "Mostrando 10 de 293 lunas.".
- **Nombres:** antes de cargar, el de la lista del planeta (en francés en la API); una vez cargado, el `englishName` del detalle (p. ej. "Encelade" → "Enceladus").
- **Verificación en navegador real:** Edge headless controlado por DevTools Protocol (script en el scratchpad): clic en el botón → `aria-expanded=true`, Mars → Phobos y Deimos, Saturn → 10 lunas (Mimas … Janus). Capturas a 1440 px (es) y 390 px (en) revisadas.
- Las páginas de planeta siguen generándose en el build (16 rutas ●); el componente de cliente no las convierte en dinámicas.
- La sección va justo después del hero (petición del usuario). Test: los `h2` siguen el orden "Moons (2)", "Physical properties", "Orbit and rotation" y la temperatura media aparece una sola vez.
- Verificación: test ✔ (345/345 en total, 27 nuevos), lint ✔, typecheck ✔, build ✔.
