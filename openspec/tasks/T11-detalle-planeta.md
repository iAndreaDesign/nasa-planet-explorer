# T11 — Página de detalle de planeta

- **Estado:** Pendiente
- **Depende de:** T05, T09

## Objetivo

Crear `/[locale]/planets/[id]` con los datos del planeta, siguiendo el estilo de `figma/detail.png` y `figma/detail-mobile.png`.

## Requisitos

- PROJECT.md §3: propiedades físicas (masa, radio medio, densidad, gravedad, velocidad de escape, inclinación axial), orbitales (semieje mayor, periodo orbital), periodo de rotación y temperatura media, con las unidades de la API (D8).
- Hero: "NN / Solar System", nombre, badge con `bodyType` e imagen. Sin contenido editorial (D7).
- Flechas anterior/siguiente **circulares** según el orden por `semimajorAxis` (D9), con nombre accesible ("Previous planet: Venus"), en escritorio y móvil.
- Breadcrumb "All planets / Solar System / <nombre>" y botón "Back to all planets".
- `loading.tsx`, `error.tsx` y `not-found` para ids inexistentes.
- Los componentes de detalle (hero, rejilla de stats, flechas) van en `components/detail/` para reutilizarlos en T13.

## Archivos afectados

`src/app/[locale]/planets/[id]/{page.tsx,loading.tsx,error.tsx,not-found.tsx}`, `src/components/detail/**`, `src/components/planet/**`, `messages/*.json`.

## Pasos

1. Implementar la página con `getPlanet(id)` y `getPlanets()` (para el anterior y el siguiente).
2. Componer el hero, las flechas y la rejilla de `StatCard`.
3. Tests: datos completos, campos ausentes, navegación circular (el primero enlaza al último y viceversa), id inexistente y error.

## Criterios de aceptación

- [ ] Se muestran todas las propiedades exigidas, con unidades.
- [ ] Los valores ausentes se muestran como "Not available" / "No disponible".
- [ ] Desde Mercurio, "anterior" lleva a Neptuno, y desde Neptuno, "siguiente" lleva a Mercurio.
- [ ] Un id inválido devuelve 404.
- [ ] lint, typecheck, test y build pasan.

## Notas / hallazgos

—
