# T06 — Servicio Exoplanetas

- **Estado:** Completada (2026-10-16)
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

`src/services/exoplanets/{types.ts,exoplanets.ts,exoplanets.test.ts}`, `PROJECT.md` (endpoint).

## Pasos

1. Definir los tipos de la respuesta cruda y el modelo `Exoplanet`.
2. Implementar el servicio y la generación de slugs, con desambiguación si dos nombres colisionan.
3. Tests: mapeo completo, nulos, slug inexistente, error de API, respuesta vacía y token ausente.

## Criterios de aceptación

- [x] Los tests pasan.
- [x] Ninguna URL del código contiene credenciales.
- [x] typecheck y lint pasan.

## Notas / hallazgos

- **La consulta de PROJECT.md no devolvía los últimos descubrimientos**: con `select top 10 … order by disc_year desc` salían planetas de 1996–2009 (GJ 1214 b, 55 Cnc e…), porque el servicio TAP aplica `TOP` antes de `ORDER BY`. El usuario aprobó usar el parámetro TAP `maxrec=10` en lugar de `top` (2026-10-16). Se han actualizado PROJECT.md y la spec `exoplanets` (escenario "Latest discoveries").
- Además del `maxrec`, el servicio recorta a 10 por si la API lo ignorase.
- Prueba real con la clave del usuario: 10 exoplanetas de 2026 (CD-35 2722 B b, DMPP-2 c… GJ 1137 c) en 1,2 s, con nulos reales (`CD-35 2722 B b` sin distancia, `Elias 2-24 b` sin periodo ni temperatura). La API también responde sin `api_key`, pero se envía según D2.
- Los datos de prueba reproducen filas reales de esa respuesta.
- Aquí no se trata el 0 como desconocido (a diferencia de T05): el archivo usa `null` para los valores desconocidos. Un `disc_year` no entero pasa a `null`.
- Verificación: test ✔ (186/186 en total, 17 nuevos), lint ✔, typecheck ✔, build ✔, prueba real ✔.
