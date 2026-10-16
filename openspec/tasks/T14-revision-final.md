# T14 — Revisión final y sincronización de specs

- **Estado:** Completada (2026-10-16)
- **Depende de:** T10, T11, T12, T13

## Objetivo

Verificar el conjunto (datos, i18n, accesibilidad, responsive y seguridad) y dejar OpenSpec actualizado.

## Requisitos

- Revisión con la skill `astronomy-review`: mapeo de campos, unidades, valores ausentes e identificación de planetas y exoplanetas.
- i18n: las dos versiones recorridas por completo; no queda texto sin traducir.
- Accesibilidad: navegación completa por teclado, foco visible, landmarks, `alt` en todas las imágenes y contraste AA.
- Responsive: comparación con los 4 mockups (≈390px y 1440px), sin scroll horizontal.
- Seguridad: no hay tokens en el bundle del cliente (búsqueda en `.next/static`), en el repo ni en los logs.
- Revisar en el navegador las páginas 404 (`notFound()` se renderiza en el cliente en Next 16.4.2, ver T07) y si una versión posterior de Next lo corrige.
- Sincronizar o archivar el cambio de OpenSpec (`/opsx:sync`, `/opsx:archive`).

## Archivos afectados

Solo las correcciones puntuales que salgan de la revisión (cada una aprobada por separado), `openspec/specs/**` y este directorio.

## Pasos

1. Ejecutar lint, typecheck, test y build.
2. Ejecutar `astronomy-review` y presentar los hallazgos.
3. Revisión manual de responsive, accesibilidad e i18n.
4. Buscar credenciales en el build y en el repo.
5. Sincronizar las specs y actualizar el README de tareas.

## Criterios de aceptación

- [x] Todos los checks pasan, con salida registrada.
- [x] Los hallazgos de `astronomy-review` están resueltos o documentados.
- [x] No se encuentra ningún token en `.next/static` ni en el repo.
- [x] `openspec/specs/` refleja lo implementado.

## Notas / hallazgos

- **`astronomy-review`** (2026-10-16): el mapeo de campos, las unidades y la identificación de planetas y exoplanetas son correctos. Hallazgos y decisión del usuario:
  - A1 — La distancia sale "pc" en la tarjeta y "pársecs" en el detalle → **se mantiene así** (decisión del usuario).
  - A2 — La unidad salía en una línea aparte (p. ej. "°" sola bajo "25,19") → **corregido**: la unidad va en la misma línea que el valor y conserva su tamaño menor (`StatCard`: flex en fila, `align-items: baseline`, `flex-wrap`). Las unidades largas ("radios terrestres") bajan de línea en móvil sin desbordar.
  - A3 — Mercurio: `avgTemp: 0` en la API → "No disponible" y sin badge → **se mantiene** (limitación de la API; la app no inventa datos).
  - A4 — `bodyType` "Planet" sin traducir en las tarjetas en español → **se mantiene** (dato de la API, que según la spec no se traduce).
- **Credenciales:** el valor exacto de `NASA_API_KEY` y `SOLAR_SYSTEM_API_TOKEN` no aparece en ningún archivo versionado ni en el historial completo de git (`git log -p --all`); la clave antigua de PROJECT.md nunca llegó a un commit; `.env` no está versionado. Tampoco aparecen en `.next/static` ni en el HTML generado (T10–T13).
- **i18n:** no hay textos JSX, `aria-label`, `alt` ni `title` escritos a mano en `src` (búsqueda automática); el test de paridad de claves en/es pasa.
- **Navegador real** (Edge headless + DevTools Protocol, `next start`):
  - 404 (`/es/planets/pluto`, `/en/exoplanets/gj-1214-b`, `/fr`): con JavaScript se pinta la página traducida con header y enlace de vuelta. Confirma el hallazgo de T07 (Next 16.4.2 la renderiza en el cliente); sin JavaScript seguiría vacía. Queda como limitación conocida del framework.
  - Sin scroll horizontal a 390 px en el home, los detalles de planeta y el de exoplaneta (`scrollWidth` = 390).
  - Tamaño de letra mínimo calculado: 16 px (1rem) en todas las páginas.
  - Teclado: orden lógico (saltar al contenido → logo → EN/ES → botones del hero → APOD → tarjetas), foco visible; el enlace de salto lleva el foco a `<main>`.
  - Estructura: 1 `header`, 1 `main`, 1 `footer`, `nav` con nombre ("Idioma", "Ruta de navegación"), un solo `h1`, ninguna imagen sin `alt`.
- **Responsive:** capturas a 1440 px y 390 px de todas las páginas, revisadas en T08–T13 y de nuevo tras A2.
- **Build final:** `/en` y `/es`, 16 páginas de planeta y 20 de exoplaneta generadas (SSG, `revalidate` 1 h); `/api/moons/[id]` y el catch-all son dinámicos.
- Verificación: test ✔ (357/357), lint ✔, typecheck ✔, build ✔, `openspec validate --strict` ✔.
- **OpenSpec:** las 8 specs delta (37 requisitos, solo ADDED) se sincronizaron como specs principales en `openspec/specs/<capacidad>/spec.md` (`openspec validate --specs --strict`: 8/8 ✔; requisitos y escenarios idénticos a los deltas) y el cambio se archivó en `openspec/changes/archive/2026-10-16-initial-planet-explorer/` (4/4 artefactos, 14/14 tareas).
