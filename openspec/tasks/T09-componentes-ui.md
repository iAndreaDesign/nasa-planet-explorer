# T09 — Componentes UI compartidos

- **Estado:** Pendiente
- **Depende de:** T03, T08

## Objetivo

Crear los componentes presentacionales reutilizados por el home y los detalles.

## Requisitos

- `CelestialCard`: imagen, nombre, línea secundaria y flecha; toda la tarjeta es un enlace con nombre accesible y foco visible.
- `SectionHeader`: título, subtítulo y contador.
- `StatCard`: etiqueta, valor y unidad. Si el valor es `null`, muestra el texto traducido de "Not available".
- `Badge` y `Breadcrumb`.
- `StatusMessage`: estados de carga (skeleton), error, error de configuración y vacío, con textos traducidos.
- `CelestialImage` + `src/lib/images/`: importación estática de las imágenes de `./planets` y asignación rotativa determinista (por posición) para planetas y exoplanetas (D6), usando `next/image` y un `alt` descriptivo.
- Cada componente por debajo de 200 líneas (CLAUDE.md §3).

## Archivos afectados

`src/components/ui/**` (componente + `.module.scss` + test), `src/lib/images/**`, `messages/*.json`.

## Pasos

1. Implementar cada componente con props tipadas.
2. Tests RTL: renderizado, `href`, nombre accesible, "Not available" en los dos idiomas, variantes de estado y asignación de imágenes determinista.

## Criterios de aceptación

- [ ] Los tests pasan.
- [ ] El estilo es coherente con las tarjetas de los mockups.
- [ ] Navegación por teclado con foco visible.
- [ ] lint, typecheck y build pasan.

## Notas / hallazgos

- `./planets` contiene por ahora `earth.png`, `Planet hot.png` y `terrarium.png`.
