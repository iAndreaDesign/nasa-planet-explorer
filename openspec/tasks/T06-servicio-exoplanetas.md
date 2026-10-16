# T06 — Servicio Exoplanetas

- **Estado:** Pendiente
- **Depende de:** T04

## Objetivo

Obtener los 10 exoplanetas del NASA Exoplanet Archive (TAP) y mapearlos a un modelo de dominio con slug.

## Requisitos

- PROJECT.md §3 "Exoplanets API": la consulta ADQL se construye en el servicio, con las columnas del documento más `pl_dens` (D10), y **sin** credenciales en el código.
- Autenticación `api_key` con `NASA_API_KEY` (D2); si falta → `ConfigError` sin petición.
- `getExoplanets()`: 10 elementos en el orden de la consulta (también para las flechas anterior/siguiente).
- `getExoplanetBySlug(slug)`: reutiliza la lista (no hay endpoint de detalle).
- Unidades de la tabla "Format", sin conversión (D8).
- Valores nulos → `null`.

## Archivos afectados

`src/services/exoplanets/{types.ts,exoplanets.ts,exoplanets.test.ts}`.

## Pasos

1. Definir los tipos de la respuesta cruda y el modelo `Exoplanet`.
2. Implementar el servicio y la generación de slugs, con desambiguación si dos nombres colisionan.
3. Tests: mapeo completo, nulos, slug inexistente, error de API, respuesta vacía y token ausente.

## Criterios de aceptación

- [ ] Los tests pasan.
- [ ] Ninguna URL del código contiene credenciales.
- [ ] typecheck y lint pasan.

## Notas / hallazgos

—
