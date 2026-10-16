# T09 — Componentes UI compartidos

- **Estado:** Completada (2026-10-16; comprobación visual hecha en T10)
- **Depende de:** T03, T08

## Objetivo

Crear los componentes presentacionales reutilizados por el home y los detalles.

## Requisitos

- `CelestialCard`: imagen, nombre, línea secundaria y flecha; toda la tarjeta es un enlace con nombre accesible y foco visible.
- `SectionHeader`: título, subtítulo y contador.
- `StatCard`: etiqueta, valor y unidad. Si el valor es `null`, muestra el texto traducido de "Not available".
- `Badge` y `Breadcrumb`.
- `StatusMessage`: estados de carga (skeleton), error, error de configuración y vacío, con textos traducidos.
- `CelestialImage` + `src/lib/images/`: importación estática de las imágenes de `./planets` con `next/image`. Cada planeta del Sistema Solar tiene su propia imagen (por slug); los exoplanetas rotan las 3 genéricas de forma determinista (D6, actualizada con el usuario).
- Cada componente por debajo de 200 líneas (CLAUDE.md §3).

## Archivos afectados

`src/components/ui/{CelestialCard,CelestialImage,SectionHeader,StatCard,Badge,Breadcrumb,StatusMessage,icons}/*` + `ui.test.tsx`, `src/lib/images/celestialImages.ts` (+ test), `src/test/{intl,mocks}.tsx`, `messages/*.json`, `_tokens.scss`.

## Pasos

1. Implementar cada componente con props tipadas.
2. Tests RTL: renderizado, `href`, nombre accesible, "Not available" en los dos idiomas, variantes de estado y asignación de imágenes determinista.

## Criterios de aceptación

- [x] Los tests pasan.
- [x] El estilo es coherente con las tarjetas de los mockups (comprobado con capturas en T10).
- [x] Navegación por teclado con foco visible.
- [x] lint, typecheck y build pasan.

## Notas / hallazgos

- **Imágenes (D6 actualizada):** el usuario subió una imagen por planeta (`Mercury.png` … `Neptune.png`), que se asignan por slug; `blue.png`, `Planet hot.png` y `terrarium.png` rotan entre los exoplanetas (índice % 3). Todas son PNG con transparencia de 388×300. Son ilustrativas, así que llevan `alt=""`: el nombre del cuerpo siempre está al lado.
- **Accesibilidad de `CelestialCard`:** los tests detectaron que el nombre accesible del enlace se calculaba como "Mars04 / Planet2 moons", con las piezas pegadas. Ahora el enlace lleva un `aria-label` que une los textos visibles con comas ("Mars, 04 / Planet, 2 moons"); contiene el texto visible, así que cumple WCAG 2.5.3.
- `StatGrid` es un `<dl>` sin `aria-label` (no admite nombre accesible); la página debe ponerle un encabezado visible delante. `StatCard` = `<dt>` + `<dd>`; con valor `null` muestra "Not available" / "No disponible" y oculta la unidad.
- Estados: `StatusMessage` (`empty` → `role=status`; `error` y `config-error` → `role=alert`) y `CardGridSkeleton` (`role=status`, `aria-busy`, texto oculto "Loading…"/"Cargando…").
- Nuevo token `--color-text-primary` (`#ffb3b9`) para el badge rojo; incluido en el test de contraste.
- Helpers de test compartidos: `src/test/intl.tsx` (`renderWithIntl` con los catálogos reales) y `src/test/mocks.tsx` (`Link` de next-intl y `next/image`); los tests de T07/T08 se han adaptado para usarlos.
- Verificación: test ✔ (260/260 en total, 39 nuevos), lint ✔, typecheck ✔, build ✔.
