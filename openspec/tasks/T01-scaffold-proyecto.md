# T01 — Scaffold del proyecto

- **Estado:** Completada (2026-10-16)
- **Depende de:** T00

## Objetivo

Crear la base del proyecto (Next.js App Router + React + TypeScript strict + SCSS + Vitest + ESLint), sin funcionalidad todavía.

## Requisitos

- CLAUDE.md §2 y §3: TypeScript `strict`, sin `any`.
- Dependencias: `next`, `react`, `react-dom`, `typescript`, `sass`, `vitest`, `@vitejs/plugin-react`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `eslint`, `eslint-config-next`. La librería de i18n se instala en T07.
- Scripts: `dev`, `build`, `start`, `lint`, `typecheck` (`tsc --noEmit`), `test`.
- `.gitignore` incluye `.env`, `.env*.local`, `node_modules`, `.next` y `coverage`.
- npm como gestor de paquetes; se inicializa un repositorio git (C5). El primer commit se hace solo si lo pides.

## Archivos afectados

`package.json`, lockfile, `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `vitest.setup.ts`, `.gitignore`, `src/app/layout.tsx`, `src/app/page.tsx` (placeholder), `src/styles/globals.scss`.

## Pasos

1. Inicializar el proyecto e instalar las dependencias.
2. Configurar el alias `@/*` → `src/*`.
3. Configurar Vitest (jsdom, setup con jest-dom) y añadir un test de humo.
4. Ejecutar todos los scripts.

## Criterios de aceptación

- [x] `lint`, `typecheck`, `test` y `build` terminan sin errores.
- [x] `dev` sirve la página placeholder.
- [x] `tsconfig.json` tiene `"strict": true`.
- [x] `.env` está ignorado.

## Notas / hallazgos

- Versiones instaladas: Next 16.4.2 (Turbopack), React 19.3.1, TypeScript 6.0.3, ESLint 9.39.5, Vitest 5.0.5, Sass 1.105.2. npm eligió TypeScript 6 y ESLint 9 (no las majors 7 y 10) por compatibilidad entre paquetes.
- `"type": "module"` en package.json para evitar el aviso de Vite sobre un config ESM cargado como CommonJS.
- Además de `strict`, se activa `noUncheckedIndexedAccess` y la regla `@typescript-eslint/no-explicit-any` como error.
- `npm audit`: 5 vulnerabilidades altas en `braces` (vía `eslint-config-next` → `fast-glob`), solo de desarrollo y no llegan a la app. El arreglo de npm obligaría a bajar a eslint-config-next 14, así que se dejan pendientes.
- npm no ejecutó los scripts de instalación de `unrs-resolver` y `@parcel/watcher` (política `allowScripts`); lint, test y build funcionan igualmente.
- `next dev` genera un `AGENTS.md` con reglas para agentes (se desactiva con `agentRules: false`). No toca CLAUDE.md.
- Verificación: `lint` ✔, `typecheck` ✔, `test` ✔ (1/1), `build` ✔, `next dev` y `next start` sirven `/` con 200 y el h1 esperado.
