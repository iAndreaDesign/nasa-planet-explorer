# T03 — Utilidades de dominio y formato

- **Estado:** Completada (2026-10-16)
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

`src/lib/format/{locale,number,scientific,position,slug}.ts`, `src/lib/navigation/adjacent.ts` y sus `*.test.ts`.

## Pasos

1. Implementar las funciones con tipos estrictos.
2. Tests de casos límite: 0, negativos, exponentes negativos, `NaN`, cadenas vacías, caracteres especiales en slugs, listas de 1 elemento en `getAdjacent` y los dos idiomas.

## Criterios de aceptación

- [x] Todos los tests unitarios pasan.
- [x] Ninguna función usa `any`.
- [x] typecheck y lint pasan.

## Notas / hallazgos

- `getAdjacent` va en `src/lib/navigation/` en lugar de `lib/format/`, porque no es formateo.
- `locale.ts` define `AppLocale` (`en` | `es`), `DEFAULT_LOCALE` e `isAppLocale`; lo reutilizará la configuración de i18n (T07).
- Las funciones de formato devuelven `null` para valores ausentes, `NaN`, `Infinity` o tipos no numéricos (las cadenas numéricas también se rechazan); la UI muestra "Not available" traducido.
- `formatScientific` normaliza la mantisa a [1, 10), redondea a 2 decimales y ajusta el exponente si el redondeo llega a 10 (9,999 × 10²³ → 1 × 10²⁴). Con exponente 0 no muestra la potencia; un exponente no entero devuelve `null`.
- Español (CLDR): los números de 4 cifras no llevan separador de miles (`6779`); a partir de 5 cifras sí (`12.345`). Es el comportamiento estándar de `Intl` y está cubierto por un test.
- `createUniqueSlugs` añade `-2`, `-3`… a las colisiones por orden de aparición, sin chocar con nombres que ya terminan así; los nombres sin caracteres válidos pasan a `item`.
- Verificación: test ✔ (83/83 en total, 70 nuevos), lint ✔, typecheck ✔, build ✔, sin `any`.
