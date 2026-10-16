# T13 — Página de detalle de exoplaneta

- **Estado:** Pendiente
- **Depende de:** T06, T11

## Objetivo

Crear `/[locale]/exoplanets/[slug]` con todos los datos del exoplaneta, reutilizando el diseño de detalle.

## Requisitos

- PROJECT.md §3 "Exoplanets API": "Display all the data", es decir, estrella anfitriona, año y método de descubrimiento, distancia (pc), radio (R⊕), masa (M⊕), periodo orbital (días), temperatura de equilibrio (K) y densidad (`pl_dens`, g/cm³), con las unidades de la API (D8).
- Reutiliza `components/detail/` de T11, incluidas las flechas circulares en el orden de la consulta.
- Breadcrumb "All planets / Exoplanets / <nombre>", "Back to all planets", `loading`/`error`/`not-found`.

## Archivos afectados

`src/app/[locale]/exoplanets/[slug]/{page.tsx,loading.tsx,error.tsx,not-found.tsx}`, `src/components/exoplanet/**`, `messages/*.json`.

## Pasos

1. Implementar la página con `getExoplanets()` y `getExoplanetBySlug()`.
2. Mapear los campos a `StatCard`.
3. Tests: datos completos, nulos, navegación circular, slug inexistente y error de API.

## Criterios de aceptación

- [ ] Se muestran todos los campos con las unidades correctas.
- [ ] Los valores nulos se muestran como "Not available".
- [ ] La navegación anterior/siguiente es circular.
- [ ] Un slug inválido devuelve 404.
- [ ] lint, typecheck, test y build pasan.

## Notas / hallazgos

—
