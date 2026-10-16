# T02 — Gestión de credenciales

- **Estado:** Pendiente
- **Depende de:** T01

## Objetivo

Leer y validar las credenciales desde variables de entorno, solo en servidor, y dar un error de configuración claro cuando falten.

## Requisitos

- PROJECT.md §5 "API credentials and security".
- Variables: `NASA_API_KEY` (APOD y exoplanetas, query `api_key`) y `SOLAR_SYSTEM_API_TOKEN` (cabecera `Authorization: Bearer`).
- Si falta una variable → `ConfigError` (con código identificable para que la UI lo traduzca), **sin hacer la petición**.
- Ningún mensaje ni log contiene el valor de un token.
- El módulo solo puede usarse en servidor.

## Archivos afectados

`.env.example`, `.env` (local, sin commitear), `src/lib/config/env.ts`, `src/lib/config/env.test.ts`.

## Pasos

1. Crear `.env.example` con valores de ejemplo.
2. Crear un `.env` vacío y **pedirte los tokens** (yo no los escribo).
3. Implementar `getNasaApiKey()` y `getSolarSystemToken()`.
4. Tests: variable ausente, variable vacía, el mensaje no filtra el valor.

## Criterios de aceptación

- [ ] Los tests unitarios pasan.
- [ ] Una búsqueda en el repo no encuentra tokens reales.
- [ ] `.env` está en `.gitignore`.
- [ ] typecheck y lint pasan.

## Notas / hallazgos

—
