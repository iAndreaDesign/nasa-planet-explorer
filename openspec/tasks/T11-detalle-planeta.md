# T11 — Página de detalle de planeta

- **Estado:** Completada (2026-10-16)
- **Depende de:** T05, T09

## Objetivo

Crear `/[locale]/planets/[slug]` con los datos del planeta, siguiendo el estilo de `figma/detail.png` y `figma/detail-mobile.png`.

## Requisitos

- PROJECT.md §3: propiedades físicas (masa, radio medio, densidad, gravedad, velocidad de escape, inclinación axial), orbitales (semieje mayor, periodo orbital), periodo de rotación y temperatura media, con las unidades de la API (D8).
- Hero: "NN / Solar System", nombre, **badge de temperatura** (D14) e imagen. Sin contenido editorial (D7).
- Flechas anterior/siguiente **circulares** según el orden por `semimajorAxis` (D9), con nombre accesible ("Previous planet: Venus"), en escritorio y móvil.
- Breadcrumb "All planets / Solar System / <nombre>" y botón "Back to all planets".
- `error.tsx` y `not-found` para slugs inexistentes (`loading.tsx` se descartó, ver notas).
- Los componentes de detalle (hero, rejilla de stats, flechas) van en `components/detail/` para reutilizarlos en T13.

## Archivos afectados

`src/app/[locale]/planets/[slug]/page.tsx`, `src/app/[locale]/error.tsx`, `src/components/detail/{DetailHero,DetailLayout,PropertyGroup}`, `src/components/planet/PlanetDetail.tsx` + `planet.test.tsx`, `ButtonLink` (`kind="route"`), `ChevronIcon`, `StatCard.module.scss`, `messages/*.json`.

## Pasos

1. Implementar la página con `getPlanetBySlug(slug)` y `getPlanets()` (para el anterior y el siguiente).
2. Componer el hero, las flechas y la rejilla de `StatCard`.
3. Tests: datos completos, campos ausentes, navegación circular (el primero enlaza al último y viceversa), slug inexistente y error.

## Criterios de aceptación

- [x] Se muestran todas las propiedades exigidas, con unidades.
- [x] Los valores ausentes se muestran como "Not available" / "No disponible".
- [x] Desde Mercurio, "anterior" lleva a Neptuno, y desde Neptuno, "siguiente" lleva a Mercurio.
- [x] Un slug inválido devuelve 404.
- [x] lint, typecheck, test y build pasan.

## Notas / hallazgos

- **Generación en build:** `generateStaticParams` genera las 16 páginas (8 planetas × 2 idiomas) con los datos reales; `revalidate = 3600`. Los slugs desconocidos se renderizan bajo demanda y dan 404 (`/en/planets/pluto` → 404).
- **Hallazgo (Next 16.4.2):** con un `loading.tsx` en `planets/[slug]`, la ruta pasaba a ser dinámica (ƒ) y no se prerenderizaba ninguna página, aunque `generateStaticParams` devolvía los 8 planetas (comprobado con un log temporal). Sin `loading.tsx` se generan las 16 páginas. Como son estáticas, se descarta `loading.tsx`.
- **Errores:** si la API falla o falta el token, la página muestra el `StatusMessage` correspondiente con el breadcrumb y "Back to all planets" (no un 404). `[locale]/error.tsx` (Next 16: `retry()`) cubre los errores inesperados de renderizado.
- **Contenido (D5, D7, D8):** solo datos de la API, con sus unidades. Tres grupos: propiedades físicas (masa ×10ⁿ kg, radio km, densidad g/cm³, gravedad m/s², escape m/s, inclinación °), órbita y rotación (semieje km, periodo orbital días, rotación horas) y temperatura (K). Resumen del hero: periodo orbital y nº de lunas.
- **Badge de temperatura (D14, cambio pedido por el usuario):** sustituye al badge `bodyType` ("Planet"), que no aportaba nada. `avgTemp` < 270 K → "Cold"/"Frío" en azul (`tone=accent`, contraste 5,2:1); > 323 K → "Hot"/"Caliente" en rojo; entre 270 y 323 K (incluidos) o sin dato → sin badge (interpretación, ya que no se especificó). Lógica en `lib/format/temperature.ts` (+ test). Spec `solar-system-planets` actualizada (requisito "Temperature badge").
- **Navegación (D9):** flechas circulares a ambos lados de la imagen en escritorio y móvil, con `aria-label` "Previous planet: Neptune" / "Planeta anterior: …". Breadcrumb "All planets / Solar System / <nombre>" (enlazado a `/` y `/#solar-system`) y botón "Back to all planets".
- `ButtonLink` admite ahora `kind: anchor | external | route` (`route` usa el `Link` con idioma).
- Ajuste visual: en móvil, "1,426,666,422 km" se partía en mitad del número; el valor de `StatCard` pasa a 1.125rem en móvil (1.375rem en tablet, 2rem en escritorio) con `overflow-wrap: break-word`.
- Verificación visual (Edge headless, datos reales): `/es/planets/mars` a 1440 px y `/en/planets/saturn` a 390 px reales, comparadas con `detail.png` y `detail-mobile.png`. `<title>` por planeta ("Mars · NASA Planet Explorer").
- Ver T07: la página 404 de `notFound()` se renderiza en el cliente en Next 16.4.2.
- **Reorganización (petición del usuario, durante T12):** orden final: hero → "Moons (N)" → propiedades físicas → órbita y rotación. El resumen del hero muestra el periodo orbital y la **temperatura media** (en lugar de las lunas conocidas, que ya aparecen en "Moons (N)"). Se elimina el grupo "Temperature" para no repetir el dato.
- Verificación: test ✔ (318/318 en total, 39 nuevos), lint ✔, typecheck ✔, build ✔ (16 rutas SSG).
