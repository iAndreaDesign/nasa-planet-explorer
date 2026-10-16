# Tasks

Each task is detailed (requirements, files, steps, acceptance criteria) in `openspec/tasks/`. A box is checked only when that file's acceptance criteria have been verified. Tasks are executed one at a time with user approval (CLAUDE.md §7).

## 1. Foundation

- [x] 1.1 T01 Project scaffold (Next.js, TS strict, SCSS, Vitest, ESLint, npm, git) — verify `lint`, `typecheck`, `test` and `build` pass (`openspec/tasks/T01-scaffold-proyecto.md`)
- [x] 1.2 T02 Credentials from environment variables — verify unit tests for missing/empty variables pass and no token is tracked (`T02-credenciales.md`)
- [x] 1.3 T03 Locale-aware formatting and domain utilities — verify unit tests for edge cases pass (`T03-utilidades-formato.md`)

## 2. Data services

- [x] 2.1 T04 HTTP client and APOD service — verify integration tests (video fallback, errors, missing key) pass (`T04-servicio-apod.md`)
- [x] 2.2 T05 Solar System service — verify integration tests (ordering, nulls, moon id validation) pass (`T05-servicio-sistema-solar.md`)
- [x] 2.3 T06 Exoplanets service — verify integration tests (mapping, slugs, errors) pass (`T06-servicio-exoplanetas.md`)

## 3. Interface foundation

- [x] 3.1 T07 Localisation en/es — verify key-parity test and language switching tests pass (`T07-internacionalizacion.md`)
- [x] 3.2 T08 Theme, header and footer — verify component tests pass and visual check against mockups (`T08-tema-y-layout.md`)
- [x] 3.3 T09 Shared UI components — verify component tests for states and "Not available" pass (`T09-componentes-ui.md`)

## 4. Pages

- [ ] 4.1 T10 Home page — verify section tests and independent failure behaviour (`T10-pagina-home.md`)
- [ ] 4.2 T11 Planet detail page — verify property, not-found and circular navigation tests (`T11-detalle-planeta.md`)
- [ ] 4.3 T12 Moons section — verify collapse, max-10, zero-moon and no-token-in-browser checks (`T12-seccion-lunas.md`)
- [ ] 4.4 T13 Exoplanet detail page — verify field, not-found and circular navigation tests (`T13-detalle-exoplaneta.md`)

## 5. Integration

- [ ] 5.1 T14 Final review — verify all checks, `astronomy-review`, accessibility/responsive/i18n review and token scan of the client bundle (`T14-revision-final.md`)

## Workflow follow-up

- Sync specs and archive this change after T14 is approved.
- T15 (image improvement) will be proposed as a separate OpenSpec change.
