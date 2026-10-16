# T10 — Página Home

- **Estado:** Pendiente
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

`src/app/[locale]/page.tsx`, `src/app/[locale]/loading.tsx`, `src/components/home/{Hero,SolarSystemSection,ExoplanetsSection}/*`, `messages/*.json`.

## Pasos

1. Implementar las secciones como Server Components asíncronos.
2. Añadir skeletons y estados de error por sección.
3. Tests de las secciones con servicios simulados: éxito, error, vacío y configuración ausente.
4. Comprobación visual en los dos idiomas.

## Criterios de aceptación

- [ ] Se ven 8 planetas en el orden correcto y 10 exoplanetas.
- [ ] Hacer clic en una tarjeta navega a su detalle; hacer clic en la APOD abre su URL.
- [ ] Si falla una API, las otras secciones se siguen mostrando.
- [ ] El estilo es coherente con `figma/home.png` y `figma/home-mobile.png`.
- [ ] lint, typecheck, test y build pasan.

## Notas / hallazgos

—
