# T03 — Utilidades de dominio y formato

- **Estado:** Pendiente
- **Depende de:** T01

## Objetivo

Reunir en funciones puras la lógica de presentación de valores astronómicos, reutilizada por los servicios y la UI.

## Requisitos

- Las funciones reciben el `locale` (`en` | `es`) y formatean con `Intl.NumberFormat` (PROJECT.md §4 i18n).
- Si el valor es ausente, `null`, `undefined` o no numérico, devuelven `null`; la UI muestra el texto traducido de "Not available".
- Masa: `massValue` + `massExponent` → `6,42 × 10²³` / `6.42 × 10²³` según el idioma (superíndices Unicode).
- Sin conversiones de unidades (D8): las etiquetas de unidad se definen junto a cada campo.
- Índice con dos dígitos (`04`) para la posición del planeta.
- `slugify` determinista para nombres de exoplanetas (`GJ 1214 b` → `gj-1214-b`).
- Navegación circular: `getAdjacent(list, index)` → anterior y siguiente con *wrap-around* (D9).

## Archivos afectados

`src/lib/format/*.ts` y sus `*.test.ts`.

## Pasos

1. Implementar las funciones con tipos estrictos.
2. Tests de casos límite: 0, negativos, exponentes negativos, `NaN`, cadenas vacías, caracteres especiales en slugs, listas de 1 elemento en `getAdjacent` y los dos idiomas.

## Criterios de aceptación

- [ ] Todos los tests unitarios pasan.
- [ ] Ninguna función usa `any`.
- [ ] typecheck y lint pasan.

## Notas / hallazgos

—
