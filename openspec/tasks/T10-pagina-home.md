# T10 — Página Home

- **Estado:** Completada (2026-10-16)
- **Depende de:** T04, T05, T06, T09

## Objetivo

Montar el home con sus tres secciones (PROJECT.md §2), siguiendo el estilo de los mockups del home.

## Requisitos

- Hero / APOD: la imagen de la APOD sustituye a la Tierra del mockup y se muestra con su `title`. Es clicable y abre su URL según C2. Botones del hero según C3.
- Solar System: 8 tarjetas ordenadas por `semimajorAxis` con nombre, tipo (`bodyType`), nº de lunas e imagen (PROJECT.md §3). El enlace va a `/[locale]/planets/[slug]`.
- Exoplanets: 10 tarjetas con nombre, distancia (`sy_dist`, en pársecs) e imagen. El enlace va a `/[locale]/exoplanets/[slug]`.
- Cada sección carga y falla de forma **independiente** (Suspense + manejo de error por sección); un error de configuración solo afecta a su sección.
- Rejilla responsive: 4 columnas en escritorio y 2 en móvil.
- Todos los textos de la interfaz traducidos.

## Archivos afectados

`src/app/[locale]/page.tsx`, `src/components/home/{Hero,SolarSystemSection,ExoplanetsSection,CardGrid}/*` + `home.test.tsx`, `src/components/ui/ButtonLink/*`, `src/lib/data/safeLoad.ts`, `src/test/intlServerMock.ts`, `next.config.ts` (`images.remotePatterns`), `messages/*.json`.

## Pasos

1. Implementar las secciones como Server Components asíncronos.
2. Añadir skeletons y estados de error por sección.
3. Tests de las secciones con servicios simulados: éxito, error, vacío y configuración ausente.
4. Comprobación visual en los dos idiomas.

## Criterios de aceptación

- [x] Se ven 8 planetas en el orden correcto y 10 exoplanetas.
- [x] Hacer clic en una tarjeta navega a su detalle; hacer clic en la APOD abre su URL.
- [x] Si falla una API, las otras secciones se siguen mostrando.
- [x] El estilo es coherente con `figma/home.png` y `figma/home-mobile.png` (incluye la comprobación visual de las tarjetas de T09).
- [x] lint, typecheck, test y build pasan.

## Notas / hallazgos

- **Independencia de las secciones:** cada sección es un Server Component asíncrono dentro de su propio `<Suspense>` (con skeleton) y carga sus datos con `safeLoad`, que convierte los fallos en estados (`error` / `config-error`) y registra en el log mensajes sin credenciales. Un test comprueba que un fallo de exoplanetas no afecta a los planetas. No se ha creado `loading.tsx`: con Suspense por sección no hace falta y bloquearía la página entera.
- **Caché:** `/en` y `/es` se generan en el build (SSG) con los datos reales y `export const revalidate = 3600` las regenera cada hora, incluso si una sección falló en el build (p. ej., por falta de credenciales).
- **Hero / APOD (C2, C3):** imagen `hdurl` con `next/image` (`fill`, `object-fit: cover`; `remotePatterns` para `assets.science.nasa.gov`, admitiendo query strings). La imagen y "Explore last discovery" abren `hdurl` en una pestaña nueva (`rel=noopener noreferrer`) y lo anuncian ("(opens in a new tab)"). "Discover planets" → `#solar-system`. Si no hay imagen o la APOD falla, el texto del hero se mantiene y el botón de la APOD se oculta. En móvil la imagen va arriba, como en `home-mobile.png`.
- **Nombres accesibles:** igual que en T09, los enlaces con varias piezas (la imagen de la APOD y los botones externos) llevan un `aria-label` explícito; los tests detectaron "…skyline.(opens in a new tab)" sin espacio.
- Tarjetas de planeta: "04 / Planet" (`bodyType` de la API, D5) + "2 moons" (plural ICU: "1 moon", "0 moons"; es: "1 luna", "0 lunas"). Exoplanetas: "Artist impression" + "54.63 pc" ("54,63 pc" en español) o "Not available".
- Nuevo componente `ButtonLink` (primario/secundario, externo) en `components/ui`.
- Tests de Server Components: `src/test/intlServerMock.ts` sustituye `next-intl/server` por `createTranslator` con los catálogos reales; los servicios se simulan con `vi.mock`.
- Verificación visual (`next start` + Edge headless, datos reales): 1440 px y 390 px. Comparadas con `home.png` y `home-mobile.png`: misma estructura (hero en 2 columnas o apilado, 4/2 columnas, contadores, tarjetas), sin scroll horizontal. Datos reales: APOD "The Milky Way over Manhattan", 8 planetas (Saturno con 293 lunas), 10 exoplanetas de 2026.
- Seguridad: los valores de `NASA_API_KEY` y `SOLAR_SYSTEM_API_TOKEN` no aparecen en `.next/static` ni en el HTML/RSC prerenderizado (búsqueda del valor exacto).
- Verificación: test ✔ (279/279 en total, 19 nuevos), lint ✔, typecheck ✔, build ✔.
