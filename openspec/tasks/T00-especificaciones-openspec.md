# T00 — Especificaciones OpenSpec iniciales

- **Estado:** Completada (aprobada por el usuario el 2026-10-16)
- **Depende de:** decisiones del [README](README.md#decisiones-resueltas) (todas aprobadas)

## Objetivo

Registrar en OpenSpec los requisitos aprobados. Según CLAUDE.md §6, OpenSpec es la fuente de verdad, y ahora mismo `openspec/specs/` está vacío.

## Requisitos

- Un cambio OpenSpec (p. ej. `initial-planet-explorer`) con `proposal.md`, `design.md` y specs por capacidad:
  `credentials`, `i18n`, `apod`, `solar-system`, `moons`, `exoplanets`, `ui-shell`, `detail-navigation`.
- Cada requisito debe tener escenarios verificables (carga, error, vacío, "Not available", cambio de idioma).
- `design.md` recoge las decisiones D1–D13 y C1–C6 del README.
- El `tasks.md` del cambio enlaza a `openspec/tasks/` en lugar de duplicar su contenido.

## Archivos afectados

- `openspec/changes/<nombre>/**`
- Opcional, con tu aprobación: `openspec/config.yaml` (`context` con las restricciones clave).

## Pasos

1. Crear el cambio con `/opsx:propose` a partir de PROJECT.md y las decisiones.
2. Revisar que no contradice `PROJECT.md` ni `CLAUDE.md`.
3. Presentar el cambio para su aprobación.

## Criterios de aceptación

- [x] Todas las capacidades tienen requisitos y escenarios.
- [x] Todas las decisiones están documentadas en `design.md`.
- [x] Ningún archivo contiene credenciales.
- [x] `openspec validate` pasa (si el CLI está disponible).
- [x] El usuario aprueba el cambio.

## Notas / hallazgos

- Cambio creado en `openspec/changes/archive/2026-10-16-initial-planet-explorer/`: proposal, design, tasks y 8 specs (`api-credentials`, `localization`, `astronomy-picture`, `solar-system-planets`, `planet-moons`, `exoplanets`, `app-shell`, `detail-navigation`). Los nombres provisionales (`credentials`, `i18n`, `ui-shell`…) se cambiaron por nombres de comportamiento.
- Artefactos en inglés, igual que PROJECT.md.
- `openspec validate initial-planet-explorer --strict` → válido (2026-10-16).
- El `tasks.md` del cambio enlaza a `openspec/tasks/` sin duplicar su contenido.
