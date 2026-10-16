# T05 — Servicio Sistema Solar

- **Estado:** Pendiente
- **Depende de:** T04

## Objetivo

Obtener los planetas y las lunas de Solar System OpenData y mapearlos a modelos de dominio.

## Requisitos

- PROJECT.md §3 "Solar System Planets API", con todos los campos de "Format" y las unidades originales (D8).
- `getPlanets()`: los 8 planetas ordenados por `semimajorAxis` ascendente (este orden también se usa para las flechas anterior/siguiente).
- `getPlanet(id)`: un planeta (o "no encontrado").
- `getMoon(id)`: el `id` se extrae del `rel` y se valida contra el host de la API (evita SSRF en el proxy de T12).
- El tipo es el `bodyType` de la API (D5).
- Cabecera `Authorization: Bearer` con `SOLAR_SYSTEM_API_TOKEN`, solo en servidor.
- Campos ausentes → `null` en el dominio.

## Archivos afectados

`src/services/solarSystem/{types.ts,solarSystem.ts,solarSystem.test.ts}`.

## Pasos

1. Definir los tipos de la respuesta cruda y los modelos `Planet`, `Moon` y `MoonRef`.
2. Implementar las funciones reutilizando `fetchJson`.
3. Tests: orden correcto con datos desordenados, campos ausentes, `mass` nulo, `moons: null` (0 lunas), ids inválidos, errores de API y token ausente.

## Criterios de aceptación

- [ ] Los tests pasan.
- [ ] El token solo aparece en la cabecera, nunca en errores ni logs.
- [ ] typecheck y lint pasan.

## Notas / hallazgos

—
