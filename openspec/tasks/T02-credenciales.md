# T02 — Gestión de credenciales

- **Estado:** Completada (2026-10-16) — a falta de que el usuario rellene .env
- **Depende de:** T01

## Objetivo

Leer y validar las credenciales desde variables de entorno, solo en servidor, y dar un error de configuración claro cuando falten.

## Requisitos

- PROJECT.md §5 "API credentials and security".
- Variables: `NASA_API_KEY` (APOD y exoplanetas, query `api_key`) y `SOLAR_SYSTEM_API_TOKEN` (cabecera `Authorization: Bearer`).
- Si falta una variable → `ConfigError` (con código identificable para que la UI lo traduzca), **sin hacer la petición**.
- Ningún mensaje ni log contiene el valor de un token.
- El módulo solo puede usarse en servidor (comprobación en tiempo de ejecución; sin el paquete `server-only`, por decisión del usuario).

## Archivos afectados

`.env.example`, `.env` (local, sin commitear), `src/lib/config/env.ts`, `src/lib/config/env.test.ts`.

## Pasos

1. Crear `.env.example` con valores de ejemplo.
2. Crear un `.env` vacío y **pedirte los tokens** (yo no los escribo).
3. Implementar `getNasaApiKey()` y `getSolarSystemToken()`.
4. Tests: variable ausente, variable vacía, el mensaje no filtra el valor.

## Criterios de aceptación

- [x] Los tests unitarios pasan.
- [x] Una búsqueda en el repo no encuentra tokens reales.
- [x] `.env` está en `.gitignore`.
- [x] typecheck y lint pasan.

## Notas / hallazgos

- `ConfigError` expone `code` (`missing-credential` | `client-access`) y `variable`; la UI traducirá a partir del código (T07/T09).
- Los valores se recortan (`trim`); una variable vacía o con solo espacios cuenta como ausente.
- Si se llama desde el navegador (`window` definido) lanza `client-access` sin leer el valor. Además, Next no incluye en el bundle del cliente variables sin el prefijo `NEXT_PUBLIC_`.
- Tests en entorno `node` (directiva `@vitest-environment node`): 12 casos.
- `.env` creado con valores vacíos; git lo ignora (`.gitignore:15`). `.env.example` sí se versiona.
- Verificación: test ✔ (13/13 en total), lint ✔, typecheck ✔, build ✔.
